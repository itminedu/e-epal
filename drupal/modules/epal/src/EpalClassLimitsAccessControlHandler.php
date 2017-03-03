<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Epal class limits entity.
 *
 * @see \Drupal\epal\Entity\EpalClassLimits.
 */
class EpalClassLimitsAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epal\Entity\EpalClassLimitsInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished epal class limits entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published epal class limits entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit epal class limits entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete epal class limits entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add epal class limits entities');
  }

}
