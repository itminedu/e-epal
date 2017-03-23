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
            $userid => $epalUser -> user_id -> entity ->id();
            
            $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('user_id' => $userid));
            $epalStudent = reset($epalStudents);
            if ($epalStudent) {
                return $this->respondWithStatus([
                    'name' => $epalStudent ->name->value,
                    'studentsurname' => $epalStudent ->studentsurname->value,
                    ], Response::HTTP_OK);
                }
            else {
                       return $this->respondWithStatus([
                    'message' => t("EPAL user not found"),
                ], Response::HTTP_FORBIDDEN);
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
