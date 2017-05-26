<?php

/**
 * @file
 * Contains eepal_region.page.inc.
 *
 * Page callback for Eepal region entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Eepal region templates.
 *
 * Default template: eepal_region.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_region(array &$variables) {
  // Fetch EepalRegion Entity Object.
  $eepal_region = $variables['elements']['#eepal_region'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
