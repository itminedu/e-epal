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

 
  public function content($token_name) {
   
   $query = \Drupal::database()->select('epal_users', 'nfd');
   $query->fields('nfd', ['name']);
   $query->condition('nfd.authtoken', $token_name);
   $field = $query->execute()->fetchAssoc();
 



    $response = new JsonResponse($field);
    return $response;

  }

}
