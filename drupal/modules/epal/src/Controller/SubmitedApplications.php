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
        $studentId = $request->headers->get('id');
     
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $userid = $epalUser -> id();
            
            if ($studentId ==="")
            {
            $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('epaluser_id' => $userid));
            $i = 0;
            if ($epalStudents) {
                 $list = array();
                foreach ($epalStudents as $object) {
                   
                
                    $list[] = array(
                            'id' => $object -> id(),
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
            }
            else
            {
                $studentIdNew = intval($studentId) ;
                $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('epaluser_id' => $userid, 'id'=> $studentIdNew));
                $i = 0;

                 if ($epalStudents) {
                 $list = array();
                foreach ($epalStudents as $object) {
                   
                
                    $list[] = array(
                            'id' => $object -> id(),
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
