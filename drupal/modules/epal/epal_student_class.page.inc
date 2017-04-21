<?php

/**
 * @file
 * Contains epal_student_class.page.inc.
 *
 * Page callback for EPAL Student Class entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for EPAL Student Class templates.
 *
 * Default template: epal_student_class.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_student_class(array &$variables) {
  // Fetch EpalStudentClass Entity Object.
  $epal_student_class = $variables['elements']['#epal_student_class'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
