<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the EPAL Student entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_student",
 *   label = @Translation("EPAL Student"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalStudentListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalStudentViewsData",
 *     "translation" = "Drupal\epal\EpalStudentTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalStudentForm",
 *       "add" = "Drupal\epal\Form\EpalStudentForm",
 *       "edit" = "Drupal\epal\Form\EpalStudentForm",
 *       "delete" = "Drupal\epal\Form\EpalStudentDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalStudentAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalStudentHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_student",
 *   data_table = "epal_student_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer epal student entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *     "surname" = "surname",
 *     "address" = "address",
 *     "birthdate" = "birthdate",
 *     "epalstudentclass_id" = "epalstudentclass_id",
 *   },
 *   links = {
 *     "canonical" = "/admin/epal/epal_student/{epal_student}",
 *     "add-form" = "/admin/epal/epal_student/add",
 *     "edit-form" = "/admin/epal/epal_student/{epal_student}/edit",
 *     "delete-form" = "/admin/epal/epal_student/{epal_student}/delete",
 *     "collection" = "/admin/epal/epal_student",
 *   },
 *   field_ui_base_route = "epal_student.settings"
 * )
 */
class EpalStudent extends ContentEntityBase implements EpalStudentInterface {

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
  public function getSurname() {
    return $this->get('surname')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setSurname($surname) {
    $this->set('surname', $surname);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getAddress() {
    return $this->get('address')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setAddress($address) {
    $this->set('address', $address);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getBirthdate() {
    return $this->get('birthdate')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setBirthdate($birthdate) {
    $this->set('birthdate', $birthdate);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getEpalstudentclass() {
    return $this->get('epalstudentclass_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getEpalstudentclassId() {
    return $this->get('epalstudentclass_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setEpalstudentclassId($epalstudentclass_id) {
    $this->set('epalstudentclass_id', $epalstudentclass_id);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setEpalstudentclass(EpalStudentClassInterface $epalstudentclass) {
    $this->set('epalstudentclass_id', $epalstudentclass->id());
    return $this;
  }



  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the EPAL Student entity.'))
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

    $fields['name'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('EpalUsers id'))
      ->setDescription(t('Δώσε το id του EpalUsers.'))
      ->setSetting('target_type', 'epal_users')
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
      $fields['surname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Surname'))
          ->setDescription(t('The surname of the Student entity.'))
          ->setSettings(array(
            'max_length' => 100,
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
	
	$fields['studentFirstname'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Όνομα μαθητή'))
      ->setDescription(t('Δώσε το μικρό μαθητή.'))
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

	  
	$fields['studentSurname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Επώνυμο μαθητή'))
          ->setDescription(t('Δώσε το επώνυμο μαθητή.'))
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
	  $fields['birthdate'] = BaseFieldDefinition::create('datetime')
        ->setLabel(t('Ημερομηνία γέννησης μαθητή'))
        ->setDescription(t('Δώσε την Ημερομηνία γέννησης μαθητή.'))
        ->setSetting('datetime_type', 'date')
        ->setRequired(false)
        ->setDisplayOptions('view', array(
          'label' => 'above',
          'type' => 'string',
          'weight' => -4,
        ))->setDisplayOptions('form', array(
          'type' => 'string_textfield',
          'weight' => -4,
        ))
        ->setDisplayConfigurable('form', TRUE)
        ->setDisplayConfigurable('view', TRUE);
	  */

      $fields['guardianSurname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Επώνυμο κηδεμόνα'))
          ->setDescription(t('Δώσε το επώνυμο του κηδεμόνα.'))
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
		  
	  $fields['guardianFirstname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Όνομα του κηδεμόνα'))
          ->setDescription(t('Δώσε το όνομα του κηδεμόνα.'))
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
	   $fields['guardianADT'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Ταυτότητα κηδεμόνα'))
          ->setDescription(t('Δώσε την ταυτότητα κηδεμόνα.'))
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
		 
	   $fields['studentAmka'] = BaseFieldDefinition::create('string')
          ->setLabel(t('ΑΜΚΑ μαθητή'))
          ->setDescription(t('Δώσε το ΑΜΚΑ μαθητή.'))
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
	  
	   $fields['regionAddress'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Διεύθνση κηδεμόνα'))
          ->setDescription(t('Δώσε τη διεύθυνση κηδεμόνα.'))
          ->setSettings(array(
            'max_length' => 100,
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
	  
	  $fields['regionTK'] = BaseFieldDefinition::create('string')
          ->setLabel(t('ΤΚ περιοχής'))
          ->setDescription(t('Δώσε τον ΤΚ της διεύθυνσης κατοικίας.'))
          ->setSettings(array(
            'max_length' => 10,
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
	  
	  $fields['regionArea'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Πόλη-Κοινότητα'))
          ->setDescription(t('Δώσε την πόλη ή κοινότητα που διαμένεις.'))
          ->setSettings(array(
            'max_length' => 100,
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
	  
		  
	   $fields['certificateType'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Τύπος απολυτηρίου'))
          ->setDescription(t('Δώσε τον τύπο απολυτηρίου, πχ Απολυτήριο Γυμνασίου'))
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
		  
	   $fields['relationToStudent'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Σχέση αιτούντα με μαθητή'))
          ->setDescription(t('Δώσε τη σχέση αιτούντα με μαθητή, πχ  Γονέας - Κηδεμόνας - Μαθητής'))
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

	  
      	 $fields['status'] = BaseFieldDefinition::create('boolean')
		  ->setLabel(t('Publishing status'))
		  ->setDescription(t('A boolean indicating whether the EPAL Student is published.'))
			->setDefaultValue(TRUE);

		$fields['created'] = BaseFieldDefinition::create('created')
		  ->setLabel(t('Created'))
		  ->setDescription(t('The time that the entity was created.'));

		$fields['changed'] = BaseFieldDefinition::create('changed')
		  ->setLabel(t('Changed'))
		  ->setDescription(t('The time that the entity was last edited.'));
		 
	 
		/*
        $fields['epalstudentclass_id'] = BaseFieldDefinition::create('entity_reference')
            ->setLabel(t('Student Class'))
            ->setDescription(t('The Students class.'))
            ->setSetting('target_type', 'epal_student_class')
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
	  */

    return $fields;
  }

}
