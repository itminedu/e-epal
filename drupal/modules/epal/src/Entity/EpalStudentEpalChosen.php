<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Epal student epal chosen entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_student_epal_chosen",
 *   label = @Translation("Epal student epal chosen"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalStudentEpalChosenListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalStudentEpalChosenViewsData",
 *     "translation" = "Drupal\epal\EpalStudentEpalChosenTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalStudentEpalChosenForm",
 *       "add" = "Drupal\epal\Form\EpalStudentEpalChosenForm",
 *       "edit" = "Drupal\epal\Form\EpalStudentEpalChosenForm",
 *       "delete" = "Drupal\epal\Form\EpalStudentEpalChosenDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalStudentEpalChosenAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalStudentEpalChosenHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_student_epal_chosen",
 *   data_table = "epal_student_epal_chosen_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer epal student epal chosen entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/epal_student_epal_chosen/{epal_student_epal_chosen}",
 *     "add-form" = "/admin/structure/epal_student_epal_chosen/add",
 *     "edit-form" = "/admin/structure/epal_student_epal_chosen/{epal_student_epal_chosen}/edit",
 *     "delete-form" = "/admin/structure/epal_student_epal_chosen/{epal_student_epal_chosen}/delete",
 *     "collection" = "/admin/structure/epal_student_epal_chosen",
 *   },
 *   field_ui_base_route = "epal_student_epal_chosen.settings"
 * )
 */
class EpalStudentEpalChosen extends ContentEntityBase implements EpalStudentEpalChosenInterface {

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
      ->setDescription(t('The user ID of author of the Epal student epal chosen entity.'))
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

	/* 
    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the Epal student epal chosen entity.'))
      ->setSettings(array(
        'max_length' => 50,
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
	 */
	
	 $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the EpalStudentEpalChosen entity.'))
      ->setSettings(array(
        'max_length' => 50,
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
	$fields['student_id'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Student id'))
      ->setDescription(t('ώσε το id μαθητή.'))
      ->setSettings(array(
        'max_length' => 50,
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
	*/
	
	
	$fields['student_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Student id'))
      ->setDescription(t('Δώσε το id μαθητή.'))
      ->setSetting('target_type', 'epal_student')
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
	
	
	 $fields['epal_id'] = BaseFieldDefinition::create('entity_reference')
            ->setLabel(t('Epal id'))
            ->setDescription(t('Δώσε το όνομα - id σχολείου που επέλεξε ο μαθητής.'))
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
			
	
	$fields['choice_no'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Max Number of Students'))
          ->setDescription(t('The maximum number of students in class.'))
          ->setSettings(array(
            'max_length' => 2,
            'text_processing' => 0,
          ))
          ->setDefaultValue(25)
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
	
		  
	$fields['points_for_order'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Μόρια για σειρά προτίμησης'))
          ->setDescription(t('Μόρια για σειρά προτίμησης.'))
          ->setSettings(array(
            'max_length' => 2,
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

	$fields['distance_from_epal'] = BaseFieldDefinition::create('float')
          ->setLabel(t('Απόσταση από ΕΠΑΛ'))
          ->setDescription(t('Απόσταση από ΕΠΑΛ.'))
          ->setSettings(array(
            //'max_length' => 2,
            'text_processing' => 0,
          ))
          //->setDefaultValue(25)
          ->setDisplayOptions('view', array(
            'label' => 'above',
            'type' => 'float',
            //'weight' => -4,
          ))
          ->setDisplayOptions('form', array(
            'type' => 'float',
            //'weight' => -4,
          ))
          ->setDisplayConfigurable('form', TRUE)
          ->setDisplayConfigurable('view', TRUE);		

    $fields['points_for_distance'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Μόρια για απόσταση'))
          ->setDescription(t('Μόρια για απόσταση.'))
          ->setSettings(array(
            'max_length' => 2,
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
	
	
	
	$fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the Epal student epal chosen is published.'))
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
