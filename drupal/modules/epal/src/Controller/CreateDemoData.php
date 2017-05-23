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



class CreateDemoData extends ControllerBase {

	protected $entity_query;
    protected $entityTypeManager;
    protected $logger;
    protected $connection;

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
          $container->get('entity.manager'),
          $container->get('entity.query'),
          $container->get('database'),
          $container->get('logger.factory')
      );
    }


	public function make_seed() {
		  list($usec, $sec) = explode(' ', microtime());
		  return $sec + $usec * 1000000;
	}

	public function UniqueRandNum($min, $max, $quantity) {
    $numbers = range($min, $max);
    shuffle($numbers);
    return array_slice($numbers, 0, $quantity);
	}


	public function createData() {

    $transaction = $this->connection->startTransaction();

		$school_id_start = 197;
		$school_id_end = 228;

		try {
			//insert demo records in entity: epal_student
			$entity_manager = \Drupal::entityTypeManager();

			$epaluserid = \Drupal::currentUser()->id();

			for ($i = 1; $i <= 2500; $i++) {
				//srand($this->make_seed());

			  $curclass = rand(1,3);
				//$curclass = 2;

				//$currentepal = rand(137,165);
				$currentepal = rand($school_id_start,$school_id_end);


				$student = array(
					//'epaluser_id' => $aitisi[0][epaluser_id],
					'epaluser_id' => $epaluserid,
					'name' => "firstname" . $i,
					'studentsurname' => "surname" . $i,
					//'birthdate' => $aitisi[0][birthdate],
					'birthdate' => '01/01/1970',
					//'fatherfirstname' => $aitisi[0][fatherfirstname],
					'fatherfirstname' => "fatherfirstname" . $i,
					//'fathersurname' => $aitisi[0][fathersurname],
					'fathersurname' => "fathersurname" . $i,
					//'motherfirstname' => $aitisi[0][motherfirstname],
					'motherfirstname' => "motherfirstname" . $i,
					//'mothersurname' => $aitisi[0][mothersurname],
					'mothersurname' => "mothersurname" . $i,
					//'studentamka' => $aitisi[0][studentamka],
					//'regionaddress' => $aitisi[0][regionaddress],
					'regionaddress' => "regionaddress" . $i,
					//'regionarea' => $aitisi[0][regionarea],
					'regionarea' => "regionarea" . $i,
					//'regiontk' => $aitisi[0][regiontk],
					'regiontk' => "tk" . $i,
					//'certificatetype' => $aitisi[0][certificatetype],
					'certificatetype' => 'Απολυτήριο Γυμνασίου',
					//'lastam' => $aitisi[0][lastam],
					'currentclass' => $curclass,
					'currentepal' => $currentepal,
					//'currentsector' => $aitisi[0][currentsector],
					//'relationtostudent' => $aitisi[0][relationtostudent],
					'relationtostudent' => 'Μαθητής',
					//'telnum' => $aitisi[0][telnum],
					'telnum' => '6944123456',
					'points' => rand(0,20)
        );

				$entity_storage_student = $entity_manager->getStorage('epal_student');
				$entity_object = $entity_storage_student->create($student);
				$entity_storage_student->save($entity_object);

				$created_student_id = $entity_object->id();



				//insert records in entity: 	epal_student_course_field (αφορά μαθητές Γ' Λυκείου)
				//						or:		epal_student_sector_field (αφορά μαθητές Β' Λυκείου)
				$availableSchools  = array();

				if ($curclass === 3)	{

					do {
						$coursefield_id = rand(1,54);
						$course = array(
							'student_id' => $created_student_id,
							'coursefield_id' => $coursefield_id
						);

						$entity_storage_course = $entity_manager->getStorage('epal_student_course_field');
						$entity_object = $entity_storage_course->create($course);
						//$entity_storage_course->save($entity_object);

						//εύρεση ΕΠΑΛ που διαθέτουν την αντίστοιχη ειδικότητα
						print_r("<br> EIDIKOTHTA: " . $coursefield_id);
						$eepalSpecialtiesInEpal_storage = $this->entityTypeManager->getStorage('eepal_specialties_in_epal');
						//$eepalSpecialtiesInEpal = $eepalSpecialtiesInEpal_storage->loadByProperties(array('specialty_id' => $coursefield_id) );

						$ids  =  $eepalSpecialtiesInEpal_storage->getQuery()
							->condition('specialty_id', $coursefield_id, "=")
							//->condition('epal_id', 137, ">=")
							//->condition('epal_id', 165, "<=")
							->condition('epal_id', $school_id_start, ">=")
							->condition('epal_id', $school_id_end, "<=")
							->execute();
						$eepalSpecialtiesInEpal = $eepalSpecialtiesInEpal_storage->loadMultiple($ids);

						print_r("<br> NUM_SCHOOLS: " . sizeof($eepalSpecialtiesInEpal));

						foreach ($eepalSpecialtiesInEpal as $eepalSpecialInEp)	{
							array_push($availableSchools, $eepalSpecialInEp->epal_id->getString());
						}

						if (sizeof($availableSchools) != 0)
							$entity_storage_course->save($entity_object);
					}	//end do
					while (sizeof($availableSchools) == 0);

					$entity_storage_course->resetCache();
					$eepalSpecialtiesInEpal_storage->resetCache();
				}

				else if ($curclass === 2)	{

					do {
						$sectorfield_id = rand(1,9);
						$sector = array(
							'student_id' => $created_student_id,
							'sectorfield_id' => $sectorfield_id
						);

						$entity_storage_sector = $entity_manager->getStorage('epal_student_sector_field');
						$entity_object = $entity_storage_sector->create($sector);
						//$entity_storage_sector->save($entity_object);

						//εύρεση ΕΠΑΛ που διαθέτουν τον αντίστοιχο τομέα
						print_r("<br> TOMEAS: " . $sectorfield_id);
						$eepalSectorsInEpal_storage = $this->entityTypeManager->getStorage('eepal_sectors_in_epal');

						$ids  =  $eepalSectorsInEpal_storage->getQuery()
							->condition('sector_id', $sectorfield_id, "=")
							//->condition('epal_id', 137, ">=")
							//->condition('epal_id', 165, "<=")
							->condition('epal_id', $school_id_start, ">=")
							->condition('epal_id', $school_id_end, "<=")
							->execute();
						$eepalSectorsInEpal = $eepalSectorsInEpal_storage->loadMultiple($ids);

						print_r("<br> NUM_SCHOOLS: " . sizeof($eepalSectorsInEpal));

						foreach ($eepalSectorsInEpal as $eepalSecInEp)	{
							array_push($availableSchools, $eepalSecInEp->epal_id->getString());
						}
						if (sizeof($availableSchools) != 0)
							$entity_storage_sector->save($entity_object);
					}	//end do
					while (sizeof($availableSchools) == 0);

					$entity_storage_sector->resetCache();
					$eepalSectorsInEpal_storage->resetCache();
				}

				else if ($curclass === 1)	{
					print_r("<br> CLASS A: ");
					//$school_id_start = 137;
					//$school_id_end = 165;
					//$school_id_start = 5;
					//for ($l=0; $l < 29; $l++)
					for ($l=0; $l < $school_id_end - $school_id_start + 1; $l++)
					//for ($l=0; $l < 395; $l++)
						array_push($availableSchools, $school_id_start + $l);
				}

				$numEpalsChosen = rand(1,3);
				if ($numEpalsChosen > sizeof($availableSchools))
					$numEpalsChosen =  sizeof($availableSchools);
				print_r("<br> NUM_EPAL_CHOSEN " . $numEpalsChosen);

				$epal_id_index = $this->UniqueRandNum(0,sizeof($availableSchools)-1,$numEpalsChosen);
				for ($j=0; $j < $numEpalsChosen; $j++)	{
					print_r("<br> EPAL_CHOSEN_ID: " . $epal_id_index[$j]);
					print_r("<br> EPAL_CHOSEN_REAL_ID: " . $availableSchools[$epal_id_index[$j]]);
				}

				for ($j = 0; $j < $numEpalsChosen ; $j++) {
						$epalchosen = array(
							'student_id' => $created_student_id,
							'epal_id' => $availableSchools[$epal_id_index[$j]],
							'choice_no' => $j+1
						);
						$entity_storage_epalchosen = $entity_manager->getStorage('epal_student_epal_chosen');
						$entity_object = $entity_storage_epalchosen->create($epalchosen);
						$entity_storage_epalchosen->save($entity_object);
				}

				$entity_storage_epalchosen->resetCache();
				$entity_storage_student->resetCache();


				/*
				//TO BE CONSIDERED
				if ($curclass === 2 || $curclass === 3) {
					//33% των μαθητών της Β' και Γ' Λυκείου δηλώνουν προτίμηση στο σχολείο που ήδη φοιτούν
					if (rand(1,3) === 1) {
						$epal_id[0] = $currentepal;
					}
				}
				*/

		}
	}

	catch (\Exception $e) {
			$this->logger->warning($e->getMessage());

			$returnmsg = "Αποτυχία καταχώρησης demo data!";
			$response = new JsonResponse([$returnmsg]);
    //  $transaction->rollback();
			return $response;
	}


  $response = new JsonResponse(['hello' => 'world']);
  $response->headers->set('X-AUTH-TOKEN', 'HELLOTOKEN');
  return $response;

	}

}
