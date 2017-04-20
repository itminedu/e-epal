<?php

namespace Drupal\oauthost;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of OAuthOST Session entities.
 *
 * @ingroup oauthost
 */
class OAuthOSTSessionListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('OAuthOST Session ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\oauthost\Entity\OAuthOSTSession */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.oauthost_session.edit_form', array(
          'oauthost_session' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
