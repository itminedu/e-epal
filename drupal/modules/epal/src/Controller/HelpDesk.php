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
use Drupal\Core\TypedData\Plugin\DataType\TimeStamp;
use Drupal\Core\Language\LanguageManagerInterface;



class HelpDesk extends ControllerBase {

    protected $entity_query;
    protected $entityTypeManager;
    protected $logger;
    protected $connection;

    public function __construct(
        EntityTypeManagerInterface $entityTypeManager,
        QueryFactory $entity_query,
        Connection $connection,
        LoggerChannelFactoryInterface $loggerChannel
    ) {
    
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



	private function respondWithStatus($arr, $s) {
		$res = new JsonResponse($arr);
		$res->setStatusCode($s);
		return $res;
	}




	 public function sendEmail(Request $request)
    {

        if (!$request->isMethod('POST')) {
			return $this->respondWithStatus([
					"message" => t("Method Not Allowed")
				], Response::HTTP_METHOD_NOT_ALLOWED);
    	}

				$postData = null;
                if ($content = $request->getContent()) {
                    $postData = json_decode($content);

                	 $this->sendEmailToHelpDesk($postData->userEmail, $postData->userName, $postData->userMessage,$postData->userSurname);
                    return $this->respondWithStatus([
                        'error_code' => 0,
                    ], Response::HTTP_OK);
                }
                else {
                    return $this->respondWithStatus([
                        'message' => t("post with no data"),
                    ], Response::HTTP_BAD_REQUEST);
                }

    }


    private function sendEmailToHelpDesk($email, $name, $cont_message, $surname) {

        $mailManager = \Drupal::service('plugin.manager.mail');

        $module = 'epal';
        $key = 'help_desk';
        $to = 'dialogos_eek@minedu.gov.gr';
        $params['message'] = '<p>Αποστολέας:'.$email.'</p><p>Όνομα: '.$name.'</p><p>Επώνυμο: '.$surname.'</p><p>Μήνυμα: '.$cont_message .'</p>';
        $langcode = 'el';
        $send = true;

        $mail_sent = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

        if ($mail_sent) {
            $this->logger->info("Mail Sent successfully.");
        }
        else {
            $this->logger->info("There was an error in sending mail.");
        }
        return;
    }

         public function findTotalStudents(Request $request)
    {



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
            foreach ($roles as $role) {
                if ($role === "applicant") {
                    $validRole = true;
                    break;
                }
            }
            if (!$validRole) {
                return $this->respondWithStatus([
                    'message' => t("User Invalid Role"),
                ], Response::HTTP_FORBIDDEN);
            }

            $list = array();

            $sCon = $this->connection
                ->select('epal_student', 'eStudent')
                ->fields('eStudent', array('id'));
            $numApplications = $sCon->countQuery()->execute()->fetchField();
            array_push($list, (object) array('name' => "Αριθμός Αιτήσεων (συνολικά)", 'numStudents' => $numApplications));


            return $this->respondWithStatus($list, Response::HTTP_OK);


    }




}
