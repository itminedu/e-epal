<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\epal\EpalConfigInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Epal config entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_config",
 *   label = @Translation("Epal config"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalConfigListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalConfigViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalConfigForm",
 *       "add" = "Drupal\epal\Form\EpalConfigForm",
 *       "edit" = "Drupal\epal\Form\EpalConfigForm",
 *       "delete" = "Drupal\epal\Form\EpalConfigDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalConfigAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalConfigHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_config",
 *   admin_permission = "administer epal config entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/epal_config/{epal_config}",
 *     "add-form" = "/admin/structure/epal_config/add",
 *     "edit-form" = "/admin/structure/epal_config/{epal_config}/edit",
 *     "delete-form" = "/admin/structure/epal_config/{epal_config}/delete",
 *     "collection" = "/admin/structure/epal_config",
 *   },
 *   field_ui_base_route = "epal_config.settings"
 * )
 */
class EpalConfig extends ContentEntityBase implements EpalConfigInterface {
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
    $this->set('status', $published ? NODE_PUBLISHED : NODE_NOT_PUBLISHED);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields['id'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('ID'))
      ->setDescription(t('The ID of the Epal config entity.'))
      ->setReadOnly(TRUE);
    $fields['uuid'] = BaseFieldDefinition::create('uuid')
      ->setLabel(t('UUID'))
      ->setDescription(t('The UUID of the Epal config entity.'))
      ->setReadOnly(TRUE);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the Epal config entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setDefaultValueCallback('Drupal\node\Entity\Node::getCurrentUserId')
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
      ->setDescription(t('The name of the Epal config entity.'))
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

      $fields['lock_school_capacity'] = BaseFieldDefinition::create('boolean')
          ->setLabel(t('Lock School Capacity'))
          ->setDescription(t('Lock School Capacity.'))
          ->setSettings(array(
            'text_processing' => 0,
          ))
          ->setRequired(TRUE)
          ->setDefaultValue(FALSE)
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

      $fields['lock_school_students_view'] = BaseFieldDefinition::create('boolean')
          ->setLabel(t('Lock School Students View'))
          ->setDescription(t('Lock School Students View.'))
          ->setSettings(array(
            'text_processing' => 0,
          ))
          ->setRequired(TRUE)
          ->setDefaultValue(FALSE)
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

      $fields['lock_application'] = BaseFieldDefinition::create('boolean')
          ->setLabel(t('Lock Application'))
          ->setDescription(t('Lock Application.'))
          ->setSettings(array(
            'text_processing' => 0,
          ))
          ->setRequired(TRUE)
          ->setDefaultValue(FALSE)
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

    $fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the Epal config is published.'))
      ->setDefaultValue(TRUE);

    $fields['langcode'] = BaseFieldDefinition::create('language')
      ->setLabel(t('Language code'))
      ->setDescription(t('The language code for the Epal config entity.'))
      ->setDisplayOptions('form', array(
        'type' => 'language_select',
        'weight' => 10,
      ))
      ->setDisplayConfigurable('form', TRUE);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    return $fields;
  }

}
