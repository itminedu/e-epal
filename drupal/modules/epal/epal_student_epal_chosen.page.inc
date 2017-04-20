<?php

/**
 * @file
 * Contains epal_student_epal_chosen.page.inc.
 *
 * Page callback for Epal student epal chosen entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Epal student epal chosen templates.
 *
 * Default template: epal_student_epal_chosen.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_student_epal_chosen(array &$variables) {
  // Fetch EpalStudentEpalChosen Entity Object.
  $epal_student_epal_chosen = $variables['elements']['#epal_student_epal_chosen'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
