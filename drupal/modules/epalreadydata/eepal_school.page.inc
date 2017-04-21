<?php

/**
 * @file
 * Contains eepal_school.page.inc.
 *
 * Page callback for Eepal school entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Eepal school templates.
 *
 * Default template: eepal_school.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_school(array &$variables) {
  // Fetch EepalSchool Entity Object.
  $eepal_school = $variables['elements']['#eepal_school'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
