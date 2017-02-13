<?php

namespace Drupal\oauthost\Authentication\Provider;

use Drupal\Core\Authentication\AuthenticationProviderInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use \OAuthProvider;
use \OAuthException;


/**
 * Class OSTAuthenticationProvider.
 *
 * @package Drupal\oauthost\Authentication\Provider
 */
class OSTAuthenticationProvider implements AuthenticationProviderInterface {

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
   *  The user data service.
   * @param \Psr\Log\LoggerInterface $logger
   *   The logger service for OAuth.
   */
/*  public function __construct(UserDataInterface $user_data, LoggerInterface $logger) {
    $this->user_data = $user_data;
    $this->logger = $logger;
} */



  /**
   * Constructs a HTTP basic authentication provider object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, EntityTypeManagerInterface $entity_type_manager) {
    $this->configFactory = $config_factory;
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * Checks whether suitable authentication credentials are on the request.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return bool
   *   TRUE if authentication credentials suitable for this provider are on the
   *   request, FALSE otherwise.
   */
  public function applies(Request $request) {
    // If you return TRUE and the method Authentication logic fails,
    // you will get out from Drupal navigation if you are logged in.

    // Only check requests with the 'authorization' header starting with OAuth.
    drupal_set_message("sdfsddgdg");
    return getHeader($request, 'OAuthEnabled');
//    return preg_match('/^OAuth/', $request->headers->get('authorization'));

//    return $this->checkAuthToken($this->getAuthToken($request));
  }

  private function checkAuthToken($authToken) {
      if (!$authToken) {
          return TRUE;
      }
      else if ($authToken === 'bourboutsala') {
          return FALSE;
      }
      else {
          return TRUE;
      }
  }

  private function getLoginToken($request) {
    $loginToken = $request->headers->get('X-Login-Token');
    if (isset($loginToken) && $loginToken !== "") {

      return TRUE;
    }
    else {
      return FALSE;
    }
  }

  private function getHeader($request, $headerName) {
    $headerValue = $request->headers->get($headerName);
    if (isset($headerValue) && $headerValue !== "") {
      return $headerValue;
    }
    else {
      return FALSE;
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

  public function authenticate(Request $request) {
/*    $code = filter_input(INPUT_GET, 'code');
    if (empty($code) || !$this->client) {
      return new RedirectResponse('/');
    }
    try {
      $this->client->authenticate($code);
    }
    catch (\Exception $e) {
      return new RedirectResponse('/');
  }
    $plus = new Google_Service_Oauth2($this->client);
    $userinfo = $plus->userinfo->get();
    $user_email = $userinfo['email']; */
    drupal_set_message("hello");
    $user_email = 'haris.rnd@gmail.com';
    $user = user_load_by_mail($user_email);
/*    if (!$user) {
      $user_name = $userinfo['name'];
      $user_picture = $userinfo['picture'];
      try {
        $user = User::create([
          'name' => $user_name,
          'mail' => $user_email,
          'status' => 1,
          'picture' => $user_picture,
        ]);
        // hook_google_oauth_create_user_alter($user, $userinfo);
        \Drupal::moduleHandler()->alter('google_oauth_create_user', $user, $userinfo);
        $user->save();
      }
      catch (\Exception $e) {
        return new RedirectResponse('/');
      }
  } */
    user_login_finalize($user);
//    return new RedirectResponse('http://example.com');
    return($user);
//    return $this->redirect('<front>');

}



  /**
   * {@inheritdoc}
   */
  public function cleanup(Request $request) {}

  /**
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
