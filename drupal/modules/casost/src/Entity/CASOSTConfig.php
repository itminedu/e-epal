<?php

namespace Drupal\casost\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the CASOST Config entity.
 *
 * @ingroup casost
 *
 * @ContentEntityType(
 *   id = "casost_config",
 *   label = @Translation("CASOST Config"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\casost\CASOSTConfigListBuilder",
 *     "views_data" = "Drupal\casost\Entity\CASOSTConfigViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\casost\Form\CASOSTConfigForm",
 *       "add" = "Drupal\casost\Form\CASOSTConfigForm",
 *       "edit" = "Drupal\casost\Form\CASOSTConfigForm",
 *       "delete" = "Drupal\casost\Form\CASOSTConfigDeleteForm",
 *     },
 *     "access" = "Drupal\casost\CASOSTConfigAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\casost\CASOSTConfigHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "casost_config",
 *   admin_permission = "administer casost config entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/casost_config/{casost_config}",
 *     "add-form" = "/admin/structure/casost_config/add",
 *     "edit-form" = "/admin/structure/casost_config/{casost_config}/edit",
 *     "delete-form" = "/admin/structure/casost_config/{casost_config}/delete",
 *     "collection" = "/admin/structure/casost_config",
 *   },
 *   field_ui_base_route = "casost_config.settings"
 * )
 */
class CASOSTConfig extends ContentEntityBase implements CASOSTConfigInterface
{
    use EntityChangedTrait;

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values)
  {
      parent::preCreate($storage_controller, $values);
      $values += array(
      'user_id' => \Drupal::currentUser()->id(),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getName()
  {
      return $this->get('name')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setName($name)
  {
      $this->set('name', $name);

      return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime()
  {
      return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp)
  {
      $this->set('created', $timestamp);

      return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner()
  {
      return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId()
  {
      return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid)
  {
      $this->set('user_id', $uid);

      return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account)
  {
      $this->set('user_id', $account->id());

      return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function isPublished()
  {
      return (bool) $this->getEntityKey('status');
  }

  /**
   * {@inheritdoc}
   */
  public function setPublished($published)
  {
      $this->set('status', $published ? true : false);

      return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type)
  {
      $fields = parent::baseFieldDefinitions($entity_type);

      $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the CASOST Config entity.'))
      ->setRevisionable(true)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setTranslatable(true)
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
      ->setDisplayConfigurable('form', true)
      ->setDisplayConfigurable('view', true);

      $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the CASOST Config entity.'))
      ->setSettings(array(
        'max_length' => 50,
        'text_processing' => 0,
      ))
      ->setDefaultValue('casost_sch_sso_config')
      ->setDisplayOptions('view', array(
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'string_textfield',
        'weight' => -4,
      ))
      ->setDisplayConfigurable('form', true)
      ->setDisplayConfigurable('view', true);

  $fields['serverversion'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Server Version'))
            ->setDescription(t('The Server Version'))
            ->setSettings(array(
              'max_length' => 200,
              'text_processing' => 0,
            ))
            ->setDefaultValue('S1')
            ->setDisplayOptions('view', array(
              'label' => 'above',
              'type' => 'string',
              'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
              'type' => 'string_textfield',
              'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

      $fields['serverhostname'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Server Hostname'))
            ->setDescription(t('The Server Hostname'))
            ->setSettings(array(
              'max_length' => 200,
              'text_processing' => 0,
            ))
            ->setDefaultValue('sso-test.sch.gr')
            ->setDisplayOptions('view', array(
              'label' => 'above',
              'type' => 'string',
              'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
              'type' => 'string_textfield',
              'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

      $fields['serverport'] = BaseFieldDefinition::create('integer')
             ->setLabel(t('User Authorization Url'))
             ->setDescription(t('The User Authorization Url'))
             ->setSettings(array(
               'max_length' => 10,
               'text_processing' => 0,
             ))
             ->setDefaultValue('443')
             ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'string',
               'weight' => -4,
             ))
             ->setDisplayOptions('form', array(
               'type' => 'string_textfield',
               'weight' => -4,
             ))
             ->setDisplayConfigurable('form', true)
             ->setDisplayConfigurable('view', true);

       $fields['serveruri'] = BaseFieldDefinition::create('string')
                    ->setLabel(t('Server Uri'))
                    ->setDescription(t('The Server Uri'))
                    ->setSettings(array(
                      'max_length' => 200,
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
                    ->setDisplayConfigurable('form', true)
                    ->setDisplayConfigurable('view', true);

        $fields['changesessionid'] = BaseFieldDefinition::create('boolean')
            ->setLabel(t('Change Session Id'))
            ->setDescription(t('A boolean indicating whether we change session id.'))
            ->setDefaultValue(false);

        $fields['casservercacert'] = BaseFieldDefinition::create('string')
            ->setLabel(t('CAS Server CaCert'))
            ->setDescription(t('The Cas Server CaCert'))
            ->setSettings(array(
              'max_length' => 1000,
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
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

        $fields['casservercnvalidate'] = BaseFieldDefinition::create('string')
            ->setLabel(t('CAS Server Cn Validate'))
            ->setDescription(t('The CAS Server Cn Validate'))
            ->setSettings(array(
              'max_length' => 1000,
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
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

        $fields['nocasservervalidation'] = BaseFieldDefinition::create('boolean')
            ->setLabel(t('no CAS Server Validation'))
            ->setDescription(t('A boolean indicating whether we do CAS server validation.'))
            ->setDefaultValue(true);

        $fields['proxy'] = BaseFieldDefinition::create('boolean')
            ->setLabel(t('proxy'))
            ->setDescription(t('A boolean indicating whether we proxy.'))
            ->setDefaultValue(false);

        $fields['handlelogoutrequests'] = BaseFieldDefinition::create('boolean')
            ->setLabel(t('Handle Logout Requests'))
            ->setDescription(t('A boolean indicating whether logout requests are handled.'))
            ->setDefaultValue(true);

        $fields['caslang'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Language'))
            ->setDescription(t('Language'))
            ->setSettings(array(
              'max_length' => 100,
              'text_processing' => 0,
             ))
            ->setDefaultValue('CAS_Languages_Greek')
            ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'string',
               'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
               'type' => 'string_textfield',
               'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

        $fields['allowed1'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Allowed attribute 1'))
            ->setDescription(t('Allowed Attribute 1'))
            ->setSettings(array(
              'max_length' => 200,
              'text_processing' => 0,
             ))
            ->setDefaultValue('physicaldeliveryofficename')
            ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'string',
               'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
               'type' => 'string_textfield',
               'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

        $fields['allowed1value'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Allowed attribute 1 Value'))
            ->setDescription(t('Allowed Attribute 1 Value'))
            ->setSettings(array(
              'max_length' => 200,
              'text_processing' => 0,
             ))
            ->setDefaultValue('/^ΕΠΙΣΗΜΟΣ ΛΟΓΑΡΙΑΣΜΟΣ$/i')
            ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'string',
               'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
               'type' => 'string_textfield',
               'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

        $fields['allowed2'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Allowed attribute 2'))
            ->setDescription(t('Allowed Attribute 2'))
            ->setSettings(array(
              'max_length' => 200,
              'text_processing' => 0,
             ))
            ->setDefaultValue('umdobject')
            ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'string',
               'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
               'type' => 'string_textfield',
               'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);

        $fields['allowed2value'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Allowed attribute 2 Value'))
            ->setDescription(t('Allowed Attribute 2 Value'))
            ->setSettings(array(
              'max_length' => 200,
              'text_processing' => 0,
             ))
            ->setDefaultValue('/^account$/i')
            ->setDisplayOptions('view', array(
               'label' => 'above',
               'type' => 'string',
               'weight' => -4,
            ))
            ->setDisplayOptions('form', array(
               'type' => 'string_textfield',
               'weight' => -4,
            ))
            ->setDisplayConfigurable('form', true)
            ->setDisplayConfigurable('view', true);


      $fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the OAuthOST Config is published.'))
      ->setDefaultValue(true);

      $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

      $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

      return $fields;
  }
}
