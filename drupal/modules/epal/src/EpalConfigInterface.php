<?php

namespace Drupal\epal;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal config entities.
 *
 * @ingroup epal
 */
interface EpalConfigInterface extends ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {
  // Add get/set methods for your configuration properties here.
  /**
   * Gets the Epal config name.
   *
   * @return string
   *   Name of the Epal config.
   */
  public function getName();

  /**
   * Sets the Epal config name.
   *
   * @param string $name
   *   The Epal config name.
   *
   * @return \Drupal\epal\EpalConfigInterface
   *   The called Epal config entity.
   */
  public function setName($name);

  /**
   * Gets the Epal config creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal config.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal config creation timestamp.
   *
   * @param int $timestamp
   *   The Epal config creation timestamp.
   *
   * @return \Drupal\epal\EpalConfigInterface
   *   The called Epal config entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal config published status indicator.
   *
   * Unpublished Epal config are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal config is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal config.
   *
   * @param bool $published
   *   TRUE to set this Epal config to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\EpalConfigInterface
   *   The called Epal config entity.
   */
  public function setPublished($published);

}
