<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Epal student epal chosen entities.
 *
 * @ingroup epal
 */
class EpalStudentEpalChosenListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('ID');
    $header['name'] = $this->t('Όνομα');
	$header['student_id'] = $this->t('Id Μαθητή');
	$header['epal_id'] = $this->t('ΕΠΑΛ');
	$header['choice_no'] = $this->t('Σειρά προτίμησης');
	 
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\epal\Entity\EpalStudentEpalChosen */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.epal_student_epal_chosen.edit_form', array(
          'epal_student_epal_chosen' => $entity->id(),
        )
      )
    );
	//$entity->get('name')->getString();
	$row['student_id'] = $entity->getStudent_id();
	$row['epal_id'] = $entity->getEpal_id();
	$row['choice_no'] = $entity->getChoice_no();
	
    return $row + parent::buildRow($entity);
  }

}
