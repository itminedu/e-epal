<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal school entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalSchool.
 */
class EepalSchoolAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalSchoolInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal school entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal school entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal school entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal school entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal school entities');
  }

}
