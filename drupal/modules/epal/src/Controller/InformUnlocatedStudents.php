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

//use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\TypedData\Plugin\DataType\TimeStamp;

use Drupal\Core\Language\LanguageManagerInterface;

class InformUnlocatedStudents extends ControllerBase {

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


	public function sendMailToUnallocatedStudents(Request $request) {

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

				$cnt_success = 0;
				$cnt_fail = 0;

				// εύρεση μαθητών που η αίτησή τους ΔΕΝ ικανοποιήθηκε
				$sCon = $this->connection->select('epal_student_class', 'eStudent')
																	->fields('eStudent', array('student_id'));
				$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				$studentIds = array();

				//array_push($studentIds,-1);

				foreach ($epalStudents as $epalStudent)
					array_push($studentIds, $epalStudent->student_id);

				$sCon = $this->connection->select('epal_student', 'eStudent')
																	->fields('eStudent', array('id', 'user_id', 'created'))
																	->condition('eStudent.id', $studentIds, 'NOT IN');
				//$numNoAllocated = $sCon->countQuery()->execute()->fetchField();
				$epalNonLocatedStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				foreach ($epalNonLocatedStudents as $epalNonLocatedStudent)	{
					$epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('user_id' => $epalNonLocatedStudent->user_id));
					$epalUser = reset($epalUsers);

					if ($epalUser) {
	            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);
							//$users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('uid' => $epalUser->user_id));
							//$user = reset($users);
	            if ($user) {
											$langcode = $user->getPreferredLangcode();
											if ($this->sendEmailToUnallocated($user->getEmail(), $epalNonLocatedStudent->id, $epalNonLocatedStudent->created, $langcode))
												$cnt_success++;
	             }
	            else {
	                return $this->respondWithStatus([
	                    'message' => t("user not found"),
	                ], Response::HTTP_INTERNAL_SERVER_ERROR);
	            }

	        } else {

						$cnt_fail++;
	        }

				} //end foreach

				return $this->respondWithStatus([
						'message' => t("post successful"),
						'num_success_mail' => $cnt_success,
						'num_fail_mail' => $cnt_fail,
						//'test' => $test,
				], Response::HTTP_OK);


			}	 //end try

			catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return $this->respondWithStatus([
							"message" => t("An unexpected problem occured during  sendMailToStudents Method ")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
			}

		}

		//sendEmail(e-mail address, A/A, application Date, lang)
		private function sendEmailToUnallocated($email, $appId, $appDate, $langcode) {
				$mailManager = \Drupal::service('plugin.manager.mail');

				$module = 'epal';
				$key = 'massive_mail_unallocated';	//to be checked..
				$to = $email;

				$params['message'] = "Σας ενημερώνουμε ότι η αίτησή σας με Α/Α: " . $appId . " - " . date('d-m-y H:i:s', $appDate)
														. " δεν ικανοποιήθηκε. Παρακαλώ επικοινωνήστε άμεσα τηλεφωνικά με τη Διεύθυνση Δευτεροβάθμιας Εκπαίδευσης / Τμήμα Επαγγελματικής Εκπαίδευσης,"
 														. "\r\nΤεστ1\nΤεστ2" ;//e-mail body
																//add new lines with SENDER name  - check it
				//$params['subject'] = t('Μη ικανοποίηση ηλεκτρονικής αίτησης για εγγραφή σε ΕΠΑΛ');

				//$this->logger->warning($params['message']);

				//$langcode = $user->getPreferredLangcode();
				$send = true;

				$mail_sent = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
				//$mail_sent = 1;

				if ($mail_sent) {
						//$this->logger->info("Το mail στάλθηκε με επιτυχία");
						return 1;
				}
				else {
						//$this->logger->info("Αποτυχία αποστολής mail.");
						return 0;
				}
		}

		public function sendMailToLocatedStudents(Request $request) {

			//$msg = "test";

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

				 // εύρεση μαθητών που η αίτησή τους ΙΚΑΝΟΠΟΙΗΘΗΚΕ

 				$sCon = $this->connection->select('epal_student_class', 'eStudent')
 																	->fields('eStudent', array('student_id', 'epal_id'));
 				$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
 				$studentIds = array();

				//if sizeof(studentIds = 0..distribution has not been made!)
				//array_push($studentIds, -1);

 				foreach ($epalStudents as $epalStudent)
 					array_push($studentIds, $epalStudent->student_id);
 				$sCon = $this->connection->select('epal_student', 'eStudent')
 																	->fields('eStudent', array('id', 'user_id', 'created'))
 																	->condition('eStudent.id', $studentIds, 'IN');

 				$epalLocatedStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

 				$cnt_success = 0;
 				$cnt_fail = 0;
 				foreach ($epalLocatedStudents as $epalLocatedStudent)	{

					//test purpose
				  //$epalLocatedStudent = reset($epalLocatedStudents);

 					$epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('user_id' => $epalLocatedStudent->user_id));
 					$epalUser = reset($epalUsers);

 					if ($epalUser) {
 	            $user = $this->entityTypeManager->getStorage('user')->load($epalUser->user_id->target_id);

 	            if ($user) {
 											$langcode = $user->getPreferredLangcode();

											//εύρεση ονόματος σχολείου
											$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
											                         ->fields('eSchool', array('id', 'name','street_address','phone_number'))
											                         ->condition('eSchool.id', $epalStudent->epal_id, '=');;
											$epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
											$epalSchool = reset($epalSchools);

											//$msg = $this->sendEmailToLocated($user->getEmail(), $epalLocatedStudent->id, $epalSchool->name, $epalSchool->street_address, $epalSchool->phone_number, $epalLocatedStudent->created, $langcode);
											if ($this->sendEmailToLocated($user->getEmail(), $epalLocatedStudent->id, $epalSchool->name, $epalSchool->street_address, $epalSchool->phone_number, $epalLocatedStudent->created, $langcode))
											  $cnt_success++;

												/*
											//test purposes
											return $this->respondWithStatus([
													//'message' => $epalLocatedStudent->id . ", " . $epalSchool->name . ", " . $epalSchool->street_address . ", " . $epalSchool->phone_number . ", " .  $epalLocatedStudent->created,
													'message' => $msg,
													'num_success_mail' => $cnt_success,
													'num_fail_mail' => $cnt_fail,
											], Response::HTTP_OK);
											//end test
											*/

 	             }
 	            else {
 	                return $this->respondWithStatus([
 	                    'message' => t("user not found"),
 	                ], Response::HTTP_INTERNAL_SERVER_ERROR);
 	            }

 	        } else {

 						$cnt_fail++;
 	        }


 				} //end foreach



				 return $this->respondWithStatus([
						 'message' => t("post successful"),
						 //'message' => t($msg),
						 'num_success_mail' => $cnt_success,
						 'num_fail_mail' => $cnt_fail,
				 ], Response::HTTP_OK);





			 }	 //end try

			 catch (\Exception $e) {
				 $this->logger->warning($e->getMessage());
				 return $this->respondWithStatus([
							 "message" => t("An unexpected problem occured during  sendMailToStudents Method ")
						 ], Response::HTTP_INTERNAL_SERVER_ERROR);
			 }

		}

		//sendEmail(e-mail address, A/A, application Date, lang)
		private function sendEmailToLocated($email, $appId, $schName, $schStreet, $schTel, $appDate, $langcode) {
				//$this->logger->warning("test");

				$mailManager = \Drupal::service('plugin.manager.mail');

				$module = 'epal';
				$key = 'massive_mail_located';
				$to = $email;

				$params['message'] = "Σας ενημερώνουμε ότι η αίτησή σας με Α/Α: " . $appId . " - " . date('d-m-y H:i:s', $appDate)
														. " ΙΚΑΝΟΠΟΙΗΘΗΚΕ. Έχετε επιλεγεί να γίνει η εγγραφή σας στο "  . $schName .", που βρίσκεται στη διεύθυνση: "   . $schStreet
														. ". Παρακαλώ επικοινωνήστε άμεσα με τη Σχολική Μονάδα τοποθέτησής σας"
														. ", ώστε να ενημερωθείτε για τη διαδικασία που πρέπει να ακολουθήσετε για την εγγραφή σας στο σχολείο. "
														. "Τηλέφωνο επικοινωνίας σχολείου: " . $schTel
														. "\r\nΤεστ1\nΤεστ2" ;//e-mail body

				//$this->logger->info($params['message']);

				$send = true;

				$mail_sent = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

				if ($mail_sent) {

						return 1;
						//return $params['message'];
				}
				else {

						return 0;
						//return $params['message'];
				}
		}


		private function respondWithStatus($arr, $s) {
					$res = new JsonResponse($arr);
					$res->setStatusCode($s);
					return $res;
			}




}
