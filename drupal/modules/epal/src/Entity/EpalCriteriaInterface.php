<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Epal criteria entities.
 *
 * @ingroup epal
 */
interface EpalCriteriaInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Epal criteria name.
   *
   * @return string
   *   Name of the Epal criteria.
   */
  public function getName();

  /**
   * Sets the Epal criteria name.
   *
   * @param string $name
   *   The Epal criteria name.
   *
   * @return \Drupal\epal\Entity\EpalCriteriaInterface
   *   The called Epal criteria entity.
   */
  public function setName($name);

  /**
   * Gets the Epal criteria creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Epal criteria.
   */
  public function getCreatedTime();

  /**
   * Sets the Epal criteria creation timestamp.
   *
   * @param int $timestamp
   *   The Epal criteria creation timestamp.
   *
   * @return \Drupal\epal\Entity\EpalCriteriaInterface
   *   The called Epal criteria entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Epal criteria published status indicator.
   *
   * Unpublished Epal criteria are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Epal criteria is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Epal criteria.
   *
   * @param bool $published
   *   TRUE to set this Epal criteria to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epal\Entity\EpalCriteriaInterface
   *   The called Epal criteria entity.
   */
  public function setPublished($published);

}
