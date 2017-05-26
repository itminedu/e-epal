<?php

/**
 * @file
 * Contains eepal_admin_area.page.inc.
 *
 * Page callback for Eepal admin area entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Eepal admin area templates.
 *
 * Default template: eepal_admin_area.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_admin_area(array &$variables) {
  // Fetch EepalAdminArea Entity Object.
  $eepal_admin_area = $variables['elements']['#eepal_admin_area'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
