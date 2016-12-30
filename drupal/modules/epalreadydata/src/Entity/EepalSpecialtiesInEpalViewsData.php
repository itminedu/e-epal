<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Eepal specialties in epal entities.
 */
class EepalSpecialtiesInEpalViewsData extends EntityViewsData implements EntityViewsDataInterface {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['eepal_specialties_in_epal']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Eepal specialties in epal'),
      'help' => $this->t('The Eepal specialties in epal ID.'),
    );

    return $data;
  }

}
