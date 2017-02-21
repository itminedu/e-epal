<?php

namespace Drupal\oauthost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\oauthost\Authentication\Provider;
use OAuth;
use OAuthException;

class CBController extends ControllerBase {

  protected $query_factory;
  protected $entityTypeManager;
  protected $request;
  protected $logger;

  protected $consumer_key = 'tc97t89';
  protected $consumer_secret = 'xr7tgt9AbK3';
  protected $request_token_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/oauth/request_token';
  protected $user_authorization_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/oauth/confirm_access';
  protected $access_token_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/oauth/access_token';
  protected $signature_method = 'PLAINTEXT';
  protected $api_url = 'https://www1.gsis.gr/gsisapps/gsisdemo/gsisdemoservice/resource_one';
  protected $callback_url = 'http://eepal.dev/drupal/oauth/cb';
  protected $logout_url = 'https://www1.gsis.gr/testgsisapps/gsisdemo/logout.htm?logout_token=';


public function __construct(EntityTypeManagerInterface $entityTypeManager, QueryFactory $query_factory) {
      $this->entityTypeManager = $entityTypeManager;
      $this->query_factory = $query_factory;
      $this->request = \Drupal::request();
      $this->logger = \Drupal::logger('oauthost');
  }

  public static function create(ContainerInterface $container) {
      return new static(
          $container->get('entity.manager'),
          $container->get('entity.query')
      );
  }


public function loginCB() {
    $authToken = $this->request->query->get('oauth_token');
    $authVerifier = $this->request->query->get('oauth_verifier');
    $this->logger->notice("authToken=".$authToken."***authVerifier=".$authVerifier);
/*    $response = new JsonResponse(['hello' => 'world', 'name' => $name, 'authToken' => $authToken, 'accessKey' => $accessKey]);
    $response->headers->set('X-AUTH-TOKEN', 'HELLOTOKEN'); */

    $authenticated = $this->authenticatePhase2($authToken, $authVerifier);

    if ($authenticated) {
        return new RedirectResponse('/dist/#/?auth_token=' . $authToken . '&auth_role=student',302,[]);
    }
    else {
        return new RedirectResponse('/dist/#/',403,[]);
    }
}

public function authenticatePhase2($authToken, $authVerifier)
{
    try {
        $oauth = new OAuth($this->consumer_key, $this->consumer_secret, OAUTH_SIG_METHOD_PLAINTEXT, OAUTH_AUTH_TYPE_URI);
        $oauth->enableDebug();

        $this->logger->warning("i am here:" . "oauthToken=" . $authToken . " state=" . $_SESSION['state']);

        $oauth->setToken($authToken, $_SESSION['secret']);
        $this->logger->warning("oauthToken=" . $authToken . "***"  . $_SESSION['secret']);
        $accessToken = $oauth->getAccessToken($this->access_token_url, '', $authVerifier);
        $this->logger->warning("accessToken=" . $accessToken['oauth_token'] . "***"  . $accessToken['oauth_token_secret']);
        $_SESSION['state'] = 2;
        $_SESSION['token'] = $accessToken['oauth_token'];
        $_SESSION['secret'] = $accessToken['oauth_token_secret'];

        $this->logger->warning("about to call web service");
        $oauth->setToken($_SESSION['token'],$_SESSION['secret']);
        $oauth->fetch($this->api_url);
        $this->logger->warning($oauth->getLastResponse());

        $epalUser = $this->entityTypeManager()->getStorage('epal_users')->loadByProperties(['taxis_userid' => '12345']);
        if ($epalUser === null || !$epalUser) {
            
        }

        return true;

    } catch (OAuthException $e) {

        $this->logger->warning($e->getMessage());
        return false;
    }
    return false;
  // Check if we found a user.
/*    if (!empty($this->user)) {
      return $this->user;
  } */

//      return null;
}


}
