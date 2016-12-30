<?php

namespace Drupal\epalreadydata;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Eepal prefecture entity.
 *
 * @see \Drupal\epalreadydata\Entity\EepalPrefecture.
 */
class EepalPrefectureAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\epalreadydata\Entity\EepalPrefectureInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished eepal prefecture entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published eepal prefecture entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit eepal prefecture entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete eepal prefecture entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add eepal prefecture entities');
  }

}
