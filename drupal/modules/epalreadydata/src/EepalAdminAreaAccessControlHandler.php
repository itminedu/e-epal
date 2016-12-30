<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal admin area entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalAdminArea.
 */
class EepalAdminAreaAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalAdminAreaInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal admin area entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal admin area entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal admin area entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal admin area entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal admin area entities');
  }

}
