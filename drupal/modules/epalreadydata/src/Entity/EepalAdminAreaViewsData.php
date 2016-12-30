<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Eepal admin area entities.
 */
class EepalAdminAreaViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['eepal_admin_area']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Eepal admin area'),
      'help' => $this->t('The Eepal admin area ID.'),
    );

    return $data;
  }

}
