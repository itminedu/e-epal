<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal region entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalRegion.
 */
class EepalRegionAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalRegionInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal region entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal region entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal region entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal region entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal region entities');
  }

}
