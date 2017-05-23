<?php

namespace Drupal\epal\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Epal config entities.
 */
class EpalConfigViewsData extends EntityViewsData implements EntityViewsDataInterface {
  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['epal_config']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Epal config'),
      'help' => $this->t('The Epal config ID.'),
    );

    return $data;
  }

}
