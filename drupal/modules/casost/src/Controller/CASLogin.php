<?php
namespace Drupal\casost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Controller\ControllerBase;
use phpCAS;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Cookie;
require ('RedirectResponseWithCookieExt.php');

class CASLogin extends ControllerBase
{

    protected $serverVersion;
    protected $serverHostname;
    protected $serverPort;
    protected $serverUri;
    protected $redirectUrl;
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

        $configRowName = 'casost_sch_sso_config';
        try {

            $configRowId = $request->query->get('config');
            if ($configRowId)
                $configRowName = $configRowName . '_' . $configRowId;
            $CASOSTConfigs = $this->entityTypeManager->getStorage('casost_config')->loadByProperties(array('name' => $configRowName));
            $CASOSTConfig = reset($CASOSTConfigs);
            if ($CASOSTConfig) {
                $this->serverVersion = $CASOSTConfig->serverversion->value;
                $this->serverHostname = $CASOSTConfig->serverhostname->value;
                $this->serverPort = $CASOSTConfig->serverport->value;
                $this->serverUri = $CASOSTConfig->serveruri->value === null ? '' : $CASOSTConfig->serveruri->value;
                $this->redirectUrl = $CASOSTConfig->redirecturl->value;
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
            }
            phpCAS::setDebug("phpcas.log");
            // Enable verbose error messages. Disable in production!
            //phpCAS::setVerbose(true);

            phpCAS::client(
                $this->serverVersion,
                $this->serverHostname,
                intval($this->serverPort),
                $this->serverUri,
                boolval($this->changeSessionId)
            );

            if ($this->CASServerCACert) {
                if ($this->CASServerCNValidate) {
                    phpCAS::setCasServerCACert($this->CASServerCACert, true);
                } else {
                    phpCAS::setCasServerCACert($this->CASServerCACert, false);
                }
            }
            if ($this->noCASServerValidation) {
                phpCAS::setNoCasServerValidation();
            }
            phpCAS::handleLogoutRequests();
            if (!phpCAS::forceAuthentication()) {
                return $this->redirectForbidden($configRowName, '5001');
            }
            $attributes = phpCAS::getAttributes();

/*
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

            if (!$isAllowed) {
                $response = new Response();
                $response->setContent(t('Access is allowed only to official school accounts'));
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json;charset=UTF-8');
                return $response;
            }
*/

            $CASUser = phpCAS::getUser();

            $this->logger->warning($CASUser);

            $filterAttribute = function ($attribute) use ($attributes) {
                if (!isset($attributes[$attribute])) {
                    return false;
                }
                return $attributes[$attribute];
            };

            $umdobject = $filterAttribute("umdobject");
            $physicaldeliveryofficename = $filterAttribute("physicaldeliveryofficename");


/****** the following is for production : Χρήση μόνο από ΕΠΙΣΗΜΟΥΣ ΛΟΓΑΡΙΑΣΜΟΥΣ ***************************/
/*
            if (!$umdobject || $umdobject !== "Account") {
                return $this->redirectForbidden($configRowName, '5002');
            }
            if (!$physicaldeliveryofficename || preg_replace('/\s+/', '', $physicaldeliveryofficename) !== 'ΕΠΙΣΗΜΟΣΛΟΓΑΡΙΑΣΜΟΣ') {
                return $this->redirectForbidden($configRowName, '5003');
            }
*/

            phpCAS::trace($umdobject);
            phpCAS::trace($physicaldeliveryofficename);
            $gsnunitcodedn = $filterAttribute('edupersonorgunitdn:gsnunitcode:extended');
            $gsnunitcode = substr($gsnunitcodedn, strpos($gsnunitcodedn, ";") + 1);
            phpCAS::trace($gsnunitcode);
            $userAssigned = $this->assignRoleToUser($gsnunitcode);
            if (sizeof($userAssigned) === 0) {
                return $this->redirectForbidden($configRowName, '5004');
            }

            $epalToken = $this->authenticatePhase2($request, $CASUser, $userAssigned, $filterAttribute('cn'));
            if ($epalToken) {
                if ('casost_sch_sso_config' === $configRowName) {
                    return new RedirectResponse($this->redirectUrl . $epalToken.'&auth_role=' . $userAssigned["exposedRole"], 302, []);
                } else {
                    \Drupal::service('page_cache_kill_switch')->trigger();
                    return new RedirectResponseWithCookieExt($this->redirectUrl . $epalToken.'&auth_role=' . $userAssigned["exposedRole"], 302, []);
                }
            } else {
                return $this->redirectForbidden($configRowName, '5005');
            }

        } catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->redirectForbidden($configRowName, '6000');
        }
    }

    private function assignRoleToUser($registry_no) {
        $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('registry_no' => $registry_no));
        $school = reset($schools);
        if ($school) {
            return array("id" => $school->id(), "exposedRole" => "director", "internalRole" => "epal");
        }
        $eduAdmins = $this->entityTypeManager->getStorage('eepal_admin_area')->loadByProperties(array('registry_no' => $registry_no));
        $eduAdmin = reset($eduAdmins);
        if ($eduAdmin) {
            return array("id" => $eduAdmin->id(), "exposedRole" => "dide", "internalRole" => "eduadmin");
        }
        $regionAdmins = $this->entityTypeManager->getStorage('eepal_region')->loadByProperties(array('registry_no' => $registry_no));
        $regionAdmin = reset($regionAdmins);
        if ($regionAdmin) {
            return array("id" => $regionAdmin->id(), "exposedRole" => "pde", "internalRole" => "regioneduadmin");
        }
        return array();

    }

    private function redirectForbidden($configRowName, $errorCode) {
        session_unset();
        session_destroy();
        \Drupal::service('page_cache_kill_switch')->trigger();
        if ('casost_sch_sso_config' === $configRowName) {
            return new RedirectResponse($this->redirectUrl.'&error_code=' . $errorCode, 302, []);
        } else {
            return new RedirectResponseWithCookieExt($this->redirectUrl .'&error_code=' . $errorCode, 302, []);
        }
    }

    private function authenticatePhase2($request, $CASUser, $userAssigned, $cn)
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
//            $user->set('init', $cn);
            $user->set('init', $userAssigned["id"]);

            //Set Language
            $language_interface = \Drupal::languageManager()->getCurrentLanguage();
            $user->set('langcode', $language_interface->getId());
            $user->set('preferred_langcode', $language_interface->getId());
            $user->set('preferred_admin_langcode', $language_interface->getId());

            //Adding default user role
            $user->addRole($userAssigned["internalRole"]);
            $user->save();
        }

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
