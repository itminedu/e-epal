<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Eepal admin area entities.
 *
 * @ingroup epalreadydata
 */
class EepalAdminAreaListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Eepal admin area ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\epalreadydata\Entity\EepalAdminArea */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.eepal_admin_area.edit_form', array(
          'eepal_admin_area' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
