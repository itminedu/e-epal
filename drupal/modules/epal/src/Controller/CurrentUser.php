<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;




class CurrentUser extends ControllerBase {

    protected $entityTypeManager;
    
    public function __construct(EntityTypeManagerInterface $entityTypeManager )
    {
        $this->entityTypeManager1 = $entityTypeManager;
       
    }


public static function create(ContainerInterface $container) {
    return new static(
        $container->get('entity_type.manager'),
        $container->get('entity.query'),
        $container->get('entity_field.manager')
    );
}

 
  public function content(Request $request) {
    
      $authToken = $request->headers->get('PHP_AUTH_USER');

  	 
			$epalUsers = $this->entityTypeManager1->getStorage('epal_users')->loadByProperties(array('authtoken' =>  $authToken)); 
			$epalUser = reset($epalUsers);
			if ($epalUser)
			     {			
                $currentUserName = $epalUser->name->value;

           			$response = new JsonResponse(['name' =>$currentUserName]);
            		}
            		else { 
            				$response = new Response();
                    $response->setContent('forbidden');
                    $response->setStatusCode(Response::HTTP_FORBIDDEN);
                    $response->headers->set('Content-Type', 'application/json');
            		}

		    return $response;

	}
}
