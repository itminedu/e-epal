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
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;



class Distribution extends ControllerBase {

	protected $entity_query;
  protected $entityTypeManager;
  protected $logger;
  protected $connection;

	protected $pendingStudents = array();
	protected $choice_id = 1;

	public function __construct(
		EntityTypeManagerInterface $entityTypeManager,
		QueryFactory $entity_query,
		Connection $connection,
		LoggerChannelFactoryInterface $loggerChannel)
		{
			$this->entityTypeManager = $entityTypeManager;
			$this->entity_query = $entity_query;
			$this->connection = $connection;
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

		/*
		if (!$request->isMethod('POST')) {
			return $this->respondWithStatus([
					"message" => t("Method Not Allowed")
				], Response::HTTP_METHOD_NOT_ALLOWED);
    	}
		*/

		$limitUp_class = $this->retrieveCapacityLimitUp("Α");
		//print_r("<br> ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ: " . $limitUp_class);
		//$limitUp_classSector = $this->retrieveCapacityLimitUp("Β");
		//$limitUp_classCourse = $this->retrieveCapacityLimitUp("Γ");

		$sizeOfBlock = 200;
		$numDistributions = 3;

		//$choice_id = 1;
		while ($this->choice_id <= $numDistributions)	 {

				print_r("<br>ΠΕΡΑΣΜΑ: " . $this->choice_id);

				$epalStudents_storage = $this->entityTypeManager->getStorage('epal_student');

				//υπολογισμός πλήθους non-finalized αιτήσεων για να καθοριστεί ο αριθμός των fetches που θα κάνουμε με συγκεκριμένο sizeOfBlock
				if ($this->choice_id === 1)	{
					$idsStud = $epalStudents_storage->getQuery()
						->execute();
					$numData = sizeof($idsStud);
					print_r("<br> numData: " .  $numData);
					$epalStudents_storage->resetCache($idsStud);
				}

				$j = 1;
				$num = 1;
				if ($this->choice_id === 1) {
							while ($num <= $numData)	{
								print_r("<br>FETCH: " .  $j);
								$idsStud  = $epalStudents_storage->getQuery()
									->condition('id', 1+ $sizeOfBlock*($j-1), '>=')
									->condition('id', $j*$sizeOfBlock, '<=')
									->execute();
								$epalStudents = $epalStudents_storage->loadMultiple($idsStud);
								$this->locateStudent($this->choice_id, $epalStudents);

								$num = $num + sizeof($idsStud);
								$j = $j + 1;

								$epalStudents_storage->resetCache($idsStud);
							}
						}
				else {
								$idsStud  = $epalStudents_storage->getQuery()
									->condition('id', $this->pendingStudents,"IN")
									->execute();
								$epalStudents = $epalStudents_storage->loadMultiple($idsStud);
								$this->locateStudent($this->choice_id, $epalStudents);
						}

				//Για κάθε σχολείο βρες τα τμήματα
				//Για κάθε τμήμα βρες αν χωράνε και διευθέτησε (checkCapacityAndArrange)
				//checkCapacityAndArrange (school_id, class_id, sectorORcourse_id, limitUp, schoolCapacity)




				$eepalSchools_storage = $this->entityTypeManager->getStorage('eepal_school');
				$idsSch = $eepalSchools_storage->getQuery()	//προσαρμοσμένο για τα demo data --> να αλλάξει
				  ->condition('id', '246', '<=')
					->condition('id', '147', '>=')
				  ->execute();
				$eepalSchools = $eepalSchools_storage->loadMultiple($idsSch);
				$eepalSchools_storage->resetCache();

				foreach ($eepalSchools as $eepalSchool)	{

						$this->checkCapacityAndArrange($eepalSchool->id->value, "1", "-1", $limitUp_class, $eepalSchool->capacity_class_a->value);


						$eepalSectorsInEpal_storage = $this->entityTypeManager->getStorage('eepal_sectors_in_epal');
						$eepalSectorsInEpal = $eepalSectorsInEpal_storage->loadByProperties(array('epal_id' => $eepalSchool->id->value) );
						foreach ($eepalSectorsInEpal as $eepalSecInEp)	{
							//print_r("<br>Sectors " . $eepalSecInEp->sector_id->getString());
							$this->checkCapacityAndArrange($eepalSchool->id->value, "2", $eepalSecInEp->sector_id->getString(), $limitUp_class, $eepalSecInEp->capacity_class_sector->value);
					  }

						$eepalSpecialtiesInEpal_storage = $this->entityTypeManager->getStorage('eepal_specialties_in_epal');
						$eepalSpecialtiesInEpal = $eepalSpecialtiesInEpal_storage->loadByProperties(array('epal_id' => $eepalSchool->id->value) );
						foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp)	{
							//print_r("<br>Specialties " . $eepalSpecialInEp->specialty_id->getString());
							$this->checkCapacityAndArrange($eepalSchool->id->value, "3", $eepalSpecialInEp->specialty_id->getString(), $limitUp_class, $eepalSpecialInEp->capacity_class_specialty->value);
						}

						$eepalSectorsInEpal_storage->resetCache();
						$eepalSpecialtiesInEpal_storage->resetCache();


					} //end for each school/department

					$this->choice_id++;

	  	} //end while

			return $this->respondWithStatus([
					"message" => t("Distribution has made successfully")
				], Response::HTTP_OK);

	}


	public function locateStudent($choice_id, &$epalStudents)	{

		$epal_dist_id = -1;
		$specialization_id = -1;

		try {

			$epalSchoolsChosen_storage = $this->entityTypeManager->getStorage('epal_student_epal_chosen');
			$epalSectorChosen_storage = $this->entityTypeManager->getStorage('epal_student_sector_field');
			$epalCourseChosen_storage = $this->entityTypeManager->getStorage('epal_student_course_field');
			$epalStudentClass_storage = $this->entityTypeManager->getStorage('epal_student_class');

			foreach ($epalStudents as $epalStudent)	{
				print_r("<br>ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ ΝΟ: " . $choice_id);
				$epalSchoolsChosen = $epalSchoolsChosen_storage->loadByProperties(array('student_id' => $epalStudent->id->value , 'choice_no' => $choice_id) );

				if (sizeof($epalSchoolsChosen) !==  0)	{
					$epalSchoolChos = reset($epalSchoolsChosen);
					print_r(" SCHOOL_ID:" . $epalSchoolChos->epal_id->getString() . " STUDENT_ID " . $epalStudent->id->getString());
					$epal_dist_id = $epalSchoolChos->epal_id->getString();

					if ($epalStudent->currentclass->value === "2")	{
						$epalSectorChosen = $epalSectorChosen_storage->loadByProperties(array('student_id' => $epalStudent->id->value));
						$epalSecChos = reset($epalSectorChosen);
						//print_r(" SECTOR_ID:" . $epalSecChos->sectorfield_id->getString() . " ");
					}
					elseif ($epalStudent->currentclass->value === "3")	{
						$epalCourseChosen = $epalCourseChosen_storage->loadByProperties(array('student_id' => $epalStudent->id->value));
						$epalCourChos = reset($epalCourseChosen);
						//print_r(" COURSE_ID:" . $epalCourChos->coursefield_id->getString() . " ");
					}

					if ($epalStudent->currentclass->value === "2")
						$specialization_id = $epalSecChos->sectorfield_id->getString();
					elseif ($epalStudent->currentclass->value === "3")
						$specialization_id = $epalCourChos->coursefield_id->getString();
					else
						$specialization_id = -1;

					$studentClass = array('student_id'=> $epalStudent->id->value, 'epal_id'=> $epal_dist_id, 'currentclass' => $epalStudent->currentclass->value,
																'currentepal' => $epalStudent->currentepal->getString(), 'specialization_id' => $specialization_id,
																'distribution_id' => $choice_id, 'points' => $epalStudent->points->value);
					$studentClass_object = $epalStudentClass_storage->create($studentClass);
					$epalStudentClass_storage->save($studentClass_object);

			} //end if

		}	//foreach

		$epalSchoolsChosen_storage->resetCache();
		$epalStudentClass_storage->resetCache();
	}

	catch (\Exception $e) {
		$this->logger->warning($e->getMessage());
		return $this->respondWithStatus([
					"message" => t("An unexpected problem occured during locateStudent Method of Distribution")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
	}

	return $this->respondWithStatus([
			"message" => t("locateStudent Method of Distribution has made successfully")
		], Response::HTTP_OK);

	}


 public function retrieveCapacityLimitUp($className) {
		 $epalClassLimits_storage = $this->entityTypeManager->getStorage('epal_class_limits');
		 $epalClassLimits = $epalClassLimits_storage->loadByProperties(array('name' => $className));
		 $epalClassLimit = reset($epalClassLimits);
		 $limit_up = $epalClassLimit->limit_up->value;
		 $epalClassLimits_storage->resetCache();

		 return $limit_up;
 }

	public function checkCapacityAndArrange($epalId, $classId, $secCourId, $limitup, $capacity)	{

		$epalStudentClass_storage = $this->entityTypeManager->getStorage('epal_student_class');
		$epalStudentClass = $epalStudentClass_storage->loadByProperties(array('epal_id' => $epalId, 'currentclass' => $classId, 'specialization_id' => $secCourId ));
		print_r("<br> ΣΧΟΛΕΙΟ: " .  $epalId . " ΤΑΞΗ: "  . $classId . " ΤΟΜΕΑΣ/ΕΙΔΙΚΟΤΗΤΑ: " . $secCourId .  " ΧΩΡΗΤΙΚΟΤΗΤΑ: " . sizeof($epalStudentClass));

		$limit = $limitup * $capacity;
		if (sizeof($epalStudentClass) > $limit)	{
			print_r("<br>ΥΠΕΡΧΕΙΛΙΣΗ!");
			foreach ($epalStudentClass as $epalStudCl)	{
				//Υπολογισμός μορίων του μαθητή και (πιθανή) αποθήκευσή τους
				//$points = $this->calculatePoints();
				//$epalStudCl->set('points', $points, true)->save();
			}
			$this->makeSelectionOfStudents($epalStudentClass,$limit);
		}
		else { //αφαίρεσε όσους μαθητές βρίσκονται στον πίνακα εκκρεμοτήτων
			foreach ($epalStudentClass as $epalStudCl) {
				if ($this->choice_id !== 1)
					////διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
					$this->removeFromPendingStudents($epalStudCl->student_id->getString());
			}
		}

		$epalStudentClass_storage->resetCache();

		return $this->respondWithStatus([
				"message" => t("checkCapacityAndArrange Method of Distribution has made successfully")
			], Response::HTTP_OK);

	}


	public function setFinalized($student, $status )	{
		//δεν χρησιμοποιείται
		/*

		$epalStudents_storage = $this->entityTypeManager->getStorage('epal_student');
		//foreach ($studentClass as $studCl)	{
		$epalStudents = $epalStudents_storage->loadByProperties(array('id' => $student->student_id->getString()) );
		$epalStudent = reset($epalStudents);
		print_r("<br> SET FINALIZED TO:" .$status . " STUDENT_ID:" . $student->student_id->getString() );
		$epalStudent->set('finalized', $status, true)->save();

		*/

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
			$student->student_id->getString();
			print_r("<br>STUDENT_ID:" . $student->student_id->getString());
		}

		//εύρεση αριθμού μαθητών που ήδη φοιτούσαν στο σχολείο
		$cnt = 0;
		foreach($students as $student)	{
			if ($student->currentepal->getString() === $student->epal_id->getString()) {
				$cnt++;
				if ($this->choice_id !== 1)
					////διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
					$this->removeFromPendingStudents($student->student_id->getString());
			}
		}
		print_r("<br>#ΕΓΓΡΑΦΩΝ ΠΟΥ ΟΙ ΜΑΘΗΤΕΣ ΦΟΙΤΟΥΣΑΝ ΗΔΗ:" . $cnt);

		$newlimit = $limit - $cnt;
		print_r("<br>ΑΝΩΤΑΤΟ ΟΡΙΟ ΜΑΘΗΤΩΝ:" . $limit);
		print_r("<br>#ΜΑΘΗΤΩΝ ΓΙΑ ΝΑ ΕΠΙΛΕΓΟΥΝ ΜΕ ΜΟΡΙΑ:" . $newlimit);

		$points_arr = [];
		foreach($students as $student)	{
			if ($student->currentepal->getString() !== $student->epal_id->getString())
				$points_arr[] = $student->points->value;
		}
		//for ($i=0; $i < sizeof($points_arr); $i++)
		//	print_r("<br>MORIA:" . $points_arr[$i]);
		rsort($points_arr);
		for ($i=0; $i < sizeof($points_arr); $i++)
			print_r("<br>ΜΟΡΙΑ ΜΕΤΑ ΤΗΝ ΤΑΞΙΝΟΜΙΣΗ: " . $points_arr[$i]);

		print_r("<br>ΟΡΙΟ ΜΟΡΙΩΝ: " . $points_arr[$newlimit-1]);

		foreach($students as $student)	{
			if ($student->currentepal->getString() !== $student->epal_id->getString())	{
				if ($student->points->value < $points_arr[$newlimit-1]) {
					print_r("<br>ΣΕ ΕΚΚΡΕΜΟΤΗΤΑ - ΔΙΑΓΡΑΦΗ: " . $student->student_id->getString());
					//βάλε τον μαθητή στον πίνακα εκκρεμοτήτων και διέγραψέ τον από τον προσωρινό πίνακα αποτελεσμάτων
					array_push($this->pendingStudents, $student->student_id->getString() );
					$student->delete();
				}
				else {
					if ($this->choice_id !== 1)
						//διέγραψε τον μαθητή από τον πίνακα εκκρεμοτήτων (αν βρίσκεται εκεί)
						$this->removeFromPendingStudents($student->student_id->getString());
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
