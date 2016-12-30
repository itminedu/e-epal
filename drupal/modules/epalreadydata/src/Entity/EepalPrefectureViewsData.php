<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Eepal prefecture entities.
 */
class EepalPrefectureViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['eepal_prefecture']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Eepal prefecture'),
      'help' => $this->t('The Eepal prefecture ID.'),
    );

    return $data;
  }

}
