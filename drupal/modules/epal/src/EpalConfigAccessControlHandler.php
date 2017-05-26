<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Epal config entity.
 *
 * @see \Drupal\epal\Entity\EpalConfig.
 */
class EpalConfigAccessControlHandler extends EntityAccessControlHandler {
  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epal\EpalConfigInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished epal config entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published epal config entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit epal config entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete epal config entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add epal config entities');
  }

}
