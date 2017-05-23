<?php

/**
 * @file
 * Contains epal_config.page.inc.
 *
 * Page callback for Epal config entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Epal config templates.
 *
 * Default template: epal_config.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_epal_config(array &$variables) {
  // Fetch EpalConfig Entity Object.
  $epal_config = $variables['elements']['#epal_config'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
