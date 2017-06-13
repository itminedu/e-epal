<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the EPAL Student Class entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_student_class",
 *   label = @Translation("EPAL Student Class"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalStudentClassListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalStudentClassViewsData",
 *
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalStudentClassForm",
 *       "add" = "Drupal\epal\Form\EpalStudentClassForm",
 *       "edit" = "Drupal\epal\Form\EpalStudentClassForm",
 *       "delete" = "Drupal\epal\Form\EpalStudentClassDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalStudentClassAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalStudentClassHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_student_class",
 *   admin_permission = "administer epal student class entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *     "student_id" = "student_id",
 *     "epal_id" = "epal_id",
 *   },
 *   links = {
 *     "canonical" = "/admin/epal/epal_student_class/{epal_student_class}",
 *     "add-form" = "/admin/epal/epal_student_class/add",
 *     "edit-form" = "/admin/epal/epal_student_class/{epal_student_class}/edit",
 *     "delete-form" = "/admin/epal/epal_student_class/{epal_student_class}/delete",
 *     "collection" = "/admin/epal/epal_student_class",
 *   },
 *   field_ui_base_route = "epal_student_class.settings"
 * )
 */
class EpalStudentClass extends ContentEntityBase implements EpalStudentClassInterface {

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
  public function getMinno() {
    return $this->get('minno')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setMinno($minno) {
    $this->set('minno', $minno);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getMaxno() {
    return $this->get('maxno')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setMaxno($maxno) {
    $this->set('maxno', $maxno);
    return $this;
  }



  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the EPAL Student Class entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
     // ->setTranslatable(TRUE)
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
      ->setLabel(t('Ονομασία'))
      ->setDescription(t('Ονομασία.'))
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
      ->setLabel(t('Id Μαθητή'))
      ->setDescription(t('Δώσε το id μαθητή.'))
      ->setSetting('target_type', 'epal_student')
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

	 $fields['epal_id'] = BaseFieldDefinition::create('entity_reference')
            ->setLabel(t('Id ΕΠΑΛ'))
            ->setDescription(t('Δώσε το όνομα - id σχολείου που επιλέχτηκε ο μαθητής.'))
            ->setSetting('target_type', 'eepal_school')
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

      $fields['currentclass'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Τάξη παρακολούθησης'))
            ->setDescription(t('Τάξη παρακολούθησης'))
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

       $fields['currentepal'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Id ΕΠΑΛ που φοιτεί ήδη'))
          ->setDescription(t('Id ΕΠΑΛ που φοιτεί ήδη.'))
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

      $fields['specialization_id'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Id Τομέα ή Ειδικότητας'))
          ->setDescription(t('Id Τομέα ή Ειδικότητας.'))
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

       $fields['distribution_id'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Id Κατανομής'))
          ->setDescription(t('Id Κατανομής.'))
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

      $fields['finalized'] = BaseFieldDefinition::create('boolean')
        ->setLabel(t('Οριστικοποίηση κατανομής'))
        ->setDescription(t('Οριστικοποίηση κατανομής.'))
        ->setSettings(array(
          'text_processing' => 0,
        ))
        ->setDefaultValue(false)
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

    $fields['directorconfirm'] = BaseFieldDefinition::create('boolean')
          ->setLabel(t('Επιβεβαίωση Διευθυντή'))
          ->setDescription(t('Επιβεβαίωση Διευθυντή.'))
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

    $fields['second_period'] = BaseFieldDefinition::create('boolean')
       ->setLabel(t('Δεύτερη περίοδος αιτήσεων'))
       ->setDescription(t('Δεύτερη περίοδος αιτήσεων.'))
        ->setSettings(array(
          'text_processing' => 0,
        ))
        ->setRequired(false)
        ->setDefaultValue(false)
        ->setDisplayOptions('view', array(
          'label' => 'above',
          'type' => 'boolean',
          'weight' => -4,
        ))
        ->setDisplayOptions('form', array(
          'type' => 'boolean',
          'weight' => -4,
        ))
        ->setDisplayConfigurable('form', true)
        ->setDisplayConfigurable('view', true);

	$fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the EPAL Student Class is published.'))
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
