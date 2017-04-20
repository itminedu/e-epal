<?php

namespace Drupal\epalreadydata\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for Eepal specialty edit forms.
 *
 * @ingroup epalreadydata
 */
class EepalSpecialtyForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\epalreadydata\Entity\EepalSpecialty */
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
        drupal_set_message($this->t('Created the %label Eepal specialty.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Eepal specialty.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.eepal_specialty.canonical', ['eepal_specialty' => $entity->id()]);
  }

}
