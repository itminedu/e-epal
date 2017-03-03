<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Epal student moria entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_student_moria",
 *   label = @Translation("Epal student moria"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalStudentMoriaListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalStudentMoriaViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalStudentMoriaForm",
 *       "add" = "Drupal\epal\Form\EpalStudentMoriaForm",
 *       "edit" = "Drupal\epal\Form\EpalStudentMoriaForm",
 *       "delete" = "Drupal\epal\Form\EpalStudentMoriaDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalStudentMoriaAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalStudentMoriaHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_student_moria",
 *   admin_permission = "administer epal student moria entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/epal_student_moria/{epal_student_moria}",
 *     "add-form" = "/admin/structure/epal_student_moria/add",
 *     "edit-form" = "/admin/structure/epal_student_moria/{epal_student_moria}/edit",
 *     "delete-form" = "/admin/structure/epal_student_moria/{epal_student_moria}/delete",
 *     "collection" = "/admin/structure/epal_student_moria",
 *   },
 *   field_ui_base_route = "epal_student_moria.settings"
 * )
 */
class EpalStudentMoria extends ContentEntityBase implements EpalStudentMoriaInterface {

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
      ->setDescription(t('The user ID of author of the Epal student moria entity.'))
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
      ->setLabel(t('Ονομασία'))
      ->setDescription(t('Ονομασία εγγραφής - πχ record1.'))
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
			->setRequired(TRUE)
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
	  
	$fields['income'] = BaseFieldDefinition::create('float')
          ->setLabel(t('Εισόδημα'))
          ->setDescription(t('Δώσε το εισόδημα.'))
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
	
	$fields['criterio_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Id κριτηρίου'))
      ->setDescription(t('Δώσε το id κριτηρίου.'))
      ->setSetting('target_type', 'epal_criteria')
            ->setSetting('handler', 'default')
			->setRequired(TRUE)
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
	  
	$fields['moria'] = BaseFieldDefinition::create('float')
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

    $fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the Epal student moria is published.'))
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
