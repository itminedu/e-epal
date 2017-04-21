<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal student moria entities.
 *
 * @ingroup epal
 */
interface EpalStudentMoriaInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal student moria name.
   *
   * @return string
   *   Name of the Epal student moria.
   */
  public function getName();

  /**
   * Sets the Epal student moria name.
   *
   * @param string $name
   *   The Epal student moria name.
   *
   * @return \Drupal\epal\Entity\EpalStudentMoriaInterface
   *   The called Epal student moria entity.
   */
  public function setName($name);

  /**
   * Gets the Epal student moria creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal student moria.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal student moria creation timestamp.
   *
   * @param int $timestamp
   *   The Epal student moria creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalStudentMoriaInterface
   *   The called Epal student moria entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal student moria published status indicator.
   *
   * Unpublished Epal student moria are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal student moria is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal student moria.
   *
   * @param bool $published
   *   TRUE to set this Epal student moria to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalStudentMoriaInterface
   *   The called Epal student moria entity.
   */
  public function setPublished($published);

}
