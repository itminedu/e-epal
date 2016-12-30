<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the EPAL Student Class entity.
 *
 * @see \Drupal\epal\Entity\EpalStudentClass.
 */
class EpalStudentClassAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epal\Entity\EpalStudentClassInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished epal student class entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published epal student class entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit epal student class entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete epal student class entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add epal student class entities');
  }

}
