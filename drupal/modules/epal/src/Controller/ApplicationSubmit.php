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
					"error_code" => 2001
				], Response::HTTP_METHOD_NOT_ALLOWED);
    	}
		$applicationForm = array();

		$content = $request->getContent();

		if (!empty($content)) {
			$applicationForm = json_decode($content, TRUE);
		}
		else {
			return $this->respondWithStatus([
					"error_code" => 5002
				], Response::HTTP_BAD_REQUEST);
		}
		$transaction = $this->connection->startTransaction();
		try {
			//insert records in entity: epal_student
			$authToken = $request->headers->get('PHP_AUTH_USER');
	        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
	        $epalUser = reset($epalUsers);
            if (!$epalUser){
    			return $this->respondWithStatus([
    					"error_code" => 4003
    				], Response::HTTP_FORBIDDEN);
    		}


			$student = array(
                'langcode' => 'el',
                'student_record_id' => 0,
                'sex' => 0,
                'fathersurname' => '',
                'mothersurname' => '',
                'studentamka' => '',
                'lastam' => '',
                'graduate_school' => 0,
                'apolytirio_id' => '',
                'currentsector' => '',
                'currentcourse' => '',
                'points' => 0,
                'user_id' => $epalUser->user_id->target_id,
                'epaluser_id' => $epalUser->id(),
				'name' => $applicationForm[0]['name'],
				'studentsurname' => $applicationForm[0]['studentsurname'],
				'birthdate' => $applicationForm[0]['studentbirthdate'],
				'fatherfirstname' => $applicationForm[0]['fatherfirstname'],
				'motherfirstname' => $applicationForm[0]['motherfirstname'],
				'regionaddress' => $applicationForm[0]['regionaddress'],
				'regionarea' => $applicationForm[0]['regionarea'],
				'regiontk' => $applicationForm[0]['regiontk'],
                'certificatetype' => $applicationForm[0]['certificatetype'],
				'graduation_year' => $applicationForm[0]['graduation_year'],
                'lastschool_registrynumber' => $applicationForm[0]['lastschool_registrynumber'],
                'lastschool_unittypeid' => $applicationForm[0]['lastschool_unittypeid'],
                'lastschool_schoolname' => $applicationForm[0]['lastschool_schoolname'],
                'lastschool_schoolyear' => $applicationForm[0]['lastschool_schoolyear'],
                'lastschool_class' => $applicationForm[0]['lastschool_class'],
				'currentclass' => $applicationForm[0]['currentclass'],
                'guardian_name' => $applicationForm[0]['cu_name'],
                'guardian_surname' => $applicationForm[0]['cu_surname'],
                'guardian_fathername' => $applicationForm[0]['cu_fathername'],
                'guardian_mothername' => $applicationForm[0]['cu_mothername'],
                'agreement' => $applicationForm[0]['disclaimer_checked'],
				'relationtostudent' => $applicationForm[0]['relationtostudent'],
				'telnum' => $applicationForm[0]['telnum']
            );

            if (($errorCode = $this->validateStudent($student)) > 0) {
                return $this->respondWithStatus([
    					"error_code" => $errorCode ], Response::HTTP_OK);
            }
            $lastSchoolRegistryNumber = $student['lastschool_registrynumber'];
            $lastSchoolYear = (int)(substr($student['lastschool_schoolyear'], -4));
            if ((int)date("Y") === $lastSchoolYear && (int)$student['lastschool_unittypeid'] === 5) {
                $epalSchools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $lastSchoolRegistryNumber));
    	        $epalSchool = reset($epalSchools);
                if (!$epalSchool){
        			return $this->respondWithStatus([
        					"error_code" => 4004
        				], Response::HTTP_FORBIDDEN);
        		} else {
                    $student['currentepal'] = $epalSchool->id();
                }
            } else {
                $student['currentepal'] = 0;
            }

			$entity_storage_student = $this->entityTypeManager->getStorage('epal_student');
			$entity_object = $entity_storage_student->create($student);
			$entity_storage_student->save($entity_object);

			$created_student_id = $entity_object->id();

			for ($i = 0; $i < sizeof($applicationForm[1]); $i++) {
				$epalchosen = array(
					'student_id' => $created_student_id,
					'epal_id' => $applicationForm[1][$i]['epal_id'],
					'choice_no' => $applicationForm[1][$i]['choice_no']
				);
				$entity_storage_epalchosen = $this->entityTypeManager->getStorage('epal_student_epal_chosen');
				$entity_object = $entity_storage_epalchosen->create($epalchosen);
				$entity_storage_epalchosen->save($entity_object);
			}


      if ($applicationForm[0]['currentclass'] === "3" || $applicationForm[0]['currentclass'] === "4" )	{
				$course = array(
					'student_id' => $created_student_id,
					'coursefield_id' => $applicationForm[3]['coursefield_id']
				);

				$entity_storage_course = $this->entityTypeManager->getStorage('epal_student_course_field');
				$entity_object = $entity_storage_course->create($course);
				$entity_storage_course->save($entity_object);
			}

      else if ($applicationForm[0]['currentclass'] === "2")	{
				$sector = array(
					'student_id' => $created_student_id,
					'sectorfield_id' => $applicationForm[3]['sectorfield_id']
				);

				$entity_storage_sector = $this->entityTypeManager->getStorage('epal_student_sector_field');
				$entity_object = $entity_storage_sector->create($sector);
				$entity_storage_sector->save($entity_object);
			}
			return $this->respondWithStatus([
					"error_code" => 0
				], Response::HTTP_OK);
		}

		catch (\Exception $e) {
            print_r($e->getMessage());
			$this->logger->warning($e->getMessage());

			$transaction->rollback();
			return $this->respondWithStatus([
					"error_code" => 5001
				], Response::HTTP_INTERNAL_SERVER_ERROR);
		}
	 }

	 private function respondWithStatus($arr, $s) {
         $res = new JsonResponse($arr);
         $res->setStatusCode($s);
         return $res;
     }

     private function validateStudent($student) {
         if(!$student["agreement"]) {
             return 1001;
         }
         if(!$student["lastschool_schoolyear"] || strlen($student["lastschool_schoolyear"]) !== 9) {
             return 1002;
         }
         return 0;
     }
}
