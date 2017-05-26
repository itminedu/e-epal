<?php

/**
 * @file
 * Contains epal_student_moria.page.inc.
 *
 * Page callback for Epal student moria entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Epal student moria templates.
 *
 * Default template: epal_student_moria.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_student_moria(array &$variables) {
  // Fetch EpalStudentMoria Entity Object.
  $epal_student_moria = $variables['elements']['#epal_student_moria'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
