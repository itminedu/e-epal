<?php
namespace Drupal\casost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Controller\ControllerBase;
require_once '/home/haris/devel/eepal/drupal/modules/casost/src/CAS/phpCAS.php';
// require_once '/home/harisnd/public_html/drupal/modules/casost/src/CAS/phpCAS.php';
// use Drupal\casost\CAS\phpCAS;
// use CASException;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class CASLogin extends ControllerBase
{

    protected $serverVersion;
    protected $serverHostname;
    protected $serverPort;
    protected $serverUri;
    protected $changeSessionId;
    protected $CASServerCACert;
    protected $CASServerCNValidate;
    protected $noCASServerValidation;
    protected $proxy;
    protected $handleLogoutRequests;
    protected $CASLang;
    protected $allowed1;
    protected $allowed1Value;
    protected $allowed2;
    protected $allowed2Value;

    protected $entity_query;
    protected $entityTypeManager;
    protected $logger;
    protected $connection;

    public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    QueryFactory $entity_query,
    Connection $connection,
    LoggerChannelFactoryInterface $loggerChannel)
    {
        $this->entityTypeManager = $entityTypeManager;
        $this->entity_query = $entity_query;
        $this->connection = $connection;
        $this->logger = $loggerChannel->get('casost');

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

    public function loginGo(Request $request)
    {
        $CASOSTConfigs = $this->entityTypeManager->getStorage('casost_config')->loadByProperties(array('name' => 'casost_sch_sso_config'));
        $CASOSTConfig = reset($CASOSTConfigs);
        if ($CASOSTConfig) {
            $this->serverVersion = $CASOSTConfig->serverversion->value;
            $this->serverHostname = $CASOSTConfig->serverhostname->value;
            $this->serverPort = $CASOSTConfig->serverport->value;
            $this->serverUri = $CASOSTConfig->serveruri->value === null ? '' : $CASOSTConfig->serveruri->value;
            $this->changeSessionId = $CASOSTConfig->changesessionid->value;
            $this->CASServerCACert = $CASOSTConfig->casservercacert->value;
            $this->CASServerCNValidate = $CASOSTConfig->casservercnvalidate->value;
            $this->noCASServerValidation = $CASOSTConfig->nocasservervalidation->value;
            $this->proxy = $CASOSTConfig->proxy->value;
            $this->handleLogoutRequests = $CASOSTConfig->handlelogoutrequests->value;
            $this->CASLang = $CASOSTConfig->caslang->value;
            $this->allowed1 = $CASOSTConfig->allowed1->value;
            $this->allowed1Value = $CASOSTConfig->allowed1value->value;
            $this->allowed2 = $CASOSTConfig->allowed2->value;
            $this->allowed2Value = $CASOSTConfig->allowed2value->value;
        } else {
            $response = new Response();
            $response->setContent('forbidden. No config');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }

        try {

            // Enable debugging
            \phpCAS::setDebug("/home/haris/devel/eepal/drupal/modules/casost/phpcas.log");
            // Enable verbose error messages. Disable in production!
            \phpCAS::setVerbose(true);

            // Initialize phpCAS
            \phpCAS::client($this->serverVersion,
                $this->serverHostname,
                intval($this->serverPort),
                $this->serverUri,
                boolval($this->changeSessionId));

//            \phpCAS::setServerLoginURL('http://sso-test.sch.gr/login');
//            \phpCAS::setServerServiceValidateURL('http://sso-test.sch.gr/cas/samlValidate');

            // For production use set the CA certificate that is the issuer of the cert
            // on the CAS server and uncomment the line below
            // phpCAS::setCasServerCACert($cas_server_ca_cert_path);

            // For quick testing you can disable SSL validation of the CAS server.
            // THIS SETTING IS NOT RECOMMENDED FOR PRODUCTION.
            // VALIDATING THE CAS SERVER IS CRUCIAL TO THE SECURITY OF THE CAS PROTOCOL!
    //        \phpCAS::setNoCasServerValidation();

            // force CAS authentication
    //        \phpCAS::forceAuthentication();

            // at this step, the user has been authenticated by the CAS server
            // and the user's login name can be read with phpCAS::getUser().

            // logout if desired
    /*        if (isset($_REQUEST['logout'])) {
            	\phpCAS::logout();
            }

            $CASUser = \phpCAS::getUser();

            $this->logger->warning($CASUser); */







$this->logger->warning("hello1");
            if ($this->CASServerCACert) {
                if ($this->CASServerCNValidate) {
                    \phpCAS::setCasServerCACert($this->CASServerCACert, true);
                } else {
                    \phpCAS::setCasServerCACert($this->CASServerCACert, false);
                }
            }
$this->logger->warning("hello2");
            if ($this->noCASServerValidation) {
                $this->logger->warning("hello222");
                print_r("************no CAS server validation********");
                \phpCAS::setNoCasServerValidation();
            }
            $this->logger->warning("hello3");
            \phpCAS::handleLogoutRequests();
                        $this->logger->warning("hello33");
            if (!\phpCAS::forceAuthentication()) {
                $this->logger->warning("hello33333");
                $response = new Response();
                $response->setContent('forbidden. cannot force authentication');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }
            $this->logger->warning("hello4");
            $attributes = \phpCAS::getAttributes();
            $this->logger->warning("hello2");
            print_r($attributes);

            $isAllowed = true;
            $att1 = $attributes[$this->allowed1];
            $att2 = $attributes[$this->allowed2];
            if (!isset($att1) || !isset($att2)) {
                $isAllowed = false;
            }
            if (!is_array($attributes[$this->allowed1])) {
                $attributes[$this->allowed1] = [$attributes[$this->allowed1]];
            }
            if (!is_array($attributes[$this->allowed2])) {
                $attributes[$this->allowed2] = [$attributes[$this->allowed2]];
            }
            $found1 = false;
            foreach ($attributes[$this->allowed1] as $value) {
                if (1 === preg_match($this->allowed1Value, $value)) {
                    $found1 = true;
                }
            }
            $found2 = false;
            foreach ($attributes[$this->allowed2] as $value) {
                if (1 === preg_match($this->allowed2Value, $value)) {
                    $found2 = true;
                }
            }
            if (!$found1 || !$found2) {
                $isAllowed = false;
            }

    /*        if (!$isAllowed) {
                $response = new Response();
                $response->setContent(t('Access is allowed only to official school accounts'));
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json;charset=UTF-8');
                return $response;
            } */

            $CASUser = \phpCAS::getUser();

            $this->logger->warning($CASUser);

            $filterAttribute = function ($attribute) use ($attributes) {
                if (!isset($attributes[$attribute])) {
                    return;
                }

                if (is_array($attributes[$attribute])) {
                    return $attributes[$attribute];
                }

                return $attributes[$attribute];
            };


            $epalToken = $this->authenticatePhase2($request, $CASUser);

            if ($epalToken) {
                return new RedirectResponse('/dist/#/school?auth_token=' . $epalToken.'&auth_role=director', 302, []);
            } else {
                $response = new Response();
                $response->setContent('forbidden');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }

/*            $identityClass = call_user_func($this->resolveIdentityClass);
            $identity      = new $identityClass(
                null,
                $identity,
                $filterAttribute('mail'),
                $filterAttribute('cn'),
                $filterAttribute('ou'),
                'CAS'
            ); */

/*
            $oauth = new OAuth($this->consumer_key, $this->consumer_secret, OAUTH_SIG_METHOD_PLAINTEXT, OAUTH_AUTH_TYPE_URI);
            $oauth->enableDebug();

            $uniqid = uniqid('sid');
            $requestToken = $oauth->getRequestToken($this->request_token_url, $this->callback_url . '?sid_ost=' . $uniqid);
                // store auth token

            $oauthostSession = $this->entityTypeManager()->getStorage('oauthost_session')->create(array(
        //    'langcode' => $language_interface->getId(),
              'langcode' => 'el',
              'user_id' => \Drupal::currentUser()->id(),
              'name' => $uniqid,
              'request_token' => $requestToken['oauth_token'],
              'request_token_secret' => $requestToken['oauth_token_secret'],
              'status' => 1
          ));
            $oauthostSession->save();
            header('Location: '.$this->user_authorization_url.'?oauth_token='.$requestToken['oauth_token']);
            $this->logger->warning('redirected to:'.$this->user_authorization_url.'?oauth_token='.$requestToken['oauth_token']); */
//            exit;
        } catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            $response = new Response();
            $response->setContent('forbidden');
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
    }




    public function authenticatePhase2($request, $CASUser)
    {
    $trx = $this->connection->startTransaction();
    try {

        $currentTime = time();

        $epalToken = md5(uniqid(mt_rand(), true));

            $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('mail' => $CASUser));
            $user = reset($users);
            if ($user) {
                $user->setPassword($epalToken);
                $user->setUsername($epalToken);
                $user->save();
            }


        if ($user === null || !$user) {

            //Create a User
            $user = User::create();
            //Mandatory settings
            $unique_id = uniqid('####');
            $user->setPassword($epalToken);
            $user->enforceIsNew();
            $user->setEmail($CASUser);
            $user->setUsername($epalToken); //This username must be unique and accept only a-Z,0-9, - _ @ .
            $user->activate();
            $user->set('init', $unique_id);

            //Set Language
            $language_interface = \Drupal::languageManager()->getCurrentLanguage();
            $user->set('langcode', $language_interface->getId());
            $user->set('preferred_langcode', $language_interface->getId());
            $user->set('preferred_admin_langcode', $language_interface->getId());

            //Adding default user role
            $user->addRole('director');
            $user->save();
        }

/*            $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('mail' => $CASUser->email));
            $user = reset($users);
            if ($user) {
                $this->logger->warning('userid 190='.$user->id().'*** name='.$user->name->value);

            } else {
                return false;
            }

        }
        $this->oauthostSession->delete(); */

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

}
