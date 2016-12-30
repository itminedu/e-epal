<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining EPAL Student Class entities.
 *
 * @ingroup epal
 */
interface EpalStudentClassInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the EPAL Student Class name.
   *
   * @return string
   *   Name of the EPAL Student Class.
   */
  public function getName();

  /**
   * Sets the EPAL Student Class name.
   *
   * @param string $name
   *   The EPAL Student Class name.
   *
   * @return \Drupal\epal\Entity\EpalStudentClassInterface
   *   The called EPAL Student Class entity.
   */
  public function setName($name);

  /**
   * Gets the EPAL Student Class creation timestamp.
   *
   * @return int
   *   Creation timestamp of the EPAL Student Class.
   */
  public function getCreatedTime();

  /**
   * Sets the EPAL Student Class creation timestamp.
   *
   * @param int $timestamp
   *   The EPAL Student Class creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalStudentClassInterface
   *   The called EPAL Student Class entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the EPAL Student Class published status indicator.
   *
   * Unpublished EPAL Student Class are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the EPAL Student Class is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a EPAL Student Class.
   *
   * @param bool $published
   *   TRUE to set this EPAL Student Class to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalStudentClassInterface
   *   The called EPAL Student Class entity.
   */
  public function setPublished($published);

  /**
   * Gets the EPAL Student Class Minno.
   *
   * @return int
   *   Creation timestamp of the EPAL Student Class.
   */
  public function getMinno();

  /**
   * Sets the EPAL Student Class Minno.
   *
   * @param int $minno
   *   The EPAL Student Class Minno.
   *
   * @return \Drupal\epal\Entity\EpalStudentClassInterface
   *   The called EPAL Student Class entity.
   */
  public function setMinno($minno);

  /**
   * Gets the EPAL Student Class Maxno.
   *
   * @return int
   *   Creation timestamp of the EPAL Student Class.
   */
  public function getMaxno();

  /**
   * Sets the EPAL Student Class Maxno.
   *
   * @param int $maxno
   *   The EPAL Student Class Maxno.
   *
   * @return \Drupal\epal\Entity\EpalStudentClassInterface
   *   The called EPAL Student Class entity.
   */
  public function setMaxno($maxno);

}
