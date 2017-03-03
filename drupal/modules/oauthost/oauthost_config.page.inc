<?php

/**
 * @file
 * Contains oauthost_config.page.inc.
 *
 * Page callback for OAuthOST Config entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for OAuthOST Config templates.
 *
 * Default template: oauthost_config.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_oauthost_config(array &$variables) {
  // Fetch OAuthOSTConfig Entity Object.
  $oauthost_config = $variables['elements']['#oauthost_config'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
