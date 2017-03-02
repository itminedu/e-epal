<?php

namespace Drupal\oauthost\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining OAuthOST Session entities.
 *
 * @ingroup oauthost
 */
interface OAuthOSTSessionInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the OAuthOST Session name.
   *
   * @return string
   *   Name of the OAuthOST Session.
   */
  public function getName();

  /**
   * Sets the OAuthOST Session name.
   *
   * @param string $name
   *   The OAuthOST Session name.
   *
   * @return \Drupal\oauthost\Entity\OAuthOSTSessionInterface
   *   The called OAuthOST Session entity.
   */
  public function setName($name);

  /**
   * Gets the OAuthOST Session creation timestamp.
   *
   * @return int
   *   Creation timestamp of the OAuthOST Session.
   */
  public function getCreatedTime();

  /**
   * Sets the OAuthOST Session creation timestamp.
   *
   * @param int $timestamp
   *   The OAuthOST Session creation timestamp.
   *
   * @return \Drupal\oauthost\Entity\OAuthOSTSessionInterface
   *   The called OAuthOST Session entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the OAuthOST Session published status indicator.
   *
   * Unpublished OAuthOST Session are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the OAuthOST Session is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a OAuthOST Session.
   *
   * @param bool $published
   *   TRUE to set this OAuthOST Session to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\oauthost\Entity\OAuthOSTSessionInterface
   *   The called OAuthOST Session entity.
   */
  public function setPublished($published);

}
