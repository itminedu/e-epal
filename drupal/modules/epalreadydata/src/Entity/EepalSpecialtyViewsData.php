<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Eepal specialty entities.
 */
class EepalSpecialtyViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['eepal_specialty']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Eepal specialty'),
      'help' => $this->t('The Eepal specialty ID.'),
    );

    return $data;
  }

}
