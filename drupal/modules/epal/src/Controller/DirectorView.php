<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Database\Connection;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

class DirectorView extends ControllerBase
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



public function getSectorsPerSchool(Request $request, $epalId)
    {
  
        $authToken = $request->headers->get('PHP_AUTH_USER');
       
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
                $userid = $epalUser -> user_id -> entity -> id();
                $epalIdNew = intval($epalId);
                $sectorPerSchool = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id'=> $epalIdNew));
                $i = 0;

            if ($sectorPerSchool) {
                 $list = array();
                foreach ($sectorPerSchool as $object) {
                    $list[] = array(
                            'sector_id' => $object -> sector_id ->entity->get('name')->value ,
                            'id' => $object -> sector_id -> entity -> id()
);

                   	 $i++;
                }
                
                return $this->respondWithStatus(
                        $list
                    , Response::HTTP_OK);
                }
             else {
                       return $this->respondWithStatus([
                    'message' => t("School not found!!!"),
                ], Response::HTTP_FORBIDDEN);
                }
            


        } else {

            return $this->respondWithStatus([
                    'message' => t("User not found!"),
                ], Response::HTTP_FORBIDDEN);
        }
        
    }

public function getSpecialPerSchool(Request $request, $epalId , $sectorId)
    {
  
        $authToken = $request->headers->get('PHP_AUTH_USER');
       
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
                $userid = $epalUser -> user_id -> entity -> id();
                $epalIdNew = intval($epalId);
                $specialityPerSchool = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id'=> $epalIdNew));
                $i = 0;

            if ($specialityPerSchool) {
                 $list = array();
                 $SectorIdNew = intval($sectorId);
                foreach ($specialityPerSchool as $object) {
                       $idSpecial =  $object -> specialty_id -> entity -> id() ;

                       $specialityPerSector = $this->entityTypeManager->getStorage('eepal_specialty')->loadByProperties(array('id'=> $idSpecial,'sector_id' => $SectorIdNew ));
                       $specialPerSec = reset($specialityPerSector);
                       if ($specialPerSec)  
                        {       $list[] = array(
                                'specialty_id' => $object -> specialty_id ->entity->get('name')->value ,
                                'id' => $object -> specialty_id -> entity -> id()     );
                                $i++;
                        }
                        
                }
                
                return $this->respondWithStatus(
                        $list
                    , Response::HTTP_OK);
                }
             else {
                       return $this->respondWithStatus([
                    'message' => t("School not found!!!"),
                ], Response::HTTP_FORBIDDEN);
                }
            


        } else {

            return $this->respondWithStatus([
                    'message' => t("User not found!"),
                ], Response::HTTP_FORBIDDEN);
        }
        
    }


public function getStudentPerSchool(Request $request, $epalId , $selectId, $classId)
    {
  
        $authToken = $request->headers->get('PHP_AUTH_USER');
       
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
                $userid = $epalUser -> user_id -> entity -> id();
                $epalIdNew = intval($epalId);
                $selectIdNew = intval($selectId);
                if ($classId == 1)
                {
                 $selectIdNew = -1;
                 $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id'=> $epalIdNew, 'specialization_id' => $selectIdNew, 'currentclass' => $classId ));
                   
                }
                else
                {    
                $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id'=> $epalIdNew, 'specialization_id' => $selectIdNew, 'currentclass' => $classId ));
                }   
                $i = 0;

            if ($studentPerSchool) {
                 $list = array();
                 foreach ($studentPerSchool as $object) 
                        {     
                        $studentId = $object -> id() ;
                        $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('id'=> $studentId));
                        $epalStudent = reset($epalStudents);
                        $i = 0;
                        if ($epalStudents) {
                             
                           $list[] = array(
                            'id' => $epalStudent -> id(),
                            'name' => $epalStudent -> name ->value,
                            'studentsurname' => $epalStudent -> studentsurname ->value,
                            'fatherfirstname' => $epalStudent -> fatherfirstname ->value,
                            'fathersurname' =>$epalStudent -> fathersurname ->value,
                            'motherfirstname' => $epalStudent -> motherfirstname ->value,
                            'mothersurname' =>$epalStudent -> mothersurname ->value,
                            'birthdate' =>$epalStudent -> birthdate ->value,
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
                    'message' => t("No students found!!!"),
                ], Response::HTTP_FORBIDDEN);
                }
            


        } 
        else {

            return $this->respondWithStatus([
                    'message' => t("User not found!"),
                ], Response::HTTP_FORBIDDEN);
        }
        
    }



    public function ConfirmStudents(Request $request)
    {

        if (!$request->isMethod('POST')) {
            return $this->respondWithStatus([ 
                    "message" => t("Method Not Allowed")
                ], Response::HTTP_METHOD_NOT_ALLOWED);
        }
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $postData = null;

            if ($content = $request->getContent())
            {
                 $postData = json_decode($content);
                 $arr = $postData->students;

                foreach ($arr as $value) {
                    $valnew = intval($value);  
                 $studentForConfirm = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('id' => $valnew ));
                    $studentConfirm = reset($studentForConfirm);
                  if ($studentConfirm) {
                         $studentConfirm->set('directorconfirm', true);
                         $studentConfirm->save();
                    }   
                } 
                return $this->respondWithStatus([
                    'message' => t("saved"),
                ], Response::HTTP_OK);
            }
             else
              {
                  return $this->respondWithStatus([
                    'message' => t("post with no data"),
                ], Response::HTTP_BAD_REQUEST);
                }

            } else {
            return $this->respondWithStatus([
                    'message' => t("EPAL user not found"),
                ], Response::HTTP_FORBIDDEN);
        }
    }




   private function respondWithStatus($arr, $s) {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }





}





