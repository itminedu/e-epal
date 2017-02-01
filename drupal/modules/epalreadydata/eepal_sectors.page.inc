<?php

/**
 * @file
 * Contains eepal_sectors.page.inc.
 *
 * Page callback for Eepal sectors entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Eepal sectors templates.
 *
 * Default template: eepal_sectors.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_sectors(array &$variables) {
  // Fetch EepalSectors Entity Object.
  $eepal_sectors = $variables['elements']['#eepal_sectors'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
