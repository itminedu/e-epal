<?php

namespace Drupal\epalreadydata\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Eepal admin area entity.
 *
 * @ingroup epalreadydata
 *
 * @ContentEntityType(
 *   id = "eepal_admin_area",
 *   label = @Translation("Eepal admin area"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epalreadydata\EepalAdminAreaListBuilder",
 *     "views_data" = "Drupal\epalreadydata\Entity\EepalAdminAreaViewsData",
 *     "translation" = "Drupal\epalreadydata\EepalAdminAreaTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\epalreadydata\Form\EepalAdminAreaForm",
 *       "add" = "Drupal\epalreadydata\Form\EepalAdminAreaForm",
 *       "edit" = "Drupal\epalreadydata\Form\EepalAdminAreaForm",
 *       "delete" = "Drupal\epalreadydata\Form\EepalAdminAreaDeleteForm",
 *     },
 *     "access" = "Drupal\epalreadydata\EepalAdminAreaAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epalreadydata\EepalAdminAreaHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "eepal_admin_area",
 *   data_table = "eepal_admin_area_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer eepal admin area entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/eepal_admin_area/{eepal_admin_area}",
 *     "add-form" = "/admin/structure/eepal_admin_area/add",
 *     "edit-form" = "/admin/structure/eepal_admin_area/{eepal_admin_area}/edit",
 *     "delete-form" = "/admin/structure/eepal_admin_area/{eepal_admin_area}/delete",
 *     "collection" = "/admin/structure/eepal_admin_area",
 *   },
 *   field_ui_base_route = "eepal_admin_area.settings"
 * )
 */
class EepalAdminArea extends ContentEntityBase implements EepalAdminAreaInterface {

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
      ->setDescription(t('The user ID of author of the Eepal admin area entity.'))
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
      ->setDescription(t('The name of the Eepal admin area entity.'))
      ->setSettings(array(
        'max_length' => 80,
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

	 /* 
     $fields['region_to_belong'] = BaseFieldDefinition::create('integer')
        ->setLabel(t('region_to_belong'))
        ->setDescription(t('Περιφερειακή Διεύθυνση στην οποία ανήκει.'))
        ->setRevisionable(TRUE)
        ->setSettings(array(
          //'max_length' => 2,
          'text_processing' => 0,
        ))
        //->setDefaultValue(25)
        ->setDisplayOptions('view', array(
          'label' => 'above',
          'type' => 'integer',
          //'weight' => -4,
        ))
        ->setDisplayOptions('form', array(
          'type' => 'integer',
          //'weight' => -4,
        ))
        ->setDisplayConfigurable('form', TRUE)
        ->setDisplayConfigurable('view', TRUE);
	*/
	$fields['region_to_belong'] = BaseFieldDefinition::create('entity_reference')
        ->setLabel(t('region_to_belong'))
        ->setDescription(t('Περιφερειακή Διεύθυνση στην οποία ανήκει.'))
        ->setSetting('target_type', 'eepal_region')
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
		
		
	$fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the Eepal admin area is published.'))
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
