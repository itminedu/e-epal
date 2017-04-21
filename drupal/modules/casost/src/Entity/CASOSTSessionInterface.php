<?php

namespace Drupal\casost\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining CASOST Session entities.
 *
 * @ingroup casost
 */
interface CASOSTSessionInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the CASOST Session name.
   *
   * @return string
   *   Name of the CASOST Session.
   */
  public function getName();

  /**
   * Sets the CASOST Session name.
   *
   * @param string $name
   *   The CASOST Session name.
   *
   * @return \Drupal\casost\Entity\CASOSTSessionInterface
   *   The called CASOST Session entity.
   */
  public function setName($name);

  /**
   * Gets the CASOST Session creation timestamp.
   *
   * @return int
   *   Creation timestamp of the CASOST Session.
   */
  public function getCreatedTime();

  /**
   * Sets the CASOST Session creation timestamp.
   *
   * @param int $timestamp
   *   The CASOST Session creation timestamp.
   *
   * @return \Drupal\casost\Entity\CASOSTSessionInterface
   *   The called CASOST Session entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the CASOST Session published status indicator.
   *
   * Unpublished CASOST Session are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the CASOST Session is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a CASOST Session.
   *
   * @param bool $published
   *   TRUE to set this CASOST Session to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\casost\Entity\CASOSTSessionInterface
   *   The called CASOST Session entity.
   */
  public function setPublished($published);

}
