<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Epal student sector field entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_student_sector_field",
 *   label = @Translation("Epal student sector field"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalStudentSectorFieldListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalStudentSectorFieldViewsData",
 *     "translation" = "Drupal\epal\EpalStudentSectorFieldTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalStudentSectorFieldForm",
 *       "add" = "Drupal\epal\Form\EpalStudentSectorFieldForm",
 *       "edit" = "Drupal\epal\Form\EpalStudentSectorFieldForm",
 *       "delete" = "Drupal\epal\Form\EpalStudentSectorFieldDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalStudentSectorFieldAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalStudentSectorFieldHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_student_sector_field",
 *   data_table = "epal_student_sector_field_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer epal student sector field entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/epal_student_sector_field/{epal_student_sector_field}",
 *     "add-form" = "/admin/structure/epal_student_sector_field/add",
 *     "edit-form" = "/admin/structure/epal_student_sector_field/{epal_student_sector_field}/edit",
 *     "delete-form" = "/admin/structure/epal_student_sector_field/{epal_student_sector_field}/delete",
 *     "collection" = "/admin/structure/epal_student_sector_field",
 *   },
 *   field_ui_base_route = "epal_student_sector_field.settings"
 * )
 */
class EpalStudentSectorField extends ContentEntityBase implements EpalStudentSectorFieldInterface {

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
  public function getSectorfield_id() {
    return $this->get('sectorfield_id')->getString();
  }

  /**
   * {@inheritdoc}
   */
  public function setSectorfield_id($name) {
    $this->set('sectorfield_id', $name);
    return $this;
  }

/**
   * {@inheritdoc}
   */
  public function getStudent_id() {
    return $this->get('student_id')->getString();
  }

  /**
   * {@inheritdoc}
   */
  public function setStudent_id($name) {
    $this->set('student_id', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Δημιουργός'))
      ->setDescription(t('Δημιουργός.'))
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
      ->setLabel(t('Όνομα'))
      ->setDescription(t('Όνομα.'))
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
	  
	$fields['student_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('ID Μαθητή'))
      ->setDescription(t('Δώσε το id μαθητή.'))
      ->setSetting('target_type', 'epal_student')
            ->setSetting('handler', 'default')
            ->setTranslatable(TRUE)
            ->setDisplayOptions('view', array(
              'label' => 'above',
              'type' => 'author',
              'weight' => -4,
            ))
	 ->setRequired(true)
           ->setDisplayOptions('form', array(
              'type' => 'entity_reference_autocomplete',
              'weight' => -4,
              'settings' => array(
                'match_operator' => 'CONTAINS',
                'size' => '60',
                'autocomplete_type' => 'tags',
                'placeholder' => '',
              ),
            ))
     ->setDisplayConfigurable('form', TRUE)
     ->setDisplayConfigurable('view', TRUE);
	
	 $fields['sectorfield_id'] = BaseFieldDefinition::create('entity_reference')
            ->setLabel(t('ID τομέα'))
            ->setDescription(t('Δώσε το id τομέα που επέλεξε ο μαθητής.'))
            ->setSetting('target_type', 'eepal_sectors')
            ->setSetting('handler', 'default')
			->setRequired(true)
            ->setTranslatable(TRUE)
            ->setDisplayOptions('view', array(
              'label' => 'above',
              'type' => 'author',
              'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
              'type' => 'entity_reference_autocomplete',
              'weight' => -4,
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
      ->setDescription(t('A boolean indicating whether the Epal student sector field is published.'))
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
