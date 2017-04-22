<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Eepal sectors entities.
 *
 * @ingroup epalreadydata
 */
interface EepalSectorsInterface extends  ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Eepal sectors name.
   *
   * @return string
   *   Name of the Eepal sectors.
   */
  public function getName();

  /**
   * Sets the Eepal sectors name.
   *
   * @param string $name
   *   The Eepal sectors name.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSectorsInterface
   *   The called Eepal sectors entity.
   */
  public function setName($name);

  /**
   * Gets the Eepal sectors creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Eepal sectors.
   */
  public function getCreatedTime();

  /**
   * Sets the Eepal sectors creation timestamp.
   *
   * @param int $timestamp
   *   The Eepal sectors creation timestamp.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSectorsInterface
   *   The called Eepal sectors entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Eepal sectors published status indicator.
   *
   * Unpublished Eepal sectors are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Eepal sectors is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Eepal sectors.
   *
   * @param bool $published
   *   TRUE to set this Eepal sectors to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\epalreadydata\Entity\EepalSectorsInterface
   *   The called Eepal sectors entity.
   */
  public function setPublished($published);

}
