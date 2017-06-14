<?php
/**
 * @file
 * Contains \Drupal\query_example\Controller\QueryExampleController.
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

define("SUCCESS", 0);
define("ERROR_DB", -1);
define("NO_CLASS_LIMIT_DOWN", -2);
define("SMALL_CLASS", 1);
define("NON_SMALL_CLASS", 2);

class Distribution extends ControllerBase {

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

		LoggerChannelFactoryInterface $loggerChannel)
		{
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


	public function createDistribution(Request $request) {

		$numDistributions = 3;
		$sizeOfBlock = 100000;

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
		$roles = $user->getRoles();
		$validRole = false;
		foreach ($roles as $role)
			if ($role === "ministry") {
				$validRole = true;
				break;
			}
		if (!$validRole) {
				return $this->respondWithStatus([
								'message' => t("User Invalid Role"),
						], Response::HTTP_FORBIDDEN);
		}


		//check where distribution can be done now ($capacityDisabled / $directorViewDisabled settings)
		$capacityDisabled = "0";
		$directorViewDisabled = "0";
		$applicantsResultsDisabled = "0";
		$config_storage = $this->entityTypeManager->getStorage('epal_config');
		$epalConfigs = $config_storage->loadByProperties(array('id' => 1));
		$epalConfig = reset($epalConfigs);
		if (!$epalConfig) {
			 return $this->respondWithStatus([
							 'message' => t("EpalConfig Enity not found"),
					 ], Response::HTTP_FORBIDDEN);
		}
		else {
			 $capacityDisabled = $epalConfig->lock_school_capacity->getString();
			 $directorViewDisabled = $epalConfig->lock_school_students_view->getString();
			 $applicantsResultsDisabled = $epalConfig->lock_results->getString();
		}
		if ($capacityDisabled === "0" || $directorViewDisabled === "0" || $applicantsResultsDisabled === "0")  {
			 return $this->respondWithStatus([
							 'message' => t("capacityDisabled and / or directorViewDisabled settings are false"),
					 ], Response::HTTP_FORBIDDEN);
		}






		$transaction = $this->connection->startTransaction();

		try {

			//initialize/empty epal_student_class if there are already data in it!
			if ($this->initializeResults() === ERROR_DB)
					return $this->respondWithStatus([
							"message" => t("Unexpected Error in initializeResults function")
						], Response::HTTP_INTERNAL_SERVER_ERROR);

			if ( ($limitUp_class = $this->retrieveCapacityLimitUp("1") ) === ERROR_DB)
			//if ($limitUp_class === DB_ERROR)
					return $this->respondWithStatus([
							"message" => t("Unexpected Error in retrieveCapacityLimitUp function")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
			//print_r("<br> ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ: " . $limitUp_class);

			while ($this->choice_id <= $numDistributions)	 {

				//υπολογισμός πλήθους non-finalized δηλώσεων για να καθοριστεί ο αριθμός των fetches που θα κάνουμε με συγκεκριμένο sizeOfBlock
				if ($this->choice_id === 1)	{
					$sCon = $this->connection->select('epal_student', 'eStudent')
																		->fields('eStudent', array('id'));
			 	  $numData = $sCon->countQuery()->execute()->fetchField();
					//print_r("<br>numData: " .  $numData);
				}

				$j = 1;
				$num = 1;
				if ($this->choice_id === 1) {
							while ($num <= $numData)	{

								//print_r("<br>FETCH: " .  $j);
								$sCon = $this->connection->select('epal_student', 'eStudent')
																					->fields('eStudent', array('id', 'name', 'currentclass', 'currentepal', 'points'))
																			    ->condition('eStudent.id', 1+ $sizeOfBlock*($j-1), '>=')
																					->condition('eStudent.id', $j*$sizeOfBlock, '<=');
								$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

								if ($this->locateStudent($this->choice_id, $epalStudents) === ERROR_DB)
										return $this->respondWithStatus([
												"message" => t("Unexpected Error in locateStudent function")
											], Response::HTTP_INTERNAL_SERVER_ERROR);

								$num = $num + sizeof($epalStudents);
								$j = $j + 1;
							}
						}
				else {

								if (sizeof($this->pendingStudents) != 0)	{
									$sCon = $this->connection->select('epal_student', 'eStudent')
																						->fields('eStudent', array('id', 'name', 'currentclass', 'currentepal', 'points'))
																						->condition('eStudent.id', $this->pendingStudents, 'IN');
									$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

									if ($this->locateStudent($this->choice_id, $epalStudents) === ERROR_DB)
											return $this->respondWithStatus([
													"message" => t("Unexpected Error in locateStudent function")
												], Response::HTTP_INTERNAL_SERVER_ERROR);

								}
								else {	//αν δεν υπάρχουν εκκρεμότητες, μην συνεχίζεις με άλλο πέρασμα
									break;
								}
						}

				//Για κάθε σχολείο βρες τα τμήματα
				//Για κάθε τμήμα βρες αν χωράνε και διευθέτησε (checkCapacityAndArrange)
				//checkCapacityAndArrange (school_id, class_id, sectorORcourse_id, limitUp, schoolCapacity)

				$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
																	->fields('eSchool', array('id', 'capacity_class_a', 'operation_shift'));
				$eepalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				foreach ($eepalSchools as $eepalSchool)	{

						if ($this->checkCapacityAndArrange($eepalSchool->id, "1", "-1", $limitUp_class, $eepalSchool->capacity_class_a) === ERROR_DB)
								return $this->respondWithStatus([
										"message" => t("Unexpected Error in checkCapacityAndArrange function")
									], Response::HTTP_INTERNAL_SERVER_ERROR);

						$sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
																			->fields('eSchool', array('epal_id', 'sector_id', 'capacity_class_sector'))
																			->condition('eSchool.epal_id', $eepalSchool->id, '=');
						$eepalSectorsInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($eepalSectorsInEpal as $eepalSecInEp)	{
							if ($this->checkCapacityAndArrange($eepalSchool->id, "2", $eepalSecInEp->sector_id, $limitUp_class, $eepalSecInEp->capacity_class_sector) === ERROR_DB)
									return $this->respondWithStatus([
											"message" => t("Unexpected Error in checkCapacityAndArrange function")
										], Response::HTTP_INTERNAL_SERVER_ERROR);
					  }

						$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																			->fields('eSchool', array('epal_id', 'specialty_id', 'capacity_class_specialty'))
																			->condition('eSchool.epal_id', $eepalSchool->id, '=');
						$eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp)	{
							//Γ' Λυκείου
							if ($this->checkCapacityAndArrange($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id, $limitUp_class, $eepalSpecialInEp->capacity_class_specialty) === ERROR_DB)
									return $this->respondWithStatus([
											"message" => t("Unexpected Error in checkCapacityAndArrange function")
										], Response::HTTP_INTERNAL_SERVER_ERROR);
							//Δ' Λυκείου
							if ($eepalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ")	{
								if ($this->checkCapacityAndArrange($eepalSchool->id, "4", $eepalSpecialInEp->specialty_id, $limitUp_class, $eepalSpecialInEp->capacity_class_specialty) === ERROR_DB)
										return $this->respondWithStatus([
												"message" => t("Unexpected Error in checkCapacityAndArrange function")
											], Response::HTTP_INTERNAL_SERVER_ERROR);
							}
						}

					} //end for each school/department

					$this->choice_id++;

	  	} //end while

			if ($this->findSmallClasses() === ERROR_DB)	{
					return $this->respondWithStatus([
							"message" => t("Unexpected Error in findSmallClasses function AFTER initial Distribution!")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
						//αν αποτύχει, δεν γίνεται rollback. --> Λύση: διαγρα΄φή των όποιων αποτελεσμάτων
						if ($this->initializeResults() === ERROR_DB)
								return $this->respondWithStatus([
										"message" => t("Unexpected Error in initializeResults function AFTER findSmallClasses call Function")
									], Response::HTTP_INTERNAL_SERVER_ERROR);

			}



		}	//end try

		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			$transaction->rollback();
			return $this->respondWithStatus([
					"message" => t("An unexpected problem occured in createDistribution Method")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

		$postData = null;
		if ($content = $request->getContent()) {
				$postData = json_decode($content);
				return $this->respondWithStatus([
						'message' => "Distribution has made successfully",
				], Response::HTTP_OK);
			}
			else {
				return $this->respondWithStatus([
						'message' => t("post with no data"),
				], Response::HTTP_BAD_REQUEST);
			}

	}


	public function locateStudent($choice_id, &$epalStudents)	{

		$epal_dist_id = -1;
		$specialization_id = -1;

		$transaction = $this->connection->startTransaction();

		try {

			foreach ($epalStudents as $epalStudent)	{
				//print_r("<br>ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ ΝΟ: " . $choice_id);
				//print_r("<br>ΜΑΘΗΤΗΣ: " .  $epalStudent->id);

				$clCon = $this->connection->select('epal_student_epal_chosen', 'epals')
					->fields('epals', array('student_id', 'epal_id', 'choice_no'))
					->condition('epals.student_id', $epalStudent->id , '=')
					->condition('epals.choice_no', $choice_id , '=');
				$epalSchoolsChosen = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				if (sizeof($epalSchoolsChosen) !==  0)	{
					$epalSchoolChos = reset($epalSchoolsChosen);
					//print_r(" SCHOOL_ID:" . $epalSchoolChos->epal_id . " STUDENT_ID " . $epalStudent->id);
					$epal_dist_id = $epalSchoolChos->epal_id;

					if ($epalStudent->currentclass === "2")	{
						$clCon = $this->connection->select('epal_student_sector_field', 'sectors')
							->fields('sectors', array('student_id', 'sectorfield_id'))
							->condition('sectors.student_id', $epalStudent->id , '=');
						$epalSectorChosen = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						$epalSecChos = reset($epalSectorChosen);
					}
					//Δ'Λυκείου - Γ' Λυκείου
					elseif ($epalStudent->currentclass === "3" || $epalStudent->currentclass === "4")	{
						$clCon = $this->connection->select('epal_student_course_field', 'courses')
							->fields('courses', array('student_id', 'coursefield_id'))
							->condition('courses.student_id', $epalStudent->id , '=');
						$epalCourseChosen = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						$epalCourChos = reset($epalCourseChosen);
					}

					if ($epalStudent->currentclass === "2")
						$specialization_id = $epalSecChos->sectorfield_id;
					//Δ'Λυκείου - Γ' Λυκείου
					elseif ($epalStudent->currentclass === "3" || $epalStudent->currentclass === "4")
						$specialization_id = $epalCourChos->coursefield_id;
					else
						$specialization_id = -1;


					$timestamp = strtotime(date("Y-m-d"));


					$this->connection->insert('epal_student_class')->fields(
						array('id' => $this->globalCounterId++,
							'uuid' => \Drupal::service('uuid')->generate(),
							'langcode' => $this->language,
							'user_id' => $this->currentuser,
							'student_id'=> $epalStudent->id,
							'epal_id'=> $epal_dist_id,
							'currentclass' => $epalStudent->currentclass,
							'currentepal' => $epalStudent->currentepal,
							'specialization_id' => $specialization_id,
							//'points' => $epalStudent->points,
							'distribution_id' => $choice_id,
							'finalized' => 1,
							'status' => 1,
							'created' => $timestamp,
							'changed' => $timestamp,)
					)->execute();


			} //end if

		}	//foreach

	}

	catch (\Exception $e) {
		$this->logger->warning($e->getMessage());
		$transaction->rollback();
		return ERROR_DB;
	}

	return SUCCESS;

	}


 public function retrieveCapacityLimitUp($className) {

	 $transaction = $this->connection->startTransaction();

	 try {
		 $clCon = $this->connection->select('epal_class_limits', 'classLimits')
			 ->fields('classLimits', array('limit_up'))
			 ->condition('classLimits.name', $className, '=');
		 $results = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);
		 $row = reset($results);
 	}
	catch (\Exception $e) {
		$this->logger->warning($e->getMessage());
		$transaction->rollback();
		return ERROR_DB;
	}

	return $row->limit_up;
 }


public function checkCapacityAndArrange($epalId, $classId, $secCourId, $limitup, $capacity)	{

		if (!isset($capacity))	{
			//print_r("<br> ΜΠΗΚΑ!!! ");
			//print_r("<br> ΣΧΟΛΕΙΟ: " .  $epalId . " ΤΑΞΗ: "  . $classId . " ΤΟΜΕΑΣ/ΕΙΔΙΚΟΤΗΤΑ: " . $secCourId .  " ΧΩΡΗΤΙΚΟΤΗΤΑ: " . $capacity);
		 	$capacity = 0;
		}

		$transaction = $this->connection->startTransaction();

		try {

			$clCon = $this->connection->select('epal_student_class', 'studentClass')
				->fields('studentClass', array('epal_id', 'student_id', 'points', 'currentepal', 'currentclass', 'specialization_id'))
				->condition('studentClass.epal_id', $epalId, '=')
				->condition('studentClass.currentclass', $classId, '=')
				->condition('studentClass.specialization_id', $secCourId, '=');
			$epalStudentClass = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);

			$limit = $limitup * $capacity;
			if (sizeof($epalStudentClass) > $limit)	{
				//print_r("<br>ΥΠΕΡΧΕΙΛΙΣΗ!");

				//foreach ($epalStudentClass as $epalStudCl)	{
					//Υπολογισμός μορίων του μαθητή και (πιθανή) αποθήκευσή τους
					//ΣΗΜΕΙΩΣΗ: Ο υπoλογισμός γίνεται στο front-end
				//}
				$this->makeSelectionOfStudents($epalStudentClass,$limit);
			}
			else { //αφαίρεσε όσους μαθητές βρίσκονται στον πίνακα εκκρεμοτήτων
				foreach ($epalStudentClass as $epalStudCl) {
					if ($this->choice_id !== 1)
						////διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
						$this->removeFromPendingStudents($epalStudCl->student_id);
				}
			}

	}	//end try

	catch (\Exception $e) {
		$this->logger->warning($e->getMessage());
		$transaction->rollback();
		return ERROR_DB;
	}

	return SUCCESS;

	}


	public function removeFromPendingStudents($val)	{
		if(($key = array_search($val, $this->pendingStudents)) !== false) {
		   unset($this->pendingStudents[$key]);
		}
		//$this->pendingStudents = array_diff($this->pendingStudents, array($val));
	}

	public function makeSelectionOfStudents_VERSION_WITH_POINTS(&$students, $limit)	{
		//συνάρτηση επιλογής μαθητών σε περίπτωση υπερχείλισης
		// (1) έχουν απόλυτη προτεραιότητα όσοι ήδη φοιτούσαν στο σχολείο (σε περίπτωση που φοιτούσαν περισσότεροι από την χωρητικότητα, τους δεχόμαστε όλους)
		// (2) αν απομένουν κενές θέσεις, επέλεξε από τους εναπομείναντες μαθητές αυτούς με τα περισσότερα μόρια. Σε περίπτωση ισοβαθμίας δεχόμαστε όλους όσους ισοβαθμούν.

		foreach($students as $student)	{
			$student->student_id;
			//print_r("<br>STUDENT_ID:" . $student->student_id);
		}

		//εύρεση αριθμού μαθητών που ήδη φοιτούσαν στο σχολείο
		$cnt = 0;
		foreach($students as $student)	{
			if ($student->currentepal === $student->epal_id) {
				$cnt++;
				if ($this->choice_id !== 1)
					////διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
					$this->removeFromPendingStudents($student->student_id);
			}
		}
		//print_r("<br>#ΕΓΓΡΑΦΩΝ ΠΟΥ ΟΙ ΜΑΘΗΤΕΣ ΦΟΙΤΟΥΣΑΝ ΗΔΗ:" . $cnt);

		$newlimit = $limit - $cnt;
		//print_r("<br>ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ:" . $limit);
		//print_r("<br>#ΜΑΘΗΤΩΝ ΓΙΑ ΝΑ ΕΠΙΛΕΓΟΥΝ ΜΕ ΜΟΡΙΑ:" . $newlimit);

		$points_arr = [];
		foreach($students as $student)	{
			if ($student->currentepal !== $student->epal_id)
				$points_arr[] = $student->points;
		}

		rsort($points_arr);
		//for ($i=0; $i < sizeof($points_arr); $i++)
			//print_r("<br>ΜΟΡΙΑ ΜΕΤΑ ΤΗΝ ΤΑΞΙΝΟΜΙΣΗ: " . $points_arr[$i]);

		//print_r("<br>ΟΡΙΟ ΜΟΡΙΩΝ: " . $points_arr[$newlimit-1]);

		$transaction = $this->connection->startTransaction();

		foreach($students as $student)	{
			if ($student->currentepal !== $student->epal_id)	{
				if ($student->points < $points_arr[$newlimit-1]) {
					//print_r("<br>ΣΕ ΕΚΚΡΕΜΟΤΗΤΑ - ΔΙΑΓΡΑΦΗ: " . $student->student_id);
					//βάλε τον μαθητή στον πίνακα εκκρεμοτήτων και διέγραψέ τον από τον προσωρινό πίνακα αποτελεσμάτων
					array_push($this->pendingStudents, $student->student_id);
					try {
						$this->connection->delete('epal_student_class')
													->condition('student_id', $student->student_id)
													->execute();
					}
					catch (\Exception $e) {
						$this->logger->warning($e->getMessage());
						$transaction->rollback();
						return $this->respondWithStatus([
									"message" => t("An unexpected problem occured during DELETE proccess in makeSelectionOfStudents Method of Distribution")
								], Response::HTTP_INTERNAL_SERVER_ERROR);
					}

				}
				else {
					if ($this->choice_id !== 1)
						//διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
						$this->removeFromPendingStudents($student->student_id);
				}
			}
		}

		return $this->respondWithStatus([
				"message" => t("makeSelectionOfStudents Method of Distribution has made successfully")
			], Response::HTTP_OK);
	}



	public function makeSelectionOfStudents(&$students, $limit)	{
		//συνάρτηση επιλογής μαθητών σε περίπτωση υπερχείλισης
		// (1) έχουν απόλυτη προτεραιότητα όσοι ήδη φοιτούσαν στο σχολείο (σε περίπτωση που φοιτούσαν περισσότεροι από την χωρητικότητα, τους δεχόμαστε όλους)
		// (2) αν απομένουν κενές θέσεις,...τοποθέτησε και όλους τους άλλους!!.

		//εύρεση αριθμού μαθητών που ήδη φοιτούσαν στο σχολείο
		$cnt = 0;
		foreach($students as $student)	{
			if ($student->currentepal === $student->epal_id) {
				$cnt++;
				if ($this->choice_id !== 1)
					//διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
					//Κάτι τέτοιο δεν είναι δυνατό πια! (έκδοση χωρίς μόρια..)
					$this->removeFromPendingStudents($student->student_id);
			}
		}
		//print_r("<br>#ΕΓΓΡΑΦΩΝ ΠΟΥ ΟΙ ΜΑΘΗΤΕΣ ΦΟΙΤΟΥΣΑΝ ΗΔΗ:" . $cnt);

		$newlimit = $limit - $cnt;
		//print_r("<br>ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ:" . $limit);

		$transaction = $this->connection->startTransaction();

		//Αν δεν απέμειναν θέσεις (δηλαδή αν η χωρητικότητα είναι μικρότερη ή ίση από το πλήθος μαθητών που ήδη φοιτούν στο σχολείο)
		//τότε διέγραψέ τους από τον προσωρινό πίνακα αποτελεσμάτων και βάλε τους στον στον πίνακα εκκρεμοτήτων

	  foreach($students as $student)	{
				if ($student->currentepal !== $student->epal_id)	{
					if ($newlimit <= 0) {
						//print_r("<br>ΣΕ ΕΚΚΡΕΜΟΤΗΤΑ - ΔΙΑΓΡΑΦΗ: " . $student->student_id);
						array_push($this->pendingStudents, $student->student_id);
						try {
							$this->connection->delete('epal_student_class')
														->condition('student_id', $student->student_id)
														->execute();
						}
						catch (\Exception $e) {
							$this->logger->warning($e->getMessage());
							$transaction->rollback();
							return ERROR_DB;
						}
					} //endif new limit
					else { //$newlimit > 0
						//NEW CODE LINES
						if ($this->choice_id !== 1)
								$this->removeFromPendingStudents($student->student_id);
					}
					//END NEW CODE LINES
			 }	//endif currentepal
		}	//end foreach

		//NEW CODE LINES
		/*
		else {
			foreach($students as $student)
				if ($student->currentepal !== $student->epal_id)
					if ($this->choice_id !== 1)
							$this->removeFromPendingStudents($student->student_id);
		}
		*/
		//END NEW CODE LINES


		return SUCCESS;

	}	//end function







	public function calculatePoints()	{

			return rand(0,20);

	}

	private function respondWithStatus($arr, $s) {
				$res = new JsonResponse($arr);
				$res->setStatusCode($s);
				return $res;
		}

	private function initializeResults() {

			//initialize/empty epal_student_class if there are already data in it!
			try  {
				$this->connection->delete('epal_student_class')->execute();
			}
			catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return ERROR_DB;
			}
			return SUCCESS;
		}



	private function findSmallClasses()	{

		//Για κάθε σχολείο βρες τα ολιγομελή τμήματα
		$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
															->fields('eSchool', array('id', 'metathesis_region','operation_shift'));
		$eepalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

		foreach ($eepalSchools as $eepalSchool)	{

				//isSmallClass (school_id, class_id, sectorORcourse_id, school_category_metathesis)

				// Α' τάξη
				if ($this->isSmallClass($eepalSchool->id, "1", "-1", $eepalSchool->metathesis_region) === SMALL_CLASS)	{
					//print_r("<br> ΚΛΗΣΗ markStudentsInSmallClass: SCHOOL_ID: " . $eepalSchool->id . " CLASSID: " . "1 " . "SECTOR/COURSE ID: " . "-1 ");
					if ($this->markStudentsInSmallClass($eepalSchool->id, "1", "-1") === ERROR_DB )
						return ERROR_DB;
				}

				//print_r("<br>");


				// Β' τάξη
				$sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
																	->fields('eSchool', array('epal_id', 'sector_id'))
																	->condition('eSchool.epal_id', $eepalSchool->id, '=');
				$eepalSectorsInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				foreach ($eepalSectorsInEpal as $eepalSecInEp)	{
					if ($this->isSmallClass($eepalSchool->id, "2", $eepalSecInEp->sector_id, $eepalSchool->metathesis_region) === SMALL_CLASS)	{
						//print_r("<br> ΚΛΗΣΗ markStudentsInSmallClass: SCHOOL_ID: " . $eepalSchool->id . " CLASSID: " . "2 " . "SECTOR/COURSE ID: " . $eepalSecInEp->sector_id);
						if ($this->markStudentsInSmallClass($eepalSchool->id, "2", $eepalSecInEp->sector_id) === ERROR_DB )
							return ERROR_DB;
					}
					//print_r("<br>");
				}

				// Γ' τάξη
				$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																	->fields('eSchool', array('epal_id', 'specialty_id'))
																	->condition('eSchool.epal_id', $eepalSchool->id, '=');
				$eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp)	{
					if ($this->isSmallClass($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id, $eepalSchool->metathesis_region) === SMALL_CLASS)	{
						//print_r("<br> ΚΛΗΣΗ markStudentsInSmallClass: SCHOOL_ID: " . $eepalSchool->id . " CLASSID: " . "3 " . "SECTOR/COURSE ID: " . $eepalSpecialInEp->specialty_id);
						if ($this->markStudentsInSmallClass($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id) === ERROR_DB )
							return ERROR_DB;
					}
					//print_r("<br>");
				}

				// Δ' τάξη
				if ($eepalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ")	{
					$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																		->fields('eSchool', array('epal_id', 'specialty_id'))
																		->condition('eSchool.epal_id', $eepalSchool->id, '=');
					$eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp)	{
						if ($this->isSmallClass($eepalSchool->id, "4", $eepalSpecialInEp->specialty_id, $eepalSchool->metathesis_region) === SMALL_CLASS)	{
							//print_r("<br> ΚΛΗΣΗ markStudentsInSmallClass: SCHOOL_ID: " . $eepalSchool->id . " CLASSID: " . "4 " . "SECTOR/COURSE ID: " . $eepalSpecialInEp->specialty_id);
							if ($this->markStudentsInSmallClass($eepalSchool->id, "4", $eepalSpecialInEp->specialty_id) === ERROR_DB )
								return ERROR_DB;
						}
						//print_r("<br>");
					}
				}	//end if ΕΣΠΕΡΙΝΟ



			} //end for each school/department

			return SUCCESS;

	}	//end function


	private function isSmallClass($schoolId, $classId, $sectorOrcourseId, $regionId)	{

		//print_r("<br> ΚΛΗΣΗ isSmallClass: SCHOOL_ID: " . $schoolId . " CLASSID: " . $classId . "SECTOR/COURSE ID: " . $sectorOrcourseId . "ΠΕΡΙΟΧΗ ΜΕΤΑΘΕΣΗΣ: " . $regionId);

		$limitDown = $this->retrieveLimitDown($classId, $regionId);
		//print_r("<br> ΚΑΤΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ: " . $limitDown);

		if ($limitDown === NO_CLASS_LIMIT_DOWN)
			return NO_CLASS_LIMIT_DOWN;
		else if ($limitDown === ERROR_DB)
			return ERROR_DB;

		$numStudents = $this->countStudents($schoolId, $classId, $sectorOrcourseId);
		//print_r("<br> ΑΡΙΘΜΟΣ ΜΑΘΗΤΩΝ: " . $numStudents);

		if ($numStudents === ERROR_DB)
			return ERROR_DB;

		//Αν $numStudents == 0, γύρισε fasle, ώστε να μη γίνει περιττή κλήση στην markStudentsInSmallClass
		if ( ($numStudents < $limitDown) && ($numStudents > 0) )
			return SMALL_CLASS;
		else
			return NON_SMALL_CLASS;

	}

	private function retrieveLimitDown($classId, $regionId)	{

		try {
			$sCon = $this->connection->select('epal_class_limits', 'eClassLimit')
																->fields('eClassLimit', array('limit_down'))
																->condition('eClassLimit.name', $classId, '=')
																->condition('eClassLimit.category', $regionId, '=');
			$classLimits = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
			if (sizeof($classLimits) === 1)	{
				$classLimit = reset($classLimits);
				return $classLimit->limit_down;
			}
			else {
				return NO_CLASS_LIMIT_DOWN;
			}
		}	//end try
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return ERROR_DB;
		}

	}	//end function

	private function countStudents($schoolId, $classId, $sectorOrcourseId)	{

		try {
			$sCon = $this->connection->select('epal_student_class', 'eStudent')
																->fields('eStudent', array('id'))
																->condition('eStudent.epal_id', $schoolId , '=')
																->condition('eStudent.currentclass', $classId , '=')
																->condition('eStudent.specialization_id', $sectorOrcourseId , '=');
			return $sCon->countQuery()->execute()->fetchField();
		}
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return ERROR_DB;
		}

	}

	private function markStudentsInSmallClass($schoolId, $classId, $sectorOrcourseId)	{

		try  {
			$query = $this->connection->update('epal_student_class');
			$query->fields([
				'finalized' => 0,
			]);
			$query->condition('epal_id', $schoolId);
			$query->condition('currentclass', $classId);
			if ($sectorOrcourseId !== "-1")
				$query->condition('specialization_id', $sectorOrcourseId);
			$query->execute();
		}
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return ERROR_DB;
		}
		return SUCCESS;

	}



	public function locateSecondPeriodStudents(Request $request) {

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
		$roles = $user->getRoles();
		$validRole = false;
		foreach ($roles as $role)
			if ($role === "ministry") {
				$validRole = true;
				break;
			}
		if (!$validRole) {
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
		}
		else {
			 $secondPeriodEnabled = $epalConfig->activate_second_period->getString();
		}
		if ($secondPeriodEnabled === "0" )  {
			 return $this->respondWithStatus([
							 'message' => t("secondPeriodEnabled setting is false"),
					 ], Response::HTTP_FORBIDDEN);
		}


		try  {

			$sCon = $this->connection->select('epal_student', 'eStudent')
																->fields('eStudent', array('id', 'currentclass', 'currentepal'))
																->condition('eStudent.second_period', 1 , '=');
			$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

			//$this->globalCounterId = 10000;
			$this->globalCounterId = $this->retrieveLastStudentId() + 1;

			if ($this->locateStudent(1, $epalStudents) === ERROR_DB)
					return $this->respondWithStatus([
							"message" => t("Unexpected Error in locateStudent function")
						], Response::HTTP_INTERNAL_SERVER_ERROR);

			if ($this->findSmallClasses() === ERROR_DB)
					return $this->respondWithStatus([
							"message" => t("Unexpected Error in findSmallClasses function AFTER locateSecondPeriodStudents!")
						], Response::HTTP_INTERNAL_SERVER_ERROR);

			//αν αποτύχει, δεν γίνεται rollback. --> Λύση: διαγρα΄φή των όποιων αποτελεσμάτων ;;




		}
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return $this->respondWithStatus([
					"message" => t("An unexpected problem occured in locateSecondPeriodStudents Method")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

		$postData = null;
		if ($content = $request->getContent()) {
				$postData = json_decode($content);
				return $this->respondWithStatus([
						'message' => "locateSecondPeriodStudents has made successfully",
				], Response::HTTP_OK);
			}
			else {
				return $this->respondWithStatus([
						'message' => t("post with no data"),
				], Response::HTTP_BAD_REQUEST);
			}




	}

	private function retrieveLastStudentId()	{

		$sCon = $this->connection->select('epal_student', 'eStudent')
															->fields('eStudent', array('id'));
	  $sCon->orderBy('eStudent.id','desc');
		$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
		if ($epalStudents)	{
			$epalStrudent = reset($epalStudents);
			return $epalStrudent->id;
		}
		return 0;

	}




}
