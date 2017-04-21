<?php

namespace Drupal\oauthost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Controller\ControllerBase;
use OAuth;
use OAuthException;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\HttpFoundation\Cookie;
require ('RedirectResponseWithCookie.php');

class CBController extends ControllerBase
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

    protected $requestToken;
    protected $requestTokenSecret;
    protected $oauthostSession;

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
          $container->get('entity_type.manager'),
          $container->get('entity.query'),
          $container->get('database'),
          $container->get('logger.factory')
      );
    }

    public function loginCB(Request $request)
    {

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

        $oauthostSessions = $this->entityTypeManager->getStorage('oauthost_session')->loadByProperties(array('name' => $request->query->get('sid_ost')));
        $this->oauthostSession = reset($oauthostSessions);
        if ($this->oauthostSession) {
            $this->requestToken = $this->oauthostSession->request_token->value;
            $this->requestTokenSecret = $this->oauthostSession->request_token_secret->value;
        } else {
            $response = new Response();
            $response->setContent('forbidden');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        $authToken = $request->query->get('oauth_token');
        $authVerifier = $request->query->get('oauth_verifier');
//        $this->logger->notice('authToken='.$authToken.'***authVerifier='.$authVerifier);

        $epalToken = $this->authenticatePhase2($request, $authToken, $authVerifier);

        if ($epalToken) {
            $cookie = new Cookie('auth_token', $epalToken, 0, '/', null, false, false);
            $cookie2 = new Cookie('auth_role', 'student', 0, '/', null, false, false);

            return new RedirectResponseWithCookie($this->redirect_url, 302, array ($cookie, $cookie2));

//            return new RedirectResponse($this->redirect_url . $epalToken.'&auth_role=student', 302, []);
        } else {
            $response = new Response();
            $response->setContent('forbidden');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
    }

    public function authenticatePhase2($request, $authToken, $authVerifier)
    {
    $taxis_userid = null;
    $trx = $this->connection->startTransaction();
    try {
        $oauth = new OAuth($this->consumer_key, $this->consumer_secret, OAUTH_SIG_METHOD_PLAINTEXT, OAUTH_AUTH_TYPE_URI);
        $oauth->enableDebug();
        $oauth->setToken($authToken, $this->requestTokenSecret);
        $accessToken = $oauth->getAccessToken($this->access_token_url, '', $authVerifier);
        $oauth->setToken($accessToken['oauth_token'], $accessToken['oauth_token_secret']);
        $oauth->fetch($this->api_url);

        $this->logger->warning($oauth->getLastResponse());
        $taxis_userid = $this->xmlParse($oauth->getLastResponse(), 'messageText');

        $currentTime = time();
        $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('taxis_userid' => $taxis_userid));
        $epalUser = reset($epalUsers);

        $epalToken = md5(uniqid(mt_rand(), true));
        if ($epalUser) {
            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);
            if ($user) {
                $user->setPassword($epalToken);
                $user->setUsername($epalToken);
                $user->save();
                $epalUser->set('authtoken', $epalToken);
                $epalUser->set('accesstoken', $accessToken['oauth_token']);
                $epalUser->set('accesstoken_secret', $accessToken['oauth_token_secret']);
                $epalUser->set('requesttoken',$this->requestToken);
                $epalUser->set('requesttoken_secret', $this->requestTokenSecret);
                $epalUser->set('timelogin', $currentTime);
                $epalUser->set('userip', $request->getClientIp());

                $epalUser->save();
            }
        }

        if ($epalUser === null || !$epalUser) {

            //Create a User
            $user = User::create();
            //Mandatory settings
            $unique_id = uniqid('####');
            $user->setPassword($epalToken);
            $user->enforceIsNew();
            $user->setEmail($unique_id);
            $user->setUsername($epalToken); //This username must be unique and accept only a-Z,0-9, - _ @ .
            $user->activate();
            $user->set('init', $unique_id);

            //Set Language
            $language_interface = \Drupal::languageManager()->getCurrentLanguage();
            $user->set('langcode', $language_interface->getId());
            $user->set('preferred_langcode', $language_interface->getId());
            $user->set('preferred_admin_langcode', $language_interface->getId());

            //Adding default user role
            $user->addRole('applicant');
            $user->save();


            $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('mail' => $unique_id));
            $user = reset($users);
            if ($user) {
                $this->logger->warning('userid 190='.$user->id().'*** name='.$user->name->value);

                $epalUser = $this->entityTypeManager()->getStorage('epal_users')->create(array(
            //    'langcode' => $language_interface->getId(),
                'langcode' => 'el',
                'user_id' => $user->id(),
                'drupaluser_id' => $user->id(),
                'taxis_userid' => $taxis_userid,
                'taxis_taxid' => $unique_id,
                'name' => $unique_id,
                'surname' => $unique_id,
                'fathername' => $unique_id,
                'mothername' => $unique_id,
                'accesstoken' => $accessToken['oauth_token'],
                'accesstoken_secret' => $accessToken['oauth_token_secret'],
                'authtoken' => $epalToken,
                'requesttoken' => $this->requestToken,
                'requesttoken_secret' => $this->requestTokenSecret,
                'timelogin' => $currentTime,
                'timeregistration' => $currentTime,
                'timetokeninvalid' => 0,
                'userip' => $request->getClientIp(),
                'status' => 1
            ));
            $epalUser->save();
            } else {
                return false;
            }

        }
        $this->oauthostSession->delete();

        return $epalToken;
    } catch (OAuthException $e) {
        $this->logger->warning($e->getMessage());
        $trx->rollback();
        return false;
    } catch (\Exception $ee) {
        $this->logger->warning($ee->getMessage());
        $trx->rollback();
        return false;
    }

        return false;
    }

    public function xmlParse($xmlText, $token){
        return '12345';
    }
}
