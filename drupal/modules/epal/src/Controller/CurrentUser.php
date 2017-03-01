<?php
/**
 * @file
 * Contains \Drupal\query_example\Controller\QueryExampleController.
 */

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;


class CurrentUser extends ControllerBase {

 
  public function content() {
  
     

//  	$name = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
  	$name = "LALALA";
    $authToken = "no authToken";
    $accessKey = "no accessKey";

    if (\Drupal::request()->headers->has('X-AUTH-TOKEN')) {
        $authToken = \Drupal::request()->headers->get( 'X-AUTH-TOKEN' );
    }
    if (\Drupal::request()->headers->has('X-ACCESS-KEY')) {
        $accessKey = \Drupal::request()->headers->get( 'X-ACCESS-KEY' );
    }
    $response = new JsonResponse([$name]);
    $response->headers->set('X-AUTH-TOKEN', 'HELLOTOKEN');
    return $response;

  }

}
