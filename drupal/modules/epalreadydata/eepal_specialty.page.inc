<?php

/**
 * @file
 * Contains eepal_specialty.page.inc.
 *
 * Page callback for Eepal specialty entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Eepal specialty templates.
 *
 * Default template: eepal_specialty.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_eepal_specialty(array &$variables) {
  // Fetch EepalSpecialty Entity Object.
  $eepal_specialty = $variables['elements']['#eepal_specialty'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
