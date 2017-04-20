<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal specialties in epal entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalSpecialtiesInEpal.
 */
class EepalSpecialtiesInEpalAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalSpecialtiesInEpalInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal specialties in epal entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal specialties in epal entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal specialties in epal entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal specialties in epal entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal specialties in epal entities');
  }

}
