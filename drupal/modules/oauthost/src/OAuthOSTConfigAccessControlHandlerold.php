<?php

namespace Drupal\oauthost;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the OAuthOST Config entity.
 *
 * @see \Drupal\oauthost\Entity\OAuthOSTConfig.
 */
class OAuthOSTConfigAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\oauthost\Entity\OAuthOSTConfigInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished oauthost config entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published oauthost config entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit oauthost config entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete oauthost config entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add oauthost config entities');
  }

}
