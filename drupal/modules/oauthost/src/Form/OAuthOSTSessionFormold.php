<?php

namespace Drupal\oauthost\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for OAuthOST Session edit forms.
 *
 * @ingroup oauthost
 */
class OAuthOSTSessionForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\oauthost\Entity\OAuthOSTSession */
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
        drupal_set_message($this->t('Created the %label OAuthOST Session.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label OAuthOST Session.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.oauthost_session.canonical', ['oauthost_session' => $entity->id()]);
  }

}
