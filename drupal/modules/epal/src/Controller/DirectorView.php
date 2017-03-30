<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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





   private function respondWithStatus($arr, $s) {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }





}





