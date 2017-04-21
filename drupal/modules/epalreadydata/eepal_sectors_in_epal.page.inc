<?php

/**
 * @file
 * Contains eepal_sectors_in_epal.page.inc.
 *
 * Page callback for Eepal sectors in epal entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Eepal sectors in epal templates.
 *
 * Default template: eepal_sectors_in_epal.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_sectors_in_epal(array &$variables) {
  // Fetch EepalSectorsInEpal Entity Object.
  $eepal_sectors_in_epal = $variables['elements']['#eepal_sectors_in_epal'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
