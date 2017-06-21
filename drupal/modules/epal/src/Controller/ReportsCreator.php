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

define("ERR_DB", -1);
define("NO_CLASS_LIM_DOWN", -2);
define("SMALL_CLS", 1);
define("NON_SMALL_CLS", 2);

class ReportsCreator extends ControllerBase
{

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

    public function makeReportUsers(Request $request)
    {

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
            foreach ($roles as $role) {
                if ($role === "ministry") {
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

            //υπολογισμός αριθμού αιτήσεων
            $sCon = $this->connection
                ->select('epal_student', 'eStudent')
                ->fields('eStudent', array('id'));
            $numApplications = $sCon->countQuery()->execute()->fetchField();
            array_push($list, (object) array('name' => "Αριθμός Αιτήσεων (συνολικά)", 'numStudents' => $numApplications));

            //υπολογισμός αριθμού αιτήσεων ανά τάξη
            $classes = [1 => 'Α', 2 => 'Β', 3 => 'Γ', 4 => 'Δ'];
            foreach ($classes as $i => $label) {
                $sCon = $this->connection
                    ->select('epal_student', 'eStudent')
                    ->fields('eStudent', array('id'))
                    ->condition('eStudent.currentclass', strval($i), '=');
                $numApplications = $sCon->countQuery()->execute()->fetchField();
                array_push($list, (object) array('name' => "Αριθμός Αιτήσεων για {$label} Τάξη", 'numStudents' => $numApplications));
            }

            //υπολογισμός αριθμού αιτήσεων για δεύτερη περίοδο
            $sCon = $this->connection
                ->select('epal_student', 'eStudent')
                ->fields('eStudent', array('id'))
                ->condition('eStudent.second_period', 1, '=');
            $numApplications = $sCon->countQuery()->execute()->fetchField();
            array_push($list, (object) array('name' => "Αριθμός Αιτήσεων B' περιόδου", 'numStudents' => $numApplications));

            //υπολογισμός αριθμού χρηστών
            $sCon = $this->connection
                ->select('epal_users', 'eUser')
                ->fields('eUser', array('id'));
            $numUsers = $sCon->countQuery()->execute()->fetchField();
            array_push($list, (object) array('name' => "Αριθμός Εγγεγραμένων Χρηστών με ρόλο Αιτούντα", 'numStudents' => $numUsers));

            return $this->respondWithStatus($list, Response::HTTP_OK);
        } //end try

        catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
                "message" => t("An unexpected problem occured during report")
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



    public function makeGeneralReport(Request $request)
    {

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
            foreach ($roles as $role) {
                if ($role === "ministry") {
                    $validRole = true;
                    break;
                }
            }
            if (!$validRole) {
                return $this->respondWithStatus([
                    'message' => t("User Invalid Role"),
                ], Response::HTTP_FORBIDDEN);
            }

            //υπολογισμός αριθμού δηλώσεων
            $sCon = $this->connection
                ->select('epal_student', 'eStudent')
                ->fields('eStudent', array('id'));
            $numTotal = $sCon->countQuery()->execute()->fetchField();

            //υπολογισμός αριθμού δηλώσεων που ικανοποιήθηκαν στην i προτίμηση
            $numData = array();
            for ($i=0; $i < 3; $i++) {
                $sCon = $this->connection
                    ->select('epal_student_class', 'eStudent')
                    ->fields('eStudent', array('id', 'distribution_id'))
                    ->condition('eStudent.distribution_id', $i+1, '=')
                    ->condition('eStudent.finalized', 1, '=');
                array_push($numData, $sCon->countQuery()->execute()->fetchField());
            }

            // υπολογισμός αριθμού δηλώσεων που ΔΕΝ ικανοποιήθηκαν
            /*
			$sCon = $this->connection
				->select('epal_student_class', 'eStudent')
				->fields('eStudent', array('student_id'));
			$epalStudents = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
			$studentIds = array();
			foreach ($epalStudents as $epalStudent)
				array_push($studentIds, $epalStudent->student_id);
			$sCon = $this->connection
				->select('epal_student', 'eStudent')
				->fields('eStudent', array('id'))
				->condition('eStudent.id', $studentIds, 'NOT IN');
			$numNoAllocated = $sCon->countQuery()->execute()->fetchField();
			*/
            $sCon = $this->connection->select('epal_student', 'epalStudent');
            $sCon->leftJoin('epal_student_class', 'eStudent', 'eStudent.student_id = epalStudent.id');
            $sCon->fields('eStudent', array('student_id'))
                ->fields('epalStudent', array('id'))
                ->isNull('eStudent.student_id');
            $numNoAllocated = $sCon->countQuery()->execute()->fetchField();

            //υπολογισμός αριθμού δηλώσεων που τοποθετήθηκαν προσωρινά σε ολιγομελή τμήματα
            $numInSmallClasses = 0;
            $sCon = $this->connection
                ->select('epal_student_class', 'eStudent')
                ->fields('eStudent', array('id'))
                ->condition('eStudent.finalized', 0, '=');
            $numInSmallClasses = $sCon->countQuery()->execute()->fetchField();

            $list = array(
                array('name' => "Αριθμός Δηλώσεων Προτίμησης", 'numStudents' => $numTotal),
                array('name' => "Αριθμός μαθητών που τοποθετήθηκαν στην πρώτη τους προτίμηση", 'numStudents' => $numData[0]),
                array('name' => "Αριθμός μαθητών που τοποθετήθηκαν στην δεύτερή τους προτίμηση", 'numStudents' => $numData[1]),
                array('name' => "Αριθμός μαθητών που τοποθετήθηκαν στην τρίτη τους προτίμηση", 'numStudents' => $numData[2]),
                array('name' => "Αριθμός μαθητών που δεν τοποθετήθηκαν σε καμμία τους προτίμηση", 'numStudents' => $numNoAllocated),
                array('name' => "Αριθμός μαθητών που τοποθετήθηκαν προσωρινά σε ολιγομελή τμήματα", 'numStudents' => $numInSmallClasses)
            );

            return $this->respondWithStatus($list, Response::HTTP_OK);
        } //end try

        catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
                "message" => t("An unexpected problem occured during report")
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function makeReportCompleteness(Request $request, $regionId, $adminId, $schId)
    {

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
            foreach ($roles as $role) {
                if ($role === "ministry" || $role === "regioneduadmin" || $role === "eduadmin") {
                    $validRole = $role;
                    break;
                }
            }
            if ($validRole === false) {
				return $this->respondWithStatus([
					'message' => t("User Invalid Role"),
				], Response::HTTP_FORBIDDEN);
            }

            if (!$this->canReportOn($user, $role, $regionId, $adminId, $schId)) {
				return $this->respondWithStatus([
					'message' => t('User access to area forbidden'),
				], Response::HTTP_FORBIDDEN);
            }

            $list = array();

            //βρες ανώτατο επιτρεπόμενο όριο μαθητών
            $limitUp = $this->retrieveUpLimit();

            //βρες όλα τα σχολεία που πληρούν τα κριτήρια / φίλτρα
            $sCon = $this->connection->select('eepal_school_field_data', 'eSchool');
			$sCon->join('eepal_region_field_data', 'eRegion', 'eRegion.id = eSchool.region_edu_admin_id');
			$sCon->join('eepal_admin_area_field_data', 'eAdmin', 'eAdmin.id = eSchool.edu_admin_id');
			$sCon->leftJoin('eepal_sectors_in_epal_field_data', 'sectors', 'sectors.epal_id = eSchool.id');
			$sCon->fields('eSchool', array('id', 'name', 'capacity_class_a', 'region_edu_admin_id', 'edu_admin_id', 'operation_shift'))
				->fields('eRegion', ['name'])
				->fields('eAdmin', ['name'])
                ->groupBy('id')
                ->groupBy('name')
                ->groupBy('capacity_class_a')
                ->groupBy('region_edu_admin_id')
                ->groupBy('edu_admin_id')
                ->groupBy('operation_shift')
                ->groupBy('eRegion_name')
                ->groupBy('eAdmin_name');
            $sCon->addExpression('sum(sectors.capacity_class_sector)', 'capacity_class_b');
            if ($regionId != 0) {
				$sCon->condition('eSchool.region_edu_admin_id', $regionId, '=');
            }
            if ($adminId != 0) {
				$sCon->condition('eSchool.edu_admin_id', $adminId, '=');
            }
            if ($schId != 0) {
                $sCon->condition('eSchool.id', $schId, '=');
            }
            $epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            foreach ($epalSchools as $epalSchool) {
                //εύρεση ονόματος ΠΔΕ που ανήκει το σχολείο
                $regionColumn = $epalSchool->eRegion_name;
                //εύρεση ονόματος ΔΙΔΕ που ανήκει το σχολείο
                $adminColumn = $epalSchool->eAdmin_name;

                //βρες μέγιστη χωρητικότητα για κάθε τάξη
                $capacity = array();
                //χωρητικότητα για Α' τάξη
                array_push($capacity, $epalSchool->capacity_class_a * $limitUp );

                //χωρητικότητα για Β' τάξη
                array_push($capacity, $epalSchool->capacity_class_b * $limitUp);

                //χωρητικότητα για Γ' τάξη
                $sCon = $this->connection
					->select('eepal_specialties_in_epal_field_data', 'eSchool')
                    ->fields('eSchool', array('id',  'capacity_class_specialty'))
                    ->condition('eSchool.epal_id', $epalSchool->id, '=');
                $specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                $numClassSpecialties = 0;
                foreach ($specialtiesInEpals as $specialtiesInEpal) {
                    $numClassSpecialties += $specialtiesInEpal->capacity_class_specialty;
                }
                array_push($capacity, $numClassSpecialties * $limitUp);

                //χωρητικότητα για Δ' τάξη
                if ($epalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ") {
                    $sCon = $this->connection
                        ->select('eepal_specialties_in_epal_field_data', 'eSchool')
                        ->fields('eSchool', array('id',  'capacity_class_specialty_d'))
                        ->condition('eSchool.epal_id', $epalSchool->id, '=');
                    $specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                    $numClassSpecialtiesNight = 0;
                    foreach ($specialtiesInEpals as $specialtiesInEpal) {
                        $numClassSpecialtiesNight += $specialtiesInEpal->capacity_class_specialty_d;
                    }
					array_push($capacity, $numClassSpecialtiesNight * $limitUp);
                } else {
                    array_push($capacity, -1);
                }

                //χωρητικότητα για όλο το σχολείο
                $capacityTotal = array_sum($capacity);

                //βρες αριθμό μαθητών γισ κάθε τάξη
                $num = array();
                $perc = array();
                $stat_complete = true;
                for ($classId = 1; $classId <= 4; $classId++) {
                    $sCon = $this->connection
						->select('epal_student_class', 'eStudent')
                        ->fields('eStudent', array('id', 'epal_id', 'currentclass'))
                        ->condition('eStudent.epal_id', $epalSchool->id, '=')
                        ->condition('eStudent.currentclass', $classId, '=');
                    array_push( $num, $sCon->countQuery()->execute()->fetchField());
                    //βρες ποσοστά συμπλήρωσης
                    if (isset($capacity[$classId-1]) && $capacity[$classId-1] > 0) {
                        $perc_str = number_format($num[$classId-1] / $capacity[$classId-1] * 100, 2);
                    } else {
                        $perc_str = '-';
                        $stat_complete = false;
                    }
                    array_push( $perc, $perc_str);
                }

                if ($stat_complete === true && $capacityTotal > 0) {
                    $percTotal = number_format(array_sum($num) / $capacityTotal * 100, 2);
                } else {
                    $percTotal = '-';
                }

                //αποστολή αποτελεσμάτων / στατιστικών
				array_push($list, (object) array(
					'name' => $epalSchool->name,
					'region' => $regionColumn,
					'admin' => $adminColumn,
					'percTotal' => $percTotal,
					'percA' => $perc[0],
					'percB' => $perc[1],
					'percC' => $perc[2],
					'percD' => $perc[3]
				));
            }

			return $this->respondWithStatus($list, Response::HTTP_OK);
        } //end try

        catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
                "message" => t("An unexpected problem occured during report")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function makeReportAllStat(Request $request, $regionId, $adminId, $schId, $classId, $sectorId, $courseId, $finalized)
    {
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
            foreach ($roles as $role) {
                if ($role === "ministry" || $role === "regioneduadmin" || $role === "eduadmin") {
                    $validRole = $role;
                    break;
                }
            }
            if ($validRole === false) {
				return $this->respondWithStatus([
					'message' => t("User Invalid Role"),
				], Response::HTTP_FORBIDDEN);
            }

            if (!$this->canReportOn($user, $role, $regionId, $adminId, $schId)) {
				return $this->respondWithStatus([
					'message' => t('User access to area forbidden'),
				], Response::HTTP_FORBIDDEN);
            }

            $limitup = $this->retrieveUpLimit();

            $list = array();

            // βρες όλα τα σχολεία που πληρούν τα κριτήρια / φίλτρα
            $sCon = $this->connection->select('eepal_school_field_data', 'eSchool');
			$sCon->join('eepal_region_field_data', 'eRegion', 'eRegion.id = eSchool.region_edu_admin_id');
			$sCon->join('eepal_admin_area_field_data', 'eAdmin', 'eAdmin.id = eSchool.edu_admin_id');
            $sCon->fields('eSchool', array('id', 'name', 'capacity_class_a', 'region_edu_admin_id', 'edu_admin_id','operation_shift', 'metathesis_region'))
				->fields('eRegion', ['name'])
				->fields('eAdmin', ['name']);
            if ($regionId != 0) {
                $sCon->condition('eSchool.region_edu_admin_id', $regionId, '=');
            }
            if ($adminId != 0) {
                $sCon->condition('eSchool.edu_admin_id', $adminId, '=');
            }
            if ($schId != 0) {
                $sCon->condition('eSchool.id', $schId, '=');
            }
            $epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

            foreach ($epalSchools as $epalSchool) { // για κάθε σχολείο

                $schoolNameColumn = array();
                $regionColumn = array();
                $adminColumn = array();
                $schoolSectionColumn = array();
                $numColumn = array();
                $capacityColumn = array();
                $percColumn = array();

                $smallClass = array();

                $numClassSec = 0;
                $numClassCour = 0;
                $numClassCour_D = 0;

                // εύρεση αριθμού μαθητών για κάθε τομέα της Β' τάξης
                if ($classId === "0" || $classId === "2") {
                    $sCon = $this->connection->select('eepal_sectors_in_epal_field_data', 'eSchool');
			        $sCon->join('eepal_sectors_field_data', 'eSectors', 'eSectors.id = eSchool.sector_id');
			        $sCon->leftJoin('epal_student_class', 'eStudent', 
                        'eStudent.epal_id = eSchool.epal_id ' .
                        'AND eStudent.specialization_id = eSchool.sector_id ' .
                        'AND eStudent.currentclass = 2');
                    $sCon->fields('eSchool', array('sector_id','capacity_class_sector'))
                        ->fields('eSectors', ['name'])
                        ->groupBy('sector_id')
                        ->groupBy('capacity_class_sector')
                        ->groupBy('eSectors.name')
                        ->condition('eSchool.epal_id', $epalSchool->id, '=');
                    $sCon->addExpression('count(eStudent.id)', 'eStudent_count');
                    if ($sectorId != "0") {
                        $sCon->condition('eSchool.sector_id', $sectorId, '=');
                    }

                    $sectorsInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                    foreach ($sectorsInEpals as $sectorsInEpal) {
                        array_push($regionColumn, $epalSchool->eRegion_name);
                        array_push($adminColumn, $epalSchool->eAdmin_name);
                        array_push($schoolNameColumn, $epalSchool->name);
                        array_push($schoolSectionColumn, 'Β τάξη / ' . $sectorsInEpal->name);

                        $numStud = $sectorsInEpal->eStudent_count;
                        $smCl = $this->isSmallClass($epalSchool->id, $numStud, "2", $sectorsInEpal->sector_id, $epalSchool->metathesis_region);
                        array_push($smallClass, $smCl);

                        array_push($numColumn, $numStud);
                        $capacityColumnValue = $sectorsInEpal->capacity_class_sector * $limitup;
                        array_push($capacityColumn, $capacityColumnValue);
                        array_push($percColumn, $capacityColumnValue > 0 ? number_format($numStud / $capacityColumnValue * 100, 2) : 0);

                        $numClassSec += $sectorsInEpal->capacity_class_sector;
                    }
                } // end εύρεση αριθμού μαθητών για κάθε τομέα της Β' τάξης

                // εύρεση αριθμού μαθητών για κάθε ειδικότητα της Γ' τάξης
                if ($classId === "0" || $classId === "3") {
                    $sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool');
			        $sCon->join('eepal_specialty_field_data', 'eSpecialties', 'eSpecialties.id = eSchool.specialty_id');
			        $sCon->leftJoin('epal_student_class', 'eStudent', 
                        'eStudent.epal_id = eSchool.epal_id ' .
                        'AND eStudent.specialization_id = eSchool.specialty_id ' .
                        'AND eStudent.currentclass = 3');
                    $sCon->fields('eSchool', array('specialty_id', 'capacity_class_specialty'))
                        ->fields('eSpecialties', ['name'])
                        ->groupBy('specialty_id')
                        ->groupBy('capacity_class_specialty')
                        ->groupBy('eSpecialties.name')
                        ->condition('eSchool.epal_id', $epalSchool->id, '=');
                    $sCon->addExpression('count(eStudent.id)', 'eStudent_count');
                    if ($courseId !== "0") {
                        $sCon->condition('eSchool.specialty_id', $courseId, '=');
                    } else if ($sectorId !== "0") {
                        $sCon->condition('eSpecialties.sector_id', $sectorId, '=');
                    }
                    $specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                    foreach ($specialtiesInEpals as $specialtiesInEpal) {
                        array_push($regionColumn, $epalSchool->eRegion_name);
                        array_push($adminColumn, $epalSchool->eAdmin_name);
                        array_push($schoolNameColumn, $epalSchool->name);
                        array_push($schoolSectionColumn, 'Γ τάξη / ' . $specialtiesInEpal->name );

                        $numStud = $specialtiesInEpal->eStudent_count;
                        $smCl = $this->isSmallClass($epalSchool->id, $numStud, "3", $specialtiesInEpal->specialty_id, $epalSchool->metathesis_region);
                        array_push($smallClass, $smCl);

                        array_push($numColumn, $numStud);
                        $capacityColumnValue = $specialtiesInEpal->capacity_class_specialty * $limitup;
                        array_push($capacityColumn, $capacityColumnValue);
                        array_push($percColumn, $capacityColumnValue > 0 ? number_format($numStud / $capacityColumnValue * 100, 2) : 0);

                        $numClassCour += $specialtiesInEpal->capacity_class_specialty;
                    }
                } // end εύρεση αριθμού μαθητών για κάθε ειδικότητα της Γ' τάξης

                // εύρεση αριθμού μαθητών για κάθε ειδικότητα της Δ' τάξης
                if ($epalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ") {
                    if ($classId === "0" || $classId === "4") {
                        $sCon = $this->connection->select('eepal_specialties_in_epal_field_data', 'eSchool');
                        $sCon->join('eepal_specialty_field_data', 'eSpecialties', 'eSpecialties.id = eSchool.specialty_id');
                        $sCon->leftJoin('epal_student_class', 'eStudent', 
                            'eStudent.epal_id = eSchool.epal_id ' .
                            'AND eStudent.specialization_id = eSchool.specialty_id ' .
                            'AND eStudent.currentclass = 4');
                        $sCon->fields('eSchool', array('specialty_id', 'capacity_class_specialty_d'))
                            ->fields('eSpecialties', ['name'])
                            ->groupBy('specialty_id')
                            ->groupBy('capacity_class_specialty_d')
                            ->groupBy('eSpecialties.name')
                            ->condition('eSchool.epal_id', $epalSchool->id, '=');
                        $sCon->addExpression('count(eStudent.id)', 'eStudent_count');
                        if ($courseId !== "0") {
                            $sCon->condition('eSchool.specialty_id', $courseId, '=');
                        } else if ($sectorId !== "0") {
                            $sCon->condition('eSpecialties.sector_id', $sectorId, '=');
                        }

                        $specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                        foreach ($specialtiesInEpals as $specialtiesInEpal) {
                            array_push($regionColumn, $epalSchool->eRegion_name);
                            array_push($adminColumn, $epalSchool->eAdmin_name);
                            array_push($schoolNameColumn, $epalSchool->name);
                            array_push($schoolSectionColumn, 'Δ τάξη / ' . $specialtiesInEpal->name );

                            $numStud = $specialtiesInEpal->eStudent_count;
                            $smCl = $this->isSmallClass($epalSchool->id, $numStud, "4", $specialtiesInEpal->specialty_id, $epalSchool->metathesis_region);
                            array_push($smallClass, $smCl);

                            array_push($numColumn, $numStud);
                            $capacityColumnValue = $specialtiesInEpal->capacity_class_specialty_d * $limitup;
                            array_push($capacityColumn, $capacityColumnValue);
                            array_push($percColumn, $capacityColumnValue > 0 ? number_format($numStud / $capacityColumnValue * 100, 2) : 0);

                            $numClassCour_D += $specialtiesInEpal->capacity_class_specialty_d;
                        }
                    }
                } //end "ΕΣΠΕΡΙΝΟ" εύρεση αριθμού μαθητών για κάθε ειδικότητα της Δ' τάξης

                // εύρεση αριθμού μαθητών για κάθε τάξη
                $numClasses = array();
                array_push($numClasses, $epalSchool->capacity_class_a);
                array_push($numClasses, $numClassSec);
                array_push($numClasses, $numClassCour);
                array_push($numClasses, $numClassCour_D);

                if ($sectorId === "0" && $courseId === "0") {
                    $clidstart = 1;
                    $clidend = 4;

                    if ($classId !== "0") {
                        $clidstart = $classId;
                        $clidend = $classId;
                        if ($classId === "1") {
                            array_push($schoolSectionColumn, 'Α τάξη');
                        } elseif ($classId === "2") {
                            array_push($schoolSectionColumn, 'Β τάξη');
                        } elseif ($classId === "3") {
                            array_push($schoolSectionColumn, 'Γ τάξη');
                        } elseif ($classId === "4") {
                            array_push($schoolSectionColumn, 'Δ τάξη');
                        }
                    } else {
                        array_push($schoolSectionColumn, 'Α τάξη');
                        array_push($schoolSectionColumn, 'Β τάξη');
                        array_push($schoolSectionColumn, 'Γ τάξη');
                        array_push($schoolSectionColumn, 'Δ τάξη');
                    }

                    for ($clId = $clidstart; $clId <= $clidend; $clId++) {
                        $sCon = $this->connection
                            ->select('epal_student_class', 'eStudent')
                            ->fields('eStudent', array('id', 'epal_id', 'currentclass'))
                            ->condition('eStudent.epal_id', $epalSchool->id, '=')
                            ->condition('eStudent.currentclass', $clId, '=');
                        $numStud =  $sCon->countQuery()->execute()->fetchField();

                        $smCl = $this->isSmallClass($epalSchool->id, $numStud, "1", "-1", $epalSchool->metathesis_region);
                        array_push($smallClass, $smCl);

                        array_push($schoolNameColumn, $epalSchool->name);
                        array_push($regionColumn, $epalSchool->eRegion_name);
                        array_push($adminColumn, $epalSchool->eAdmin_name);
                        array_push($numColumn, $numStud);
                        $capacityColumnValue = ($numClasses[$clId-1] * $limitup);
                        array_push($capacityColumn, $capacityColumnValue);
                        array_push($percColumn, $capacityColumnValue > 0 ? number_format($numStud / $capacityColumnValue * 100, 2) : 0);
                    }
                } // end εύρεση αριθμού μαθητών για κάθε τάξη

                for ($j = 0; $j < sizeof($schoolNameColumn); $j++) {
                    // αν έγινε αίτημα για εμφάνιση ολιγομελών και είναι το τρέχον τμήμα ολιγομελές
                    if (($finalized === "1") || 
                        ($finalized === "0" && $smallClass[$j] === SMALL_CLS
                            && $schoolSectionColumn[$j] !== "Β τάξη" && $schoolSectionColumn[$j] !== "Γ τάξη" 
                            && $schoolSectionColumn[$j] !== "Δ τάξη")) {
                            array_push($list, (object) array(
                                'name' => $schoolNameColumn[$j],
                                'region' => $regionColumn[$j],
                                'admin' => $adminColumn[$j],
                                'section' => $schoolSectionColumn[$j],
                                'num' => $numColumn[$j],
                                'capacity' => $capacityColumn[$j],
                                'percentage' => $percColumn[$j],
                            ));
                    }
                }
            } //end loop για κάθε σχολείο

            return $this->respondWithStatus($list, Response::HTTP_OK);
        } 
        catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
                "message" => t("An unexpected problem occured in makeReportCompleteness Method")
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function isSmallClass($schoolId, $numStud, $classId, $sectorOrcourseId, $regionId)
    {

        $limitDown = $this->retrieveLimitDown($classId, $regionId);

        if ($limitDown === NO_CLASS_LIM_DOWN) {
            return NO_CLASS_LIM_DOWN;
        } elseif ($limitDown === ERR_DB) {
            return ERR_DB;
        }

        $numStudents = (int) $numStud;
        if (($numStudents < $limitDown) /*&& ($numStudents > 0)*/) {
            return SMALL_CLS;
        } else {
            return NON_SMALL_CLS;
        }
    }


    /**
     * Fetch epal_class_limits data in memory; will save time.
     *
     */
    private function retrieveLimitDown($classId, $regionId)
    {
        static $data = [];

        if (count($data) === 0) {
            try {
                $sCon = $this->connection
                    ->select('epal_class_limits', 'eClassLimit')
                    ->fields('eClassLimit', ['name', 'category', 'limit_down']);
                $classLimits = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                if ($classLimits !== FALSE) {
                    foreach ($classLimits as $limit) {
                        $data["$limit->name"]["$limit->category"] = $limit->limit_down;
                    }
                } else {
                    return NO_CLASS_LIM_DOWN;                    
                }
            } catch (\Exception $e) {
                $this->logger->warning($e->getMessage());
                return ERR_DB;
            }
        }

        if (isset($data["$classId"]["$regionId"])) {
            return $data["$classId"]["$regionId"];
        } else {
            return NO_CLASS_LIM_DOWN;
        }
    }

    public function retrieveUserRegistryNo(Request $request)
    {

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
            foreach ($roles as $role) {
                if ($role === "regioneduadmin" || $role === "eduadmin") {
                    $validRole = true;
                    break;
                }
            }
            if (!$validRole) {
				return $this->respondWithStatus([
					'message' => t("User Invalid Role"),
				], Response::HTTP_FORBIDDEN);
            }

            return $this->respondWithStatus([
				'message' => t("retrieve ID successful"),
				'id' => $user->init->value,
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
				"message" => t("An unexpected problem occured in retrievePDEId Method")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function makeReportNoCapacity(Request $request, $capacityEnabled)
    {

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
            foreach ($roles as $role) {
                if ($role === "ministry") {
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

            //βρες όλα τα σχολεία
            $sCon = $this->connection
				->select('eepal_school_field_data', 'eSchool')
                ->fields('eSchool', array('id', 'name', 'capacity_class_a', 'region_edu_admin_id', 'edu_admin_id','operation_shift'));

            //if ($capacityEnabled === "0")
            //	$sCon->condition('eSchool.capacity_class_a', 0, '=');

            $epalSchools = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

            foreach ($epalSchools as $epalSchool) {       //για κάθε σχολείο

                $schoolNameColumn = array();
                $regionColumn = array();
                $adminColumn = array();
                $schoolSectionColumn = array();
                $capacityColumn = array();

                //εύρεση ονόματος ΠΔΕ που ανήκει το σχολείο
                $sCon = $this->connection
					->select('eepal_region_field_data', 'eRegion')
                    ->fields('eRegion', array('id','name'))
                    ->condition('eRegion.id', $epalSchool->region_edu_admin_id, '=');
                $epalRegions = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                $epalRegion = reset($epalRegions);

                //εύρεση ονόματος ΔΙΔΕ που ανήκει το σχολείο
                $sCon = $this->connection
					->select('eepal_admin_area_field_data', 'eAdmin')
                    ->fields('eAdmin', array('id','name'))
                    ->condition('eAdmin.id', $epalSchool->edu_admin_id, '=');
                $epalAdmins = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                $epalAdmin = reset($epalAdmins);

                //εύρεση αριθμού τμημάτων (χωρητικότητα) για κάθε τμήμα της Α' τάξης
                //$epalSchool->capacity_class_a === "0" ||
                if (($capacityEnabled === '0' && ( !isset($epalSchool->capacity_class_a)) )  ||  ($capacityEnabled === "1")) {
					array_push($regionColumn, $epalRegion->name);
					array_push($adminColumn, $epalAdmin->name);
					array_push($schoolNameColumn, $epalSchool->name);
					array_push($schoolSectionColumn, 'Α\' τάξη');
					array_push($capacityColumn, $epalSchool->capacity_class_a);
                }

                //εύρεση αριθμού τμημάτων (χωρητικότητα) για κάθε τομέα της Β' τάξης
                //ΠΡΟΣΟΧΗ: χειρισμ΄ός τιμών: 0 (ΟΧΙ??) και null

                $sCon = $this->connection
					->select('eepal_sectors_in_epal_field_data', 'eSchool')
                    ->fields('eSchool', array('sector_id','capacity_class_sector'))
                    ->condition('eSchool.epal_id', $epalSchool->id, '=');
                //$db_or = db_or();
                //$db_or->condition('eSchool.capacity_class_sector', 0, '=');
                //$db_or->condition('eSchool.capacity_class_sector', null, 'is');
                //$sCon->condition($db_or) ;
                if ($capacityEnabled === "0") {
                    $sCon->condition( db_or()
						//->condition('eSchool.capacity_class_sector', 0, '=')
						->condition('eSchool.capacity_class_sector', null, 'is')  ) ;
                }
                $sectorsInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                foreach ($sectorsInEpals as $sectorsInEpal) {
                    $sCon = $this->connection
						->select('eepal_sectors_field_data', 'eSectors')
                        ->fields('eSectors', array('name'))
                        ->condition('eSectors.id', $sectorsInEpal->sector_id, '=');

                    $sectorsNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                    foreach ($sectorsNamesInEpals as $sectorsNamesInEpal) {
                        array_push($regionColumn, $epalRegion->name);
                        array_push($adminColumn, $epalAdmin->name);
                        array_push($schoolNameColumn, $epalSchool->name);
                        array_push($schoolSectionColumn, 'Β\' τάξη / ' . $sectorsNamesInEpal->name );
                        array_push($capacityColumn, $sectorsInEpal->capacity_class_sector);
                    }   //end foreach sectorsNamesInEpals
                }   //end foreach sectorsInEpal

                //εύρεση αριθμού τμημάτων (χωρητικότητα) για κάθε ειδικότητα της Γ' τάξης
                $sCon = $this->connection
					->select('eepal_specialties_in_epal_field_data', 'eSchool')
                    ->fields('eSchool', array('specialty_id', 'capacity_class_specialty'))
                    ->condition('eSchool.epal_id', $epalSchool->id, '=');

                if ($capacityEnabled === "0") {
					$sCon->condition( db_or()
						//->condition('eSchool.capacity_class_specialty', 0, '=')
						->condition('eSchool.capacity_class_specialty', null, 'is')  ) ;
                }

                $specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                foreach ($specialtiesInEpals as $specialtiesInEpal) {
					$sCon = $this->connection
						->select('eepal_specialty_field_data', 'eSpecialties')
                        ->fields('eSpecialties', array('name'))
                        ->condition('eSpecialties.id', $specialtiesInEpal->specialty_id, '=');

					$specialtiesNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                    foreach ($specialtiesNamesInEpals as $specialtiesNamesInEpal) {
						array_push($regionColumn, $epalRegion->name);
						array_push($adminColumn, $epalAdmin->name);
						array_push($schoolNameColumn, $epalSchool->name);
						array_push($schoolSectionColumn, 'Γ\' τάξη / ' . $specialtiesNamesInEpal->name );
						array_push($capacityColumn, $specialtiesInEpal->capacity_class_specialty);
                    }   //end foreach $specialtiesNamesInEpal
                } //end foreach $specialtiesInEpals

                //εύρεση αριθμού τμημάτων (χωρητικότητα) για κάθε ειδικότητα της Δ' τάξης
                $sCon = $this->connection
					->select('eepal_specialties_in_epal_field_data', 'eSchool')
                    ->fields('eSchool', array('specialty_id', 'capacity_class_specialty_d'))
                    ->condition('eSchool.epal_id', $epalSchool->id, '=');

                if ($capacityEnabled === "0") {
					$sCon->condition( db_or()
						//->condition('eSchool.capacity_class_specialty_d', 0, '=')
						->condition('eSchool.capacity_class_specialty_d', null, 'is')  ) ;
                }

                $specialtiesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);

                foreach ($specialtiesInEpals as $specialtiesInEpal) {
					$sCon = $this->connection
						->select('eepal_specialty_field_data', 'eSpecialties')
                        ->fields('eSpecialties', array('name'))
                        ->condition('eSpecialties.id', $specialtiesInEpal->specialty_id, '=');

					$specialtiesNamesInEpals = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
                    foreach ($specialtiesNamesInEpals as $specialtiesNamesInEpal) {
                        if ($epalSchool->operation_shift === "ΕΣΠΕΡΙΝΟ") {
                            array_push($regionColumn, $epalRegion->name);
                            array_push($adminColumn, $epalAdmin->name);
                            array_push($schoolNameColumn, $epalSchool->name);
                            array_push($schoolSectionColumn, 'Δ\' τάξη / ' . $specialtiesNamesInEpal->name );
                            array_push($capacityColumn, $specialtiesInEpal->capacity_class_specialty_d);
                        }
                    }   //end foreach $specialtiesNamesInEpal
                } //end foreach $specialtiesInEpals

                //εισαγωγή εγγραφών στο tableschema
                for ($j = 0; $j < sizeof($schoolNameColumn); $j++) {
					array_push($list, (object) array(
						'name' => $schoolNameColumn[$j],
						'region' => $regionColumn[$j],
						'admin' => $adminColumn[$j],
						'section' => $schoolSectionColumn[$j],
						'capacity' => $capacityColumn[$j],
					));
                }
            } //end foreach school

            return $this->respondWithStatus($list, Response::HTTP_OK);
        } //end try

        catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
				"message" => t("An unexpected problem occured during makeReportNoCapacity Method")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function retrieveUpLimit()
    {

        //βρες ανώτατο επιτρεπόμενο όριο μαθητών
        //$limitup = 1;
        try {
            $sCon = $this->connection
				->select('epal_class_limits', 'eSchool')
                ->fields('eSchool', array('name', 'limit_up'))
                ->condition('eSchool.name', '1', '=');
            $epalLimitUps = $sCon->execute()->fetchAll(\PDO::FETCH_OBJ);
            $epalLimitUp = reset($epalLimitUps);
            //$limitup = $epalLimitUp->limit_up;
            //return $limitup;
            return $epalLimitUp->limit_up;
        } catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return -1;
        }
    }

    /**
     * Check if $user, under $role, can issue the report on the 
     * designated region, admin area and school.
     *
     * @return boolean 
     */
    protected function canReportOn($user, $role, $regionId, $adminId, $schId)
    {
        if ($role === 'ministry') {
            $can = true;
        } elseif ($role === 'regioneduadmin') {
            $can = (
                ($user->init->value == $regionId)
                && (($adminId == 0) || $this->isAdminUnderRegion($adminId, $regionId))
            );
        } elseif ($role === 'eduadmin') {
            $can = (
                ($user->init->value == $adminId)
                && (($regionId == 0) || $this->isAdminUnderRegion($adminId, $regionId))
                && (($schId == 0) || $this->isSchoolUnderAdmin($schId, $adminId))
            );
        } else {
            $can = false;
        }
        return $can;
    }

    protected function isSchoolUnderAdmin($schId, $adminId)
    {
        $map = $this->entityTypeManager
            ->getStorage('eepal_school')
            ->loadByProperties([
                'id' => $schId,
                'edu_admin_id' => $adminId,
            ]);
        $existing_map = reset($map);
        if (!$existing_map) {
            return false;
        } else {
            return true;
        }
    }

    protected function isAdminUnderRegion($adminId, $regionId)
    {
        $map = $this->entityTypeManager
            ->getStorage('eepal_admin_area')
            ->loadByProperties([
                'id' => $adminId,
                'region_to_belong' => $regionId,
            ]);
        $existing_map = reset($map);
        if (!$existing_map) {
            return false;
        } else {
            return true;
        }
    }

    private function respondWithStatus($arr, $s)
    {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);
        return $res;
    }
}
