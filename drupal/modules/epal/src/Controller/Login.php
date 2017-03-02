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
use Drupal\Core\Entity\EntityFieldManagerInterface;

/**
 * Controller routines for page example routes.
 */
class Login extends ControllerBase {
 
  protected $query_factory;
  protected $entityTypeManager;
  protected $entityFieldManager;

public function __construct(EntityTypeManagerInterface $entityTypeManager, QueryFactory $query_factory, EntityFieldManagerInterface $entityFieldManager) {
//    public function __construct(QueryFactory $query_factory) {
      $this->entityTypeManager = $entityTypeManager;
      $this->query_factory = $query_factory;
      $this->entityFieldManager = $entityFieldManager;
  }


public static function create(ContainerInterface $container) {
    return new static(
        $container->get('entity_type.manager'),
        $container->get('entity.query'),
        $container->get('entity_field.manager')
    );
}


public function helloWorld() {
    $name = \Drupal::request()->query->get('name');
    $authToken = "no authToken";
    $accessKey = "no accessKey";

    if (\Drupal::request()->headers->has('X-AUTH-TOKEN')) {
        $authToken = \Drupal::request()->headers->get( 'X-AUTH-TOKEN' );
    }
    if (\Drupal::request()->headers->has('X-ACCESS-KEY')) {
        $accessKey = \Drupal::request()->headers->get( 'X-ACCESS-KEY' );
    }
    $response = new JsonResponse(['hello' => 'world', 'name' => $name, 'authToken' => $authToken, 'accessKey' => $accessKey]);
    $response->headers->set('X-AUTH-TOKEN', 'HELLOTOKEN');
    return $response;
}

  protected function simpleQuery() {
    $query = $this->query_factory->get('student_class');
//      ->condition('status', 1);
    $scids = $query->execute();
    $studentClass_storage = $this->entityTypeManager->getStorage('student_class');
    $studentClasses = $studentClass_storage->loadMultiple($scids);
    $arrayToReturn = array();

    foreach ($studentClasses as $studentClass) {
        array_push($arrayToReturn,
            array(
                array('data' => $studentClass->get('name')->value, 'class' => 'not-editable'),
                array('data' => "hello")
            ));
    }

    return array_values($arrayToReturn);
}

public function object_2_array($result) {
  $array = array();
  foreach ($result as $key=>$value)
  {
      if (is_object($value))
      {
          $array[$key]=$this->object_2_array($value);
      }
      elseif (is_array($value))
      {
          $array[$key]=$this->object_2_array($value);
      }
      else
      {
          $array[$key]=$value;
      }
  }
  return $array;
}


  public function testQuery() {
    $query = $this->query_factory->get('epal_users');
//      ->condition('status', 1);
    $scids = $query->execute();
    $epalUsers_storage = $this->entityTypeManager->getStorage('epal_users');
    $epalUsers = $epalUsers_storage->loadMultiple($scids);
    $arrayToReturn = array();

    $j=0;
    foreach ($epalUsers as $epalUser) {
    //    print_r($epalUser);

//            $arrayToReturn[$j] = implode(",", $this->object_2_array($epalUser->id) );
            $arrayToReturn[$j] = $epalUser->user_id->target_id;
            $j++;

/*        foreach ($epalUser->name as $delta => $item) {
            $arrayToReturn[$delta] = $item->value;
        } */
/*        array_push($arrayToReturn,
        $epalUser->surname->getValue()); */
    }

//    return array_values($arrayToReturn);
    $response = new JsonResponse($arrayToReturn);
    return $response;
}


  public function basicQuery() {
    return [
      '#title' => 'All student class ids',
      'studentclasses' => array(
          '#attributes' => ['id' => 'studentclasses', 'name' => 'studentclasses'],
          '#theme' => 'table',
          '#caption' => t('Student Classes'),
          '#header' => array(t('Name'), t('Max No')),
          '#rows' => $this->simpleQuery(),
      ),
      '#attached' => [
          'library' => [
              'eepal/eepal-styles', //include our custom module library for this response
              'eepal/data-tables' //include data tables libraries with this response
          ]
      ]
    ];
  }

  protected function intermediateQuery() {
    $query = $this->query_factory->get('node')
      ->condition('status', 1)
      ->condition('changed', REQUEST_TIME, '<')
      ->condition('title', 'ipsum lorem', 'CONTAINS')
      ->condition('field_tags.entity.name', 'test');
    $nids = $query->execute();
    return array_values($nids);
  }

  public function conditionalQuery() {
    return [
      '#title' => 'Published Nodes Called "ipsum lorem" That Have a Tag "test"',
      'content' => [
        '#theme' => 'item_list',
        '#items' => $this->intermediateQuery()
      ]
    ];
  }

  protected function advancedQuery() {
    $query = $this->query_factory->get('node')
      ->condition('status', 1)
      ->condition('changed', REQUEST_TIME, '<');
    $group = $query->orConditionGroup()
      ->condition('title', 'ipsum lorem', 'CONTAINS')
      ->condition('field_tags.entity.name', 'test');
    $nids = $query->condition($group)->execute();
    return array_values($nids);
  }

  public function conditionalGroupQuery() {
    return [
      '#title' => 'Published Nodes That Are Called "ipsum lorem" Or Have a Tag "test"',
      'content' => [
        '#theme' => 'item_list',
        '#items' => $this->advancedQuery()
      ]
    ];
  }

}



