<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal prefecture entities.
 *
 * @ingroup epalreadydata
 */
interface EepalPrefectureInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal prefecture name.
   *
   * @return string
   *   Name of the Eepal prefecture.
   */
  public function getName();

  /**
   * Sets the Eepal prefecture name.
   *
   * @param string $name
   *   The Eepal prefecture name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalPrefectureInterface
   *   The called Eepal prefecture entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal prefecture creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal prefecture.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal prefecture creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal prefecture creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalPrefectureInterface
   *   The called Eepal prefecture entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal prefecture published status indicator.
   *
   * Unpublished Eepal prefecture are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal prefecture is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal prefecture.
   *
   * @param bool $published
   *   TRUE to set this Eepal prefecture to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalPrefectureInterface
   *   The called Eepal prefecture entity.
   */
  public function setPublished($published);

}
