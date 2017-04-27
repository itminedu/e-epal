<?php

/**
 * @file
 * Contains eepal_specialties_in_epal.page.inc.
 *
 * Page callback for Eepal specialties in epal entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Eepal specialties in epal templates.
 *
 * Default template: eepal_specialties_in_epal.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_specialties_in_epal(array &$variables) {
  // Fetch EepalSpecialtiesInEpal Entity Object.
  $eepal_specialties_in_epal = $variables['elements']['#eepal_specialties_in_epal'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
