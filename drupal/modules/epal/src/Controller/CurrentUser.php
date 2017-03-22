<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CurrentUser extends ControllerBase
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

    public function getLoginInfo(Request $request)
    {
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            return $this->respondWithStatus([
                    'name' => $epalUser->name->value,
                ], Response::HTTP_OK);
        } else {
            return $this->respondWithStatus([
                    'message' => t("EPAL user not found"),
                ], Response::HTTP_FORBIDDEN);
        }
    }

    public function getEpalUserData(Request $request)
    {
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);
            if ($user) {
                $userName = $epalUser->name->value;
                $userSurname = $epalUser->surname->value;
                $userFathername = $epalUser->fathername->value;
                $userMothername = $epalUser->mothername->value;
                $userEmail = $user->mail->value;
                return $this->respondWithStatus([
                    'userName' => mb_substr($epalUser->name->value,0,4,'UTF-8') !== "####" ? $epalUser->name->value : '',
                    'userSurname' => mb_substr($epalUser->surname->value,0,4,'UTF-8') !== "####" ? $epalUser->surname->value : '',
                    'userFathername' => mb_substr($epalUser->fathername->value,0,4,'UTF-8') !== "####" ? $epalUser->fathername->value : '',
                    'userMothername' => mb_substr($epalUser->mothername->value,0,4,'UTF-8') !== "####" ? $epalUser->mothername->value : '',
                    'userEmail' => mb_substr($user->mail->value,0,4,'UTF-8') !== "####" ? $user->mail->value : '',
                ], Response::HTTP_OK);
            } else {
                return $this->respondWithStatus([
                    'message' => t("user not found"),
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
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
