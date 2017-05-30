<?php
/**
 * @file
 * Contains \Drupal\query_example\Controller\QueryExampleController.
 */

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Database\Database;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;


class MinisterSettings extends ControllerBase {

	protected $entity_query;
  protected $entityTypeManager;
  protected $logger;
  protected $connection;

	public function __construct(
		EntityTypeManagerInterface $entityTypeManager,
		QueryFactory $entity_query,
		Connection $connection,

		LoggerChannelFactoryInterface $loggerChannel)
		{
			$this->entityTypeManager = $entityTypeManager;
			$this->entity_query = $entity_query;
			$connection = Database::getConnection();
			$this->connection = $connection;
			$this->logger = $loggerChannel->get('epal');
    }

	public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity_type.manager'),
          $container->get('entity.query'),
          $container->get('database'),
          $container->get('logger.factory')
      );
    }


	public function retrieveSettings(Request $request) {

		try {
			 if (!$request->isMethod('GET')) {
					return $this->respondWithStatus([
						 "message" => t("Method Not Allowed")
							], Response::HTTP_METHOD_NOT_ALLOWED);
			 }

			 //user validation
			 $authToken = $request->headers->get('PHP_AUTH_USER');
			 $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
			 $user = reset($users);
			 if (!$user) {
					 return $this->respondWithStatus([
									 'message' => t("User not found"),
							 ], Response::HTTP_FORBIDDEN);
			 }

			 //user role validation
			 $roles = $user->getRoles();
			 $validRole = false;
			 foreach ($roles as $role)
				 if ($role === "ministry") {
					 $validRole = true;
					 break;
				 }
			 if (!$validRole) {
					 return $this->respondWithStatus([
									 'message' => t("User Invalid Role"),
							 ], Response::HTTP_FORBIDDEN);
			 }

			 //minister settings retrieve
			 $config_storage = $this->entityTypeManager->getStorage('epal_config');
	 		 $epalConfigs = $config_storage->loadByProperties(array('name' => 'epal_config'));
	 		 $epalConfig = reset($epalConfigs);
	 		 if (!$epalConfig) {
	 				return $this->respondWithStatus([
	 								'message' => t("EpalConfig Enity not found"),
	 						], Response::HTTP_FORBIDDEN);
	 		 }
	 		 else {
	 				$capacityDisabled = $epalConfig->lock_school_capacity->getString();
	 				$directorViewDisabled = $epalConfig->lock_school_students_view->getString();
	 				$applicantsLoginDisabled = $epalConfig->lock_application->getString();
	 		 }
	 		 $config_storage->resetCache();


			return $this->respondWithStatus([
					//'message' => t("post successful"),
					'capacityDisabled' => $capacityDisabled,
					'directorViewDisabled' => $directorViewDisabled,
					'applicantsLoginDisabled' => $applicantsLoginDisabled,
			], Response::HTTP_OK);

		}	//end try

		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return $this->respondWithStatus([
						"message" => t("An unexpected problem occured during retrieveSettings Method ")
					], Response::HTTP_INTERNAL_SERVER_ERROR);
		}



}


public function storeSettings(Request $request, $capacityDisabled, $directorViewDisabled, $applicantsLoginDisabled ) {

	try {
		 if (!$request->isMethod('GET')) {
				return $this->respondWithStatus([
					 "message" => t("Method Not Allowed")
						], Response::HTTP_METHOD_NOT_ALLOWED);
		 }

		 //user validation
		 $authToken = $request->headers->get('PHP_AUTH_USER');
		 $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
		 $user = reset($users);
		 if (!$user) {
				 return $this->respondWithStatus([
								 'message' => t("User not found"),
						 ], Response::HTTP_FORBIDDEN);
		 }

		 //user role validation
		 $roles = $user->getRoles();
		 $validRole = false;
		 foreach ($roles as $role)
			 if ($role === "ministry") {
				 $validRole = true;
				 break;
			 }
		 if (!$validRole) {
				 return $this->respondWithStatus([
								 'message' => t("User Invalid Role"),
						 ], Response::HTTP_FORBIDDEN);
		 }

		 $config_storage = $this->entityTypeManager->getStorage('epal_config');
 		 $epalConfigs = $config_storage->loadByProperties(array('name' => 'epal_config'));
 		 $epalConfig = reset($epalConfigs);
 		 if (!$epalConfig) {
 				return $this->respondWithStatus([
 								'message' => t("EpalConfig Enity not found"),
 						], Response::HTTP_FORBIDDEN);
 		 }
 		 else {
 				  $epalConfig->set('lock_school_capacity', $capacityDisabled);
					$epalConfig->set('lock_school_students_view', $directorViewDisabled);
					$epalConfig->set('lock_application', $applicantsLoginDisabled);
					$epalConfig->save();
 		 }
 		 $config_storage->resetCache();


		return $this->respondWithStatus([
				//'message' => t("post successful"),
				'capacityDisabled' => $capacityDisabled,
				'directorViewDisabled' => $directorViewDisabled,
				'applicantsLoginDisabled' => $applicantsLoginDisabled,
		], Response::HTTP_OK);

	}	//end try

	catch (\Exception $e) {
		$this->logger->warning($e->getMessage());
		return $this->respondWithStatus([
					"message" => t("An unexpected problem occured during storeSettings Method ")
				], Response::HTTP_INTERNAL_SERVER_ERROR);
	}



}




	private function respondWithStatus($arr, $s) {
					$res = new JsonResponse($arr);
					$res->setStatusCode($s);
					return $res;
			}




}
