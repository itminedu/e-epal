<?php namespace Drupal\oauthost\Controller;

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
    EntityTypeManagerInterface $entityTypeManager, QueryFactory $entity_query, Connection $connection, LoggerChannelFactoryInterface $loggerChannel)
    {
        $this->entityTypeManager = $entityTypeManager;
        $this->entity_query = $entity_query;
        $this->connection = $connection;
        $this->logger = $loggerChannel->get('oauthost');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('entity.manager'), $container->get('entity.query'), $container->get('database'), $container->get('logger.factory')
        );
    }

    public function logoutGo(Request $request)
    {
        $trx = $this->connection->startTransaction();

        try {
            $user = null;
            $username = $request->headers->get('PHP_AUTH_USER');
            $oauthostSessions = $this->entityTypeManager->getStorage('oauthost_session')->loadByProperties(array('authtoken' => $username));
            $this->oauthostSession = reset($oauthostSessions);

            if ($this->oauthostSession) {
                $configRowName = $this->oauthostSession->configrowname->value;
            } else {
                $trx->rollback();
                $this->logger->warning("oauthostSession for [{$username}] not set");
                $response = new Response();
                $response->setContent('forbidden');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

            $ostauthConfigs = $this->entityTypeManager->getStorage('oauthost_config')->loadByProperties(array('name' => $configRowName));
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
                $trx->rollback();
                $this->logger->warning("ostauthConfig [{$configRowName}]not found");
                $response = new Response();
                $response->setContent('forbidden');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

            $epalUsers = $this->entityTypeManager
                ->getStorage('epal_users')
                ->loadByProperties(array('authtoken' => $username));
            $epalUser = reset($epalUsers);
            $foundUser = false;
            if ($epalUser) {
                $user = $this->entityTypeManager
                    ->getStorage('user')
                    ->load($epalUser->user_id->target_id);
                $logout_token = $epalUser->getRequesttoken();
                if ($user) {
                    $res = \Drupal::httpClient()->get($this->logout_url . $username, array('headers' => array('Accept' => 'text/plain')));
                    $user->setPassword(uniqid('pw'));
                    $user->save();
                    $epalUser->set('accesstoken', '-');
                    $epalUser->set('accesstoken_secret', '-');
                    $epalUser->set('authtoken', '-');
                    $epalUser->set('requesttoken', '-');
                    $epalUser->set('requesttoken_secret', '-');
                    $epalUser->save();
                    $foundUser = true;
                }
            }
            if (!$foundUser) {
                $trx->rollback();
                $this->logger->warning("user not found");
                $response = new Response();
                $response->setContent('forbidden');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

            // logout from remote host
            $logout_call_url = "{$this->logout_url}{$logout_token}";
            if (($ch = curl_init()) !== false) {
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_URL, $logout_call_url);
                $remote_logout_result = curl_exec($ch);
                if ($remote_logout_result === false) {
                    // record failure
                    $this->logger->warning("OAUTH remote logout call to [{$logout_call_url}] fail: " . curl_error($ch));
                }
                curl_close($ch);
            } else {
                $this->logger->warning("OAUTH remote logout to [{$logout_call_url}] not called");
            }

            session_unset();
            session_destroy();
            \Drupal::service('page_cache_kill_switch')->trigger();
            $this->oauthostSession->delete();
            $this->logger->info("OAUTH remote logout success for [{$username}]");

            $response = new Response();
            $response->setContent("{\"message\": \"Server logout successful\",\"next\": \"{$this->redirect_url}\"}");
            $response->setStatusCode(Response::HTTP_OK);
            $response->headers->set('Content-Type', 'application/json');

            return $response;
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
