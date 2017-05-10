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
                    $list[] = array(
                            'name' => $object -> name ->value,
                            'studentsurname' => $object -> studentsurname ->value,
                            'fatherfirstname' => $object -> fatherfirstname ->value,
                            'fathersurname' =>$object -> fathersurname ->value,
                            'motherfirstname' => $object -> motherfirstname ->value,
                            'mothersurname' =>$object -> mothersurname ->value,
                            'guardianfirstname' =>$epalUser -> name ->value,
                            'guardiansurname' =>$epalUser -> surname ->value,                            
                            'regionaddress' =>$object -> regionaddress ->value,
                            'regiontk' =>$object -> regiontk ->value,
                            'regionarea' =>$object -> regionarea ->value,
                            'certificatetype' =>$object -> certificatetype ->value,
                            'telnum' =>$object -> telnum ->value,
                            'relationtostudent' =>$object -> relationtostudent ->value,
                            'birthdate' =>$object -> birthdate ->value,
                            



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
                    'message' => t("User not found"),
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





   private function respondWithStatus($arr, $s) {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }





}
