<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal specialties in epal entities.
 *
 * @ingroup epalreadydata
 */
interface EepalSpecialtiesInEpalInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal specialties in epal name.
   *
   * @return string
   *   Name of the Eepal specialties in epal.
   */
  public function getName();

  /**
   * Sets the Eepal specialties in epal name.
   *
   * @param string $name
   *   The Eepal specialties in epal name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSpecialtiesInEpalInterface
   *   The called Eepal specialties in epal entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal specialties in epal creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal specialties in epal.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal specialties in epal creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal specialties in epal creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSpecialtiesInEpalInterface
   *   The called Eepal specialties in epal entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal specialties in epal published status indicator.
   *
   * Unpublished Eepal specialties in epal are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal specialties in epal is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal specialties in epal.
   *
   * @param bool $published
   *   TRUE to set this Eepal specialties in epal to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSpecialtiesInEpalInterface
   *   The called Eepal specialties in epal entity.
   */
  public function setPublished($published);

}
