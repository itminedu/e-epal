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

  //get/set methods for additional fields for  configuration properties.
  public function getUser_id();
  public function setUser_id($val);
  public function getEpaluser_id();
  public function setEpaluser_id($val);
  public function getStudentSurname();
  public function setStudentSurname($val);
  public function getBirthdate();
  public function setBirthdate($val);
  public function getFatherFirstname();
  public function setFatherFirstname($val);
  public function getMotherSurname();
  public function setMotherSurname($val);
  public function getStudentAmka();
  public function setStudentAmka($val);
  public function getRegionAddress();
  public function setRegionAddress($val);
  public function getRegionTK();
  public function setRegionTK($val);
  public function getRegionArea();
  public function setRegionArea($val);
  public function getCertificateType();
  public function setCertificateType($val);
  public function getCurrentclass();
  public function setCurrentclass($val);
  public function getCurrentepal();
  public function setCurrentepal($val);
  public function getCurrentsector();
  public function setCurrentsector($val);
  public function getTelnum();
  public function setTelnum($val);
  public function getRelationToStudent();
  public function setRelationToStudent($val);
  
}
