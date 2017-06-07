<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SubmitedApplications extends ControllerBase
{
    protected $entityTypeManager;

    public function __construct(EntityTypeManagerInterface $entityTypeManager)
    {
        $this->entityTypeManager = $entityTypeManager;
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('entity_type.manager')
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
                 $list = array();
                foreach ($epalStudents as $object) {

                    $indexid = intval($object -> id())-1;
                    $list[] = array(
                            'id' => $indexid,
                            'name' => $object -> name ->value,
                            'studentsurname' => $object -> studentsurname ->value);
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
                    $list[] = array(
                            'applicationId' => $object->id(),
                            'name' => $object -> name ->value,
                            'studentsurname' => $object -> studentsurname ->value,
                            'fatherfirstname' => $object -> fatherfirstname ->value,
                            'fathersurname' =>$object -> fathersurname ->value,
                            'motherfirstname' => $object -> motherfirstname ->value,
                            'mothersurname' =>$object -> mothersurname ->value,
                            'guardian_name' =>$object -> guardian_name ->value,
                            'guardian_surname' =>$object -> guardian_surname ->value,
                            'guardian_fathername' =>$object -> guardian_fathername ->value,
                            'guardian_mothername' =>$object -> guardian_mothername ->value,
                            'lastschool_schoolname' =>$object -> lastschool_schoolname ->value,
                            'lastschool_schoolyear' =>$object -> lastschool_schoolyear ->value,
                            'lastschool_class' =>$object -> lastschool_class ->value,
                            'currentclass' =>$object -> currentclass ->value,
                            'currentsector' =>$sectorName,
                            'currentcourse' =>$courseName,
                            'regionaddress' =>$object -> regionaddress ->value,
                            'regiontk' =>$object -> regiontk ->value,
                            'regionarea' =>$object -> regionarea ->value,
                            'certificatetype' =>$object -> certificatetype ->value,
                            'graduation_year' =>$object -> graduation_year ->value,
                            'telnum' =>$object -> telnum ->value,
                            'relationtostudent' =>$object -> relationtostudent ->value,
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
