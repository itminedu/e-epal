<?php

namespace Drupal\oauthost;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of OAuthOST Config entities.
 *
 * @ingroup oauthost
 */
class OAuthOSTConfigListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('OAuthOST Config ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\oauthost\Entity\OAuthOSTConfig */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.oauthost_config.edit_form', array(
          'oauthost_config' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
