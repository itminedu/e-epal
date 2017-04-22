<?php

namespace Drupal\oauthost;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the OAuthOST Session entity.
 *
 * @see \Drupal\oauthost\Entity\OAuthOSTSession.
 */
class OAuthOSTSessionAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\oauthost\Entity\OAuthOSTSessionInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished oauthost session entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published oauthost session entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit oauthost session entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete oauthost session entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add oauthost session entities');
  }

}
