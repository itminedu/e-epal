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

class ReportsCreator extends ControllerBase {

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


	public function makegGeneralReport(Request $request) {

			try  {
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

				//υπολογισμός αριθμού αιτήσεων
				$sCon = $this->connection->select('epal_student', 'eStudent')
																	->fields('eStudent', array('id'));
				$numTotal = $sCon->countQuery()->execute()->fetchField();

				//υπολογισμός αριθμού αιτήσεων που ικανοποιήθηκαν στην i προτίμηση
				$numData = array();
				for ($i=0; $i < 3; $i++)	{
					$sCon = $this->connection->select('epal_student_class', 'eStudent')
																		->fields('eStudent', array('id', 'distribution_id'))
																		->condition('eStudent.distribution_id', $i+1, '=');
					array_push($numData, $sCon->countQuery()->execute()->fetchField());
				}

				// υπολογισμός αριθμού αιτήσεων που ΔΕΝ ικανοποιήθηκαν
				//Σημείωση: υπολογισμός με queries στη βάση
				$sCon = $this->connection->select('epal_student_class', 'eStudent')
																	->fields('eStudent', array('student_id'));
				$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				$studentIds = array();
				foreach ($epalStudents as $epalStudent)
					array_push($studentIds, $epalStudent->student_id);
				$sCon = $this->connection->select('epal_student', 'eStudent')
																	->fields('eStudent', array('id'))
																	->condition('eStudent.id', $studentIds, 'NOT IN');
				$numNoAllocated = $sCon->countQuery()->execute()->fetchField();

				/*
				$list[] = array(
					 'num_applications' => $numTotal,
				 	 'numchoice1' => $numData[0],
					 'numchoice2' => $numData[1],
					 'numchoice3' => $numData[2],
					 'num_noallocated' => $numNoAllocated,
				 );
				*/

				 $list = array();

				 //$record = new generalReportSchema;
				 //$record->name = "nikos";
				 //$record->numStudents = 20;

				 array_push($list,(object) array('name' => "Αριθμός Αιτήσεων", 'numStudents' => $numTotal));
				 array_push($list,(object) array('name' => "Αριθμός μαθητών που τοποθετήθηκαν στην πρώτη τους προτίμηση", 'numStudents' => $numData[0]));
				 array_push($list,(object) array('name' => "Αριθμός μαθητών που τοποθετήθηκαν στην δεύτερή τους προτίμηση", 'numStudents' => $numData[1]));
				 array_push($list,(object) array('name' => "Αριθμός μαθητών που τοποθετήθηκαν στην τρίτη τους προτίμηση", 'numStudents' => $numData[2]));
				 array_push($list,(object) array('name' => "Αριθμός μαθητών που δεν τοποθετήθηκαν σε καμμία τους προτίμηση", 'numStudents' => $numNoAllocated));

				 return $this->respondWithStatus(
								 $list
						 , Response::HTTP_OK);
			}	 //end try

			catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return $this->respondWithStatus([
							"message" => t("An unexpected problem occured during DELETE proccess in makeSelectionOfStudents Method of Distribution")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
			}

		}


		public function makeReportCompleteness(Request $request) {

			//$this->checkAuthorization($request);

			try  {

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

				$list = array();

				//βρες όλα τα σχολεία
				$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
																	->fields('eSchool', array('id', 'name', 'capacity_class_a'));
				$epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				//βρες ανώτατο επιτρεπόμενο όριο μαθητών
				$sCon = $this->connection->select('epal_class_limits', 'eSchool')
																	->fields('eSchool', array('name', 'limit_up'))
																	->condition('eSchool.name', '1' , '=');
				$epalLimitUps = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				$epalLimitUp = reset($epalLimitUps);
				$limitUp = $epalLimitUp->limit_up;

				foreach ($epalSchools as $epalSchool)	{
					//βρες μέγιστη χωρητικότητα για κάθε τάξη
					$capacity = array();
					//χωρητικότητα για Α' τάξη
					array_push($capacity, $epalSchool->capacity_class_a * $limitUp );
					//χωρητικότητα για Β' τάξη
					$sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
																		->fields('eSchool', array('id',  'capacity_class_sector'))
																		->condition('eSchool.epal_id', $epalSchool->id , '=');
					$sectorsInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$numClassSectors = 0;
					foreach ($sectorsInEpals as $sectorsInEpal)
						$numClassSectors += $sectorsInEpal->capacity_class_sector;
					array_push($capacity,  $numClassSectors * $limitUp);
					//χωρητικότητα για Γ' τάξη
					$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																		->fields('eSchool', array('id',  'capacity_class_specialty'))
																		->condition('eSchool.epal_id', $epalSchool->id , '=');
					$specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$numClassSpecialties = 0;
					foreach ($specialtiesInEpals as $specialtiesInEpal)
						$numClassSpecialties += $specialtiesInEpal->capacity_class_specialty;
					array_push($capacity,  $numClassSpecialties * $limitUp);
					//χωρητικότητα για όλο το σχολείο
					$capacityTotal = array_sum($capacity);

					//βρες αριθμό μαθητών γισ κάθε τάξη
					$num = array();
					$perc = array();
					for ( $classId = 1; $classId <= 3; $classId++)	{
						$sCon = $this->connection->select('epal_student_class', 'eStudent')
																			->fields('eStudent', array('id', 'epal_id', 'currentclass'))
																			->condition('eStudent.epal_id', $epalSchool->id , '=')
																			->condition('eStudent.currentclass', $classId , '=');
						array_push( $num, $sCon->countQuery()->execute()->fetchField() );
						//βρες ποσοστά συμπλήρωσης
						array_push( $perc, number_format($num[$classId-1] / $capacity[$classId-1] * 100 , 1)  . "%");
					}

					$percTotal = number_format (array_sum($num) / array_sum($capacity) * 100, 1) . "%";

					//αποστολή αποτελεσμάτων / στατιστικών
					if ($num[0] !== "0" || $num[1] !== "0" || $num[2] !== "0")

						/*
						array_push($list,(object) array(
							'name' => $epalSchool->name, 'numStudents' => $num[0] + $num[1] + $num[2], 'capacityTotal' => $capacityTotal, 'percTotal' => $percTotal,
							'numStudentsA' => $num[0], 'capacityA' => $capacity[0], 'percA' => $perc[0],
							'numStudentsB' => $num[1], 'capacityB' => $capacity[1], 'percB' => $perc[1],
							'numStudentsC' => $num[2], 'capacityC' => $capacity[2], 'percC' => $perc[2])
							 );
						*/


						array_push($list,(object) array(
							'name' => $epalSchool->name, 'percTotal' => $percTotal,
							'percA' => $perc[0],
							'percB' => $perc[1],
							'percC' => $perc[2])
							 );

				}

				 return $this->respondWithStatus(
								 $list
						 , Response::HTTP_OK);
			}	 //end try

			catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return $this->respondWithStatus([
							"message" => t("An unexpected problem occured in makeReportCompleteness Method")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
			}

		}



		public function makeReportAllStat(Request $request)	{

			try  {

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


				$list = array();

				//βρες όλα τα σχολεία
				$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
																	->fields('eSchool', array('id', 'name', 'capacity_class_a', 'region_edu_admin_id', 'edu_admin_id'));
				$epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				foreach ($epalSchools as $epalSchool)	{		//για κάθε σχολείο

					$schoolNameColumn = array();
					$schoolSectionColumn = array();
					$numColumn = array();
					$adminColumn = array();
					$regionColumn = array();

					//εύρεση ΠΔΕ που ανήκει το σχολείο
					$sCon = $this->connection->select('eepal_region_field_data', 'eRegion')
																		->fields('eRegion', array('id','name'))
																		->condition('eRegion.id', $epalSchool->region_edu_admin_id, '=');
					$epalRegions = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$epalRegion = reset($epalRegions);

					//εύρεση ΔΙΔΕ που ανήκει το σχολείο
					$sCon = $this->connection->select('eepal_admin_area_field_data', 'eAdmin')
																		->fields('eAdmin', array('id','name'))
																		->condition('eAdmin.id', $epalSchool->edu_admin_id, '=');
					$epalAdmins = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$epalAdmin = reset($epalAdmins);

					//εύρεση αριθμού μαθητών για κάθε τάξη
					array_push($schoolSectionColumn, 'Α τάξη');
					array_push($schoolSectionColumn, 'Β τάξη');
					array_push($schoolSectionColumn, 'Γ τάξη');
					for ( $classId = 1; $classId <= 3; $classId++)	{
						$sCon = $this->connection->select('epal_student_class', 'eStudent')
																			->fields('eStudent', array('id', 'epal_id', 'currentclass'))
																			->condition('eStudent.epal_id', $epalSchool->id , '=')
																			->condition('eStudent.currentclass', $classId , '=');
						array_push($schoolNameColumn, $epalSchool->name);
						array_push( $numColumn, $sCon->countQuery()->execute()->fetchField() );
						array_push($regionColumn, $epalRegion->name);
						array_push($adminColumn, $epalAdmin->name);
					}

					//εύρεση αριθμού μαθητών για κάθε τομέα της Β' τάξης
					$sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
																		->fields('eSchool', array('sector_id'))
																		->condition('eSchool.epal_id', $epalSchool->id , '=');
					$sectorsInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					foreach ($sectorsInEpals as $sectorsInEpal)	{
						$sCon = $this->connection->select('eepal_sectors_field_data', 'eSectors')
																			->fields('eSectors', array('name'))
																			->condition('eSectors.id', $sectorsInEpal->sector_id , '=');
						$sectorsNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($sectorsNamesInEpals as $sectorsNamesInEpal)	{
							array_push($schoolNameColumn, $epalSchool->name);
							array_push($schoolSectionColumn, 'Β τάξη / ' . $sectorsNamesInEpal->name );
							$sCon = $this->connection->select('epal_student_class', 'eStudent')
																				->fields('eStudent', array('id'))
																				->condition('eStudent.epal_id', $epalSchool->id , '=')
																				->condition('eStudent.currentclass', 2 , '=')
																				->condition('eStudent.specialization_id', $sectorsInEpal->sector_id , '=');
							array_push( $numColumn, $sCon->countQuery()->execute()->fetchField() );
							array_push($regionColumn, $epalRegion->name);
							array_push($adminColumn, $epalAdmin->name);
						}
					}

					//εύρεση αριθμού μαθητών για κάθε ειδικότητα της Γ' τάξης
					$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																		->fields('eSchool', array('specialty_id'))
																		->condition('eSchool.epal_id', $epalSchool->id , '=');
					$specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					foreach ($specialtiesInEpals as $specialtiesInEpal)	{
						$sCon = $this->connection->select('eepal_specialty_field_data', 'eSpecialties')
																			->fields('eSpecialties', array('name'))
																			->condition('eSpecialties.id', $specialtiesInEpal->specialty_id , '=');
						$specialtiesNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($specialtiesNamesInEpals as $specialtiesNamesInEpal)	{
							array_push($schoolNameColumn, $epalSchool->name);
							array_push($schoolSectionColumn, 'Γ τάξη / ' . $specialtiesNamesInEpal->name );
							$sCon = $this->connection->select('epal_student_class', 'eStudent')
																				->fields('eStudent', array('id'))
																				->condition('eStudent.epal_id', $epalSchool->id , '=')
																				->condition('eStudent.currentclass', 3 , '=')
																				->condition('eStudent.specialization_id', $specialtiesInEpal->specialty_id , '=');
							array_push( $numColumn, $sCon->countQuery()->execute()->fetchField() );
							array_push($regionColumn, $epalRegion->name);
							array_push($adminColumn, $epalAdmin->name);
						}
					}


					for ($j = 0; $j < sizeof($schoolNameColumn); $j++)	{
						array_push($list,(object) array(
							'name' => $schoolNameColumn[$j],
							'region' => $regionColumn[$j],
							'admin' => $adminColumn[$j],
							'section' => $schoolSectionColumn[$j],
							'num' => $numColumn[$j])
							 );
					}


				}	//end foreach school


				return $this->respondWithStatus(
								$list
						, Response::HTTP_OK);

			}	//end try

			catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return $this->respondWithStatus([
							"message" => t("An unexpected problem occured in makeReportCompleteness Method")
						], Response::HTTP_INTERNAL_SERVER_ERROR);
			}





		}

		private function respondWithStatus($arr, $s) {
					$res = new JsonResponse($arr);
					$res->setStatusCode($s);
					return $res;
			}




}
