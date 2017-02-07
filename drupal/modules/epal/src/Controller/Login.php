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

/**
 * Controller routines for page example routes.
 */
class Login extends ControllerBase {

  protected $query_factory;

public function __construct(EntityTypeManagerInterface $entityTypeManager, QueryFactory $query_factory) {
//    public function __construct(QueryFactory $query_factory) {
      $this->entityTypeManager = $entityTypeManager;
      $this->query_factory = $query_factory;
  }


public static function create(ContainerInterface $container) {
    return new static(
        $container->get('entity.manager'),
        $container->get('entity.query')
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
