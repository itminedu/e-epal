<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Eepal specialties in epal entity.
 *
 * @ingroup epalreadydata
 *
 * @ContentEntityType(
 *   id = "eepal_specialties_in_epal",
 *   label = @Translation("Eepal specialties in epal"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epalreadydata\EepalSpecialtiesInEpalListBuilder",
 *     "views_data" = "Drupal\epalreadydata\Entity\EepalSpecialtiesInEpalViewsData",
 *     "translation" = "Drupal\epalreadydata\EepalSpecialtiesInEpalTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\epalreadydata\Form\EepalSpecialtiesInEpalForm",
 *       "add" = "Drupal\epalreadydata\Form\EepalSpecialtiesInEpalForm",
 *       "edit" = "Drupal\epalreadydata\Form\EepalSpecialtiesInEpalForm",
 *       "delete" = "Drupal\epalreadydata\Form\EepalSpecialtiesInEpalDeleteForm",
 *     },
 *     "access" = "Drupal\epalreadydata\EepalSpecialtiesInEpalAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epalreadydata\EepalSpecialtiesInEpalHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "eepal_specialties_in_epal",
 *   data_table = "eepal_specialties_in_epal_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer eepal specialties in epal entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/eepal_specialties_in_epal/{eepal_specialties_in_epal}",
 *     "add-form" = "/admin/structure/eepal_specialties_in_epal/add",
 *     "edit-form" = "/admin/structure/eepal_specialties_in_epal/{eepal_specialties_in_epal}/edit",
 *     "delete-form" = "/admin/structure/eepal_specialties_in_epal/{eepal_specialties_in_epal}/delete",
 *     "collection" = "/admin/structure/eepal_specialties_in_epal",
 *   },
 *   field_ui_base_route = "eepal_specialties_in_epal.settings"
 * )
 */
class EepalSpecialtiesInEpal extends ContentEntityBase implements EepalSpecialtiesInEpalInterface {

  use EntityChangedTrait;

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values) {
    parent::preCreate($storage_controller, $values);
    $values += array(
      'user_id' => \Drupal::currentUser()->id(),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return $this->get('name')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setName($name) {
    $this->set('name', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime() {
    return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp) {
    $this->set('created', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    $this->set('user_id', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function isPublished() {
    return (bool) $this->getEntityKey('status');
  }

  /**
   * {@inheritdoc}
   */
  public function setPublished($published) {
    $this->set('status', $published ? TRUE : FALSE);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the Eepal specialties in epal entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setTranslatable(TRUE)
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'entity_reference_autocomplete',
        'weight' => 5,
        'settings' => array(
          'match_operator' => 'CONTAINS',
          'size' => '60',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ),
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the Eepal specialties in epal entity.'))
      ->setSettings(array(
        'max_length' => 20,
        'text_processing' => 0,
      ))
      ->setDefaultValue('')
      ->setDisplayOptions('view', array(
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'string_textfield',
        'weight' => -4,
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['epal_id'] = BaseFieldDefinition::create('entity_reference')
        ->setLabel(t('Σχολείο επιλογής'))
        ->setDescription(t('Σχολείο επιλογής.'))
        ->setSetting('target_type', 'eepal_school')
        ->setSetting('handler', 'default')
        ->setTranslatable(TRUE)
        ->setDisplayOptions('view', array(
              'label' => 'hidden',
              'type' => 'author',
              'weight' => 0,
            ))
        ->setDisplayOptions('form', array(
              'type' => 'entity_reference_autocomplete',
              'weight' => 5,
              'settings' => array(
                'match_operator' => 'CONTAINS',
                'size' => '60',
                'autocomplete_type' => 'tags',
                'placeholder' => '',
              ),
            ))
        ->setDisplayConfigurable('form', TRUE)
        ->setDisplayConfigurable('view', TRUE);

	$fields['specialty_id'] = BaseFieldDefinition::create('entity_reference')
        ->setLabel(t('Ειδικότητα επιλογής'))
        ->setDescription(t('Ειδικότητα επιλογής.'))
        ->setSetting('target_type', 'eepal_specialty')
        ->setSetting('handler', 'default')
        ->setTranslatable(TRUE)
        ->setDisplayOptions('view', array(
              'label' => 'hidden',
              'type' => 'author',
              'weight' => 0,
            ))
        ->setDisplayOptions('form', array(
              'type' => 'entity_reference_autocomplete',
              'weight' => 5,
              'settings' => array(
                'match_operator' => 'CONTAINS',
                'size' => '60',
                'autocomplete_type' => 'tags',
                'placeholder' => '',
              ),
            ))
        ->setDisplayConfigurable('form', TRUE)
        ->setDisplayConfigurable('view', TRUE);

    $fields['capacity_class_specialty'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('Μέγιστος αριθμός τμημάτων ειδικότητας για την Γ Λυκείου'))
      ->setDescription(t('Δώσε τον μέγιστο αριθμό τμημάτων ειδικότητας για την Γ Λυκείου.'))
       ->setSettings(array(
               'max_length' => 2,
               'text_processing' => 0,
             ))
     ->setRequired(false)
     ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'integer',
               'weight' => -4,
             ))
     ->setDisplayOptions('form', array(
               'type' => 'integer',
               'weight' => -4,
             ))
     ->setDisplayConfigurable('form', TRUE)
     ->setDisplayConfigurable('view', TRUE);

     $fields['capacity_class_specialty_d'] = BaseFieldDefinition::create('integer')
       ->setLabel(t('Μέγιστος αριθμός τμημάτων ειδικότητας για την Δ Λυκείου'))
       ->setDescription(t('Δώσε τον μέγιστο αριθμό τμημάτων ειδικότητας για την Δ Λυκείου.'))
        ->setSettings(array(
                'max_length' => 2,
                'text_processing' => 0,
              ))
      ->setRequired(false)
      ->setDisplayOptions('view', array(
                'label' => 'above',
                'type' => 'integer',
                'weight' => -4,
              ))
      ->setDisplayOptions('form', array(
                'type' => 'integer',
                'weight' => -4,
              ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

  $fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the Eepal specialties in epal is published.'))
      ->setDefaultValue(TRUE);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    return $fields;
  }

}
