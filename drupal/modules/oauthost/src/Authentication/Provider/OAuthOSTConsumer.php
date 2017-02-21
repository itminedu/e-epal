<?php

namespace Drupal\oauthost\Authentication\Provider;

use Drupal\Core\Authentication\AuthenticationProviderInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use OAuth;
use OAuthException;

/**
 * Class OSTAuthenticationProvider.
 */
class OAuthOSTConsumer implements AuthenticationProviderInterface
{
    protected $consumer_key = 'tc97t89';
    protected $consumer_secret = 'xr7tgt9AbK3';
    protected $request_token_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/oauth/request_token';
    protected $user_authorization_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/oauth/confirm_access';
    protected $access_token_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/oauth/access_token';
    protected $signature_method = 'PLAINTEXT'; 
    protected $api_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/gsisdemoservice/resource_one';
    protected $callback_url = 'http://localhost/angular/eepal-front/drupal/oauth/cb';
    protected $logout_url = 'https://www1.gsis.gr/testgsisapps/gsisdemo/logout.htm?logout_token=';

  /**
   * The config factory. 
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The user data service.
   *
   * @var \Drupal\user\UserDataInterface
   */
  protected $user_data;

  /**
   * The logger service for OAuth.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected $logger;

  /**
   * An authenticated user object.
   *
   * @var \Drupal\user\UserBCDecorator
   */
  protected $user;

  /**
   * Constructor.
   *
   * @param \Drupal\user\UserDataInterface
   *  The user data service
   * @param \Psr\Log\LoggerInterface $logger
   *   The logger service for OAuth
   */
/*  public function __construct(UserDataInterface $user_data, LoggerInterface $logger) {
    $this->user_data = $user_data;
    $this->logger = $logger;
} */

  /**
   * Constructs a HTTP basic authentication provider object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service
   */
  public function __construct(ConfigFactoryInterface $config_factory, EntityTypeManagerInterface $entity_type_manager, LoggerInterface $logger)
  {
      $this->configFactory = $config_factory;
      $this->entityTypeManager = $entity_type_manager;
      $this->logger = $logger;
  }

  /**
   * Checks whether suitable authentication credentials are on the request.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object
   *
   * @return bool
   *   TRUE if authentication credentials suitable for this provider are on the
   *   request, FALSE otherwise
   */
  public function applies(Request $request)
  {
      // If you return TRUE and the method Authentication logic fails,
    // you will get out from Drupal navigation if you are logged in.

    // Only check requests with the 'authorization' header starting with OAuth.
    // drupal_set_message('sdfsddgdg');
    $oauthEnabled = $this->getHeader($request, 'x-oauth-enabled');
    if (!$oauthEnabled && $request->getMethod() == 'POST') {
        $oauthEnabled = $request->request->get('X-oauth-enabled');
    }
//    $this->logger->warning("oauthEnabled=" . $oauthEnabled);
    if (!isset($oauthEnabled) || $oauthEnabled === false) {
        return false;
    }
    return true;


    //  return $this->getHeader($request, 'x-oauth-enabled');
//    return preg_match('/^OAuth/', $request->headers->get('authorization'));

//    return $this->checkAuthToken($this->getAuthToken($request));
  }

/*    private function checkAuthToken($authToken)
    {
        if (!$authToken) {
            return false;
        } elseif ($authToken === 'testAuthToken') {
            return $authToken;
        } else {
            return false;
        }
    } */

    private function getHeader($request, $headerName)
    {
        $headerValue = $request->headers->get($headerName);
        if (isset($headerValue) && $headerValue !== '') {
            return $headerValue;
        } else {
            return false;
        }
    }


  /**
   * {@inheritdoc}
   */
/*  public function authenticate(Request $request) {
    $consumer_ip = $request->getClientIp();
    $ips = ['192.168.0.59:80'];
//    if (in_array($consumer_ip, $ips)) {

    if ($request->query->get('name') === 'haris') {
      // Return Anonymous user.
      print_r($request->query->get('name'));
      return true;
//      return $this->entityTypeManager->getStorage('user')->load(1);
    }
    else {
      throw new AccessDeniedHttpException();
    }
} */

  public function authenticate(Request $request)
  {
      // if(!$this->getHeader($request, "x-oauth-token") && $_SESSION['state'] && $_SESSION['state']==1) $_SESSION['state'] = 0;
      $this->logger->warning("authenticate:" . "oauthToken=" . $request->query->get('oauth_token') . " state=" . $_SESSION['state']);
      if($request->query->get('oauth_token') == null && $_SESSION['state'] && $_SESSION['state']==1) $_SESSION['state'] = 0;
      try {
          if (isset($request->query)) {
             $authToken = $request->query->get('oauth_token');
             $authVerifier = $request->query->get('oauth_verifier');
         } else {
             $authToken = false;
             $authVerifier = false;
         }
          $oauth = new OAuth($this->consumer_key, $this->consumer_secret, OAUTH_SIG_METHOD_PLAINTEXT, OAUTH_AUTH_TYPE_URI);
          $oauth->enableDebug();

          $this->logger->warning("i am here:" . "oauthToken=" . $authToken . " state=" . $_SESSION['state']);
          if (($authToken == null || !$authToken) && !$_SESSION['state']) {
              $this->logger->warning("send request token");
              $requestToken = $oauth->getRequestToken($this->request_token_url, $this->callback_url);
              // store auth token
              $this->logger->warning("requestToken=" . $requestToken['oauth_token_secret']);
              $_SESSION['secret'] = $requestToken['oauth_token_secret'];
              $_SESSION['state'] = 1;
//              $_SESSION['secret'] = $request_token['oauth_token_secret'];

              header('Location: '.$this->user_authorization_url.'?oauth_token='.$requestToken['oauth_token']);
              exit;
          } else if ($_SESSION['state']==1) {
              $oauth->setToken($authToken, $_SESSION['secret']);
              $this->logger->warning("oauthToken=" . $authToken . "***"  . $_SESSION['secret']);
              $accessToken = $oauth->getAccessToken($this->access_token_url, '', $authVerifier);
              $this->logger->warning("accessToken=" . $accessToken['oauth_token'] . "***"  . $accessToken['oauth_token_secret']);
              $_SESSION['state'] = 2;
              $_SESSION['token'] = $accessToken['oauth_token'];
              $_SESSION['secret'] = $accessToken['oauth_token_secret'];
//              $_SESSION['token'] = serialize($access_token);

          }
          $this->logger->warning("about to call web service");
          $oauth->setToken($_SESSION['token'],$_SESSION['secret']);
          $oauth->fetch($this->api_url);

      } catch (OAuthException $e) {

          $this->logger->warning($e->getMessage());
      }
    // Check if we found a user.
/*    if (!empty($this->user)) {
        return $this->user;
    } */

//      return null;
  }

  /**
   * {@inheritdoc}
   */
  public function cleanup(Request $request)
  {
  }

  /*
   * {@inheritdoc}
   */
/*  public function handleException(GetResponseForExceptionEvent $event) {
    $exception = $event->getException();
    if ($exception instanceof AccessDeniedHttpException) {
      $event->setException(
        new UnauthorizedHttpException('Invalid consumer origin.', $exception)
      );
      return TRUE;
    }
    return FALSE;
} */
}
