<?php

namespace Drupal\casost\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining CASOST Config entities.
 *
 * @ingroup casost
 */
interface CASOSTConfigInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the CASOST Config name.
   *
   * @return string
   *   Name of the CASOST Config.
   */
  public function getName();

  /**
   * Sets the CASOST Config name.
   *
   * @param string $name
   *   The CASOST Config name.
   *
   * @return \Drupal\casost\Entity\CASOSTConfigInterface
   *   The called CASOST Config entity.
   */
  public function setName($name);

  /**
   * Gets the CASOST Config creation timestamp.
   *
   * @return int
   *   Creation timestamp of the CASOST Config.
   */
  public function getCreatedTime();

  /**
   * Sets the CASOST Config creation timestamp.
   *
   * @param int $timestamp
   *   The CASOST Config creation timestamp.
   *
   * @return \Drupal\casost\Entity\CASOSTConfigInterface
   *   The called CASOST Config entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the CASOST Config published status indicator.
   *
   * Unpublished CASOST Config are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the CASOST Config is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a CASOST Config.
   *
   * @param bool $published
   *   TRUE to set this CASOST Config to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\casost\Entity\CASOSTConfigInterface
   *   The called CASOST Config entity.
   */
  public function setPublished($published);

}
