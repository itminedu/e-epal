<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Eepal school entities.
 */
class EepalSchoolViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

	/*
    $data['eepal_school']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Eepal school'),
      'help' => $this->t('The Eepal school ID.'),
    );
	*/

    return $data;
  }

}
