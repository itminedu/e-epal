<?php

namespace Drupal\oauthost\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the OAuthOST Config entity.
 *
 * @ingroup oauthost
 *
 * @ContentEntityType(
 *   id = "oauthost_config",
 *   label = @Translation("OAuthOST Config"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\oauthost\OAuthOSTConfigListBuilder",
 *     "views_data" = "Drupal\oauthost\Entity\OAuthOSTConfigViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\oauthost\Form\OAuthOSTConfigForm",
 *       "add" = "Drupal\oauthost\Form\OAuthOSTConfigForm",
 *       "edit" = "Drupal\oauthost\Form\OAuthOSTConfigForm",
 *       "delete" = "Drupal\oauthost\Form\OAuthOSTConfigDeleteForm",
 *     },
 *     "access" = "Drupal\oauthost\OAuthOSTConfigAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\oauthost\OAuthOSTConfigHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "oauthost_config",
 *   admin_permission = "administer oauthost config entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/oauthost_config/{oauthost_config}",
 *     "add-form" = "/admin/structure/oauthost_config/add",
 *     "edit-form" = "/admin/structure/oauthost_config/{oauthost_config}/edit",
 *     "delete-form" = "/admin/structure/oauthost_config/{oauthost_config}/delete",
 *     "collection" = "/admin/structure/oauthost_config",
 *   },
 *   field_ui_base_route = "oauthost_config.settings"
 * )
 */
class OAuthOSTConfig extends ContentEntityBase implements OAuthOSTConfigInterface
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
      ->setDescription(t('The user ID of author of the OAuthOST Config entity.'))
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
      ->setDescription(t('The name of the OAuthOST Config entity.'))
      ->setSettings(array(
        'max_length' => 50,
        'text_processing' => 0,
      ))
      ->setDefaultValue('oauthost_taxisnet_config')
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

      $fields['consumer_key'] = BaseFieldDefinition::create('string')
        ->setLabel(t('Consumer Key'))
        ->setDescription(t('The Consumer Key'))
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

      $fields['consumer_secret'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Consumer Secret'))
            ->setDescription(t('The Consumer Secret'))
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

      $fields['request_token_url'] = BaseFieldDefinition::create('string')
            ->setLabel(t('Request Token Url'))
            ->setDescription(t('The Request Token Url'))
            ->setSettings(array(
              'max_length' => 500,
              'text_processing' => 0,
            ))
            ->setDefaultValue('https://www1.gsis.gr/gsisapps/gsisdemo/oauth/request_token')
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

      $fields['user_authorization_url'] = BaseFieldDefinition::create('string')
             ->setLabel(t('User Authorization Url'))
             ->setDescription(t('The User Authorization Url'))
             ->setSettings(array(
               'max_length' => 500,
               'text_processing' => 0,
             ))
             ->setDefaultValue('https://www1.gsis.gr/gsisapps/gsisdemo/oauth/confirm_access')
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

       $fields['access_token_url'] = BaseFieldDefinition::create('string')
                    ->setLabel(t('Access Token Url'))
                    ->setDescription(t('The Access Token Url'))
                    ->setSettings(array(
                      'max_length' => 500,
                      'text_processing' => 0,
                    ))
                    ->setDefaultValue('https://www1.gsis.gr/gsisapps/gsisdemo/oauth/access_token')
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

                    $fields['signature_method'] = BaseFieldDefinition::create('string')
                                 ->setLabel(t('Signature Method'))
                                 ->setDescription(t('The Signature Method'))
                                 ->setSettings(array(
                                   'max_length' => 100,
                                   'text_processing' => 0,
                                 ))
                                 ->setDefaultValue('PLAINTEXT')
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

                                 $fields['api_url'] = BaseFieldDefinition::create('string')
                                              ->setLabel(t('API Url'))
                                              ->setDescription(t('The API Url'))
                                              ->setSettings(array(
                                                'max_length' => 500,
                                                'text_processing' => 0,
                                              ))
                                              ->setDefaultValue('https://www1.gsis.gr/gsisapps/gsisdemo/gsisdemoservice/resource_one')
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

                                              $fields['callback_url'] = BaseFieldDefinition::create('string')
                                                           ->setLabel(t('Callback Url'))
                                                           ->setDescription(t('The Callback Url'))
                                                           ->setSettings(array(
                                                             'max_length' => 500,
                                                             'text_processing' => 0,
                                                           ))
                                                           ->setDefaultValue('http://eepal.dev/drupal/oauth/cb')
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

                                                           $fields['logout_url'] = BaseFieldDefinition::create('string')
                                                                        ->setLabel(t('Logout_Url'))
                                                                        ->setDescription(t('The Logout_Url'))
                                                                        ->setSettings(array(
                                                                          'max_length' => 500,
                                                                          'text_processing' => 0,
                                                                        ))
                                                                        ->setDefaultValue('https://www1.gsis.gr/gsisapps/gsisdemo/logout.htm?logout_token=')
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

                                                                        $fields['redirect_url'] = BaseFieldDefinition::create('string')
                                                                                     ->setLabel(t('Redirect_Url'))
                                                                                     ->setDescription(t('The Redirect_Url'))
                                                                                     ->setSettings(array(
                                                                                       'max_length' => 500,
                                                                                       'text_processing' => 0,
                                                                                     ))
                                                                                     ->setDefaultValue('/dist/#/?auth_token=')
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
