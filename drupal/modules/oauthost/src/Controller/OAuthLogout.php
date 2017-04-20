<?php

namespace Drupal\oauthost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class OAuthLogout extends ControllerBase
{
    protected $entity_query;
    protected $entityTypeManager;
    protected $logger;
    protected $connection;

    protected $consumer_key = '';
    protected $consumer_secret = '';
    protected $request_token_url;
    protected $user_authorization_url;
    protected $access_token_url;
    protected $signature_method;
    protected $api_url;
    protected $callback_url;
    protected $logout_url;
    protected $redirect_url;

    public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    QueryFactory $entity_query,
    Connection $connection,
    LoggerChannelFactoryInterface $loggerChannel)
    {
        $this->entityTypeManager = $entityTypeManager;
        $this->entity_query = $entity_query;
        $this->connection = $connection;
        $this->logger = $loggerChannel->get('oauthost');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity.manager'),
          $container->get('entity.query'),
          $container->get('database'),
          $container->get('logger.factory')
      );
    }

    public function logoutGo(Request $request)
    {
        $trx = $this->connection->startTransaction();
        try {
        $ostauthConfigs = $this->entityTypeManager->getStorage('oauthost_config')->loadByProperties(array('name' => 'oauthost_taxisnet_config'));
        $ostauthConfig = reset($ostauthConfigs);
        if ($ostauthConfig) {
            $this->consumer_key = $ostauthConfig->consumer_key->value;
            $this->consumer_secret = $ostauthConfig->consumer_secret->value;
            $this->request_token_url = $ostauthConfig->request_token_url->value;
            $this->user_authorization_url = $ostauthConfig->user_authorization_url->value;
            $this->access_token_url = $ostauthConfig->access_token_url->value;
            $this->signature_method = $ostauthConfig->signature_method->value;
            $this->api_url = $ostauthConfig->api_url->value;
            $this->callback_url = $ostauthConfig->callback_url->value;
            $this->logout_url = $ostauthConfig->logout_url->value;
            $this->redirect_url = $ostauthConfig->redirect_url->value;
        } else {
            $response = new Response();
            $response->setContent('forbidden');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $user = null;
        $username = $request->headers->get('PHP_AUTH_USER');
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $username));
        $epalUser = reset($epalUsers);
        $foundUser = true;

        if ($epalUser) {
            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);
            if ($user) {

                $res = \Drupal::httpClient()->get($this->logout_url . $username, array('headers' => array('Accept' => 'text/plain')));
/*                $resData = (string) $res->getBody();
                if (empty($resData)) {
                    return FALSE;
                } */

//                if ($res->getStatusCode() === "200")

                $user->setPassword(uniqid('pw'));
                $user->save();
                $epalUser->set('accesstoken', '-');
                $epalUser->set('accesstoken_secret', '-');
                $epalUser->set('authtoken','-');
                $epalUser->set('requesttoken','-');
                $epalUser->set('requesttoken_secret', '-');
                $epalUser->save();

            } else {
                $foundUser = false;
            }
        } else {
            $foundUser = false;
        }
        if (!$foundUser) {
            $this->logger->warning("user not found");
            $response = new Response();
            $response->setContent('forbidden');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        $response = new Response();
        $response->setContent('logout successful');
        $response->setStatusCode(Response::HTTP_OK);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
//        return new RedirectResponse($this->redirect_url . '&auth_role=', 302, []);


        } catch (Exception $e) {
            $this->logger->warning($e->getMessage());
            $response = new Response();
            $response->setContent('forbidden');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            $trx->rollback();
            return $response;
        }
    }

}
