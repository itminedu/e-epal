<?php

namespace Drupal\oauthost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;

class CBController extends ControllerBase {

  protected $query_factory;
  protected $entityTypeManager;
  protected $request;
  protected $logger;

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
    return new RedirectResponse('/dist/#/?auth_token=' . $authToken . '&auth_role=student',302,[]);
}

}
