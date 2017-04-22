<?php

namespace Drupal\epalreadydata\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for Eepal sectors edit forms.
 *
 * @ingroup epalreadydata
 */
class EepalSectorsForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\epalreadydata\Entity\EepalSectors */
    $form = parent::buildForm($form, $form_state);

    $entity = $this->entity;

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $entity = &$this->entity;

    $status = parent::save($form, $form_state);

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label Eepal sectors.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Eepal sectors.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.eepal_sectors.canonical', ['eepal_sectors' => $entity->id()]);
  }

}
