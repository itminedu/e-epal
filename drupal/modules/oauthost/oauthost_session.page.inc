<?php

/**
 * @file
 * Contains oauthost_session.page.inc.
 *
 * Page callback for OAuthOST Session entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for OAuthOST Session templates.
 *
 * Default template: oauthost_session.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_oauthost_session(array &$variables) {
  // Fetch OAuthOSTSession Entity Object.
  $oauthost_session = $variables['elements']['#oauthost_session'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
