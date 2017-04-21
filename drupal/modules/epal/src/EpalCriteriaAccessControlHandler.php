<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Epal criteria entity.
 *
 * @see \Drupal\epal\Entity\EpalCriteria.
 */
class EpalCriteriaAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epal\Entity\EpalCriteriaInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished epal criteria entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published epal criteria entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit epal criteria entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete epal criteria entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add epal criteria entities');
  }

}
