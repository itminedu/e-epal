<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal admin area entities.
 *
 * @ingroup epalreadydata
 */
interface EepalAdminAreaInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal admin area name.
   *
   * @return string
   *   Name of the Eepal admin area.
   */
  public function getName();

  /**
   * Sets the Eepal admin area name.
   *
   * @param string $name
   *   The Eepal admin area name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalAdminAreaInterface
   *   The called Eepal admin area entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal admin area creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal admin area.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal admin area creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal admin area creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalAdminAreaInterface
   *   The called Eepal admin area entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal admin area published status indicator.
   *
   * Unpublished Eepal admin area are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal admin area is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal admin area.
   *
   * @param bool $published
   *   TRUE to set this Eepal admin area to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalAdminAreaInterface
   *   The called Eepal admin area entity.
   */
  public function setPublished($published);

}
