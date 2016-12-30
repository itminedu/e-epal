<?php

/**
 * @file
 * Contains eepal_prefecture.page.inc.
 *
 * Page callback for Eepal prefecture entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Eepal prefecture templates.
 *
 * Default template: eepal_prefecture.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_prefecture(array &$variables) {
  // Fetch EepalPrefecture Entity Object.
  $eepal_prefecture = $variables['elements']['#eepal_prefecture'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
