<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal sectors in epal entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalSectorsInEpal.
 */
class EepalSectorsInEpalAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalSectorsInEpalInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal sectors in epal entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal sectors in epal entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal sectors in epal entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal sectors in epal entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal sectors in epal entities');
  }

}
