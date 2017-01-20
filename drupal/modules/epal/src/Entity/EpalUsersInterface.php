<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal users entities.
 *
 * @ingroup epal
 */
interface EpalUsersInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal users name.
   *
   * @return string
   *   Name of the Epal users.
   */
  public function getName();

  /**
   * Sets the Epal users name.
   *
   * @param string $name
   *   The Epal users name.
   *
   * @return \Drupal\epal\Entity\EpalUsersInterface
   *   The called Epal users entity.
   */
  public function setName($name);

  /**
   * Gets the Epal users creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal users.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal users creation timestamp.
   *
   * @param int $timestamp
   *   The Epal users creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalUsersInterface
   *   The called Epal users entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal users published status indicator.
   *
   * Unpublished Epal users are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal users is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal users.
   *
   * @param bool $published
   *   TRUE to set this Epal users to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalUsersInterface
   *   The called Epal users entity.
   */
  public function setPublished($published);

}
