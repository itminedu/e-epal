<?php

/**
 * @file
 * Contains epal_student_sector_field.page.inc.
 *
 * Page callback for Epal student sector field entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Epal student sector field templates.
 *
 * Default template: epal_student_sector_field.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_student_sector_field(array &$variables) {
  // Fetch EpalStudentSectorField Entity Object.
  $epal_student_sector_field = $variables['elements']['#epal_student_sector_field'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
