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
			//$this->logger = $loggerChannel->get('oauthost');
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
		try {
			//insert demo records in entity: epal_student
			$entity_manager = \Drupal::entityTypeManager();

			$epaluserid = \Drupal::currentUser()->id();

			for ($i = 1; $i <= 1100; $i++) {
				//srand($this->make_seed());

				//$curclass = rand(1,3);
				$curclass = 1;
				$currentepal = rand(147,156);

				$student = array(
					//'epaluser_id' => $aitisi[0][epaluser_id],
					'epaluser_id' => $epaluserid,
					'name' => "firstname" . $i,
					'studentsurname' => "surname" . $i,
					//'birthdate' => $aitisi[0][birthdate],
					//'fatherfirstname' => $aitisi[0][fatherfirstname],
					//'fathersurname' => $aitisi[0][fathersurname],
					//'motherfirstname' => $aitisi[0][motherfirstname],
					//'mothersurname' => $aitisi[0][mothersurname],
					//'studentamka' => $aitisi[0][studentamka],
					//'regionaddress' => $aitisi[0][regionaddress],
					//'regionarea' => $aitisi[0][regionarea],
					//'regiontk' => $aitisi[0][regiontk],
					//'certificatetype' => $aitisi[0][certificatetype],
					//'lastam' => $aitisi[0][lastam],
					'currentclass' => $curclass,
					'currentepal' => $currentepal
					//'currentsector' => $aitisi[0][currentsector],
					//'relationtostudent' => $aitisi[0][relationtostudent],
					//'telnum' => $aitisi[0][telnum],
					//'moria' => rand(0,10)
        );

				$entity_storage_student = $entity_manager->getStorage('epal_student');
				$entity_object = $entity_storage_student->create($student);
				$entity_storage_student->save($entity_object);

				$created_student_id = $entity_object->id();


				//insert demo records in entity: epal_student_epal_chosen

				//$epal_id = rand(147,149);	//TO BE REMOVED

				$numEpalsChosen = rand(1,3);
				$epal_id = $this->UniqueRandNum(147,156,$numEpalsChosen);
				//for ($j = 1; $j <= $numEpalsChosen ; $j++) {
					if ($curclass === 2 || $curclass === 3) {
						//33% των μαθητών της Β' και Γ' Λυκείου δηλώνουν προτίμηση στο σχολείο που ήδη φοιτούν
						if (rand(1,3) === 1) {

							$epal_id[0] = $currentepal;
							//$epal_id = array($currentepal ,$currentepal, $currentepal);
						}
						else {
							//$epal_id = rand(147,149);


							//print_r("<br>". $epal_id[0] . $epal_id[1] . $epal_id[2]);
						}
					}


				for ($j = 0; $j < $numEpalsChosen ; $j++) {
//					print_r("<br>Data: Student" . $created_student_id . "EPAL" . $epal_id . "CHOICE"  . $j );
						$epalchosen = array(
							'student_id' => $created_student_id,
							'epal_id' => $epal_id[$j],
							'choice_no' => $j+1
						);
						//print_r("<br>Test1");
						$entity_storage_epalchosen = $entity_manager->getStorage('epal_student_epal_chosen');
						//print_r("<br>Test2");
						$entity_object = $entity_storage_epalchosen->create($epalchosen);
						//print_r("<br>Test3");
						$entity_storage_epalchosen->save($entity_object);
						//print_r("<br>Test4");
				}


				//insert records in entity: 	epal_student_course_field (αφορά μαθητές Γ' Λυκείου)
				//						or:		epal_student_sector_field (αφορά μαθητές Β' Λυκείου)
				if ($curclass === 3)	{
					$course = array(
						//'name' => $aitisi[3][name],
						//'student_id' => $aitis[3][student_i],
						'student_id' => $created_student_id,
						'coursefield_id' => rand(1,54)
					);

					$entity_storage_course = $entity_manager->getStorage('epal_student_course_field');
					$entity_object = $entity_storage_course->create($course);
					$entity_storage_course->save($entity_object);
				}

				else if ($curclass === 2)	{
					$sector = array(
						//'name' => $aitisi[3][name],
						'student_id' => $created_student_id,
						//'student_id' => $aitis[3][student_i],
						'sectorfield_id' => rand(1,9)
					);

					$entity_storage_sector = $entity_manager->getStorage('epal_student_sector_field');
					$entity_object = $entity_storage_sector->create($sector);
					$entity_storage_sector->save($entity_object);
				}



		}
	}

	catch (\Exception $e) {
			//$this->logger->warning($e->getMessage());

			$returnmsg = "Αποτυχία καταχώρησης demo data!";
			$response = new JsonResponse([$returnmsg]);
            $transaction->rollback();
			return $response;
	}


  $response = new JsonResponse(['hello' => 'world']);
  $response->headers->set('X-AUTH-TOKEN', 'HELLOTOKEN');
  return $response;

	}

}
