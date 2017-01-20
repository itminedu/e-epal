<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal student epal chosen entities.
 *
 * @ingroup epal
 */
interface EpalStudentEpalChosenInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal student epal chosen name.
   *
   * @return string
   *   Name of the Epal student epal chosen.
   */
  public function getName();

  /**
   * Sets the Epal student epal chosen name.
   *
   * @param string $name
   *   The Epal student epal chosen name.
   *
   * @return \Drupal\epal\Entity\EpalStudentEpalChosenInterface
   *   The called Epal student epal chosen entity.
   */
  public function setName($name);

  /**
   * Gets the Epal student epal chosen creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal student epal chosen.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal student epal chosen creation timestamp.
   *
   * @param int $timestamp
   *   The Epal student epal chosen creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalStudentEpalChosenInterface
   *   The called Epal student epal chosen entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal student epal chosen published status indicator.
   *
   * Unpublished Epal student epal chosen are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal student epal chosen is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal student epal chosen.
   *
   * @param bool $published
   *   TRUE to set this Epal student epal chosen to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalStudentEpalChosenInterface
   *   The called Epal student epal chosen entity.
   */
  public function setPublished($published);

}
