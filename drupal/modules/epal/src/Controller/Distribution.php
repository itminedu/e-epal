<?php
/**
 * @file
 * Contains \Drupal\query_example\Controller\QueryExampleController
 */

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Database\Database;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

//use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\TypedData\Plugin\DataType\TimeStamp;

use Drupal\Core\Language\LanguageManagerInterface;

class Distribution extends ControllerBase
{

    const SUCCESS = 0;
    const ERROR_DB = -1;
    const NO_CLASS_LIMIT_DOWN = -2;
    const SMALL_CLASS = 1;
    const NON_SMALL_CLASS = 2;
    const IS_FIRST_PERIOD = false;
    const IS_SECOND_PERIOD = true;

    protected $entity_query;
    protected $entityTypeManager;
    protected $logger;
    protected $connection;
    protected $language;
    protected $currentuser;

    protected $pendingStudents = array();
    protected $choice_id = 1;
    protected $globalCounterId = 1;

    public function __construct(
        EntityTypeManagerInterface $entityTypeManager,
        QueryFactory $entity_query,
        Connection $connection,
        LoggerChannelFactoryInterface $loggerChannel
    ) {
		$this->entityTypeManager = $entityTypeManager;
		$this->entity_query = $entity_query;
		$connection = Database::getConnection();
		$this->connection = $connection;
		$language =  \Drupal::languageManager()->getCurrentLanguage()->getId();
		$this->language = $language;
		$currentuser = \Drupal::currentUser()->id();
		$this->currentuser = $currentuser;
		$this->logger = $loggerChannel->get('epal');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity_type.manager'),
          $container->get('entity.query'),
          $container->get('database'),
          $container->get('logger.factory')
        );
    }

    public function createDistribution(Request $request)
    {
        set_time_limit(600); // dev
        $numDistributions = 3;
        $sizeOfBlock = 1000000;

        // POST method is checked
        if (!$request->isMethod('POST')) {
            return $this->respondWithStatus([
                "message" => t("Method Not Allowed")
            ], Response::HTTP_METHOD_NOT_ALLOWED);
        }

        // user validation
        $authToken = $request->headers->get('PHP_AUTH_USER');
        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if (!$user) {
            return $this->respondWithStatus([
                'message' => t("User not found"),
            ], Response::HTTP_FORBIDDEN);
        }

        // user role validation
        if (false === in_array('ministry', $user->getRoles())) {
            return $this->respondWithStatus([
                'message' => t("User Invalid Role"),
            ], Response::HTTP_FORBIDDEN);
        }

        // check where distribution can be done now ($capacityDisabled / $directorViewDisabled settings)
        $config_storage = $this->entityTypeManager->getStorage('epal_config');
        $epalConfigs = $config_storage->loadByProperties(array('id' => 1));
        $epalConfig = reset($epalConfigs);
        if (!$epalConfig) {
             return $this->respondWithStatus([
                'message' => t("EpalConfig Enity not found"),
             ], Response::HTTP_FORBIDDEN);
        } else {
            $capacityDisabled = $epalConfig->lock_school_capacity->getString();
            $directorViewDisabled = $epalConfig->lock_school_students_view->getString();
            $applicantsResultsDisabled = $epalConfig->lock_results->getString();
            if ($capacityDisabled !== "1" || $directorViewDisabled !== "1" || $applicantsResultsDisabled !== "1") {
                return $this->respondWithStatus([
                    'message' => t("capacityDisabled and / or directorViewDisabled settings are false"),
                ], Response::HTTP_FORBIDDEN);
            }
        }

        $transaction = $this->connection->startTransaction();

        try {
            // initialize/empty epal_student_class if there are already data in it!
            if ($this->initializeResults() === self::ERROR_DB) {
	            $transaction->rollback();
                return $this->respondWithStatus([
                    "message" => t("Unexpected Error")
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            if (($limitUp_class = $this->retrieveCapacityLimitUp("1")) === self::ERROR_DB) {
	            $transaction->rollback();
                return $this->respondWithStatus([
                    "message" => t("Unexpected Error")
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            while ($this->choice_id <= $numDistributions) {

                if ($this->choice_id === 1) {
					// υπολογισμός πλήθους για να καθοριστεί ο αριθμός των fetches που θα κάνουμε με συγκεκριμένο sizeOfBlock
					$sCon = $this->connection->select('epal_student', 'eStudent')
						->fields('eStudent', array('id'));
                    $sCon->join('epal_student_epal_chosen', 'epals', "eStudent.id = epals.student_id AND epals.choice_no = {$this->choice_id}");
					$numData = $sCon->countQuery()->execute()->fetchField();

	                $num = 1;
					$j = 1;
                    while ($num <= $numData) {
                        if (($total_located = $this->locateStudent($this->choice_id, self::IS_FIRST_PERIOD, 1 + $sizeOfBlock * ($j-1), $j * $sizeOfBlock, null)) === self::ERROR_DB) {
				            $transaction->rollback();
                            return $this->respondWithStatus([
                                "message" => t("Unexpected Error")
                            ], Response::HTTP_INTERNAL_SERVER_ERROR);
                        }
                        $num += $total_located;
                        $j += 1;
                    }
                } 
				else { // $this->choice_id !== 1
                    if (sizeof($this->pendingStudents) != 0) {
                        if ($this->locateStudent($this->choice_id, self::IS_FIRST_PERIOD, null, null, $this->pendingStudents) === self::ERROR_DB) {
				            $transaction->rollback();
                            return $this->respondWithStatus([
                                "message" => t("Unexpected Error")
                            ], Response::HTTP_INTERNAL_SERVER_ERROR);
                        
                        }
                    } else { // αν δεν υπάρχουν εκκρεμότητες, μην συνεχίζεις με άλλο πέρασμα
                        break;
                    }
                }

                // Για κάθε σχολείο βρες τα τμήματα
                // Για κάθε τμήμα βρες αν χωράνε και διευθέτησε (checkCapacityAndArrange)
                // checkCapacityAndArrange (school_id, class_id, sectorORcourse_id, limitUp, schoolCapacity)

                $sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
                    ->fields('eSchool', array('id', 'capacity_class_a', 'operation_shift'));
                $eepalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                foreach ($eepalSchools as $eepalSchool) {
                    if ($this->checkCapacityAndArrange($eepalSchool->id, "1", "-1", $limitUp_class, $eepalSchool->capacity_class_a) === self::ERROR_DB) {
						$transaction->rollback();
                        return $this->respondWithStatus([
                            "message" => t("Unexpected Error")
                        ], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }

                    $sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
                        ->fields('eSchool', array('epal_id', 'sector_id', 'capacity_class_sector'))
                        ->condition('eSchool.epal_id', $eepalSchool->id, '=');
                    $eepalSectorsInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                    foreach ($eepalSectorsInEpal as $eepalSecInEp) {
                        if ($this->checkCapacityAndArrange($eepalSchool->id, "2", $eepalSecInEp->sector_id, $limitUp_class, $eepalSecInEp->capacity_class_sector) === self::ERROR_DB) {
				            $transaction->rollback();
                            return $this->respondWithStatus([
                                "message" => t("Unexpected Error")
                            ], Response::HTTP_INTERNAL_SERVER_ERROR);
                        }
                    }

                    $sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
                        ->fields('eSchool', array('epal_id', 'specialty_id', 'capacity_class_specialty', 'capacity_class_specialty_d'))
                        ->condition('eSchool.epal_id', $eepalSchool->id, '=');
                    $eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                    foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp) {
                        //Γ' Λυκείου
                        if ($this->checkCapacityAndArrange($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id, $limitUp_class, $eepalSpecialInEp->capacity_class_specialty) === self::ERROR_DB) {
				            $transaction->rollback();
                            return $this->respondWithStatus([
                                "message" => t("Unexpected Error")
                            ], Response::HTTP_INTERNAL_SERVER_ERROR);
                        }
                        //Δ' Λυκείου
                        if ($eepalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ") {
                            if ($this->checkCapacityAndArrange($eepalSchool->id, "4", $eepalSpecialInEp->specialty_id, $limitUp_class, $eepalSpecialInEp->capacity_class_specialty_d) === self::ERROR_DB) {
					            $transaction->rollback();
                                return $this->respondWithStatus([
                                    "message" => t("Unexpected Error")
                                ], Response::HTTP_INTERNAL_SERVER_ERROR);
                            }
                        }
                    }
                } //end for each school/department

                $this->choice_id++;
            } //end while

            if ($this->findSmallClasses() === self::ERROR_DB) {
				$transaction->rollback();
				return $this->respondWithStatus([
                    "message" => t("Unexpected Error")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
				// αν αποτύχει, δεν γίνεται rollback. --> Λύση: διαγραφή των όποιων αποτελεσμάτων
                // if ($this->initializeResults() === self::ERROR_DB) {
                //         return $this->respondWithStatus([
                //                 "message" => t("Unexpected Error in initializeResults function AFTER findSmallClasses call Function")
                //             ], Response::HTTP_INTERNAL_SERVER_ERROR);
                // }
            }
        } 
        catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            $transaction->rollback();
            return $this->respondWithStatus([
                "message" => t("Unexpected Error")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

		return $this->respondWithStatus([
			'message' => "Distribution completed successfully",
		], Response::HTTP_OK);
    }


    /**
     * @param int $choice_id the order of choice 
     * @param boolean $period self::IS_FIRST_PERIOD or self::IS_SECOND_PERIOD
     * @param int $id_range_start id range start 
     * @param int $id_range_end id range end 
     * @param int[] $id_list restrict selection to specific ids 
     * @return int  Return self::ERROR_DB in case of error, else return number of 'locatedStudents'
     */
    public function locateStudent($choice_id, $period = false, $id_range_start = null, $id_range_end = null, $id_list = null)
    {
        $total_count = 0;        
        try {
            $sCon = $this->connection->select('epal_student', 'eStudent')
                ->fields('eStudent', array('id', 'currentclass', 'currentepal', 'second_period'));
            if ($period === self::IS_SECOND_PERIOD) {
                $sCon->condition('eStudent.second_period', 1, '=');
            }
            if ($id_range_start !== null) {
                $sCon->condition('eStudent.id', $id_range_start, '>=');
            }
            if ($id_range_end !== null) {
                $sCon->condition('eStudent.id', $id_range_end, '<=');
            }
            if (is_array($id_list) && count($id_list) > 0) {
                $sCon->condition('eStudent.id', $id_list, 'IN');
            }
            $sCon->join('epal_student_epal_chosen', 'epals', "eStudent.id = epals.student_id AND epals.choice_no = {$choice_id}");
            $sCon->fields('epals', array('epal_id', 'choice_no'));
            $sCon->leftJoin('epal_student_sector_field', 'sectors', "sectors.student_id = eStudent.id");
            $fieldname1 = $sCon->addField('sectors', 'sectorfield_id');
            $sCon->leftJoin('epal_student_course_field', 'courses', "courses.student_id = eStudent.id");
            $fieldname2 = $sCon->addField('courses', 'coursefield_id');
            // $sCon->addExpression('-1', 'specialization_id'); // no need, will have to check anyway

            // $epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            // if ($epalStudents === false) {
            //     throw new \Exception("Cannot fetch data");
            // }

            $results = $sCon->execute();
            while ($epalStudent = $results->fetchObject()) {
                $total_count++;

                if ($epalStudent->currentclass === "2") {
                    $specialization_id = $epalStudent->sectorfield_id;
                } else if ($epalStudent->currentclass === "3" || $epalStudent->currentclass === "4") {
                    $specialization_id = $epalStudent->coursefield_id;
                } else {
                    $specialization_id = -1;
                }
                $epal_dist_id = $epalStudent->epal_id;
                $timestamp = strtotime(date("Y-m-d"));

                $this->connection->insert('epal_student_class')->fields([
                    'id' => $this->globalCounterId++,
                    'uuid' => \Drupal::service('uuid')->generate(),
                    'langcode' => $this->language,
                    'user_id' => $this->currentuser,
                    'student_id'=> $epalStudent->id,
                    'epal_id'=> $epal_dist_id,
                    'currentclass' => $epalStudent->currentclass,
                    'currentepal' => $epalStudent->currentepal,
                    'specialization_id' => $specialization_id,
                    // 'points' => $epalStudent->points,
                    'distribution_id' => $choice_id,
                    'finalized' => 1,
                    'second_period' => $epalStudent->second_period,
                    'status' => 1,
                    'created' => $timestamp,
                    'changed' => $timestamp
                ])->execute();
            } 
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }

        // return self::SUCCESS;
        return $total_count;
    }


    public function retrieveCapacityLimitUp($className)
    {
        try {
            $clCon = $this->connection->select('epal_class_limits', 'classLimits')
                ->fields('classLimits', array('limit_up'))
                ->condition('classLimits.name', $className, '=');
            $results = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            $row = reset($results);
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }

        return $row->limit_up;
    }


    public function checkCapacityAndArrange($epalId, $classId, $secCourId, $limitup, $capacity)
    {

        if (!isset($capacity)) {
            $capacity = 0;
        }

        try {
            $clCon = $this->connection->select('epal_student_class', 'studentClass')
                ->fields('studentClass', array('epal_id', 'student_id', 'points', 'currentepal', 'currentclass', 'specialization_id'))
                ->condition('studentClass.epal_id', $epalId, '=')
                ->condition('studentClass.currentclass', $classId, '=')
                ->condition('studentClass.specialization_id', $secCourId, '=');
            $epalStudentClass = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);

            $limit = $limitup * $capacity;
            if (sizeof($epalStudentClass) > $limit) {
                $this->makeSelectionOfStudents($epalStudentClass, $limit);
            } elseif ($this->choice_id !== 1) {
                // αφαίρεσε όσους μαθητές βρίσκονται στον πίνακα εκκρεμοτήτων
                $clear_ids = array_map(function ($epalStudCl) {
                    return $epalStudCl->student_id;
                }, $epalStudentClass);
                $this->removeFromPendingStudents($clear_ids);
            }
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }

        return self::SUCCESS;
    }


    public function removeFromPendingStudents($val)
    {
        if (is_array($val) && count($val) > 0) {
            $this->pendingStudents = array_diff($this->pendingStudents, $val);
        } elseif (($key = array_search($val, $this->pendingStudents)) !== false) {
            unset($this->pendingStudents[$key]);
        }
    }

    public function makeSelectionOfStudents_VERSION_WITH_POINTS(&$students, $limit)
    {
        //συνάρτηση επιλογής μαθητών σε περίπτωση υπερχείλισης
        // (1) έχουν απόλυτη προτεραιότητα όσοι ήδη φοιτούσαν στο σχολείο (σε περίπτωση που φοιτούσαν περισσότεροι από την χωρητικότητα, τους δεχόμαστε όλους)
        // (2) αν απομένουν κενές θέσεις, επέλεξε από τους εναπομείναντες μαθητές αυτούς με τα περισσότερα μόρια. Σε περίπτωση ισοβαθμίας δεχόμαστε όλους όσους ισοβαθμούν.

        foreach ($students as $student) {
            $student->student_id;
            //print_r("<br>STUDENT_ID:" . $student->student_id);
        }

        //εύρεση αριθμού μαθητών που ήδη φοιτούσαν στο σχολείο
        $cnt = 0;
        foreach ($students as $student) {
            if ($student->currentepal === $student->epal_id) {
                $cnt++;
                if ($this->choice_id !== 1) {
                    ////διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
                    $this->removeFromPendingStudents($student->student_id);
                }
            }
        }
        //print_r("<br>#ΕΓΓΡΑΦΩΝ ΠΟΥ ΟΙ ΜΑΘΗΤΕΣ ΦΟΙΤΟΥΣΑΝ ΗΔΗ:" . $cnt);

        $newlimit = $limit - $cnt;
        //print_r("<br>ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ:" . $limit);
        //print_r("<br>#ΜΑΘΗΤΩΝ ΓΙΑ ΝΑ ΕΠΙΛΕΓΟΥΝ ΜΕ ΜΟΡΙΑ:" . $newlimit);

        $points_arr = [];
        foreach ($students as $student) {
            if ($student->currentepal !== $student->epal_id) {
                $points_arr[] = $student->points;
            }
        }

        rsort($points_arr);
        //for ($i=0; $i < sizeof($points_arr); $i++)
            //print_r("<br>ΜΟΡΙΑ ΜΕΤΑ ΤΗΝ ΤΑΞΙΝΟΜΙΣΗ: " . $points_arr[$i]);

        //print_r("<br>ΟΡΙΟ ΜΟΡΙΩΝ: " . $points_arr[$newlimit-1]);

        $transaction = $this->connection->startTransaction();

        foreach ($students as $student) {
            if ($student->currentepal !== $student->epal_id) {
                if ($student->points < $points_arr[$newlimit-1]) {
                    //print_r("<br>ΣΕ ΕΚΚΡΕΜΟΤΗΤΑ - ΔΙΑΓΡΑΦΗ: " . $student->student_id);
                    //βάλε τον μαθητή στον πίνακα εκκρεμοτήτων και διέγραψέ τον από τον προσωρινό πίνακα αποτελεσμάτων
                    array_push($this->pendingStudents, $student->student_id);
                    try {
                        $this->connection->delete('epal_student_class')
							->condition('student_id', $student->student_id)
							->execute();
                    } catch (\Exception $e) {
                        $this->logger->error($e->getMessage());
                        $transaction->rollback();
                        return $this->respondWithStatus([
							"message" => t("An unexpected problem occured during DELETE proccess in makeSelectionOfStudents Method of Distribution")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                } else {
                    if ($this->choice_id !== 1) {
                        //διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
                        $this->removeFromPendingStudents($student->student_id);
                    }
                }
            }
        }

        return $this->respondWithStatus([
			"message" => t("makeSelectionOfStudents Method of Distribution has made successfully")
		], Response::HTTP_OK);
    }

    public function makeSelectionOfStudents(&$students, $limit)
    {
        // συνάρτηση επιλογής μαθητών σε περίπτωση υπερχείλισης
        // (1) έχουν απόλυτη προτεραιότητα όσοι ήδη φοιτούσαν στο σχολείο (σε περίπτωση που φοιτούσαν περισσότεροι από την χωρητικότητα, τους δεχόμαστε όλους)
        // (2) αν απομένουν κενές θέσεις,...τοποθέτησε και όλους τους άλλους!!.

        //αν capacity = 0, ..διέγραψέ τους από εκεί που τοποθετήθηκαν προσωρινά
        if ($limit === 0) {
            try {
                $clear_ids = array_map(function ($student) {
                    return $student->student_id;
                }, $students);
                $this->connection->delete('epal_student_class')
                    ->condition('student_id', $clear_ids, 'IN')
                    ->execute();
            } catch (\Exception $e) {
                $this->logger->error($e->getMessage());
                return self::ERROR_DB;
            }
            return self::SUCCESS;
        }

        // εύρεση αριθμού μαθητών που ήδη φοιτούσαν στο σχολείο
        $cnt = 0;
        foreach ($students as $student) {
            if ($student->currentepal === $student->epal_id) {
                $cnt++;
                if ($this->choice_id !== 1) {
                    // διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
                    // Κάτι τέτοιο δεν είναι δυνατό πια! (έκδοση χωρίς μόρια..)
                    $this->removeFromPendingStudents($student->student_id);
                }
            }
        }

        $newlimit = $limit - $cnt;
        //Αν δεν απέμειναν θέσεις (δηλαδή αν η χωρητικότητα είναι μικρότερη ή ίση από το πλήθος μαθητών που ήδη φοιτούν στο σχολείο)
        //τότε διέγραψέ τους από τον προσωρινό πίνακα αποτελεσμάτων και βάλε τους στον στον πίνακα εκκρεμοτήτων
        $not_current_students = array_filter($students, function ($student) {
            return $student->currentepal !== $student->epal_id;
        });
        if (count($not_current_students) > 0) {
            try {
                $clear_ids = array_map(function ($student) {
                    return $student->student_id;
                }, $not_current_students);
                if ($newlimit <= 0) {
                    $this->pendingStudents = array_merge($this->pendingStudents, $clear_ids);
                    $this->connection->delete('epal_student_class')
                        ->condition('student_id', $clear_ids, 'IN')
                        ->execute();
                } else { // $newlimit > 0
                    if ($this->choice_id !== 1) {
                        $this->removeFromPendingStudents($clear_ids);
                    }
                }
            } catch (\Exception $e) {
                $this->logger->error($e->getMessage());
                return self::ERROR_DB;
            }
        }

        return self::SUCCESS;
    }

    private function initializeResults()
    {
		//initialize/empty epal_student_class if there are already data in it!
        try {
            $this->connection->delete('epal_student_class')->execute();
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }

		return self::SUCCESS;
    }

    private function findSmallClasses()
    {
        //Για κάθε σχολείο βρες τα ολιγομελή τμήματα
        $sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
            ->fields('eSchool', array('id', 'metathesis_region','operation_shift'));
        $eepalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

        foreach ($eepalSchools as $eepalSchool) {

            // Α' τάξη
            if ($this->isSmallClass($eepalSchool->id, "1", "-1", $eepalSchool->metathesis_region) === self::SMALL_CLASS) {
                if ($this->markStudentsInSmallClass($eepalSchool->id, "1", "-1") === self::ERROR_DB) {
                    return self::ERROR_DB;
                }
            }

            // Β' τάξη
            $sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
                ->fields('eSchool', array('epal_id', 'sector_id'))
                ->condition('eSchool.epal_id', $eepalSchool->id, '=');
            $eepalSectorsInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            foreach ($eepalSectorsInEpal as $eepalSecInEp) {
                if ($this->isSmallClass($eepalSchool->id, "2", $eepalSecInEp->sector_id, $eepalSchool->metathesis_region) === self::SMALL_CLASS) {
                    if ($this->markStudentsInSmallClass($eepalSchool->id, "2", $eepalSecInEp->sector_id) === self::ERROR_DB) {
                        return self::ERROR_DB;
                    }
                }
            }

            // Γ' τάξη
            $sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
                ->fields('eSchool', array('epal_id', 'specialty_id'))
                ->condition('eSchool.epal_id', $eepalSchool->id, '=');
            $eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp) {
                if ($this->isSmallClass($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id, $eepalSchool->metathesis_region) === self::SMALL_CLASS) {
                    if ($this->markStudentsInSmallClass($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id) === self::ERROR_DB) {
                        return self::ERROR_DB;
                    }
                }
            }

            // Δ' τάξη
            if ($eepalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ") {
                $sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
                    ->fields('eSchool', array('epal_id', 'specialty_id'))
                    ->condition('eSchool.epal_id', $eepalSchool->id, '=');
                $eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp) {
                    if ($this->isSmallClass($eepalSchool->id, "4", $eepalSpecialInEp->specialty_id, $eepalSchool->metathesis_region) === self::SMALL_CLASS) {
                        if ($this->markStudentsInSmallClass($eepalSchool->id, "4", $eepalSpecialInEp->specialty_id) === self::ERROR_DB) {
                            return self::ERROR_DB;
                        }
                    }
                }
            } //end if ΕΣΠΕΡΙΝΟ
        } //end for each school/department

        return self::SUCCESS;
    }   //end function


    private function isSmallClass($schoolId, $classId, $sectorOrcourseId, $regionId)
    {

        $limitDown = $this->retrieveLimitDown($classId, $regionId);

        if ($limitDown === self::NO_CLASS_LIMIT_DOWN) {
            return self::NO_CLASS_LIMIT_DOWN;
        } elseif ($limitDown === self::ERROR_DB) {
            return self::ERROR_DB;
        }

        $numStudents = $this->countStudents($schoolId, $classId, $sectorOrcourseId);

        if ($numStudents === self::ERROR_DB) {
            return self::ERROR_DB;
        }

        //Αν $numStudents == 0, γύρισε false, ώστε να μη γίνει περιττή κλήση στην markStudentsInSmallClass
        if (($numStudents < $limitDown) && ($numStudents > 0)) {
            return self::SMALL_CLASS;
        } else {
            return self::NON_SMALL_CLASS;
        }
    }

    private function retrieveLimitDown($classId, $regionId)
    {

        try {
            $sCon = $this->connection->select('epal_class_limits', 'eClassLimit')
                ->fields('eClassLimit', array('limit_down'))
                ->condition('eClassLimit.name', $classId, '=')
                ->condition('eClassLimit.category', $regionId, '=');
            $classLimits = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            if (sizeof($classLimits) === 1) {
                $classLimit = reset($classLimits);
                return $classLimit->limit_down;
            } else {
                return self::NO_CLASS_LIMIT_DOWN;
            }
        } //end try
        catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }
    } //end function

    private function countStudents($schoolId, $classId, $sectorOrcourseId)
    {
        try {
            $sCon = $this->connection->select('epal_student_class', 'eStudent')
                ->fields('eStudent', array('id'))
                ->condition('eStudent.epal_id', $schoolId, '=')
                ->condition('eStudent.currentclass', $classId, '=')
                ->condition('eStudent.specialization_id', $sectorOrcourseId, '=');
            return $sCon->countQuery()->execute()->fetchField();
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }
    }

    private function markStudentsInSmallClass($schoolId, $classId, $sectorOrcourseId)
    {
        try {
            $query = $this->connection->update('epal_student_class');
            $query->fields(['finalized' => 0]);
            $query->condition('epal_id', $schoolId);
            $query->condition('currentclass', $classId);
            if ($sectorOrcourseId !== "-1") {
                $query->condition('specialization_id', $sectorOrcourseId);
            }
            $query->execute();
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }
        return self::SUCCESS;
    }

    public function locateSecondPeriodStudents(Request $request)
    {
        set_time_limit(600); // dev

        //POST method is checked
        if (!$request->isMethod('POST')) {
            return $this->respondWithStatus([
				"message" => t("Method Not Allowed")
			], Response::HTTP_METHOD_NOT_ALLOWED);
        }

        //user validation
        $authToken = $request->headers->get('PHP_AUTH_USER');
        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if (!$user) {
			return $this->respondWithStatus([
				'message' => t("User not found"),
			], Response::HTTP_FORBIDDEN);
        }

        //user role validation
        if (false === in_array('ministry', $user->getRoles())) {
			return $this->respondWithStatus([
				'message' => t("User Invalid Role"),
			], Response::HTTP_FORBIDDEN);
        }

        //check where distribution can be done now
        $secondPeriodEnabled = "0";

        $config_storage = $this->entityTypeManager->getStorage('epal_config');
        $epalConfigs = $config_storage->loadByProperties(array('id' => 1));
        $epalConfig = reset($epalConfigs);
        if (!$epalConfig) {
             return $this->respondWithStatus([
				'message' => t("EpalConfig Enity not found"),
			], Response::HTTP_FORBIDDEN);
        } else {
             $secondPeriodEnabled = $epalConfig->activate_second_period->getString();
        }
        if ($secondPeriodEnabled === "0") {
             return $this->respondWithStatus([
				'message' => t("secondPeriodEnabled setting is false"),
			], Response::HTTP_FORBIDDEN);
        }

        $transaction = $this->connection->startTransaction();

        try {
            if ($this->initializeResultsInSecondPeriod() === self::ERROR_DB) {
				$transaction->rollback();
				return $this->respondWithStatus([
					"message" => t("Unexpected Error")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // τοποθέτηση όλων των μαθητών Β' περιόδου στην πρώτη τους προτίμηση'
            $this->globalCounterId = $this->retrieveLastStudentId() + 1;
            if ($this->locateStudent(1, self::IS_SECOND_PERIOD) === self::ERROR_DB) {
				$transaction->rollback();
				return $this->respondWithStatus([
					"message" => t("Unexpected Error"),
				], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            //επαναϋπολογισμός όλων των ολιγομελών τμημάτων (Προσοχή: αφορά ΟΛΟΥΣ τους μαθητές - κανονικής και Β΄ περιόδου)

            //αρχικοποίηση flag finalize σε 1 για όλους
            if ($this->setFinalize() === self::ERROR_DB) {
				$transaction->rollback();
				return $this->respondWithStatus([
					"message" => t("Unexpected Error")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            //εύρεση ολιγομελών και καταχώρηση μαθητών σε αυτά με κατάλληλη ένδειξη (finalize=0)
            if ($this->findSmallClasses() === self::ERROR_DB) {
				//αν αποτύχει, δεν γίνεται rollback. --> Λύση: διαγρα΄φή των όποιων αποτελεσμάτων
                // if ($this->initializeResultsInSecondPeriod() === self::ERROR_DB) {
				// 	$transaction->rollback();
				// 	return $this->respondWithStatus([
				// 		"message" => t("Unexpected Error in initializeResults function AFTER findSmallClasses call Function")
				// 	], Response::HTTP_INTERNAL_SERVER_ERROR);
                // }

				$transaction->rollback();
				return $this->respondWithStatus([
					"message" => t("Unexpected Error")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
			$transaction->rollback();
            return $this->respondWithStatus([
                "message" => t("Unexpected Error")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

		return $this->respondWithStatus([
			'message' => "locateSecondPeriodStudents has made successfully",
		], Response::HTTP_OK);
    }

    private function setFinalize()
    {
        try {
            $query = $this->connection->update('epal_student_class');
            $query->fields([
                'finalized' => 1,
            ]);
            $query->execute();
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }
        return self::SUCCESS;
    }

    private function initializeResultsInSecondPeriod()
    {
		// initialize/empty epal_student_class if there are already data in it!
        try {
            $this->connection->delete('epal_student_class')
                ->condition('second_period', 1)
                ->execute();
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());
            return self::ERROR_DB;
        }

		return self::SUCCESS;
    }

    private function retrieveLastStudentId()
    {
        $sCon = $this->connection->select('epal_student', 'eStudent');
        $sCon->addExpression('max(eStudent.id)', 'max_id');
        $max_id = intval($sCon->execute()->fetchField());

        return $max_id;
    }


    private function respondWithStatus($arr, $s)
    {
		$res = new JsonResponse($arr);
		$res->setStatusCode($s);
		return $res;
    }

}
