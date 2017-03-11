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



class ApplicationSubmit extends ControllerBase {
	
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
			$this->logger = $loggerChannel->get('oauthost');
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

 
    
	
	
	 public function appSubmitWORK() {
		 
		$db = \Drupal\Core\Database\Database::getConnection();
		$transaction = $db->startTransaction();

		try {
			$student = array('epaluser_id'=> 1, 'name'=> 'ΝΙΚΟΣ', 'studentsurname'=>'ΚΑΤΣΑ', 'status'=> 1);
			$entity_manager = \Drupal::entityManager();
			$entity_storage_student = $entity_manager->getStorage('epal_student');
			$entity_storage_eidikotita = $entity_manager->getStorage('epal_student_course_field');
			
			
			$entity_object = $entity_storage_student->create($student);
			$entity_storage_student->save($entity_object);
			
			$created_student_id = $entity_object->id();

			
			$eidikotita = array('name'=>'record1', 'student_id' => 1, 'coursefield_id' => 4, 'status'=> 1 );
			$entity_object = $entity_storage_eidikotita->create($eidikotita);
			$entity_storage_eidikotita->save($entity_object);
			$created_eidikotites_id = $entity_object->id();
			
		}

		catch (\Exception $e) {
			$transaction->rollback();
		}

		 
	 }
	 
	 
	 public function appSubmit2() {
		 
			
		$db = \Drupal\Core\Database\Database::getConnection();
		$transaction = $db->startTransaction();

		try {	
			
			$student = array('epaluser_id'=> 1, 'name'=> 'ΝΙΚΟΣ', 'studentsurname'=>'ΚΑΤΣΑ', 'status'=> 1);
			
			$entity_manager = \Drupal::entityManager();
			
			$entity_storage_student = $entity_manager->getStorage('epal_student');
			$entity_storage_course = $entity_manager->getStorage('epal_student_course_field');
			
			$entity_object = $entity_storage_student->create($student);
			$entity_storage_student->save($entity_object);

			$created_student_id = $entity_object->id();
			
			$course =  array('name'=>'record1', 'student_id' => 1, 'coursefield_id' => 4, 'status'=> 1 );
			$entity_object = $entity_storage_course->create($course);
			$entity_storage_course->save($entity_object);
			
			
		}

		catch (\Exception $e) {
			$transaction->rollback();
			
		}

		 
	 }
	 
	 
	 public function appSubmit() {
		 
		$aitisi = array();
		$content = \Drupal::request()->getContent();
	  
		if (!empty($content)) {
			$aitisi = json_decode($content, TRUE);
			//$aitisi[0] --> student data, $aitisi[1][] --> epals chosen, $aitisi[2][] --> criteria, $aitisi[3] --> sector or course chosen
		}
		
		$db = \Drupal\Core\Database\Database::getConnection();
		$transaction = $db->startTransaction();

		try {	
			//insert records in entity: epal_student
			$entity_manager = \Drupal::entityTypeManager();
			
			$epaluserid = \Drupal::currentUser()->id();
			
			$student = array(
				//'epaluser_id' => $aitisi[0][epaluser_id],
				'epaluser_id' => $epaluserid,
				'name' => $aitisi[0][name],
				'studentsurname' => $aitisi[0][studentsurname],
				//'birthdate' => $aitisi[0][birthdate],
				//'fatherfirstname' => $aitisi[0][fatherfirstname],
				//'fathersurname' => $aitisi[0][fathersurname],
				//'motherfirstname' => $aitisi[0][motherfirstname],
				//'mothersurname' => $aitisi[0][mothersurname],
				'studentamka' => $aitisi[0][studentamka],
				'regionaddress' => $aitisi[0][regionaddress],
				'regionarea' => $aitisi[0][regionarea],
				'regiontk' => $aitisi[0][regiontk],
				'certificatetype' => $aitisi[0][certificatetype],
				//'lastam' => $aitisi[0][lastam],
				'currentclass' => $aitisi[0][currentclass],
				//'currentepal' => $aitisi[0][currentepal],
				//'currentsector' => $aitisi[0][currentsector],
				'relationtostudent' => $aitisi[0][relationtostudent],
				'telnum' => $aitisi[0][telnum]
            );
			
			$entity_storage_student = $entity_manager->getStorage('epal_student');
			$entity_object = $entity_storage_student->create($student);
			$entity_storage_student->save($entity_object);

			$created_student_id = $entity_object->id();
			
			
			//insert records in entity: epal_student_epal_chosen 
			for ($i = 0; $i < sizeof($aitisi[1]); $i++) {
				$epalchosen = array(
					//'name' => $aitisi[1][$i][name],
					'student_id' => $created_student_id,
					'epal_id' => $aitisi[1][$i][epal_id],
					'choice_no' => $aitisi[1][$i][choice_no]
					//'points_for_order' => $aitisi[1][$i][points_for_order],
					//'distance_from_epal' => $aitisi[1][$i][distance_from_epal],
					//'points_for_distance' => $aitisi[1][$i][points_for_distance],
				);
				$entity_storage_epalchosen = $entity_manager->getStorage('epal_student_epal_chosen');
				$entity_object = $entity_storage_epalchosen->create($epalchosen);
				$entity_storage_epalchosen->save($entity_object);
			}
			
			//insert records in entity: epal_student_moria 
			for ($i = 0; $i < sizeof($aitisi[2]); $i++) {
				$criteria = array(
					//'name' => $aitisi[2][$i][name],
					'student_id' => $created_student_id,
					'income' => $aitisi[2][$i][income],
					'criterio_id' => $aitisi[2][$i][criterio_id],
					//'moria' => $aitisi[2][$i][moria],
				);
				$entity_storage_criteria = $entity_manager->getStorage('epal_student_moria');
				$entity_object = $entity_storage_criteria->create($criteria);
				$entity_storage_criteria->save($entity_object);
			}
			
			//insert records in entity: 	epal_student_course_field (αφορά μαθητές Γ' Λυκείου)
			//						or:		epal_student_sector_field (αφορά μαθητές Β' Λυκείου)
			if ($aitisi[0][currentclass] === "Γ' Λυκείου")	{
				//$course =  array('name'=>'record1', 'student_id' => 1, 'coursefield_id' => 4, 'status'=> 1 );
				$course = array(
					//'name' => $aitisi[3][name],
					//'student_id' => $aitis[3][student_i],
					'student_id' => $created_student_id,
					'coursefield_id' => $aitisi[3][coursefield_id]
				);
				
				$entity_storage_course = $entity_manager->getStorage('epal_student_course_field');
				$entity_object = $entity_storage_course->create($course);
				$entity_storage_course->save($entity_object);
			}
			
			else if ($aitisi[0][currentclass] === "Β' Λυκείου")	{
				$sector = array(
					//'name' => $aitisi[3][name],
					'student_id' => $created_student_id,
					//'student_id' => $aitis[3][student_i],
					'sectorfield_id' => $aitisi[3][sectorfield_id]
				);
				
				$entity_storage_sector = $entity_manager->getStorage('epal_student_sector_field');
				$entity_object = $entity_storage_sector->create($sector);
				$entity_storage_sector->save($entity_object);
			}
			
			$returnmsg = "Επιτυχής καταχώρηση στοιχείων αίτησης!";
			$response = new JsonResponse([$returnmsg]);
			return $response;
		}

		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			$transaction->rollback();
			
			$returnmsg = "Αποτυχία καταχώρησης στοιχείων αίτησης!";
			$response = new JsonResponse([$returnmsg]);
			return $response;
		}

	 }

}
