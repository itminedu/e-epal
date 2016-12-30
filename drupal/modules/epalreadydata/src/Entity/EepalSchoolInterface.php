<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal school entities.
 *
 * @ingroup epalreadydata
 */
interface EepalSchoolInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal school name.
   *
   * @return string
   *   Name of the Eepal school.
   */
  public function getName();

  /**
   * Sets the Eepal school name.
   *
   * @param string $name
   *   The Eepal school name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSchoolInterface
   *   The called Eepal school entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal school creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal school.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal school creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal school creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSchoolInterface
   *   The called Eepal school entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal school published status indicator.
   *
   * Unpublished Eepal school are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal school is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal school.
   *
   * @param bool $published
   *   TRUE to set this Eepal school to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSchoolInterface
   *   The called Eepal school entity.
   */
  public function setPublished($published);

}
