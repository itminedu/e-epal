<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal region entities.
 *
 * @ingroup epalreadydata
 */
interface EepalRegionInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal region name.
   *
   * @return string
   *   Name of the Eepal region.
   */
  public function getName();

  /**
   * Sets the Eepal region name.
   *
   * @param string $name
   *   The Eepal region name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalRegionInterface
   *   The called Eepal region entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal region creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal region.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal region creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal region creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalRegionInterface
   *   The called Eepal region entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal region published status indicator.
   *
   * Unpublished Eepal region are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal region is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal region.
   *
   * @param bool $published
   *   TRUE to set this Eepal region to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalRegionInterface
   *   The called Eepal region entity.
   */
  public function setPublished($published);

}
