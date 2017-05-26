<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal specialty entities.
 *
 * @ingroup epalreadydata
 */
interface EepalSpecialtyInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal specialty name.
   *
   * @return string
   *   Name of the Eepal specialty.
   */
  public function getName();

  /**
   * Sets the Eepal specialty name.
   *
   * @param string $name
   *   The Eepal specialty name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSpecialtyInterface
   *   The called Eepal specialty entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal specialty creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal specialty.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal specialty creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal specialty creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSpecialtyInterface
   *   The called Eepal specialty entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal specialty published status indicator.
   *
   * Unpublished Eepal specialty are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal specialty is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal specialty.
   *
   * @param bool $published
   *   TRUE to set this Eepal specialty to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSpecialtyInterface
   *   The called Eepal specialty entity.
   */
  public function setPublished($published);

}
