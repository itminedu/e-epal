<?php

namespace Drupal\oauthost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Controller\ControllerBase;
use OAuth;
use DOMDocument;
use OAuthException;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Drupal\epal\Crypt;
require ('RedirectResponseWithCookieExt.php');

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

        $oauthostSessions = $this->entityTypeManager->getStorage('oauthost_session')->loadByProperties(array('name' => $request->query->get('sid_ost')));
        $this->oauthostSession = reset($oauthostSessions);
        if ($this->oauthostSession) {
            $this->requestToken = $this->oauthostSession->request_token->value;
            $this->requestTokenSecret = $this->oauthostSession->request_token_secret->value;
            $configRowName = $this->oauthostSession->configrowname->value;
        } else {
            $response = new Response();
            $response->setContent('forbidden1');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        $ostauthConfigs = $this->entityTypeManager->getStorage('oauthost_config')->loadByProperties(array('name' => $configRowName));
        $ostauthConfig = reset($ostauthConfigs);
        if ($ostauthConfig) {

            $crypt = new Crypt();

            try  {
              $consumer_key_decoded = $crypt->decrypt($ostauthConfig->consumer_key->value);
              $consumer_secret_decoded = $crypt->decrypt($ostauthConfig->consumer_secret->value);
            }
            catch (\Exception $e) {
              unset($crypt);
              $this->logger->notice('epalToken decoding false');
              $response = new Response();
              $response->setContent('internal_server_error');
              $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
              $response->headers->set('Content-Type', 'application/json');
              return $response;
            }
            unset($crypt);

            $this->consumer_key = $consumer_key_decoded;
            $this->consumer_secret = $consumer_secret_decoded;
            //$this->consumer_key = $ostauthConfig->consumer_key->value;
            //$this->consumer_secret = $ostauthConfig->consumer_secret->value;

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
            $response->setContent('forbidden2');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        $authToken = $request->query->get('oauth_token');
        $authVerifier = $request->query->get('oauth_verifier');
//        $this->logger->notice('authToken='.$authToken.'***authVerifier='.$authVerifier);
        $epalToken = $this->authenticatePhase2($request, $authToken, $authVerifier);
        if ($epalToken) {
            if ('oauthost_taxisnet_config' === $configRowName) {
/*                $this->logger->notice('$configRowName='.$configRowName.'***url='.$this->redirect_url);
                $cookie = new Cookie('auth_token', $epalToken, 0, '/', null, false, false);
                $cookie2 = new Cookie('auth_role', 'student', 0, '/', null, false, false); */
                return new RedirectResponse($this->redirect_url . $epalToken.'&auth_role=student', 302, []);
            } else {
                \Drupal::service('page_cache_kill_switch')->trigger();
                return new RedirectResponseWithCookieExt($this->redirect_url . $epalToken.'&auth_role=student', 302, []);

            }


//            return new RedirectResponse($this->redirect_url . $epalToken.'&auth_role=student', 302, []);
        } else {
            $this->logger->notice('epalToken false');
            $response = new Response();
            $response->setContent('forbidden3');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
    }

    public function authenticatePhase2($request, $authToken, $authVerifier)
    {
        try {
            $taxis_userid = null;
            $trx = $this->connection->startTransaction();
            $oauth = new OAuth($this->consumer_key, $this->consumer_secret, OAUTH_SIG_METHOD_PLAINTEXT, OAUTH_AUTH_TYPE_URI);
//            $oauth->enableDebug();
            $oauth->setToken($authToken, $this->requestTokenSecret);
            $accessToken = $oauth->getAccessToken($this->access_token_url, '', $authVerifier);
            $oauth->setToken($accessToken['oauth_token'], $accessToken['oauth_token_secret']);
            $oauth->fetch($this->api_url);

            $dom = $this->loadXML($oauth->getLastResponse());
            $taxis_userData = $this->getXMLElements($dom);

            if (!$taxis_userData || sizeof($taxis_userData) === 0) {
                return false;
            }

            $currentTime = time();
            $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('taxis_userid' => $taxis_userData['tin']));
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
                    $crypt = new Crypt();
                    try  {
                      $name_encoded = $crypt->encrypt($unique_id);
                    }
                    catch (\Exception $e) {
                      unset($crypt);
                      $this->logger->notice('epalToken encoding false');
                      $response = new Response();
                      $response->setContent('internal_server_error');
                      $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
                      $response->headers->set('Content-Type', 'application/json');
                      return $response;
                    }
                    unset($crypt);


                    $epalUser = $this->entityTypeManager()->getStorage('epal_users')->create(array(
                        'langcode' => 'el',
                        'user_id' => $user->id(),
                        'drupaluser_id' => $user->id(),
                        'taxis_userid' => $taxis_userData['tin'],
                        'taxis_taxid' => $taxis_userData['tin'],
/*                        'name' => $taxis_userData['firstName'],
                        'surname' => $taxis_userData['surname'],
                        'fathername' => $taxis_userData['fathersName'], */
                        //'name' => $unique_id,
                        //'surname' => $unique_id,
                        //'fathername' => $unique_id,
                        //'mothername' => $unique_id,
                        'name' => $name_encoded,
                        'surname' => $name_encoded,
                        'fathername' => $name_encoded,
                        'mothername' => $name_encoded,

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
            $this->oauthostSession->set('authtoken', $epalToken);
            $this->oauthostSession->save();

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

    public function loadXML($text_response){
        $dom = new DOMDocument();
        // Fix possible whitespace problems
        $dom->preserveWhiteSpace = false;

        if (!($dom->loadXML($text_response))) {
            $this->logger->warning('dom->loadXML() failed');
            return false;
        }

        if (!($tree_response = $dom->documentElement)) {
            $this->logger->warning('documentElement() failed');
            return false;
        }
        return $dom;
    }

    public function getXMLElements($doc){
        $webUserDetails = $doc->getElementsByTagName( "WebUserDetails" );
        if (!$webUserDetails || $webUserDetails->length === 0)
//            return false;
            return array(   // to be changed to empty array
                'firstName' => '',
                'surname' => '',
                'fathersName' => '',
                'comments' => '',
                'tin' => '12345'
            );

        foreach( $webUserDetails as $element )
        {
            $comments = $element->getElementsByTagName( "comments" );
            $comment = $comments->item(0)->nodeValue;

            $fathersNames = $element->getElementsByTagName( "fathersName" );
            $fathersName = $fathersNames->item(0)->nodeValue;

            $firstNames = $element->getElementsByTagName( "name" );
            $firstName = $firstNames->item(0)->nodeValue;

            $surnames = $element->getElementsByTagName( "surname" );
            $surname = $surnames->item(0)->nodeValue;

            $tins = $element->getElementsByTagName( "tin" );
            $tin = $tins->item(0)->nodeValue;

            if (!$tin || $tin === '')
//                return false;
                return array(   // to be changed to empty array
                    'firstName' => '',
                    'surname' => '',
                    'fathersName' => '',
                    'comments' => '',
                    'tin' => '12345'
                ); 
            return array(
                'firstName' => $firstName,
                'surname' => $surname,
                'fathersName' => $fathersName,
                'comments' => $comment,
                'tin' => $tin
            );
        }
    }
}
