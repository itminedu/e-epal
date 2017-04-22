<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Epal student sector field entities.
 *
 * @ingroup epal
 */
class EpalStudentSectorFieldListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('ID');
    $header['name'] = $this->t('Όνομα');
	$header['student_id'] = $this->t('ID Μαθητή');
    $header['sectorfield_id'] = $this->t('ID Τομέα');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\epal\Entity\EpalStudentSectorField */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.epal_student_sector_field.edit_form', array(
          'epal_student_sector_field' => $entity->id(),
        )
      )
    );
	
	 $row['student_id'] = $this->l(
      $entity->getStudent_id(),
      new Url(
        'entity.epal_student_course_field.edit_form', array(
          'epal_student_course_field' => $entity->id(),
        )
      )
    );
    $row['sectorfield_id'] = $this->l(
      $entity->getSectorField_id(),
      new Url(
        'entity.epal_student_sector_field.edit_form', array(
          'epal_student_sector_field' => $entity->id(),
        )
      )
    );
	
    return $row + parent::buildRow($entity);
  }

}
