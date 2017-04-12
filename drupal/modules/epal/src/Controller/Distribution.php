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

		/*
		if (!$request->isMethod('POST')) {
			return $this->respondWithStatus([
					"message" => t("Method Not Allowed")
				], Response::HTTP_METHOD_NOT_ALLOWED);
    	}
		*/

		//clearDistributionResults();

		$transaction = $this->connection->startTransaction();

		try {

			//initialize/empty epal_student_class if there are already data in it!
			$this->connection->delete('epal_student_class')->execute();

			$limitUp_class = $this->retrieveCapacityLimitUp("Α");
			print_r("<br> ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ: " . $limitUp_class);

			while ($this->choice_id <= $numDistributions)	 {

				print_r("<br>ΠΕΡΑΣΜΑ: " . $this->choice_id);

				//υπολογισμός πλήθους non-finalized αιτήσεων για να καθοριστεί ο αριθμός των fetches που θα κάνουμε με συγκεκριμένο sizeOfBlock
				if ($this->choice_id === 1)	{
					$sCon = $this->connection->select('epal_student', 'eStudent')
																		->fields('eStudent', array('id'));
			 	  $numData = $sCon->countQuery()->execute()->fetchField();
					print_r("<br>numData: " .  $numData);
				}

				$j = 1;
				$num = 1;
				if ($this->choice_id === 1) {
							while ($num <= $numData)	{

								print_r("<br>FETCH: " .  $j);
								$sCon = $this->connection->select('epal_student', 'eStudent')
																					->fields('eStudent', array('id', 'name', 'currentclass', 'currentepal', 'points'))
																			    ->condition('eStudent.id', 1+ $sizeOfBlock*($j-1), '>=')
																					->condition('eStudent.id', $j*$sizeOfBlock, '<=');
								$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

								$this->locateStudent($this->choice_id, $epalStudents);

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

									//foreach ($epalStudents as $x)
									//	print_r("<br> TEST:" .  $x->id . "  ");

									$this->locateStudent($this->choice_id, $epalStudents);
								}
								else {	//αν δεν υπάρχουν εκκρεμότητες, μην συνεχίζεις με άλλο πέρασμα
									break;
								}
						}

				//Για κάθε σχολείο βρες τα τμήματα
				//Για κάθε τμήμα βρες αν χωράνε και διευθέτησε (checkCapacityAndArrange)
				//checkCapacityAndArrange (school_id, class_id, sectorORcourse_id, limitUp, schoolCapacity)

				$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
																	->fields('eSchool', array('id', 'capacity_class_a'));
																	//->condition('eSchool.id', 151, '>=')
																	//->condition('eSchool.id', 153, '<=');	//προσαρμοσμένο για τα demo data --> να αλλάξει
				$eepalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				foreach ($eepalSchools as $eepalSchool)	{

						$this->checkCapacityAndArrange($eepalSchool->id, "1", "-1", $limitUp_class, $eepalSchool->capacity_class_a);

						$sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
																			->fields('eSchool', array('epal_id', 'sector_id', 'capacity_class_sector'))
																			->condition('eSchool.epal_id', $eepalSchool->id, '=');
						$eepalSectorsInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($eepalSectorsInEpal as $eepalSecInEp)	{
							$this->checkCapacityAndArrange($eepalSchool->id, "2", $eepalSecInEp->sector_id, $limitUp_class, $eepalSecInEp->capacity_class_sector);
					  }

						$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																			->fields('eSchool', array('epal_id', 'specialty_id', 'capacity_class_specialty'))
																			->condition('eSchool.epal_id', $eepalSchool->id, '=');
						$eepalSpecialtiesInEpal = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp)	{
							$this->checkCapacityAndArrange($eepalSchool->id, "3", $eepalSpecialInEp->specialty_id, $limitUp_class, $eepalSpecialInEp->capacity_class_specialty);
						}

					} //end for each school/department

					$this->choice_id++;

	  	} //end while

		}	//end try

		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			$transaction->rollback();
			return $this->respondWithStatus([
					"message" => t("An unexpected problem occured")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

		return $this->respondWithStatus([
					"message" => t("Distribution has made successfully")
				], Response::HTTP_OK);

	}


	public function locateStudent($choice_id, &$epalStudents)	{

		$epal_dist_id = -1;
		$specialization_id = -1;

		$transaction = $this->connection->startTransaction();

		try {

			foreach ($epalStudents as $epalStudent)	{
				print_r("<br>ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ ΝΟ: " . $choice_id);
				print_r("<br>ΜΑΘΗΤΗΣ: " .  $epalStudent->id);

				$clCon = $this->connection->select('epal_student_epal_chosen', 'epals')
					->fields('epals', array('student_id', 'epal_id', 'choice_no'))
					->condition('epals.student_id', $epalStudent->id , '=')
					->condition('epals.choice_no', $choice_id , '=');
				$epalSchoolsChosen = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				if (sizeof($epalSchoolsChosen) !==  0)	{
					$epalSchoolChos = reset($epalSchoolsChosen);
					print_r(" SCHOOL_ID:" . $epalSchoolChos->epal_id . " STUDENT_ID " . $epalStudent->id);
					$epal_dist_id = $epalSchoolChos->epal_id;

					if ($epalStudent->currentclass === "2")	{
						$clCon = $this->connection->select('epal_student_sector_field', 'sectors')
							->fields('sectors', array('student_id', 'sectorfield_id'))
							->condition('sectors.student_id', $epalStudent->id , '=');
						$epalSectorChosen = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						$epalSecChos = reset($epalSectorChosen);
					}
					elseif ($epalStudent->currentclass === "3")	{
						$clCon = $this->connection->select('epal_student_course_field', 'courses')
							->fields('courses', array('student_id', 'coursefield_id'))
							->condition('courses.student_id', $epalStudent->id , '=');
						$epalCourseChosen = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						$epalCourChos = reset($epalCourseChosen);
					}

					if ($epalStudent->currentclass === "2")
						$specialization_id = $epalSecChos->sectorfield_id;
					elseif ($epalStudent->currentclass === "3")
						$specialization_id = $epalCourChos->coursefield_id;
					else
						$specialization_id = -1;


				 //$currentTime = \Drupal\Core\TypedData\Plugin\DataType\TimeStamp::getDateTime();
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
							'points' => $epalStudent->points,
							'distribution_id' => $choice_id,
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
		return $this->respondWithStatus([
					"message" => t("An unexpected problem occured during locateStudent Method of Distribution")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
	}

	return $this->respondWithStatus([
			"message" => t("locateStudent Method of Distribution has made successfully")
		], Response::HTTP_OK);

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
		return $this->respondWithStatus([
					"message" => t("An unexpected problem occured during retrieveCapacityLimitUp Method of Distribution")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
	}

	return $row->limit_up;
 }

	public function checkCapacityAndArrange($epalId, $classId, $secCourId, $limitup, $capacity)	{

		$transaction = $this->connection->startTransaction();

		try {

			$clCon = $this->connection->select('epal_student_class', 'studentClass')
				->fields('studentClass', array('epal_id', 'student_id', 'points', 'currentepal', 'currentclass', 'specialization_id'))
				->condition('studentClass.epal_id', $epalId, '=')
				->condition('studentClass.currentclass', $classId, '=')
				->condition('studentClass.specialization_id', $secCourId, '=');
			$epalStudentClass = $clCon->execute()->fetchAll(\PDO::FETCH_OBJ);

			print_r("<br> ΣΧΟΛΕΙΟ: " .  $epalId . " ΤΑΞΗ: "  . $classId . " ΤΟΜΕΑΣ/ΕΙΔΙΚΟΤΗΤΑ: " . $secCourId .  " ΧΩΡΗΤΙΚΟΤΗΤΑ: " . sizeof($epalStudentClass));

			//ΕΠΙΠΛΕΟΝ ΕΠΙΠΕΔΟ ΑΣΦΑΛΕΙΑΣ: αν δεν υπάρχει ο συγκεκριμένος τομέας/ειδικότητα στο σχολείο
			//ο μαθητής που τοποθετήθηκε με την locateStudent να διαγραφεί
			//Σημείωση: κανονικά κάτι τέτοιο δεν μπορεί να συμβεί από το front-end (δηλ. μαθητής να δηλώσει τομέα/ειδικότητα που δεν προσφέρεται..)
			//ΑΝ ΜΠΕΙ ΠΡΕΠΕΙ ΝΑ ΕΝΣΩΜΑΤΩΘΕΙ ΣΤΗΝ LOCATESTUDENT..
			/*
			if (sizeof($epalStudentClass) === 0)	{
				//print_r("<br>ΜΠΗΚΑ! ");
				foreach ($epalStudentClass as $epalStudCl)	{
					//print_r("<br>ΜΠΗΚΑ! ΜΑΘΗΤΗΣ: " .  $epalStudCl->student_id);
					$query = $this->connection->delete('epal_student_class')
													->condition('student_id', $epalStudCl->student_id)
													->execute();
					}
			}
			*/
			//ΤΕΛΟΣ

			$limit = $limitup * $capacity;
			if (sizeof($epalStudentClass) > $limit)	{
				print_r("<br>ΥΠΕΡΧΕΙΛΙΣΗ!");
				foreach ($epalStudentClass as $epalStudCl)	{
					//Υπολογισμός μορίων του μαθητή και (πιθανή) αποθήκευσή τους
					//ΣΗΜΕΙΩΣΗ: Ο υπoλογισμός γίνεται στο front-end

					//$points = $this->calculatePoints();
					/*
					$query = $this->connection->update('epal_student');
					$query->fields([
						'points' =>$points,
					]);
					$query->condition('id',$epalStudCl->student_id);
					$query->execute();
					*/

				}
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
		return $this->respondWithStatus([
					"message" => t("An unexpected problem occured during checkCapacityAndArrange Method of Distribution")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
	}

	return $this->respondWithStatus([
				"message" => t("checkCapacityAndArrange Method of Distribution has made successfully")
			], Response::HTTP_OK);

	}


	public function removeFromPendingStudents($val)	{
		if(($key = array_search($val, $this->pendingStudents)) !== false) {
		   unset($this->pendingStudents[$key]);
		}
		//$this->pendingStudents = array_diff($this->pendingStudents, array($val));
	}

	public function makeSelectionOfStudents(&$students, $limit)	{
		//συνάρτηση επιλογής μαθητών σε περίπτωση υπερχείλισης
		// (1) έχουν απόλυτη προτεραιότητα όσοι ήδη φοιτούσαν στο σχολείο (σε περίπτωση που φοιτούσαν περισσότεροι από την χωρητικότητα, τους δεχόμαστε όλους)
		// (2) αν απομένουν κενές θέσεις, επέλεξε από τους εναπομείναντες μαθητές αυτούς με τα περισσότερα μόρια. Σε περίπτωση ισοβαθμίας δεχόμαστε όλους όσους ισοβαθμούν.
		//αυτοδίκαια έχουν προτεραιότητα όσοι ήδη φοιτούσαν στο σχολείο

		foreach($students as $student)	{
			$student->student_id;
			print_r("<br>STUDENT_ID:" . $student->student_id);
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
		print_r("<br>#ΕΓΓΡΑΦΩΝ ΠΟΥ ΟΙ ΜΑΘΗΤΕΣ ΦΟΙΤΟΥΣΑΝ ΗΔΗ:" . $cnt);

		$newlimit = $limit - $cnt;
		print_r("<br>ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ:" . $limit);
		print_r("<br>#ΜΑΘΗΤΩΝ ΓΙΑ ΝΑ ΕΠΙΛΕΓΟΥΝ ΜΕ ΜΟΡΙΑ:" . $newlimit);

		$points_arr = [];
		foreach($students as $student)	{
			if ($student->currentepal !== $student->epal_id)
				$points_arr[] = $student->points;
		}

		rsort($points_arr);
		for ($i=0; $i < sizeof($points_arr); $i++)
			print_r("<br>ΜΟΡΙΑ ΜΕΤΑ ΤΗΝ ΤΑΞΙΝΟΜΙΣΗ: " . $points_arr[$i]);

		print_r("<br>ΟΡΙΟ ΜΟΡΙΩΝ: " . $points_arr[$newlimit-1]);

		$transaction = $this->connection->startTransaction();

		foreach($students as $student)	{
			if ($student->currentepal !== $student->epal_id)	{
				if ($student->points < $points_arr[$newlimit-1]) {
					print_r("<br>ΣΕ ΕΚΚΡΕΜΟΤΗΤΑ - ΔΙΑΓΡΑΦΗ: " . $student->student_id);
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

	public function calculatePoints()	{

			return rand(0,20);

	}

	private function respondWithStatus($arr, $s) {
				$res = new JsonResponse($arr);
				$res->setStatusCode($s);
				return $res;
		}




}
