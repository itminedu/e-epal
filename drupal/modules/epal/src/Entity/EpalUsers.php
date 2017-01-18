<?php

namespace Drupal\epal\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Epal users entity.
 *
 * @ingroup epal
 *
 * @ContentEntityType(
 *   id = "epal_users",
 *   label = @Translation("Epal users"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\epal\EpalUsersListBuilder",
 *     "views_data" = "Drupal\epal\Entity\EpalUsersViewsData",
 *     "translation" = "Drupal\epal\EpalUsersTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\epal\Form\EpalUsersForm",
 *       "add" = "Drupal\epal\Form\EpalUsersForm",
 *       "edit" = "Drupal\epal\Form\EpalUsersForm",
 *       "delete" = "Drupal\epal\Form\EpalUsersDeleteForm",
 *     },
 *     "access" = "Drupal\epal\EpalUsersAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\epal\EpalUsersHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "epal_users",
 *   data_table = "epal_users_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer epal users entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/epal_users/{epal_users}",
 *     "add-form" = "/admin/structure/epal_users/add",
 *     "edit-form" = "/admin/structure/epal_users/{epal_users}/edit",
 *     "delete-form" = "/admin/structure/epal_users/{epal_users}/delete",
 *     "collection" = "/admin/structure/epal_users",
 *   },
 *   field_ui_base_route = "epal_users.settings"
 * )
 */
class EpalUsers extends ContentEntityBase implements EpalUsersInterface {

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
      ->setDescription(t('The user ID of author of the Epal users entity.'))
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
      ->setLabel(t('User Id από Drupal Users '))
      ->setDescription(t('Δώσε το id του user από τον Drupal Users πίνακα'))
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

	$fields['userId'] = BaseFieldDefinition::create('string')
      ->setLabel(t('User id χρήστη από taxis'))
      ->setDescription(t('Δώσε το user id του χρήστη από taxis.'))
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
	
	$fields['userTaxId'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Tax id χρήστη'))
      ->setDescription(t('Δώσε το tax id / ΑΦΜ του χρήστη.'))
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
	  
	$fields['userFirstname'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Όνομα χρήστη'))
      ->setDescription(t('Δώσε το μικρό όνομα του χρήστη.'))
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
	  
    $fields['userSurname'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Επώνυμο χρήστη'))
      ->setDescription(t('Δώσε το επώνυμο του χρήστη.'))
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
	
	$fields['userFatherName'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Όνομα πατέρα χρήστη'))
      ->setDescription(t('Δώσε το όνομα του πατέρα του χρήστη.'))
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
	
	$fields['userMothername'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Όνομα μητέρας χρήστη'))
      ->setDescription(t('Δώσε το όνομα της μητέρας χρήστη.'))
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
	  
	
	  
	$fields['userAddress'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Διεύθυνση κατοικίας'))
      ->setDescription(t('Δώσε τη διεύθυνση κατοικίας.'))
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
	  
	$fields['userAddressTK'] = BaseFieldDefinition::create('string')
      ->setLabel(t('ΤΚ'))
      ->setDescription(t('Δώσε τον ΤΚ κατοικίας.'))
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
	  
	$fields['userAddressArea'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Πόλη/Περιοχή διεύθυνσης κατοικίας'))
      ->setDescription(t('Δώσε την πόλη/περιοχή διεύθυνσης.'))
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
	  
	$fields['accessToken'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Access-Token από taxis'))
      ->setDescription(t('Access-Token από taxis.'))
      ->setSettings(array(
        'max_length' => 300,
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
	  
	$fields['offToken'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Off-Token'))
      ->setDescription(t('Off-Token που δημιουργείται από εμάς.'))
      ->setSettings(array(
        'max_length' => 300,
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
	
	$fields['timeLogin'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('timeLogin'))
      ->setDescription(t('timeLogin.'))
      ;
	  
	$fields['timeRegistration'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('timeRegistration'))
      ->setDescription(t('timeRegistration.'))
      ;
	
	$fields['timeTokenInvalid'] = BaseFieldDefinition::create('integer')
          ->setLabel(t('Χρόνος σε min'))
          ->setDescription(t('Χρόνος σε min μετά τον οποίο γίνεται το token ανενεργό.'))
          ->setSettings(array(
            //'max_length' => 2,
            'text_processing' => 0,
          ))
          ->setDisplayOptions('view', array(
            'label' => 'above',
            'type' => 'integer',
          ))
          ->setDisplayOptions('form', array(
            'type' => 'integer',
          ))
          ->setDisplayConfigurable('form', TRUE)
          ->setDisplayConfigurable('view', TRUE);
		  
	$fields['userIP'] = BaseFieldDefinition::create('string')
      ->setLabel(t('userIP'))
      ->setDescription(t('userIP.'))
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
      ->setDescription(t('A boolean indicating whether the Epal users is published.'))
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
