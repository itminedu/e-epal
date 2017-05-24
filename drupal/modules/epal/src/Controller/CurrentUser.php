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

class CurrentUser extends ControllerBase
{
    protected $entityTypeManager;
    protected $logger;
    protected $connection;

    public function __construct(
        EntityTypeManagerInterface $entityTypeManager,
        Connection $connection,
        LoggerChannelFactoryInterface $loggerChannel
        )
    {
        $this->entityTypeManager = $entityTypeManager;
        $this->connection = $connection;
        $this->logger = $loggerChannel->get('epal');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('entity_type.manager'),
            $container->get('database'),
            $container->get('logger.factory')
        );
    }

    public function getLoginInfo(Request $request)
    {

        $authToken = $request->headers->get('PHP_AUTH_USER');
//        echo("authtoken in controller=" . $authToken);
        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if (!$user) {
            return $this->respondWithStatus([
                    'message' => t("User not found"),
                ], Response::HTTP_FORBIDDEN);
        }

        $epalConfigs = $this->entityTypeManager->getStorage('epal_config')->loadByProperties(array('name' => 'epal_config'));
        $epalConfig = reset($epalConfigs);
        if (!$epalConfig) {
            return $this->respondWithStatus([
                    'message' => t("Configuration not found"),
                ], Response::HTTP_FORBIDDEN);
        }

        $userRoles = $user->getRoles();
        foreach ($userRoles as $userRole) {
            if (($userRole === 'epal') || ($userRole === 'regioneduadmin') || ($userRole === 'eduadmin')) {
                return $this->respondWithStatus([
                        'cu_name' => $user->mail->value,
                        'cu_surname' => '',
                        'cu_fathername' => '',
                        'cu_mothername' => '',
                        'cu_email' => '',
                        'minedu_username' => '',
                        'minedu_userpassword' => '',
                        'lock_capacity' => $epalConfig->lock_school_capacity->value,
                        'lock_students' => $epalConfig->lock_school_students_view->value,
                        'lock_application' => $epalConfig->lock_application->value,
                        'disclaimer_checked' => "0",
                        'title' => $user->init->value
                    ], Response::HTTP_OK);
            } else if ($userRole === 'applicant') {
                break;
            }

        }

        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $userName = $epalUser->name->value;
            $userSurname = $epalUser->surname->value;
            $userFathername = $epalUser->fathername->value;
            $userMothername = $epalUser->mothername->value;
            $userEmail = $user->mail->value;
            return $this->respondWithStatus([
                    'cu_name' => mb_substr($epalUser->name->value,0,4,'UTF-8') !== "####" ? $epalUser->name->value : '',
                    'cu_surname' => mb_substr($epalUser->surname->value,0,4,'UTF-8') !== "####" ? $epalUser->surname->value : '',
                    'cu_fathername' => mb_substr($epalUser->fathername->value,0,4,'UTF-8') !== "####" ? $epalUser->fathername->value : '',
                    'cu_mothername' => mb_substr($epalUser->mothername->value,0,4,'UTF-8') !== "####" ? $epalUser->mothername->value : '',
                    'cu_email' => mb_substr($user->mail->value,0,4,'UTF-8') !== "####" ? $user->mail->value : '',
                    'minedu_username' => '',
                    'minedu_userpassword' => '',
                    'lock_capacity' => $epalConfig->lock_school_capacity->value,
                    'lock_students' => $epalConfig->lock_school_students_view->value,
                    'lock_application' => $epalConfig->lock_application->value,
                    'disclaimer_checked' => "0",
                    'verificationCodeVerified' => $epalUser->verificationcodeverified->value,
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
                    'verificationCodeVerified' => $epalUser->verificationcodeverified->value,
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

    public function sendVerificationCode(Request $request)
    {

        if (!$request->isMethod('POST')) {
			return $this->respondWithStatus([
					"message" => t("Method Not Allowed")
				], Response::HTTP_METHOD_NOT_ALLOWED);
    	}
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $trx = $this->connection->startTransaction();
        try {
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
        $epalUser = reset($epalUsers);
        if ($epalUser) {
            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);
            if ($user) {
                $postData = null;
                if ($content = $request->getContent()) {
                    $postData = json_decode($content);
                    $verificationCode = uniqid();
                    $epalUser->set('verificationcode', $verificationCode);
                    $epalUser->set('verificationcodeverified', FALSE);
                    $epalUser->save();
                    $user->set('mail', $postData->userEmail);
                    $user->save();
                    $this->sendEmailWithVerificationCode($postData->userEmail, $verificationCode, $user);
                    return $this->respondWithStatus([
                        'userEmail' => $postData->userEmail,
                        'verCode' => $verificationCode,
                    ], Response::HTTP_OK);
                }
                else {
                    return $this->respondWithStatus([
                        'message' => t("post with no data"),
                    ], Response::HTTP_BAD_REQUEST);
                }

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
        } catch (\Exception $ee) {
            $this->logger->warning($ee->getMessage());
            $trx->rollback();
            return false;
        }

    }

    private function sendEmailWithVerificationCode($email, $vc, $user) {
        $mailManager = \Drupal::service('plugin.manager.mail');

        $module = 'epal';
        $key = 'send_verification_code';
        $to = $email;
        $params['message'] = 'Κωδικός επαλήθευσης=' . $vc;
        $langcode = $user->getPreferredLangcode();
        $send = true;

        $mail_sent = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

        if ($mail_sent) {
            $this->logger->info("Mail Sent successfully.");
        }
        else {
            $this->logger->info("There is error in sending mail.");
        }
        return;
    }


    public function verifyVerificationCode(Request $request)
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

            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);
            if ($user) {
                $postData = null;
                if ($content = $request->getContent()) {
                    $postData = json_decode($content);
                    if ($epalUser->verificationcode->value !== $postData->verificationCode) {
                        return $this->respondWithStatus([
                            'userEmail' => $user->mail->value,
                            'verificationCodeVerified' => false
                        ], Response::HTTP_OK);
                    } else {
                        $epalUser->set('verificationcodeverified', true);
                        $epalUser->save();
                        return $this->respondWithStatus([
                            'userEmail' => $user->mail->value,
                            'verificationCodeVerified' => true
                        ], Response::HTTP_OK);
                    }
                }
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

    public function saveUserProfile(Request $request)
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
            if ($content = $request->getContent()) {
                $postData = json_decode($content);
                $epalUser->set('name', $postData->userProfile->userName);
                $epalUser->set('surname', $postData->userProfile->userSurname);
                $epalUser->set('mothername', $postData->userProfile->userMothername);
                $epalUser->set('fathername', $postData->userProfile->userFathername);
                $epalUser->save();
                return $this->respondWithStatus([
                    'message' => t("profile saved"),
                ], Response::HTTP_OK);
            } else {
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
