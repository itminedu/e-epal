<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal student sector field entities.
 *
 * @ingroup epal
 */
interface EpalStudentSectorFieldInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal student sector field name.
   *
   * @return string
   *   Name of the Epal student sector field.
   */
  public function getName();

  /**
   * Sets the Epal student sector field name.
   *
   * @param string $name
   *   The Epal student sector field name.
   *
   * @return \Drupal\epal\Entity\EpalStudentSectorFieldInterface
   *   The called Epal student sector field entity.
   */
  public function setName($name);

  /**
   * Gets the Epal student sector field creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal student sector field.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal student sector field creation timestamp.
   *
   * @param int $timestamp
   *   The Epal student sector field creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalStudentSectorFieldInterface
   *   The called Epal student sector field entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal student sector field published status indicator.
   *
   * Unpublished Epal student sector field are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal student sector field is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal student sector field.
   *
   * @param bool $published
   *   TRUE to set this Epal student sector field to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalStudentSectorFieldInterface
   *   The called Epal student sector field entity.
   */
  public function setPublished($published);
  
  //get/set methods for additional fields for  configuration properties.
  public function getSectorfield_id();
  public function setSectorfield_id($val);
  public function getStudent_id();
  public function setStudent_id($val);

}
