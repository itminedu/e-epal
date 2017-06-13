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

use Drupal\epal\Crypt;

use Drupal\epal\ClientConsumer;

class ApplicationSubmit extends ControllerBase
{

    const UNIT_TYPE_NIP = 1;
    const UNIT_TYPE_DIM = 2;
    const UNIT_TYPE_GYM = 3;
    const UNIT_TYPE_LYK = 4;
    const UNIT_TYPE_EPAL = 5;

    const CERT_GYM = 'Απολυτήριο Γυμνασίου';
    const CERT_LYK = 'Απολυτήριο Λυκείου';

    protected $entityTypeManager;
    protected $logger;
    protected $connection;
    protected $client; // client consumer

    public function __construct(
        EntityTypeManagerInterface $entityTypeManager,
        Connection $connection,
        LoggerChannelFactoryInterface $loggerChannel
    ) {
        $this->entityTypeManager = $entityTypeManager;
        $this->connection = $connection;
        $this->logger = $loggerChannel->get('epal');

        $config = $this->config('epal.settings');
        $settings = [];
        foreach (['ws_endpoint', 'ws_username', 'ws_password', 'verbose', 'NO_SAFE_CURL'] as $setting) {
            $settings[$setting] = $config->get($setting);
        }
        $this->client = new ClientConsumer($settings, $entityTypeManager, $loggerChannel);
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

            $epalConfigs = $this->entityTypeManager->getStorage('epal_config')->loadByProperties(array('name' => 'epal_config'));
            $epalConfig = reset($epalConfigs);
            if (!$epalConfig) {
                return $this->respondWithStatus([
                        "error_code" => 3001
                    ], Response::HTTP_FORBIDDEN);
            }
            if ($epalConfig->lock_application->value) {
                return $this->respondWithStatus([
                        "error_code" => 3002
                    ], Response::HTTP_FORBIDDEN);
            }

        $crypt = new Crypt();
        try  {
          $name_encoded = $crypt->encrypt($applicationForm[0]['name']);
          $studentsurname_encoded = $crypt->encrypt($applicationForm[0]['studentsurname']);
          $fatherfirstname_encoded = $crypt->encrypt($applicationForm[0]['fatherfirstname']);
          $motherfirstname_encoded = $crypt->encrypt($applicationForm[0]['motherfirstname']);
          $regionaddress_encoded = $crypt->encrypt($applicationForm[0]['regionaddress']);
          $regiontk_encoded = $crypt->encrypt($applicationForm[0]['regiontk']);
          $regionarea_encoded = $crypt->encrypt($applicationForm[0]['regionarea']);
          //$certificatetype_encoded = $crypt->encrypt($applicationForm[0]['certificatetype']);
          $relationtostudent_encoded = $crypt->encrypt($applicationForm[0]['relationtostudent']);
          $telnum_encoded = $crypt->encrypt($applicationForm[0]['telnum']);
          $guardian_name_encoded = $crypt->encrypt($applicationForm[0]['cu_name']);
          $guardian_surname_encoded = $crypt->encrypt($applicationForm[0]['cu_surname']);
          $guardian_fathername_encoded = $crypt->encrypt($applicationForm[0]['cu_fathername']);
          $guardian_mothername_encoded = $crypt->encrypt($applicationForm[0]['cu_mothername']);
        }
        catch (\Exception $e) {
            print_r($e->getMessage());
            unset($crypt);
      			$this->logger->warning($e->getMessage());
      			return $this->respondWithStatus([
      					"error_code" => 5001
      				], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        unset($crypt);

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

          $second_period = $this->retrievePeriod();

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

                'name' => $name_encoded,
                'studentsurname' => $studentsurname_encoded,
        				'birthdate' => $applicationForm[0]['studentbirthdate'],
                'fatherfirstname' => $fatherfirstname_encoded,
                'motherfirstname' => $motherfirstname_encoded,
                'regionaddress' => $regionaddress_encoded,
                'regionarea' => $regionarea_encoded,
                'regiontk' => $regiontk_encoded,
                //'certificatetype' => $certificatetype_encoded,
        				//'graduation_year' => $applicationForm[0]['graduation_year'],
                'lastschool_registrynumber' => $applicationForm[0]['lastschool_registrynumber'],
                'lastschool_unittypeid' => $applicationForm[0]['lastschool_unittypeid'],
                'lastschool_schoolname' => $applicationForm[0]['lastschool_schoolname'],
                'lastschool_schoolyear' => $applicationForm[0]['lastschool_schoolyear'],
                'lastschool_class' => $applicationForm[0]['lastschool_class'],
        				'currentclass' => $applicationForm[0]['currentclass'],
                'guardian_name' => $guardian_name_encoded,
                'guardian_surname' => $guardian_surname_encoded,
                'guardian_fathername' => $guardian_fathername_encoded,
                'guardian_mothername' => $guardian_mothername_encoded,
                'agreement' => $applicationForm[0]['disclaimer_checked'],
                'relationtostudent' => $relationtostudent_encoded,
                'telnum' => $telnum_encoded,

                'second_period' => $second_period,
                    );

            if (($errorCode = $this->validateStudent($student)) > 0) {
                return $this->respondWithStatus([
                    "error_code" => $errorCode
                ], Response::HTTP_OK);
            }

            $lastSchoolRegistryNumber = $student['lastschool_registrynumber'];
            $lastSchoolYear = (int)(substr($student['lastschool_schoolyear'], -4));
            if ((int)date("Y") === $lastSchoolYear && (int)$student['lastschool_unittypeid'] === 5) {
                $epalSchools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $lastSchoolRegistryNumber));
                $epalSchool = reset($epalSchools);
            /*  if (!$epalSchool){
        			return $this->respondWithStatus([
        					"error_code" => 4004
        				], Response::HTTP_FORBIDDEN);
        		} else { */
                if ($epalSchool) {
                    $student['currentepal'] = $epalSchool->id();
                } else {
                    $student['currentepal'] = 0;
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


            if ($applicationForm[0]['currentclass'] === "3" || $applicationForm[0]['currentclass'] === "4") {
                $course = array(
                    'student_id' => $created_student_id,
                    'coursefield_id' => $applicationForm[3]['coursefield_id']
                );
                $entity_storage_course = $this->entityTypeManager->getStorage('epal_student_course_field');
                $entity_object = $entity_storage_course->create($course);
                $entity_storage_course->save($entity_object);
            } elseif ($applicationForm[0]['currentclass'] === "2") {
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
        } catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            $transaction->rollback();

            return $this->respondWithStatus([
                "error_code" => 5001
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function respondWithStatus($arr, $s)
    {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }


    private function retrievePeriod() {

      $config_storage = $this->entityTypeManager->getStorage('epal_config');
      $epalConfigs = $config_storage->loadByProperties(array('name' => 'epal_config'));
      $epalConfig = reset($epalConfigs);
      if (!$epalConfig)
         return 0;
      else
         $secondPeriodEnabled = $epalConfig->activate_second_period->getString();

      return $secondPeriodEnabled;

    }

    /**
     *
     * @return int error code ελέγχου; 0 εάν ο έλεγχος επιτύχει, μη μηδενικό εάν αποτύχει:
     *  1001 δεν επιλέχθηκε το πλαίσιο συμφωνης γνώμης
     *  1002 λανθασμένο τελευταίο έτος φοίτησης
     *  1003 λανθασμένη ημερομηνία
     *  1004-> 1023: λανθασμένα πεδία αίτησης
     *  8000 μη αναμενόμενο λάθος
     *  8001 δικτυακό λάθος κλήσης υπηρεσίας επιβεβαίωσης στοιχείων
     *  8002 τα στοιχεία φοίτησης δεν επικυρώθηκαν
     *  8003 τα στοιχεία φοίτησης δεν είναι έγκυρα
     */
    private function validateStudent($student)
    {
        $error_code = 0;
        if (!$student["agreement"]) {
            return 1001;
        }
        if (!$student["lastschool_schoolyear"] || strlen($student["lastschool_schoolyear"]) !== 9) {
            return 1002;
        }

        // date in YYY-MM-DD, out d-m-Y
        $date_parts = explode('-', $student['birthdate'], 3);
        if ((count($date_parts) !== 3) ||
            (checkdate($date_parts[1], $date_parts[2], $date_parts[0]) !== true)) {
            return 1003;
        }
        if (intval($date_parts[0]) >= 2003)
            return 1003;
        $birthdate = "{$date_parts[2]}-{$date_parts[1]}-{$date_parts[0]}";

        if (!$student["name"]) {
            return 1004;
        }
        if (!$student["studentsurname"]) {
            return 1005;
        }
        if (!$student["fatherfirstname"]) {
            return 1006;
        }
        if (!$student["motherfirstname"]) {
            return 1007;
        }
        if (!$student["regionaddress"]) {
            return 1008;
        }
        if (!$student["regiontk"]) {
            return 1009;
        }
        if (!$student["regionarea"]) {
            return 1010;
        }
        /*
        if (!$student["certificatetype"]) {
            return 1011;
        }
        if (!$student["graduation_year"]) {
            return 1012;
        }
        */
        if (!$student["currentclass"] || ($student["currentclass"] !== "1" && $student["currentclass"] !== "2" && $student["currentclass"] !== "3" && $student["currentclass"] !== "4") ) {
            return 1013;
        }
        if (!$student["relationtostudent"]) {
            return 1014;
        }
        if (!$student["telnum"]) {
            return 1015;
        }
        if (!$student["guardian_name"]) {
            return 1016;
        }
        if (!$student["guardian_surname"]) {
            return 1017;
        }
        if (!$student["guardian_fathername"]) {
            return 1018;
        }
        if (!$student["guardian_mothername"]) {
            return 1019;
        }
        if (!$student["lastschool_registrynumber"]) {
            return 1020;
        }
        if (!$student["lastschool_unittypeid"]) {
            return 1021;
        }
        if (!$student["lastschool_schoolname"]) {
            return 1022;
        }
        if (!$student["lastschool_class"]) {
            return 1023;
        }

        // check as per specs:
        // - can't check certification prior to 2014, pass through
        // - check certification if last passed class is gym
        // - check promotion if last passed class is not gym

/*        $check_certification = true;
        $check_promotion = true;
        if (intval($student['lastschool_unittypeid']) == self::UNIT_TYPE_GYM) {
            $check_promotion = false;
            $check_certification = true;
        }
        if (intval($student['graduation_year']) < 2014 &&
            intval($student['certificatetype']) == self::CERT_GYM) {
            $check_certification = false;
        }

        // now check service
        $pass = true;
        $error_code = 0;
        if (($check_certification === true) ||
            ($check_promotion === true)) {
            if ($check_promotion === true) {
                $service = 'getStudentEpalPromotion';
            } else {
                $service = 'getStudentEpalCertification';
            }
            try {
                $didactic_year_id = $this->client->getDidacticYear(substr($student["lastschool_schoolyear"], -4, 4));
                $level_name = $this->client->getLevelName($student['lastschool_class']);
                $service_rv = $this->client->$service(
                    $didactic_year_id,
                    $student['studentsurname'],
                    $student['name'],
                    $student['fatherfirstname'],
                    $student['motherfirstname'],
                    $birthdate,
                    $student['lastschool_registrynumber'],
                    $level_name
                );
                $pass = ($service_rv == 'true');
                if ($service_rv == 'true') {
                    $error_code = 0;
                } elseif ($service_rv == 'false') {
                    $error_code = 8002;
                } elseif ($service_rv == 'null') {
                    $error_code = 8003;
                } else {
                    // -1 is an exception and data is already validated
                    $error_code = 8001;
                }
            } catch (\Exception $e) {
                $pass = false;
                $error_code = 8000;
            }
        } */

        return $error_code;
    }
}
