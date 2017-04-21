<?php

namespace Drupal\epalreadydata\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for Eepal specialties in epal edit forms.
 *
 * @ingroup epalreadydata
 */
class EepalSpecialtiesInEpalForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\epalreadydata\Entity\EepalSpecialtiesInEpal */
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
        drupal_set_message($this->t('Created the %label Eepal specialties in epal.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Eepal specialties in epal.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.eepal_specialties_in_epal.canonical', ['eepal_specialties_in_epal' => $entity->id()]);
  }

}
