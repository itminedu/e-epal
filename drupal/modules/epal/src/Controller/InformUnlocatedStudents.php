<?php

/**
 * @file
 * Contains \Drupal\query_example\Controller\QueryExampleController
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

	public function sendMailToUnallocatedStudents(Request $request, $period) {

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
			if (false === in_array('ministry', $user->getRoles())) {
				return $this->respondWithStatus([
					'message' => t("User Invalid Role"),
				], Response::HTTP_FORBIDDEN);
			}

			// take care of second_period parameter
			if ($period != 0 && $period != 1) {
				$period = null;
			}

			// εύρεση μαθητών που η αίτησή τους ΔΕΝ ΙΚΑΝΟΠΟΙΗΘΗΚΕ (δεν κατανεμήθηκαν πουθενά)
			$sCon = $this->connection->select('epal_student', 'eStudent');
			if ($period !== null) {
				$sCon->condition('eStudent.second_period', $period, '=');
			}
			$sCon->leftJoin('epal_student_class', 'eStudentClass', 'eStudent.id = eStudentClass.student_id');
			$sCon->fields('eStudentClass', array('student_id'))
				->fields('eStudent', array('id', 'user_id', 'created'))
				->isNull('eStudentClass.student_id');
			$sCon->join('epal_users', 'eUsers', 'eUsers.user_id = eStudent.user_id');
			$sCon->join('users_field_data', 'users', 'users.uid = eUsers.user_id');
			$sCon->fields('users', array('mail', 'preferred_langcode'));
			$epalNonLocatedStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

			$cnt_success = 0;
			$cnt_fail = 0;
			foreach ($epalNonLocatedStudents as $student)	{
				if ($this->sendEmailToUnallocated($student->mail, $student->id, $student->created, $student->preferred_langcode)) {
					$cnt_success++;
		        } else {
					$cnt_fail++;
	        	}
			}
			return $this->respondWithStatus([
				'message' => t("post successful"),
				'num_success_mail' => $cnt_success,
				'num_fail_mail' => $cnt_fail,
			], Response::HTTP_OK);
		}
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return $this->respondWithStatus([
				"message" => t("An unexpected problem occured during sendMailToStudents Method ")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

	}


	public function sendMailToUnallocatedStudentsSC(Request $request, $period) {

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
			if (false === in_array('ministry', $user->getRoles())) {
				return $this->respondWithStatus([
					'message' => t("User Invalid Role"),
				], Response::HTTP_FORBIDDEN);
			}

			// take care of second_period parameter
			if ($period != 0 && $period != 1) {
				$period = null;
			}

			// εύρεση μαθητών που η αίτησή τους ΔΕΝ ικανοποιήθηκε,
			//(δεν κατανεμήθηκαν πουθενά)
			$sCon = $this->connection->select('epal_student_class', 'eStudentClass')
				->fields('eStudentClass', array('student_id'));
			if ($period !== null) {
				$sCon->join('epal_student', 'eStudent', 'eStudent.id = eStudentClass.student_id AND eStudent.second_period = :second_period', [':second_period' => $period]);
			} else {
				$sCon->join('epal_student', 'eStudent', 'eStudent.id = eStudentClass.student_id');
			}

			$sCon->fields('eStudent', array('id', 'user_id', 'created'));
			$sCon->join('epal_users', 'eUsers', 'eUsers.user_id = eStudent.user_id');
			$sCon->join('users_field_data', 'users', 'users.uid = eUsers.user_id');
			$sCon->fields('users', array('mail', 'preferred_langcode'));
			$sCon->join('eepal_school_field_data', 'eSchool', 'eSchool.id = eStudentClass.user_id');
			$sCon->fields('eSchool', array('id', 'name','street_address', 'phone_number'));
			$sCon->condition('eStudentClass.finalized', 0, '=');
			$epalNonLocatedStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

			$cnt_success = 0;
			$cnt_fail = 0;

			foreach ($epalNonLocatedStudents as $student)	{
				if ($this->sendEmailToUnallocated($student->mail, $student->id, $student->created, $student->preferred_langcode)) {
					$cnt_success++;
				} else {
					$cnt_fail++;
				}
			}

			return $this->respondWithStatus([
				'message' => t("post successful"),
				'num_success_mail' => $cnt_success,
				'num_fail_mail' => $cnt_fail,
			], Response::HTTP_OK);
		}
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return $this->respondWithStatus([
				"message" => t("An unexpected problem occured during sendMailToStudents Method")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

	}

	private function sendEmailToUnallocated($email, $appId, $appDate, $langcode) 
	{
		$module = 'epal';
		$key = 'massive_mail_unallocated';	//to be checked..
		$to = $email;

		$params['message'] = "Σας ενημερώνουμε ότι η αίτησή σας με Α/Α: " . $appId . " / " . date('d-m-y H:i:s', $appDate)
			. " είναι σε εκκρεμότητα. Για την τοποθέτησή σας και τις ενέργειες που πρέπει να  κάνετε θα ενημερωθείτε με νέο μήνυμα, με τον ίδιο τρόπο, μετά  τις 8-7-2017."
			. "\r\n\r\n Ομάδα Διαχείρισης της εφαρμογής e-epal."
			. "\r\n Προσοχή: το μήνυμα που διαβάζετε είναι αυτοματοποιημένο. Παρακαλώ μην απαντάτε σε αυτό το μήνυμα.." ;

		return $this->sendEmails($module, $key, $to, $langcode, $params);
	}

	public function sendMailToLocatedStudents(Request $request, $period) {

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
			if (false === in_array('ministry', $user->getRoles())) {
				return $this->respondWithStatus([
					'message' => t("User Invalid Role"),
				], Response::HTTP_FORBIDDEN);
			}

			// take care of second_period parameter
			if ($period != 0 && $period != 1) {
				$period = null;
			}

			// εύρεση μαθητών που η αίτησή τους ΙΚΑΝΟΠΟΙΗΘΗΚΕ
			$sCon = $this->connection->select('epal_student_class', 'eStudentClass')
				->fields('eStudentClass', array('student_id', 'epal_id'));
			if ($period !== null) {
				$sCon->join('epal_student', 'eStudent', 'eStudent.id = eStudentClass.student_id AND eStudent.second_period = :second_period', [':second_period' => $period]);
			} else {
				$sCon->join('epal_student', 'eStudent', 'eStudent.id = eStudentClass.student_id');
			}
			$sCon->fields('eStudent', array('id', 'user_id', 'created'));
			$sCon->join('epal_users', 'eUsers', 'eUsers.user_id = eStudent.user_id');
			$sCon->join('users_field_data', 'users', 'users.uid = eUsers.user_id');
			$sCon->fields('users', array('mail', 'preferred_langcode'));
			$sCon->join('eepal_school_field_data', 'eSchool', 'eSchool.id = eStudentClass.user_id');
			$sCon->fields('eSchool', array('id', 'name','street_address', 'phone_number'));
			$sCon->condition('eStudentClass.finalized', 1 , '=');
			$epalLocatedStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

			$cnt_success = 0;
			$cnt_fail = 0;
			foreach ($epalLocatedStudents as $student)	{
				// $user->getEmail() users_mail = $student->mail 
				// $epalLocatedStudent->id eStudent_id = $student->id
				// $epalSchool->name eSchool_name = $student->name
				// $epalSchool->street_address eSchool_street_address = $student->street_address
				// $epalSchool->phone_number eSchool_phone_number = $student->phone_number
				// $epalLocatedStudent->created eStudent_created = $student->created 
				// $langcode users_preferred_langcode = $student->preferred_langcode
				if ($this->sendEmailToLocated($student->mail, $student->id, $student->name, $student->street_address, $student->phone_number, $student->created, $student->preferred_langcode)) {
					$cnt_success++;
				} else {
					$cnt_fail++;
				}
			} 

			return $this->respondWithStatus([
				'message' => t("post successful"),
				'num_success_mail' => $cnt_success,
				'num_fail_mail' => $cnt_fail,
			], Response::HTTP_OK);
		} 
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return $this->respondWithStatus([
				"message" => t("An unexpected problem occured during sendMailToStudents Method")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

	}

	private function sendEmailToLocated($email, $appId, $schName, $schStreet, $schTel, $appDate, $langcode) 
	{
		$module = 'epal';
		$key = 'massive_mail_located';
		$to = $email;

		$params['message'] = "Σας ενημερώνουμε ότι η αίτησή σας με Α/Α: " . $appId . " / " . date('d-m-y H:i:s', $appDate)
			. " ΙΚΑΝΟΠΟΙΗΘΗΚΕ. Έχετε επιλεγεί για να εγγραφείτε στο  "  . $schName
			. ". Παρακαλώ να προσέλθετε ΑΜΕΣΑ στο σχολείο για να προχωρήσει η διαδικασία εγγραφής σας σε αυτό, "
			. "προσκομίζοντας τα απαραίτητα δικαιολογητικά. Διεύθυνση σχολείου:  " . $schStreet
			. " Τηλέφωνο επικοινωνίας σχολείου: " . $schTel
			. "\r\n\r\n Ομάδα Διαχείρισης της εφαρμογής e-epal."
			. "\r\n Προσοχή: το μήνυμα που διαβάζετε είναι αυτοματοποιημένο. Παρακαλώ μην απαντάτε σε αυτό το μήνυμα."; 

		return $this->sendEmails($module, $key, $to, $langcode, $params);
	}

	private function sendEmails($module, $key, $to, $langcode, $params) 
	{
		$mailManager = \Drupal::service('plugin.manager.mail');
		$send = true;
		$mail_sent = $mailManager->mail($module, $key, $to, $langcode, $params, null, $send);

		return ($mail_sent['result'] == true); 
	}

	private function respondWithStatus($arr, $s) {
		$res = new JsonResponse($arr);
		$res->setStatusCode($s);
		return $res;
	}

}
