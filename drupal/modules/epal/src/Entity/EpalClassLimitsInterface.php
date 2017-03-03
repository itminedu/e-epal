<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal class limits entities.
 *
 * @ingroup epal
 */
interface EpalClassLimitsInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal class limits name.
   *
   * @return string
   *   Name of the Epal class limits.
   */
  public function getName();

  /**
   * Sets the Epal class limits name.
   *
   * @param string $name
   *   The Epal class limits name.
   *
   * @return \Drupal\epal\Entity\EpalClassLimitsInterface
   *   The called Epal class limits entity.
   */
  public function setName($name);

  /**
   * Gets the Epal class limits creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal class limits.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal class limits creation timestamp.
   *
   * @param int $timestamp
   *   The Epal class limits creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalClassLimitsInterface
   *   The called Epal class limits entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal class limits published status indicator.
   *
   * Unpublished Epal class limits are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal class limits is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal class limits.
   *
   * @param bool $published
   *   TRUE to set this Epal class limits to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalClassLimitsInterface
   *   The called Epal class limits entity.
   */
  public function setPublished($published);

}
