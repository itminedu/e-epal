<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;

use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

class ApplicationSubmit extends ControllerBase {

    protected $entityTypeManager;
    protected $logger;
    protected $connection;

	public function __construct(
		EntityTypeManagerInterface $entityTypeManager,
		Connection $connection,
		LoggerChannelFactoryInterface $loggerChannel)
		{
			$this->entityTypeManager = $entityTypeManager;
			$this->connection = $connection;
			$this->logger = $loggerChannel->get('epal');
    }

	public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity_type.manager'),
          $container->get('database'),
          $container->get('logger.factory')
      );
    }

 	public function appSubmit(Request $request) {

		if (!$request->isMethod('POST')) {
			return $this->respondWithStatus([
					"message" => t("Method Not Allowed")
				], Response::HTTP_METHOD_NOT_ALLOWED);
    	}

		$applicationForm = array();

		$content = $request->getContent();

		if (!empty($content)) {
			$applicationForm = json_decode($content, TRUE);
		}
		else {
			return $this->respondWithStatus([
					"message" => t("Bad Request")
				], Response::HTTP_BAD_REQUEST);
		}

		$transaction = $this->connection->startTransaction();
		try {
			//insert records in entity: epal_student

			$authToken = $request->headers->get('PHP_AUTH_USER');
	        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
	        $epalUser = reset($epalUsers);

			$student = array(
				'epaluser_id' => $epalUser->id(),
				'name' => $applicationForm[0][name],
				'studentsurname' => $applicationForm[0][studentsurname],
				'birthdate' => $applicationForm[0][studentbirthdate],
				'fatherfirstname' => $applicationForm[0][fatherfirstname],
				'fathersurname' => $applicationForm[0][fathersurname],
				'motherfirstname' => $applicationForm[0][motherfirstname],
				'mothersurname' => $applicationForm[0][mothersurname],
				'studentamka' => $applicationForm[0][studentamka],
				'regionaddress' => $applicationForm[0][regionaddress],
				'regionarea' => $applicationForm[0][regionarea],
				'regiontk' => $applicationForm[0][regiontk],
				'certificatetype' => $applicationForm[0][certificatetype],
				//'lastam' => $applicationForm[0][lastam],
				'currentclass' => $applicationForm[0][currentclass],
                'guardian_name' => $applicationForm[0][cu_name],
                'guardian_surname' => $applicationForm[0][cu_surname],
                'guardian_fathername' => $applicationForm[0][cu_fathername],
                'guardian_mothername' => $applicationForm[0][cu_mothername],
                'agreement' => $applicationForm[0][disclaimer_checked],

				//'currentepal' => $applicationForm[0][currentepal],
				//'currentsector' => $applicationForm[0][currentsector],
        'points' => $applicationForm[0][points],
				'relationtostudent' => $applicationForm[0][relationtostudent],
				'telnum' => $applicationForm[0][telnum]
            );

			$entity_storage_student = $this->entityTypeManager->getStorage('epal_student');
			$entity_object = $entity_storage_student->create($student);
			$entity_storage_student->save($entity_object);

			$created_student_id = $entity_object->id();

			//insert records in entity: epal_student_epal_chosen
			for ($i = 0; $i < sizeof($applicationForm[1]); $i++) {
				$epalchosen = array(
					//'name' => $applicationForm[1][$i][name],
					'student_id' => $created_student_id,
					'epal_id' => $applicationForm[1][$i][epal_id],
					'choice_no' => $applicationForm[1][$i][choice_no]
					//'points_for_order' => $applicationForm[1][$i][points_for_order],
					//'distance_from_epal' => $applicationForm[1][$i][distance_from_epal],
					//'points_for_distance' => $applicationForm[1][$i][points_for_distance],
				);
				$entity_storage_epalchosen = $this->entityTypeManager->getStorage('epal_student_epal_chosen');
				$entity_object = $entity_storage_epalchosen->create($epalchosen);
				$entity_storage_epalchosen->save($entity_object);
			}

			//insert records in entity: epal_student_moria
			for ($i = 0; $i < sizeof($applicationForm[2]); $i++) {
				$criteria = array(
					//'name' => $applicationForm[2][$i][name],
					'student_id' => $created_student_id,
					'income' => $applicationForm[2][$i][income],
					'criterio_id' => $applicationForm[2][$i][criterio_id],
					//'moria' => $applicationForm[2][$i][moria],
				);
				$entity_storage_criteria = $this->entityTypeManager->getStorage('epal_student_moria');
				$entity_object = $entity_storage_criteria->create($criteria);
				$entity_storage_criteria->save($entity_object);
			}

			//insert records in entity: 	epal_student_course_field (αφορά μαθητές Γ' Λυκείου)
			//						or:		epal_student_sector_field (αφορά μαθητές Β' Λυκείου)

      //if ($applicationForm[0][currentclass] === "Γ' Λυκείου")	{
      if ($applicationForm[0][currentclass] === "3" || $applicationForm[0][currentclass] === "4" )	{
				//$course =  array('name
				$course = array(
					//'name' => $aitisi[3][name],
					//'student_id' => $aitis[3][student_i],
					'student_id' => $created_student_id,
					'coursefield_id' => $applicationForm[3][coursefield_id]
				);

				$entity_storage_course = $this->entityTypeManager->getStorage('epal_student_course_field');
				$entity_object = $entity_storage_course->create($course);
				$entity_storage_course->save($entity_object);
			}

			//else if ($applicationForm[0][currentclass] === "Β' Λυκείου")	{
      else if ($applicationForm[0][currentclass] === "2")	{
				$sector = array(
					//'name' => $applicationForm[3][name],
					'student_id' => $created_student_id,
					//'student_id' => $aitis[3][student_i],
					'sectorfield_id' => $applicationForm[3][sectorfield_id]
				);

				$entity_storage_sector = $this->entityTypeManager->getStorage('epal_student_sector_field');
				$entity_object = $entity_storage_sector->create($sector);
				$entity_storage_sector->save($entity_object);
			}
			return $this->respondWithStatus([
					"message" => t("Application saved successfully")
				], Response::HTTP_OK);
		}

		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			$transaction->rollback();
			return $this->respondWithStatus([
					"message" => t("An unexpected problem occured")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
		}
	 }

	 private function respondWithStatus($arr, $s) {
         $res = new JsonResponse($arr);
         $res->setStatusCode($s);
         return $res;
     }
}
