<?php

namespace Drupal\epal\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for Epal student epal chosen edit forms.
 *
 * @ingroup epal
 */
class EpalStudentEpalChosenForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\epal\Entity\EpalStudentEpalChosen */
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
        drupal_set_message($this->t('Created the %label Epal student epal chosen.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Epal student epal chosen.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.epal_student_epal_chosen.canonical', ['epal_student_epal_chosen' => $entity->id()]);
  }

}
