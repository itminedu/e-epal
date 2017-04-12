<?php

namespace Drupal\casost;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the CASOST Config entity.
 *
 * @see \Drupal\casost\Entity\CASOSTConfig.
 */
class CASOSTConfigAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\casost\Entity\CASOSTConfigInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished casost config entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published casost config entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit casost config entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete casost config entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add casost config entities');
  }

}
