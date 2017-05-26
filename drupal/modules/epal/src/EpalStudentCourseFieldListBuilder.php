<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Routing\LinkGeneratorTrait;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Epal student course field entities.
 *
 * @ingroup epal
 */
class EpalStudentCourseFieldListBuilder extends EntityListBuilder {

  use LinkGeneratorTrait;

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('ID');
    $header['name'] = $this->t('Όνομα');
    $header['student_id'] = $this->t('ID Μαθητή');
    $header['coursefield_id'] = $this->t('ID Ειδικότητας');        
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\epal\Entity\EpalStudentCourseField */
    $row['id'] = $entity->id();
    $row['name'] = $this->l(
      $entity->label(),
      new Url(
        'entity.epal_student_course_field.edit_form', array(
          'epal_student_course_field' => $entity->id(),
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
    $row['coursefield_id'] = $this->l(
      $entity->getCourseField_id(),
      new Url(
        'entity.epal_student_course_field.edit_form', array(
          'epal_student_course_field' => $entity->id(),
        )
      )
    );

    return $row + parent::buildRow($entity);
  }

}
