<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal sectors in epal entities.
 *
 * @ingroup epalreadydata
 */
interface EepalSectorsInEpalInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal sectors in epal name.
   *
   * @return string
   *   Name of the Eepal sectors in epal.
   */
  public function getName();

  /**
   * Sets the Eepal sectors in epal name.
   *
   * @param string $name
   *   The Eepal sectors in epal name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSectorsInEpalInterface
   *   The called Eepal sectors in epal entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal sectors in epal creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal sectors in epal.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal sectors in epal creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal sectors in epal creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSectorsInEpalInterface
   *   The called Eepal sectors in epal entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal sectors in epal published status indicator.
   *
   * Unpublished Eepal sectors in epal are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal sectors in epal is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal sectors in epal.
   *
   * @param bool $published
   *   TRUE to set this Eepal sectors in epal to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSectorsInEpalInterface
   *   The called Eepal sectors in epal entity.
   */
  public function setPublished($published);

}
