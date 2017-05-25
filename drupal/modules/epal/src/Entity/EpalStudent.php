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
 *   admin_permission = "administer epal student entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *     "epaluser_id" = "epaluser_id",
 *     "name" = "name",
 *     "studentsurname" = "studentsurname",
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
  public function getUser_id() {
    return $this->get('user_id')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setUser_id($name) {
    $this->set('user_id', $name);
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
  public function getStatus() {
    return $this->get('status')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setStatus($name) {
    $this->set('status', $name);
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
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
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
  public function getEpaluser_id() {
    return $this->get('epaluser_id')->getString();
  }

  /**
   * {@inheritdoc}
   */
  public function setEpaluser_id($name) {
    $this->set('epaluser_id', $name);
    return $this;
  }

   /**
   * {@inheritdoc}
   */
  public function getStudentSurname() {
    return $this->get('studentsurname')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setStudentSurname($name) {
    $this->set('Studentsurname', $name);
    return $this;
  }

  public function getBirthdate() {
    return $this->get('birthdate')->value;
  }

  public function setBirthdate($name) {
    $this->set('birthdate', $name);
    return $this;
  }

  public function getFatherFirstname() {
    return $this->get('fatherfirstname')->value;
  }

  public function setFatherFirstname($name) {
    $this->set('fatherfirstname', $name);
    return $this;
  }

  public function getMotherSurname() {
    return $this->get('mothersurname')->value;
  }

  public function setMotherSurname($name) {
    $this->set('mothersurname', $name);
    return $this;
  }

   /**
   * {@inheritdoc}
   */
  public function getStudentAmka() {
    return $this->get('studentamka')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setStudentAmka($name) {
    $this->set('studentamka', $name);
    return $this;
  }

   /**
   * {@inheritdoc}
   */
  public function getRegionAddress() {
    return $this->get('regionaddress')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setRegionAddress($name) {
    $this->set('regionaddress', $name);
    return $this;
  }

   /**
   * {@inheritdoc}
   */
  public function getRegionTK() {
    return $this->get('regiontk')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setRegionTK($name) {
    $this->set('regiontk', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRegionArea() {
    return $this->get('regionarea')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setRegionArea($name) {
    $this->set('regionarea', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCertificateType() {
    return $this->get('certificatetype')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCertificateType($name) {
    $this->set('certificatetype', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCurrentclass() {
    return $this->get('currentclass')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCurrentclass($name) {
    $this->set('currentclass', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCurrentepal() {
    return $this->get('currentepal')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCurrentepal($name) {
    $this->set('currentepal', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCurrentsector() {
    return $this->get('currentsector')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCurrentsector($name) {
    $this->set('currentsector', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getTelnum() {
    return $this->get('telnum')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setTelnum($name) {
    $this->set('telnum', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getRelationToStudent() {
    return $this->get('relationtostudent')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setRelationToStudent($name) {
    $this->set('relationtostudent', $name);
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
        'label' => 'above',
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

    $fields['epaluser_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Id χρήστη ΕΠΑΛ'))
      ->setDescription(t('Δώσε το id του αντίστοιχου Epal User.'))
      ->setSetting('target_type', 'epal_users')
      ->setSetting('handler', 'default')
	    ->setRequired(true)
 //     ->setTranslatable(TRUE)
      ->setDisplayOptions('view', array(
              'label' => 'above',
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

  $fields['student_record_id'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Id μαθητή από myschool'))
      ->setDescription(t('Δώσε το Id μαθητή από myschool.'))
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

  $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Όνομα μαθητή'))
      ->setDescription(t('Δώσε το μικρό μαθητή.'))
      ->setSettings(array(
        'max_length' => 50,
        'text_processing' => 0,
      ))
	  ->setRequired(true)
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

  $fields['studentsurname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Επώνυμο μαθητή'))
          ->setDescription(t('Δώσε το επώνυμο μαθητή.'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
		  ->setRequired(true)
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


	  $fields['birthdate'] = BaseFieldDefinition::create('datetime')
        ->setLabel(t('Ημερομηνία γέννησης μαθητή'))
        ->setDescription(t('Δώσε την Ημερομηνία γέννησης μαθητή.'))
        ->setSetting('datetime_type', 'date')
        ->setRequired(true)
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

      $fields['sex'] = BaseFieldDefinition::create('boolean')
          ->setLabel(t('Φύλο'))
          ->setDescription(t('Φύλο.'))
          ->setSettings(array(
            'text_processing' => 0,
          ))
          ->setRequired(false)
          ->setDisplayOptions('view', array(
            'label' => 'above',
            'type' => 'boolean',
            'weight' => -4,
          ))
          ->setDisplayOptions('form', array(
            'type' => 'boolean',
            'weight' => -4,
          ))
          ->setDisplayConfigurable('form', TRUE)
          ->setDisplayConfigurable('view', TRUE);

     $fields['fatherfirstname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Όνομα του πατέρα'))
          ->setDescription(t('Δώσε το όνομα του πατέρα.'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
		  ->setRequired(true)
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

	    $fields['fathersurname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Επώνυμο πατέρα'))
          ->setDescription(t('Δώσε το επώνυμο του πατέρα.'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
		  ->setRequired(true)
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

		$fields['motherfirstname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Όνομα μητέρας'))
          ->setDescription(t('Δώσε το όνομα της μητέρας.'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
		  ->setRequired(true)
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

	    $fields['mothersurname'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Επώνυμο μητέρας'))
          ->setDescription(t('Δώσε το επώνυμο της μητέρας.'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
		  ->setRequired(true)
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

	   $fields['studentamka'] = BaseFieldDefinition::create('string')
          ->setLabel(t('ΑΜΚΑ μαθητή'))
          ->setDescription(t('Δώσε το ΑΜΚΑ μαθητή.'))
          ->setSettings(array(
            'max_length' => 20,
            'text_processing' => 0,
          ))
          ->setRequired(false)
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

	   $fields['regionaddress'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Διεύθνση κηδεμόνα'))
          ->setDescription(t('Δώσε τη διεύθυνση κηδεμόνα.'))
          ->setSettings(array(
            'max_length' => 100,
            'text_processing' => 0,
          ))
          ->setRequired(true)
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

	  $fields['regiontk'] = BaseFieldDefinition::create('string')
          ->setLabel(t('ΤΚ περιοχής'))
          ->setDescription(t('Δώσε τον ΤΚ της διεύθυνσης κατοικίας.'))
          ->setSettings(array(
            'max_length' => 10,
            'text_processing' => 0,
          ))
          ->setRequired(true)
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

	  $fields['regionarea'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Πόλη-Κοινότητα'))
          ->setDescription(t('Δώσε την πόλη ή κοινότητα που διαμένεις.'))
          ->setSettings(array(
            'max_length' => 100,
            'text_processing' => 0,
          ))
          ->setRequired(true)
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

	  $fields['certificatetype'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Τύπος απολυτηρίου'))
          ->setDescription(t('Δώσε τον τύπο απολυτηρίου, πχ Απολυτήριο Γυμνασίου'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
          ->setRequired(true)
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

	  $fields['lastam'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Αριθμός Μητρώου στο τελευταίο σχολείο φοίτησης'))
          ->setDescription(t('Αριθμός Μητρώου στο τελευταίο σχολείο φοίτησης'))
          ->setSettings(array(
            'max_length' => 10,
            'text_processing' => 0,
          ))
          ->setRequired(false)
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

      //entity_reference has to be changed to a reference to  new entity containing the whole schools
      $fields['graduate_school'] = BaseFieldDefinition::create('entity_reference')
          ->setLabel(t('Σχολείο αποφοίτησης'))
          ->setDescription(t('Δώσε το σχολείο αποφοίτησης.'))
          ->setSetting('target_type', 'eepal_school')
          ->setSetting('handler', 'default')
          //   ->setTranslatable(TRUE)
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

    $fields['apolytirio_id'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Αριθμός απολυτηρίου'))
            ->setDescription(t('Δώσε τον αριθμό απολυτηρίου'))
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

      $fields['apolytirio_date'] = BaseFieldDefinition::create('datetime')
            ->setLabel(t('Ημερομηνία κτήσης απολυτηρίου'))
            ->setDescription(t('Δώσε την ημερομηνία κτήσης απολυτηρίου.'))
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

      $fields['currentclass'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Τάξη παρακολούθησης'))
            ->setDescription(t('Δώσε την τρέχουσα τάξη παρακολούθησης'))
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

    $fields['currentepal'] = BaseFieldDefinition::create('entity_reference')
            ->setLabel(t('ΕΠΑΛ παρακολούθησης'))
            ->setDescription(t('Δώσε το τρέχον ΕΠΑΛ παρακολούθησης.'))
            ->setSetting('target_type', 'eepal_school')
            ->setSetting('handler', 'default')
         //   ->setTranslatable(TRUE)
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

	  $fields['currentsector'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Τομέας παρακολούθησης'))
          ->setDescription(t('Δώσε τον τομέα παρακολούθησης.'))
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

     $fields['currentcourse'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Ειδικότητα παρακολούθησης'))
            ->setDescription(t('Δώσε την ειδικότητα παρακολούθησης.'))
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

    $fields['relationtostudent'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Σχέση αιτούντα με μαθητή'))
          ->setDescription(t('Δώσε τη σχέση αιτούντα με μαθητή, πχ  Γονέας - Κηδεμόνας - Μαθητής'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
          ->setRequired(true)
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

	$fields['telnum'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Τηλέφωνο επικοινωνίας'))
          ->setDescription(t('Δώσε το τηλέφωνο επικοινωνίας'))
          ->setSettings(array(
            'max_length' => 50,
            'text_processing' => 0,
          ))
          ->setRequired(true)
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

    $fields['points'] = BaseFieldDefinition::create('float')
        ->setLabel(t('Μόρια'))
        ->setDescription(t('Μόρια.'))
        ->setSettings(array(
          'text_processing' => 0,
        ))
        ->setDisplayOptions('view', array(
          'label' => 'above',
          'type' => 'float',
          'weight' => -4,
        ))
        ->setDisplayOptions('form', array(
          'type' => 'float',
          'weight' => -4,
        ))
        ->setDisplayConfigurable('form', TRUE)
        ->setDisplayConfigurable('view', TRUE);

    $fields['agreement'] = BaseFieldDefinition::create('boolean')
        ->setLabel(t('Συμφωνία όρων συστήματος'))
        ->setDescription(t('Συμφωνία όρων συστήματος.'))
        ->setSettings(array(
          'text_processing' => 0,
        ))
        ->setRequired(true)
        ->setDisplayOptions('view', array(
          'label' => 'above',
          'type' => 'boolean',
          'weight' => -4,
        ))
        ->setDisplayOptions('form', array(
          'type' => 'boolean',
          'weight' => -4,
        ))
        ->setDisplayConfigurable('form', TRUE)
        ->setDisplayConfigurable('view', TRUE);

        $fields['guardian_name'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Όνομα κηδεμόνα'))
            ->setDescription(t('Δώσε το όνομα κηδεμόνα.'))
            ->setSettings(array(
              'max_length' => 50,
              'text_processing' => 0,
            ))
      	  ->setRequired(true)
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

            $fields['guardian_surname'] = BaseFieldDefinition::create('string')
                ->setLabel(t('Επώνυμο κηδεμόνα'))
                ->setDescription(t('Δώσε το επώνυμο κηδεμόνα.'))
                ->setSettings(array(
                  'max_length' => 50,
                  'text_processing' => 0,
                ))
              ->setRequired(true)
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

                $fields['guardian_fathername'] = BaseFieldDefinition::create('string')
                    ->setLabel(t('Όνομα πατέρα κηδεμόνα'))
                    ->setDescription(t('Δώσε το όνομα πατέρα του κηδεμόνα.'))
                    ->setSettings(array(
                      'max_length' => 50,
                      'text_processing' => 0,
                    ))
                  ->setRequired(true)
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

                    $fields['guardian_mothername'] = BaseFieldDefinition::create('string')
                        ->setLabel(t('Όνομα μητέρας κηδεμόνα'))
                        ->setDescription(t('Δώσε το όνομα μητέρας του κηδεμόνα.'))
                        ->setSettings(array(
                          'max_length' => 50,
                          'text_processing' => 0,
                        ))
                      ->setRequired(true)
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

    return $fields;
  }

}
