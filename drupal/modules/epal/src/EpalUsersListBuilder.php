<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Epal users entities.
 *
 * @ingroup epal
 */
class EpalUsersListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('ID');
	$header['name'] = $this->t('Όνομα');
	$header['surname'] = $this->t('Επώνυμο');
	$header['fathername'] = $this->t('Όνομα πατέρα');
	$header['mothername'] = $this->t('Όνομα μητέρας');
	
	//$header['drupaluser_id'] = $this->t('ID χρήστη Drupal');
	//$header['taxis_userid'] = $this->t('ID χρήστη από taxisnet');
	//$header['taxis_taxid'] = $this->t('TAXID χρήστη από taxisnet');
	//$header['address'] = $this->t('Διεύθυνση');
	//$header['addresstk'] = $this->t('ΤΚ');
	//$header['addressarea'] = $this->t('Περιοχή');
	//$header['accesstoken'] = $this->t('AccessToken');
	//$header['authtoken'] = $this->t('AuthToken');
	//$header['timelogin'] = $this->t('Time Login');
	//$header['timeregistration'] = $this->t('Time Registration');
	//$header['timetokeninvalid'] = $this->t('Time Token Invalid');
	//$header['userip'] = $this->t('User IP');
    
	return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\epal\Entity\EpalUsers */
	 $row['id'] = $entity->id();
	 $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.epal_users.edit_form', array(
          'epal_users' => $entity->id(),
        )
      )
    );
	$row['surname'] = $this->l(
	  $entity->getSurname(),
	  new Url(
        'entity.epal_users.edit_form', array(
          'epal_users' => $entity->id(),
        )
      )   
    );
	$row['fathername'] = $this->l(
	  $entity->getFathername(),
	  new Url(
        'entity.epal_users.edit_form', array(
          'epal_users' => $entity->id(),
        )
      )
    );
	$row['mothername'] = $this->l(
	  $entity->getMothername(),
	  new Url(
        'entity.epal_users.edit_form', array(
          'epal_users' => $entity->id(),
        )
      )
    );
	
    return $row + parent::buildRow($entity);
  }

}
