<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal specialty entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalSpecialty.
 */
class EepalSpecialtyAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalSpecialtyInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal specialty entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal specialty entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal specialty entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal specialty entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal specialty entities');
  }

}
