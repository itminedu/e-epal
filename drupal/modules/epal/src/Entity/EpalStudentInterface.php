<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining EPAL Student entities.
 *
 * @ingroup epal
 */
interface EpalStudentInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the EPAL Student name.
   *
   * @return string
   *   Name of the EPAL Student.
   */
  public function getName();

  /**
   * Sets the EPAL Student name.
   *
   * @param string $name
   *   The EPAL Student name.
   *
   * @return \Drupal\epal\Entity\EpalStudentInterface
   *   The called EPAL Student entity.
   */
  public function setName($name);

  /**
   * Gets the EPAL Student creation timestamp.
   *
   * @return int
   *   Creation timestamp of the EPAL Student.
   */
  public function getCreatedTime();

  /**
   * Sets the EPAL Student creation timestamp.
   *
   * @param int $timestamp
   *   The EPAL Student creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalStudentInterface
   *   The called EPAL Student entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the EPAL Student published status indicator.
   *
   * Unpublished EPAL Student are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the EPAL Student is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a EPAL Student.
   *
   * @param bool $published
   *   TRUE to set this EPAL Student to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalStudentInterface
   *   The called EPAL Student entity.
   */
  public function setPublished($published);

  /**
   * Gets the EPAL Student surname.
   *
   * @return string
   *   Surname of the EPAL Student.
   */
  public function getSurname();

  /**
   * Sets the EPAL Student surname.
   *
   * @param string $surname
   *   The EPAL Student surname.
   *
   * @return \Drupal\epal\Entity\EpalStudentInterface
   *   The called EPAL Student entity.
   */
  public function setSurname($surname);

  /**
   * Gets the EPAL Student address.
   *
   * @return string
   *   Address of the EPAL Student.
   */
  public function getAddress();

  /**
   * Sets the EPAL Student address.
   *
   * @param string $address
   *   The EPAL Student address.
   *
   * @return \Drupal\epal\Entity\EpalStudentInterface
   *   The called EPAL Student entity.
   */
  public function setAddress($address);

  /**
   * Gets the EPAL Student birthdate.
   *
   * @return string
   *   Birthdate of the EPAL Student.
   */
  public function getBirthdate();

  /**
   * Sets the EPAL Student birthdate.
   *
   * @param string $birthdate
   *   The EPAL Student birthdate.
   *
   * @return \Drupal\epal\Entity\EpalStudentInterface
   *   The called EPAL Student entity.
   */
  public function setBirthdate($birthdate);



}
