<?php

/**
 * @file
 * Contains casost_config.page.inc.
 *
 * Page callback for CASOST Config entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for CASOST Config templates.
 *
 * Default template: casost_config.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_casost_config(array &$variables) {
  // Fetch CASOSTConfig Entity Object.
  $casost_config = $variables['elements']['#casost_config'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
