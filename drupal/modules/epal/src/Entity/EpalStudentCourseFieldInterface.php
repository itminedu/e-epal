<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal student course field entities.
 *
 * @ingroup epal
 */
interface EpalStudentCourseFieldInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal student course field name.
   *
   * @return string
   *   Name of the Epal student course field.
   */
  public function getName();

  /**
   * Sets the Epal student course field name.
   *
   * @param string $name
   *   The Epal student course field name.
   *
   * @return \Drupal\epal\Entity\EpalStudentCourseFieldInterface
   *   The called Epal student course field entity.
   */
  public function setName($name);

  /**
   * Gets the Epal student course field creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal student course field.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal student course field creation timestamp.
   *
   * @param int $timestamp
   *   The Epal student course field creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalStudentCourseFieldInterface
   *   The called Epal student course field entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal student course field published status indicator.
   *
   * Unpublished Epal student course field are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal student course field is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal student course field.
   *
   * @param bool $published
   *   TRUE to set this Epal student course field to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalStudentCourseFieldInterface
   *   The called Epal student course field entity.
   */
  public function setPublished($published);
  
   //get/set methods for additional fields for  configuration properties.
  public function getCoursefield_id();
  public function setCoursefield_id($val);
  public function getStudent_id();
  public function setStudent_id($val);

}
