<?php

namespace Drupal\oauthost\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining OAuthOST Config entities.
 *
 * @ingroup oauthost
 */
interface OAuthOSTConfigInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the OAuthOST Config name.
   *
   * @return string
   *   Name of the OAuthOST Config.
   */
  public function getName();

  /**
   * Sets the OAuthOST Config name.
   *
   * @param string $name
   *   The OAuthOST Config name.
   *
   * @return \Drupal\oauthost\Entity\OAuthOSTConfigInterface
   *   The called OAuthOST Config entity.
   */
  public function setName($name);

  /**
   * Gets the OAuthOST Config creation timestamp.
   *
   * @return int
   *   Creation timestamp of the OAuthOST Config.
   */
  public function getCreatedTime();

  /**
   * Sets the OAuthOST Config creation timestamp.
   *
   * @param int $timestamp
   *   The OAuthOST Config creation timestamp.
   *
   * @return \Drupal\oauthost\Entity\OAuthOSTConfigInterface
   *   The called OAuthOST Config entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the OAuthOST Config published status indicator.
   *
   * Unpublished OAuthOST Config are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the OAuthOST Config is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a OAuthOST Config.
   *
   * @param bool $published
   *   TRUE to set this OAuthOST Config to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\oauthost\Entity\OAuthOSTConfigInterface
   *   The called OAuthOST Config entity.
   */
  public function setPublished($published);

}
