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

				 $list = array();

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


		public function makeReportCompleteness(Request $request, $regionId, $adminId, $schId) {

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

				//βρες ανώτατο επιτρεπόμενο όριο μαθητών
				/*
				$sCon = $this->connection->select('epal_class_limits', 'eSchool')
																	->fields('eSchool', array('name', 'limit_up'))
																	->condition('eSchool.name', '1' , '=');
				$epalLimitUps = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				$epalLimitUp = reset($epalLimitUps);
				$limitUp = $epalLimitUp->limit_up;
				*/
				$limitUp = $this->retrieveUpLimit();

				//βρες όλα τα σχολεία που πληρούν τα κριτήρια / φίλτρα
				$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
																	->fields('eSchool', array('id', 'name', 'capacity_class_a', 'region_edu_admin_id', 'edu_admin_id'));
				if ($regionId != 0)
						$sCon->condition('eSchool.region_edu_admin_id', $regionId, '=');
				if ($adminId != 0)
						$sCon->condition('eSchool.edu_admin_id', $adminId, '=');
					if ($schId != 0)
						$sCon->condition('eSchool.id', $schId, '=');
				$epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				foreach ($epalSchools as $epalSchool)	{

					//εύρεση ονόματος ΠΔΕ που ανήκει το σχολείο
					$sCon = $this->connection->select('eepal_region_field_data', 'eRegion')
																		->fields('eRegion', array('id','name'))
																		->condition('eRegion.id', $epalSchool->region_edu_admin_id, '=');
					$epalRegions = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$epalRegion = reset($epalRegions);

					$regionColumn = $epalRegion->name;

					//εύρεση ονόματος ΔΙΔΕ που ανήκει το σχολείο
					$sCon = $this->connection->select('eepal_admin_area_field_data', 'eAdmin')
																		->fields('eAdmin', array('id','name'))
																		->condition('eAdmin.id', $epalSchool->edu_admin_id, '=');
					$epalAdmins = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$epalAdmin = reset($epalAdmins);

					$adminColumn = $epalAdmin->name;

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
						array_push( $perc, number_format($num[$classId-1] / $capacity[$classId-1] * 100 , 2)  . "%");
					}

					$percTotal = number_format (array_sum($num) / array_sum($capacity) * 100, 2) . "%";

					//αποστολή αποτελεσμάτων / στατιστικών
						array_push($list,(object) array(
							'name' => $epalSchool->name,
							'region' => $regionColumn,
							'admin' => $adminColumn,
							'percTotal' => $percTotal,
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



		public function makeReportAllStat(Request $request, $regionId, $adminId, $schId, $classId, $sectorId, $courseId)	{

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

				$limitup = $this->retrieveUpLimit();

				$list = array();

				//βρες όλα τα σχολεία που πληρούν τα κριτήρια / φίλτρα
				$sCon = $this->connection->select('eepal_school_field_data', 'eSchool')
																	->fields('eSchool', array('id', 'name', 'capacity_class_a', 'region_edu_admin_id', 'edu_admin_id'));
																	//->condition('eSchool.region_edu_admin_id', $regionId, '=');
				if ($regionId != 0)
					$sCon->condition('eSchool.region_edu_admin_id', $regionId, '=');
				if ($adminId != 0)
					$sCon->condition('eSchool.edu_admin_id', $adminId, '=');
				if ($schId != 0)
					$sCon->condition('eSchool.id', $schId, '=');
				$epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

				foreach ($epalSchools as $epalSchool)	{		//για κάθε σχολείο

					$schoolNameColumn = array();
					$regionColumn = array();
					$adminColumn = array();
					$schoolSectionColumn = array();
					$numColumn = array();
					$capacityColumn = array();
					$percColumn = array();


					//εύρεση ονόματος ΠΔΕ που ανήκει το σχολείο
					$sCon = $this->connection->select('eepal_region_field_data', 'eRegion')
																		->fields('eRegion', array('id','name'))
																		->condition('eRegion.id', $epalSchool->region_edu_admin_id, '=');
					$epalRegions = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$epalRegion = reset($epalRegions);

					//εύρεση ονόματος ΔΙΔΕ που ανήκει το σχολείο
					$sCon = $this->connection->select('eepal_admin_area_field_data', 'eAdmin')
																		->fields('eAdmin', array('id','name'))
																		->condition('eAdmin.id', $epalSchool->edu_admin_id, '=');
					$epalAdmins = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
					$epalAdmin = reset($epalAdmins);

					//εύρεση αριθμού μαθητών για κάθε τάξη

					//array_push($schoolSectionColumn, 'Α τάξη');
					//array_push($schoolSectionColumn, 'Β τάξη');
					//array_push($schoolSectionColumn, 'Γ τάξη');

					if ($sectorId === "0" && $courseId == 0)	{	//|| courseId === 0

						$clidstart = 1;
						$clidend = 3;

						if ($classId !== "0")	{
							$clidstart = $classId;
							$clidend = $classId;
							if ($classId === "1")
								array_push($schoolSectionColumn, 'Α τάξη');
							else if ($classId === "2")
								array_push($schoolSectionColumn, 'Β τάξη');
							else if ($classId === "3")
								array_push($schoolSectionColumn, 'Γ τάξη');
						}
						else {
							array_push($schoolSectionColumn, 'Α τάξη');
							array_push($schoolSectionColumn, 'Β τάξη');
							array_push($schoolSectionColumn, 'Γ τάξη');
						}

						for ( $clId = $clidstart; $clId <= $clidend; $clId++)	{
							$sCon = $this->connection->select('epal_student_class', 'eStudent')
																				->fields('eStudent', array('id', 'epal_id', 'currentclass'))
																				->condition('eStudent.epal_id', $epalSchool->id , '=')
																				->condition('eStudent.currentclass', $clId , '=');

							$numStud =  $sCon->countQuery()->execute()->fetchField();
							array_push($schoolNameColumn, $epalSchool->name);
							array_push($regionColumn, $epalRegion->name);
							array_push($adminColumn, $epalAdmin->name);
							//array_push($numColumn, $sCon->countQuery()->execute()->fetchField() );
							array_push($numColumn, $numStud);
							array_push($capacityColumn, $epalSchool->capacity_class_a * $limitup);
							array_push($percColumn, number_format($numStud / ($epalSchool->capacity_class_a * $limitup) * 100, 2) . '%' );

						}

					}	//end if

					//εύρεση αριθμού μαθητών για κάθε τομέα της Β' τάξης
					if ($classId === "0" || $classId === "2")	{

					$sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool')
																		->fields('eSchool', array('sector_id','capacity_class_sector'))
																		->condition('eSchool.epal_id', $epalSchool->id , '=');

					if ($sectorId != "0")
						$sCon->condition('eSchool.sector_id', $sectorId, '=');

					$sectorsInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

					foreach ($sectorsInEpals as $sectorsInEpal)	{
						$sCon = $this->connection->select('eepal_sectors_field_data', 'eSectors')
																			->fields('eSectors', array('name'))
																			->condition('eSectors.id', $sectorsInEpal->sector_id , '=');
						$sectorsNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
						foreach ($sectorsNamesInEpals as $sectorsNamesInEpal)	{
							array_push($regionColumn, $epalRegion->name);
							array_push($adminColumn, $epalAdmin->name);
							array_push($schoolNameColumn, $epalSchool->name);
							array_push($schoolSectionColumn, 'Β τάξη / ' . $sectorsNamesInEpal->name );
							$sCon = $this->connection->select('epal_student_class', 'eStudent')
																				->fields('eStudent', array('id'))
																				->condition('eStudent.epal_id', $epalSchool->id , '=')
																				->condition('eStudent.currentclass', 2 , '=')
																				->condition('eStudent.specialization_id', $sectorsInEpal->sector_id , '=');
							$numStud = $sCon->countQuery()->execute()->fetchField();
							array_push( $numColumn, $numStud );
							array_push($capacityColumn, $sectorsInEpal->capacity_class_sector * $limitup);
							array_push($percColumn, number_format($numStud / ($sectorsInEpal->capacity_class_sector * $limitup) * 100, 2) . '%' );

						}
					}
				}	//end if

					//εύρεση αριθμού μαθητών για κάθε ειδικότητα της Γ' τάξης
					if ($classId === "0" || $classId === "3")	{
							$sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool')
																				->fields('eSchool', array('specialty_id', 'capacity_class_specialty'))
																				->condition('eSchool.epal_id', $epalSchool->id , '=');

							if ($courseId !== "0")
								$sCon->condition('eSchool.specialty_id', $courseId, '=');

							$specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

							foreach ($specialtiesInEpals as $specialtiesInEpal)	{
									$sCon = $this->connection->select('eepal_specialty_field_data', 'eSpecialties')
																						->fields('eSpecialties', array('name'))
																						->condition('eSpecialties.id', $specialtiesInEpal->specialty_id , '=');

									if ($courseId === "0" && $sectorId !== "0")
										$sCon->condition('eSpecialties.sector_id', $sectorId, '=');

									$specialtiesNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
									foreach ($specialtiesNamesInEpals as $specialtiesNamesInEpal)	{
											array_push($regionColumn, $epalRegion->name);
											array_push($adminColumn, $epalAdmin->name);
											array_push($schoolNameColumn, $epalSchool->name);
											array_push($schoolSectionColumn, 'Γ τάξη / ' . $specialtiesNamesInEpal->name );
											$sCon = $this->connection->select('epal_student_class', 'eStudent')
																								->fields('eStudent', array('id'))
																								->condition('eStudent.epal_id', $epalSchool->id , '=')
																								->condition('eStudent.currentclass', 3 , '=')
																								->condition('eStudent.specialization_id', $specialtiesInEpal->specialty_id , '=');
											$numStud = $sCon->countQuery()->execute()->fetchField();
											array_push( $numColumn, $numStud );
											array_push($capacityColumn, $specialtiesInEpal->capacity_class_specialty * $limitup);
											array_push($percColumn, number_format($numStud / ($specialtiesInEpal->capacity_class_specialty * $limitup) * 100, 2) . '%' );

									}	//end foreach
							} //end foreach
				}	//end if


					for ($j = 0; $j < sizeof($schoolNameColumn); $j++)	{
						array_push($list,(object) array(
							'name' => $schoolNameColumn[$j],
							'region' => $regionColumn[$j],
							'admin' => $adminColumn[$j],
							'section' => $schoolSectionColumn[$j],
							'num' => $numColumn[$j],
							'capacity' => $capacityColumn[$j],
							'percentage' => $percColumn[$j],
						));
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


		public function retrieveUpLimit()	{

			//βρες ανώτατο επιτρεπόμενο όριο μαθητών
			//$limitup = 1;
			try {
				$sCon = $this->connection->select('epal_class_limits', 'eSchool')
																	->fields('eSchool', array('name', 'limit_up'))
																	->condition('eSchool.name', '1' , '=');
				$epalLimitUps = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
				$epalLimitUp = reset($epalLimitUps);
				//$limitup = $epalLimitUp->limit_up;
				//return $limitup;
				return $epalLimitUp->limit_up;
			}
			catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return -1;
			}
		}

		private function respondWithStatus($arr, $s) {
					$res = new JsonResponse($arr);
					$res->setStatusCode($s);
					return $res;
			}




}
