<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;

use Drupal\epal\Crypt;

class SubmitedApplications extends ControllerBase
{
    protected $entityTypeManager;
    protected $logger;

    /*
    public function __construct(EntityTypeManagerInterface $entityTypeManager)
    {
        $this->entityTypeManager = $entityTypeManager;

    }
    */

    public function __construct(
  		EntityTypeManagerInterface $entityTypeManager,
  		LoggerChannelFactoryInterface $loggerChannel)
  		{
  			$this->entityTypeManager = $entityTypeManager;
  			$this->logger = $loggerChannel->get('epal');
      }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('entity_type.manager'),
            $container->get('logger.factory')
        );
    }


    public function getSubmittedApplications(Request $request)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $userid = $epalUser -> id();

            $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('epaluser_id' => $userid));
            $i = 0;
            if ($epalStudents) {

                $crypt = new Crypt();

                $list = array();
                foreach ($epalStudents as $object) {

                    $indexid = intval($object -> id())-1;

                    try  {
                      $name_decoded = $crypt->decrypt($object->name->value);
                      $studentsurname_decoded = $crypt->decrypt($object->studentsurname->value);
                    }
                    catch (\Exception $e) {
                        unset($crypt);
                        $this->logger->warning($e->getMessage());
                        return $this->respondWithStatus([
                          "message" => t("An unexpected error occured during DECODING data in getSubmittedApplications Method ")
                        ], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }

                    $list[] = array(
                            'id' => $indexid,
                            //'name' => $object -> name ->value,
                            'name' => $name_decoded,
                            //'studentsurname' => $object -> studentsurname ->value);
                            'studentsurname' => $studentsurname_decoded );
                    $i++;
                }

                unset($crypt);

                return $this->respondWithStatus(
                        $list
                    , Response::HTTP_OK);
                }
            else {
                       return $this->respondWithStatus([
                    'message' => t("EPAL user not found"),
                ], Response::HTTP_FORBIDDEN);
                }




        } else {
            return $this->respondWithStatus([
                    'message' => t("User not found"),
                ], Response::HTTP_FORBIDDEN);
        }

    }




 public function getStudentApplications(Request $request, $studentId)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $userid = $epalUser -> id();
                $studentIdNew = intval($studentId) ;
                $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('epaluser_id' => $userid, 'id'=> $studentIdNew));
                $i = 0;

                 if ($epalStudents) {


                 $list = array();

                foreach ($epalStudents as $object) {
                    $sectorName = '';
                    $courseName = '';
                    if ($object->currentclass->value === '2') {
                        $sectors = $this->entityTypeManager->getStorage('epal_student_sector_field')->loadByProperties(array('student_id' => $object->id()));
                        $sector = reset($sectors);
                        if ($sector)
                            $sectorName = $this->entityTypeManager->getStorage('eepal_sectors')->load($sector->sectorfield_id->target_id)->name->value;
                    }
                    else if ($object->currentclass->value === '3' || $object->currentclass->value === '4') {
                        $courses = $this->entityTypeManager->getStorage('epal_student_course_field')->loadByProperties(array('student_id' => $object->id()));
                        $course = reset($courses);
                        if ($course)
                            $courseName = $this->entityTypeManager->getStorage('eepal_specialty')->load($course->coursefield_id->target_id)->name->value;
                    }


                    $crypt = new Crypt();
                    try  {
                      $name_decoded = $crypt->decrypt($object->name->value);
                      $studentsurname_decoded = $crypt->decrypt($object->studentsurname->value);
                      $fatherfirstname_decoded = $crypt->decrypt($object->fatherfirstname->value);
                      $motherfirstname_decoded = $crypt->decrypt($object->motherfirstname->value);
                      $regionaddress_decoded = $crypt->decrypt($object->regionaddress->value);
                      $regiontk_decoded = $crypt->decrypt($object->regiontk->value);
                      $regionarea_decoded = $crypt->decrypt($object->regionarea->value);
                      $certificatetype_decoded = $crypt->decrypt($object->certificatetype->value);
                      $relationtostudent_decoded = $crypt->decrypt($object->relationtostudent->value);
                      $telnum_decoded = $crypt->decrypt($object->telnum->value);
                      $guardian_name_decoded = $crypt->decrypt($object->guardian_name->value);
                      $guardian_surname_decoded = $crypt->decrypt($object->guardian_surname->value);
                      $guardian_fathername_decoded = $crypt->decrypt($object->guardian_fathername->value);
                      $guardian_mothername_decoded = $crypt->decrypt($object->guardian_mothername->value);
                    }
                    catch (\Exception $e) {
                        //print_r($e->getMessage());
                        unset($crypt);
                  			$this->logger->warning($e->getMessage());
                  			return $this->respondWithStatus([
                            "message" => t("An unexpected error occured during DECODING data in getStudentApplications Method ")
                  			     ], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                    unset($crypt);

                    $list[] = array(
                            'applicationId' => $object->id(),
                            //'name' => $object -> name ->value,
                            'name' => $name_decoded,
                            //'studentsurname' => $object -> studentsurname ->value,
                            'studentsurname' => $studentsurname_decoded,
                            //'fatherfirstname' => $object -> fatherfirstname ->value,
                            'fatherfirstname' => $fatherfirstname_decoded,
                            'fathersurname' =>$object -> fathersurname ->value,
                            //'motherfirstname' => $object -> motherfirstname ->value,
                            'motherfirstname' => $motherfirstname_decoded,
                            'mothersurname' =>$object -> mothersurname ->value,
                            //'guardian_name' =>$object -> guardian_name ->value,
                            'guardian_name' =>$guardian_name_decoded,
                            //'guardian_surname' =>$object -> guardian_surname ->value,
                            'guardian_surname' => $guardian_surname_decoded,
                            //'guardian_fathername' =>$object -> guardian_fathername ->value,
                            'guardian_fathername' =>$guardian_fathername_decoded,
                            //'guardian_mothername' =>$object -> guardian_mothername ->value,
                            'guardian_mothername' =>$guardian_mothername_decoded,
                            'lastschool_schoolname' =>$object -> lastschool_schoolname ->value,
                            'lastschool_schoolyear' =>$object -> lastschool_schoolyear ->value,
                            'lastschool_class' =>$object -> lastschool_class ->value,
                            'currentclass' =>$object -> currentclass ->value,
                            'currentsector' =>$sectorName,
                            'currentcourse' =>$courseName,
                            //'regionaddress' =>$object -> regionaddress ->value,
                            'regionaddress' =>$regionaddress_decoded,
                            //'regiontk' =>$object -> regiontk ->value,
                            'regiontk' =>$regiontk_decoded,
                            //'regionarea' =>$object -> regionarea ->value,
                            'regionarea' =>$regionarea_decoded,
                            //'certificatetype' =>$object -> certificatetype ->value,
                            'certificatetype' => $certificatetype_decoded,
                            'graduation_year' =>$object -> graduation_year ->value,
                            //'telnum' =>$object -> telnum ->value,
                            'telnum' =>$telnum_decoded,
                            //'relationtostudent' =>$object -> relationtostudent ->value,
                            'relationtostudent' => $relationtostudent_decoded,
                            'birthdate' => substr($object->birthdate->value, 8, 2) . '/' . substr($object->birthdate->value, 6, 2) . '/' . substr($object->birthdate->value, 0, 4),
                            'created' => date('d/m/Y H:i', $object -> created ->value),

                        );

                    $i++;
                }

                return $this->respondWithStatus(
                        $list
                    , Response::HTTP_OK);
                }
             else {
                       return $this->respondWithStatus([
                    'message' => t("EPAL user not found"),
                ], Response::HTTP_FORBIDDEN);
                }



        } else {
            return $this->respondWithStatus([
                    'message' => t("User not found!!!!"),
                ], Response::HTTP_FORBIDDEN);
        }

    }


public function getEpalChosen(Request $request, $studentId)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
                $userid = $epalUser -> user_id -> entity -> id();
                $studentIdNew = intval($studentId) ;
                 $epalChosen = $this->entityTypeManager->getStorage('epal_student_epal_chosen')->loadByProperties(array( 'user_id'=>$userid,'student_id'=> $studentIdNew));
                $i = 0;

            if ($epalChosen) {
                 $list = array();
                foreach ($epalChosen as $object) {
                    $list[] = array(
                            'epal_id' => $object -> epal_id ->entity->get('name')->value ,
                            'choice_no' => $object -> choice_no ->value,
);

                    $i++;
                }

                return $this->respondWithStatus(
                        $list
                    , Response::HTTP_OK);
                }
             else {
                       return $this->respondWithStatus([
                    'message' => t("EPAL chosen not found!!!"),
                ], Response::HTTP_FORBIDDEN);
                }



        } else {
            return $this->respondWithStatus([
                    'message' => t("User not found"),
                ], Response::HTTP_FORBIDDEN);
        }

    }


    public function getCritiria(Request $request, $studentId, $type)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
                $userid = $epalUser -> user_id -> entity -> id();
                $studentIdNew = intval($studentId) ;
                $critiriaChosen = $this->entityTypeManager->getStorage('epal_student_moria')->loadByProperties(array( 'user_id'=>$userid,'student_id'=> $studentIdNew));
                $i = 0;

            if ($critiriaChosen) {
                 $list = array();
                foreach ($critiriaChosen as $object) {
                    $critirio_id = $object -> criterio_id ->entity -> id();
                    $critiriatype = $this->entityTypeManager->getStorage('epal_criteria')->loadByProperties(array( 'id'=>$critirio_id ));
                    $typeofcritiria = reset($critiriatype);
                    $typecrit = $typeofcritiria -> category -> value;
                    if ($typecrit == "Κοινωνικό" && $type == 1){
                        $list[] = array(
                            'critirio' => $object -> criterio_id ->entity->get('name')->value ,
                            'critirio_id' => $critirio_id ,
                            );

                        $i++;
                    }
                    if ($typecrit == "Εισοδηματικό" && $type == 2){
                        $list[] = array(
                            'critirio' => $object -> criterio_id ->entity->get('name')->value ,
                            'critirio_id' => $critirio_id ,
                            );

                        $i++;
                    }


                }

                return $this->respondWithStatus(
                        $list
                    , Response::HTTP_OK);
                }
             else {
                       return $this->respondWithStatus([
                    'message' => t("EPAL chosen not found!!!"),
                ], Response::HTTP_FORBIDDEN);
                }



        } else {
            return $this->respondWithStatus([
                    'message' => t("User not found"),
                ], Response::HTTP_FORBIDDEN);
        }

    }






   private function respondWithStatus($arr, $s) {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }





}
