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
    protected $logger;
    protected $testSchoolId='0640050';

    public function __construct(EntityTypeManagerInterface $entityTypeManager,
        LoggerChannelFactoryInterface $loggerChannel)
    {
        $this->entityTypeManager = $entityTypeManager;
        $this->logger = $loggerChannel->get('epal-school');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('entity_type.manager'),
            $container->get('logger.factory')
        );
    }



public function getSectorsPerSchool(Request $request, $epalId)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
         $user = reset($users);
         if ($user) {
//             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $user->mail->value, 'id' => intval($epalId)));
             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $this->testSchoolId, 'id' => intval($epalId)));
             $school = reset($schools);
             if (!$school) {
                 $this->logger->warning("no access to this school=" . $user->id());
                 $response = new Response();
                 $response->setContent('No access to this school');
                 $response->setStatusCode(Response::HTTP_FORBIDDEN);
                 $response->headers->set('Content-Type', 'application/json');
                 return $response;
             }


                $userid = $user -> id();
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
                ], Response::HTTP_OK);
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

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
         $user = reset($users);
         if ($user) {
//             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $user->mail->value, 'id' => intval($epalId)));
            $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $this->testSchoolId, 'id' => intval($epalId)));
             $school = reset($schools);
             if (!$school) {
                 $this->logger->warning("no access to this school=" . $user->id());
                 $response = new Response();
                 $response->setContent('No access to this school');
                 $response->setStatusCode(Response::HTTP_FORBIDDEN);
                 $response->headers->set('Content-Type', 'application/json');
                 return $response;
             }
                $userid = $user -> id();
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
                ], Response::HTTP_OK);
                }



        } else {

            return $this->respondWithStatus([
                    'message' => t("User not found!"),
                ], Response::HTTP_FORBIDDEN);
        }

    }


public function getStudentPerSchool(Request $request, $epalId , $selectId, $classId, $limitdown, $limitup)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');

       $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
//            $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $user->mail->value, 'id' => intval($epalId)));
            $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $this->testSchoolId, 'id' => intval($epalId)));
            $school = reset($schools);
            if (!$school) {
                $this->logger->warning("no access to this school=" . $user->id());
                $response = new Response();
                $response->setContent('No access to this school');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

                $userid = $user -> id();
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
                 $i = 0;
                 if  ($limitdown==$limitup && $limitup == 0)
                     {
                            $list=array(
                                   'id' => sizeof($studentPerSchool)  
                                ); 
                     }

                  else   
                  {
                         foreach ($studentPerSchool as $object)
                                {
                                $studentId = $object -> id() ;
                                $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('id'=> $studentId));
                                $epalStudent = reset($epalStudents);
                               
                                if ($epalStudent) {

                                   if ($i >= $limitdown && $i < $limitup)
                                   { 
                                   $list[] = array(
                                    'i' => $i,
                                    'id' => $epalStudent -> id(),
                                    'name' => $epalStudent -> name ->value,
                                    'studentsurname' => $epalStudent -> studentsurname ->value,
                                    'fatherfirstname' => $epalStudent -> fatherfirstname ->value,
                                    'fathersurname' =>$epalStudent -> fathersurname ->value,
                                    'motherfirstname' => $epalStudent -> motherfirstname ->value,
                                    'mothersurname' =>$epalStudent -> mothersurname ->value,
                                    'birthdate' =>$epalStudent -> birthdate ->value,
                                    );
                                   }
                                   $i++;
                                }
                            }
                        }
                        return $this->respondWithStatus(
                                $list
                            , Response::HTTP_OK);
                        }
             else {
                 $list = array();
                       return $this->respondWithStatus($list, Response::HTTP_OK);
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

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
         $user = reset($users);
         if ($user) {
//             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $user->mail->value, 'id' => intval($epalId)));
             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $this->testSchoolId));
             $school = reset($schools);
             if (!$school) {
                 $this->logger->warning("no access to this school=" . $user->id());
                 $response = new Response();
                 $response->setContent('No access to this school');
                 $response->setStatusCode(Response::HTTP_FORBIDDEN);
                 $response->headers->set('Content-Type', 'application/json');
                 return $response;
             }

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






public function SaveCapacity(Request $request,$taxi,$tomeas,$specialit,$schoolid)
    {

        if (!$request->isMethod('POST')) {
            return $this->respondWithStatus([
                    "message" => t("Method Not Allowed")
                ], Response::HTTP_METHOD_NOT_ALLOWED);
        }
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
         $user = reset($users);
         if ($user) {
//             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $user->mail->value, 'id' => intval($epalId)));
             $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $this->testSchoolId));
             $school = reset($schools);
             if (!$school) {
                 $this->logger->warning("no access to this school=" . $user->id());
                 $response = new Response();
                 $response->setContent('No access to this school');
                 $response->setStatusCode(Response::HTTP_FORBIDDEN);
                 $response->headers->set('Content-Type', 'application/json');
                 return $response;
             }
            $postData = null;

            if ($content = $request->getContent())
            {
                 $postData = json_decode($content);
                 $cap = $postData->capacity;
                if (($tomeas == 0) || ($specialit == 0))
                {
                 $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid ));
                 $classcapacity = reset($CapacityPerClass);
                  if ($classcapacity) {
                         $classcapacity->set('capacity_class_a', $cap);
                         $classcapacity->save();
                    }
                }


                if (($tomeas != 0) || ($specialit == 0))
                {
                 $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'sector_id' => $tomeas ));
                 $classcapacity = reset($CapacityPerClass);
                  if ($classcapacity) {
                         $classcapacity->set('capacity_class_sector', $cap);
                         $classcapacity->save();
                    }
                }


                if (($tomeas != 0) || ($specialit != 0))
                {
                 $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'specialty_id' => $specialit));
                 $classcapacity = reset($CapacityPerClass);
                  if ($classcapacity) {
                         $classcapacity->set('capacity_class_specialty', $cap);
                         $classcapacity->save();
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




public function getSchoolsPerPerfetcure(Request $request, $perfectureId)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user)
            {
                $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('region_edu_admin_id'=> $perfectureId ));
                if ($schools)        
                {
                    $list = array();
                    foreach ($schools as $object) {
                            $list[] = array(
                                    'id' =>$object -> id(),
                                    'name' => $object -> name ->value,
                                    );

                                 $i++;
                            }
                            return $this->respondWithStatus(
                                     $list
                                   , Response::HTTP_OK);
                }
                else
                {
                       return $this->respondWithStatus([
                            'message' => t("Perfecture not found!"),
                        ], Response::HTTP_FORBIDDEN);

                }
            }    
            else
            {

                   return $this->respondWithStatus([
                            'message' => t("User not found!"),
                        ], Response::HTTP_FORBIDDEN);
            }

    }




   private function respondWithStatus($arr, $s) {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }





}
