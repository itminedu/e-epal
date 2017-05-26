<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Eepal region entities.
 */
class EepalRegionViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

	/*
    $data['eepal_region']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Eepal region'),
      'help' => $this->t('The Eepal region ID.'),
    );
	*/

    return $data;
  }

}
