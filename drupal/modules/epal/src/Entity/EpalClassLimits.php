<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Epal class limits entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_class_limits",
 *   label = @Translation("Epal class limits"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalClassLimitsListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalClassLimitsViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalClassLimitsForm",
 *       "add" = "Drupal\epal\Form\EpalClassLimitsForm",
 *       "edit" = "Drupal\epal\Form\EpalClassLimitsForm",
 *       "delete" = "Drupal\epal\Form\EpalClassLimitsDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalClassLimitsAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalClassLimitsHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_class_limits",
 *   admin_permission = "administer epal class limits entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/epal_class_limits/{epal_class_limits}",
 *     "add-form" = "/admin/structure/epal_class_limits/add",
 *     "edit-form" = "/admin/structure/epal_class_limits/{epal_class_limits}/edit",
 *     "delete-form" = "/admin/structure/epal_class_limits/{epal_class_limits}/delete",
 *     "collection" = "/admin/structure/epal_class_limits",
 *   },
 *   field_ui_base_route = "epal_class_limits.settings"
 * )
 */
class EpalClassLimits extends ContentEntityBase implements EpalClassLimitsInterface {

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
      ->setDescription(t('The user ID of author of the Epal class limits entity.'))
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
      ->setLabel(t('Ονομασία τύπου τμήματος'))
      ->setDescription(t('Ονομασία τύπου τμήματος.'))
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

  $fields['category'] = BaseFieldDefinition::create('string')
          ->setLabel(t('Κατηγορία σύμφωνα με την περιοχή μετάθεσης'))
          ->setDescription(t('Κατηγορία σύμφωνα με την περιοχή μετάθεσης.'))
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

	$fields['limit_down'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Κατώτατο όριο μαθητών'))
          ->setDescription(t('Κατώτατο όριο μαθητών.'))
          ->setSettings(array(
            'max_length' => 2,
            'text_processing' => 0,
          ))
          //->setDefaultValue(25)
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

	$fields['limit_up'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Ανώτατο όριο μαθητών'))
          ->setDescription(t('Ανώτατο όριο μαθητών.'))
          ->setSettings(array(
            'max_length' => 2,
            'text_processing' => 0,
          ))
          //->setDefaultValue(30)
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
      ->setDescription(t('A boolean indicating whether the Epal class limits is published.'))
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
