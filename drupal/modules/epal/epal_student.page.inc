<?php

/**
 * @file
 * Contains epal_student.page.inc.
 *
 * Page callback for EPAL Student entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for EPAL Student templates.
 *
 * Default template: epal_student.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_student(array &$variables) {
  // Fetch EpalStudent Entity Object.
  $epal_student = $variables['elements']['#epal_student'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
