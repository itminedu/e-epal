<?php

namespace Drupal\casost;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the CASOST Session entity.
 *
 * @see \Drupal\casost\Entity\CASOSTSession.
 */
class CASOSTSessionAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\casost\Entity\CASOSTSessionInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished casost session entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published casost session entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit casost session entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete casost session entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add casost session entities');
  }

}
