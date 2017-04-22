<?php

/**
 * @file
 * Contains casost_session.page.inc.
 *
 * Page callback for CASOST Session entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for CASOST Session templates.
 *
 * Default template: casost_session.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_casost_session(array &$variables) {
  // Fetch CASOSTSession Entity Object.
  $casost_session = $variables['elements']['#casost_session'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
