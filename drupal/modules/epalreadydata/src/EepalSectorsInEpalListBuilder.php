<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Eepal sectors in epal entities.
 *
 * @ingroup epalreadydata
 */
class EepalSectorsInEpalListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Eepal sectors in epal ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\epalreadydata\Entity\EepalSectorsInEpal */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.eepal_sectors_in_epal.edit_form', array(
          'eepal_sectors_in_epal' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
