<?php

/**
 * @file
 * Contains epal_class_limits.page.inc.
 *
 * Page callback for Epal class limits entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Epal class limits templates.
 *
 * Default template: epal_class_limits.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_class_limits(array &$variables) {
  // Fetch EpalClassLimits Entity Object.
  $epal_class_limits = $variables['elements']['#epal_class_limits'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
