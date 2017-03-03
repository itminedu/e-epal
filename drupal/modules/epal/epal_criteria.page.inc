<?php

/**
 * @file
 * Contains epal_criteria.page.inc.
 *
 * Page callback for Epal criteria entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Epal criteria templates.
 *
 * Default template: epal_criteria.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_criteria(array &$variables) {
  // Fetch EpalCriteria Entity Object.
  $epal_criteria = $variables['elements']['#epal_criteria'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
