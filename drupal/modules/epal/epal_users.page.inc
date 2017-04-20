<?php

/**
 * @file
 * Contains epal_users.page.inc.
 *
 * Page callback for Epal users entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Epal users templates.
 *
 * Default template: epal_users.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_users(array &$variables) {
  // Fetch EpalUsers Entity Object.
  $epal_users = $variables['elements']['#epal_users'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
