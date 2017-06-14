<?php

namespace Drupal\epal\Controller;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

use Drupal\epal\Crypt;

class DirectorView extends ControllerBase
{
    protected $entityTypeManager;
    protected $logger;
  //  protected $testSchoolId='0640050';

    public function __construct(
        EntityTypeManagerInterface $entityTypeManager,
        LoggerChannelFactoryInterface $loggerChannel
    ) {

        $this->entityTypeManager = $entityTypeManager;
        $this->logger = $loggerChannel->get('epal-school');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('entity_type.manager'),
            $container->get('logger.factory')
        );
    }



    public function getStudentPerSchool(Request $request, $classId, $sector, $specialit)
    {
        try {
            $authToken = $request->headers->get('PHP_AUTH_USER');

            $epalConfigs = $this->entityTypeManager->getStorage('epal_config')->loadByProperties(array('name' => 'epal_config'));
            $epalConfig = reset($epalConfigs);
            if (!$epalConfig) {
                return $this->respondWithStatus([
                        "error_code" => 3001
                    ], Response::HTTP_FORBIDDEN);
            }
            if ($epalConfig->lock_students->value) {
                return $this->respondWithStatus([
                        "error_code" => 3002
                    ], Response::HTTP_FORBIDDEN);
            }

            $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
            $user = reset($users);
            if ($user) {
                $epalId = $user->init->value;
                $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $epalId));
                $school = reset($schools);
                if (!$school) {
                    $this->logger->warning('no access to this school='.$user->id());
                    return $this->respondWithStatus([
                        "message" => "No access to this school"
                    ], Response::HTTP_FORBIDDEN);
                }


                $userRoles = $user->getRoles();
                $userRole = '';
                foreach ($userRoles as $tmpRole) {
                    if ($tmpRole === 'epal') {
                        $userRole = $tmpRole;
                    }
                }
                if ($userRole === '') {
                    return $this->respondWithStatus([
                             'error_code' => 4003,
                         ], Response::HTTP_FORBIDDEN);
                } elseif ($userRole === 'epal') {
                    $selectIdNew = $selectId;
                    if ($classId == 1) {
                        $selectIdNew = -1;
                    } elseif ($classId == 2) {
                        $selectIdNew = $sector;
                    } else {
                        $selectIdNew = $specialit;
                    }
                    $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $epalId, 'specialization_id' => $selectIdNew, 'currentclass' => $classId));
                }
                $i = 0;
                if ($studentPerSchool) {
                    $list = array();
                    foreach ($studentPerSchool as $object) {
                            $studentId = intval($object->student_id ->getString());
                            $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('id' => $studentId));
                            $epalStudent = reset($epalStudents);
                        if ($epalStudents) {
                            $studentIdNew = $epalStudent->id();
                            $checkstatus = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('student_id' => $studentIdNew));
                            $checkstudentstatus = reset($checkstatus);
                            $sectorName = '';
                            $courseName = '';
                            if ($epalStudent->currentclass->value === '2') {
                                $sectors = $this->entityTypeManager->getStorage('epal_student_sector_field')->loadByProperties(array('student_id' => $studentIdNew));
                                $sector = reset($sectors);
                                if ($sector) {
                                    $sectorName = $this->entityTypeManager->getStorage('eepal_sectors')->load($sector->sectorfield_id->target_id)->name->value;
                                }
                            } elseif ($epalStudent->currentclass->value === '3' || $epalStudent->currentclass->value === '4') {
                                $courses = $this->entityTypeManager->getStorage('epal_student_course_field')->loadByProperties(array('student_id' => $studentIdNew));
                                $course = reset($courses);
                                if ($course) {
                                    $courseName = $this->entityTypeManager->getStorage('eepal_specialty')->load($course->coursefield_id->target_id)->name->value;
                                }
                            }


                                $crypt = new Crypt();
                            try {
                                $name_decoded = $crypt->decrypt($epalStudent->name->value);
                                $studentsurname_decoded = $crypt->decrypt($epalStudent->studentsurname->value);
                                $fatherfirstname_decoded = $crypt->decrypt($epalStudent->fatherfirstname->value);
                                $motherfirstname_decoded = $crypt->decrypt($epalStudent->motherfirstname->value);
                                $regionaddress_decoded = $crypt->decrypt($epalStudent->regionaddress->value);
                                $regiontk_decoded = $crypt->decrypt($epalStudent->regiontk->value);
                                $regionarea_decoded = $crypt->decrypt($epalStudent->regionarea->value);
                                // $certificatetype_decoded = $crypt->decrypt($epalStudent->certificatetype->value); // obsolete
                                $relationtostudent_decoded = $crypt->decrypt($epalStudent->relationtostudent->value);
                                $telnum_decoded = $crypt->decrypt($epalStudent->telnum->value);
                                $guardian_name_decoded = $crypt->decrypt($epalStudent->guardian_name->value);
                                $guardian_surname_decoded = $crypt->decrypt($epalStudent->guardian_surname->value);
                                $guardian_fathername_decoded = $crypt->decrypt($epalStudent->guardian_fathername->value);
                                $guardian_mothername_decoded = $crypt->decrypt($epalStudent->guardian_mothername->value);
                            } catch (\Exception $e) {
                                $this->logger->warning(__METHOD__ . ' Decrypt error: ' . $e->getMessage());
                                return $this->respondWithStatus([
                                "message" => t("An unexpected error occured during DECODING data in getStudentPerSchool Method ")
                                ], Response::HTTP_INTERNAL_SERVER_ERROR);
                            }


                                $list[] = array(
                                'id' => $epalStudent->id(),
                                'name' => $name_decoded,
                                'studentsurname' => $studentsurname_decoded,
                                'fatherfirstname' => $fatherfirstname_decoded,
                                'motherfirstname' => $motherfirstname_decoded,
                                'guardian_name' => $guardian_name_decoded,
                                'guardian_surname' => $guardian_surname_decoded,
                                'guardian_fathername' => $guardian_fathername_decoded,
                                'guardian_mothername' => $guardian_mothername_decoded,
                                'lastschool_schoolname' => $epalStudent->lastschool_schoolname->value,
                                'lastschool_schoolyear' => $epalStudent->lastschool_schoolyear->value,
                                'lastschool_class' => $epalStudent->lastschool_class->value,
                                'currentclass' =>$epalStudent -> currentclass ->value,
                                'currentsector' =>$sectorName,
                                'currentcourse' =>$courseName,
                                'regionaddress' => $regionaddress_decoded,
                                'regiontk' => $regiontk_decoded,
                                'regionarea' => $regionarea_decoded,
                                'certificatetype' => '', // $certificatetype_decoded, // obsolete
                                'graduation_year' => $epalStudent->graduation_year->value,
                                'telnum' => $telnum_decoded,
                                'relationtostudent' => $relationtostudent_decoded,
                                //'birthdate' => substr($epalStudent->birthdate->value, 8, 10) . '/' . substr($epalStudent->birthdate->value, 6, 8) . '/' . substr($epalStudent->birthdate->value, 0, 4),
                                'birthdate' => date("d-m-Y", strtotime($epalStudent->birthdate->value)),
                                'checkstatus' => $checkstudentstatus -> directorconfirm ->value,
                                'created' => date('d/m/Y H:i', $epalStudent -> created ->value),

                            );
                        }
                                ++$i;
                    }
                    return $this->respondWithStatus(
                     $list, Response::HTTP_OK);
                } else {
                       return $this->respondWithStatus([
                    'message' => t('Students not found!'),
                        ], Response::HTTP_FORBIDDEN);
                }
            } else {
                return $this->respondWithStatus([
                'message' => t('User not found!'),
                ], Response::HTTP_FORBIDDEN);
            }
        } catch (\Exception $e) {
            $this->logger->warning($e->getMessage());
            return $this->respondWithStatus([
            'message' => t('Unexpected Error'),
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function ConfirmStudents(Request $request)
    {
        if (!$request->isMethod('POST')) {
            return $this->respondWithStatus(['message' => t('Method Not Allowed')], Response::HTTP_METHOD_NOT_ALLOWED);
        }

        $authToken = $request->headers->get('PHP_AUTH_USER');
        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
            $userRoles = $user->getRoles();
            $userRole = '';
            foreach ($userRoles as $tmpRole) {
                if ($tmpRole === 'epal') {
                    $userRole = $tmpRole;
                }
            }
            if ($userRole === 'epal') {
                if ($content = $request->getContent()) {
                    $postData = json_decode($content);
                    $arr = $postData->students;
                    $type = $postData->type;
                    $valnew = intval($arr);
                    $typen = intval($type);
                    $studentForConfirm = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(['student_id' => $valnew]);
                    $studentConfirm = reset($studentForConfirm);
                    if ($studentConfirm) {
                        if ($typen === 1) {
                            $studentConfirm->set('directorconfirm', 1);
                            $studentConfirm->save();
                            return $this->respondWithStatus(['message' => t('saved')], Response::HTTP_OK);
                        } elseif ($typen === 2) {
                            $studentConfirm->set('directorconfirm', 0);
                            $studentConfirm->save();
                            return $this->respondWithStatus(['message' => t('saved')], Response::HTTP_OK);
                        } elseif ($typen === 3) {
                            unset($studentConfirm->{directorconfirm});
                            $studentConfirm->save();
                            return $this->respondWithStatus(['message' => t('saved')], Response::HTTP_OK);
                        } else {
                            return $this->respondWithStatus(['message' => t('Bad request')], Response::HTTP_FORBIDDEN);
                        }
                    } else {
                        return $this->respondWithStatus(['message' => t('Student not found')], Response::HTTP_FORBIDDEN);
                    }
                } else {
                    return $this->respondWithStatus(['message' => t('post with no data')], Response::HTTP_BAD_REQUEST);
                }
            } else {
                return $this->respondWithStatus(['error_code' => 4003], Response::HTTP_FORBIDDEN);
            }
        } else {
            return $this->respondWithStatus(['message' => t('EPAL user not found')], Response::HTTP_FORBIDDEN);
        }
    }



    public function SaveCapacity(Request $request, $taxi, $tomeas, $specialit)
    {
        if (!$request->isMethod('POST')) {
            return $this->respondWithStatus([
                    'message' => t('Method Not Allowed'),
                ], Response::HTTP_METHOD_NOT_ALLOWED);
        }
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $epalConfigs = $this->entityTypeManager->getStorage('epal_config')->loadByProperties(array('name' => 'epal_config'));
        $epalConfig = reset($epalConfigs);
        if (!$epalConfig) {
            return $this->respondWithStatus([
                    "error_code" => 3001
                ], Response::HTTP_FORBIDDEN);
        }
        if ($epalConfig->lock_capacity->value) {
            return $this->respondWithStatus([
                    "error_code" => 3002
                ], Response::HTTP_FORBIDDEN);
        }

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
            $schoolid = $user->init->value;
            $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));
            $school = reset($schools);
            if (!$school) {
                $this->logger->warning('no access to this school='.$user->id());
                $response = new Response();
                $response->setContent('No access to this school');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');

                return $response;
            }
            $userRoles = $user->getRoles();
            $userRole = '';
            foreach ($userRoles as $tmpRole) {
                if ($tmpRole === 'epal') {
                    $userRole = $tmpRole;
                }
            }
            if ($userRole === '') {
                return $this->respondWithStatus([
                             'error_code' => 4003,
                         ], Response::HTTP_FORBIDDEN);
            } elseif ($userRole === 'epal') {
                $postData = null;

                if ($content = $request->getContent()) {
                    $postData = json_decode($content);
                    $cap = $postData->capacity;
                    if ($cap <= 0 || $cap > 99) {
                        return $this->respondWithStatus([
                            'message' => t('Number out of limits!'),
                        ], Response::HTTP_BAD_REQUEST);
                    }

                    if (($tomeas == 0) && ($specialit == 0)) {
                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $classcapacity->set('capacity_class_a', $cap);
                            $classcapacity->save();
                        }
                    }

                    if (($tomeas != 0) && ($specialit == 0)) {
                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'sector_id' => $tomeas));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $classcapacity->set('capacity_class_sector', $cap);
                            $classcapacity->save();
                        }
                    }

                    if (($specialit != 0) && ($taxi == 3)) {
                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'specialty_id' => $specialit));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $classcapacity->set('capacity_class_specialty', $cap);
                            $classcapacity->save();
                        }
                    }

                    if (($specialit != 0) && ($taxi == 4)) {
                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'specialty_id' => $specialit));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $classcapacity->set('capacity_class_specialty_d', $cap);
                            $classcapacity->save();
                        }
                    }

                    return $this->respondWithStatus([
                            'message' => t('saved'),
                        ], Response::HTTP_OK);
                }
            } else {
                return $this->respondWithStatus([
                    'message' => t('post with no data'),
                ], Response::HTTP_BAD_REQUEST);
            }
        } else {
            return $this->respondWithStatus([
                    'message' => t('EPAL user not found'),
                ], Response::HTTP_FORBIDDEN);
        }
    }



    public function getSchools(Request $request)
    {
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
            $selectionId = $user->init->value;
            $userRoles = $user->getRoles();
            $userRole = '';
            foreach ($userRoles as $tmpRole) {
                if (($tmpRole === 'epal') || ($tmpRole === 'regioneduadmin') || ($tmpRole === 'eduadmin')) {
                    $userRole = $tmpRole;
                }
            }
            $this->logger->warning('userRole='.$userRole);
            if ($userRole === '') {
                return $this->respondWithStatus([
                             'error_code' => 4003,
                         ], Response::HTTP_FORBIDDEN);
            } elseif ($userRole === 'regioneduadmin') {
                $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('region_edu_admin_id' => $selectionId));
            } elseif ($userRole === 'eduadmin') {
                $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('edu_admin_id' => $selectionId));
            }
            if ($schools) {
                $list = array();

                foreach ($schools as $object) {
                    $status = $this->returnstatus($object->id());
                    $list[] = array(
                                    'id' => $object->id(),
                                    'name' => $object->name->value,
                                    'status' => $status,
                                    );

                    ++$i;
                }

                return $this->respondWithStatus(
                                     $list, Response::HTTP_OK);
            } else {
                return $this->respondWithStatus([
                            'message' => t('Perfecture not found!'),
                        ], Response::HTTP_FORBIDDEN);
            }
        } else {
            return $this->respondWithStatus([
                            'message' => t('User not found!'),
                        ], Response::HTTP_FORBIDDEN);
        }
    }


    public function getCoursesPerSchool(Request $request, $schoolid)
    {
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
            $newid = $user->init->value;
            $userRoles = $user->getRoles();
            $userRole = '';
            foreach ($userRoles as $tmpRole) {
                if (($tmpRole === 'regioneduadmin') || ($tmpRole === 'eduadmin')) {
                    $userRole = $tmpRole;
                }
            }
            if ($userRole === '') {
                return $this->respondWithStatus([
                             'error_code' => 4003,
                         ], Response::HTTP_FORBIDDEN);
            } elseif ($userRole === 'regioneduadmin') {
                $SchoolCats = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid, 'region_edu_admin_id' => $newid));
            } elseif ($userRole === 'eduadmin') {
                $SchoolCats = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid, 'edu_admin_id' => $newid));
            }

            $SchoolCat = reset($SchoolCats);
            if ($SchoolCat) {
                $list = array();
                $categ = $SchoolCat->metathesis_region->value;
            }
//            $CourseA = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('id' => $schoolid));
            $CourseA = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid));

            if ($CourseA) {
                $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 1, 'category' => $categ));
                $limitdown = reset($limit_down);
                if ($limitdown) {
                    $limit = $limitdown->limit_down->value;
                }
                $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => -1, 'currentclass' => 1));
                $list = array();
                foreach ($CourseA as $object) {
                    $list[] = array(
                                    'id' => '1',
                                    'name' => 'Α Λυκείου',
                                    'size' => sizeof($studentPerSchool),
                                    'categ' => $categ,
                                    'classes' => 1,
                                    'limitdown' => $limit,
                                    );
                }
            }

            $CourseB = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid));
            if ($CourseB) {
                $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 2, 'category' => $categ));
                $limitdown = reset($limit_down);
                if ($limitdown) {
                    $limit = $limitdown->limit_down->value;
                }

                foreach ($CourseB as $object) {
                    $sectorid = $object->sector_id->entity->id();
                    $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $sectorid, 'currentclass' => 2));
                    $list[] = array(
                            'id' => $object->sector_id->entity->id(),
                            'name' => 'Β Λυκείου  '.$object->sector_id->entity->get('name')->value,
                            'size' => sizeof($studentPerSchool),
                            'categ' => $categ,
                            'classes' => 2,
                            'limitdown' => $limit,

                          );
                }
            }
            $CourseC = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid));
            if ($CourseC) {
                $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 3, 'category' => $categ));
                $limitdown = reset($limit_down);
                if ($limitdown) {
                    $limit = $limitdown->limit_down->value;
                }

                foreach ($CourseC as $object) {
                    $specialityid = $object->specialty_id->entity->id();
                    $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $specialityid, 'currentclass' => 3));

                    $list[] = array(
                            'id' => $object->specialty_id->entity->id(),
                            'name' => 'Γ Λυκείου  '.$object->specialty_id->entity->get('name')->value,
                            'size' => sizeof($studentPerSchool),
                            'categ' => $categ,
                            'classes' => 3,
                            'limitdown' => $limit,

                          );
                }
            }
            if ($CourseA || $CourseB || $CourseC) {
                return $this->respondWithStatus(
                                     $list, Response::HTTP_OK);
            } else {
                return $this->respondWithStatus([
                            'message' => t('Perfecture not found!'),
                        ], Response::HTTP_FORBIDDEN);
            }
        } else {
            return $this->respondWithStatus([
                            'message' => t('User not found!'),
                        ], Response::HTTP_FORBIDDEN);
        }
    }

    public function returnstatus($id)
    {
        $schoolid = $id;
        $SchoolCats = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));
        $SchoolCat = reset($SchoolCats);
        if ($SchoolCat) {
            $categ = $SchoolCat->metathesis_region->value;
        }
        $CourseA = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('id' => $schoolid));

        if ($CourseA) {
            $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 1, 'category' => $categ));
            $limitdown = reset($limit_down);
            if ($limitdown) {
                $limit = $limitdown->limit_down->value;
            }
            $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => -1, 'currentclass' => 1));

                    //foreach ($CourseA as $object) {
            if (sizeof($studentPerSchool) < $limit) {
                return false;
//                                exit;
            }
        }          //  }

                $CourseB = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid));
        if ($CourseB) {
            $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 2, 'category' => $categ));
            $limitdown = reset($limit_down);
            if ($limitdown) {
                $limit = $limitdown->limit_down->value;
            }

            foreach ($CourseB as $object) {
                $sectorid = $object->sector_id->entity->id();
                $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $sectorid, 'currentclass' => 2));
                if (sizeof($studentPerSchool) < $limit) {
                    return false;
                    exit;
                }
            }
        }
        $CourseC = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid));
        if ($CourseC) {
            $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 3, 'category' => $categ));
            $limitdown = reset($limit_down);
            if ($limitdown) {
                $limit = $limitdown->limit_down->value;
            }

            foreach ($CourseC as $object) {
                $specialityid = $object->specialty_id->entity->id();
                $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $specialityid, 'currentclass' => 3));

                if (sizeof($studentPerSchool) < $limit) {
                    return false;
                    exit;
                }
            }
        }

        return true;
    }


    public function FindCapacityPerSchool(Request $request)
    {
        $i = 0;
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
            $schoolid = $user->init->value;
            $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));
            $school = reset($schools);
            if (!$school) {
                $this->logger->warning('no access to this school='.$user->id());
                $response = new Response();
                $response->setContent('No access to this school');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');

                return $response;
            }
            $operation_shift = $school -> operation_shift -> value;
            $userRoles = $user->getRoles();
            $userRole = '';
            foreach ($userRoles as $tmpRole) {
                if ($tmpRole === 'epal') {
                    $userRole = $tmpRole;
                }
            }
            if ($userRole === '') {
                return $this->respondWithStatus([
                             'error_code' => 4003,
                         ], Response::HTTP_FORBIDDEN);
            } elseif ($userRole === 'epal') {
                $categ = $school->metathesis_region->value;
                $list = array();
                $CourseA = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));
                $classcapacity = reset($CourseA);

                if ($classcapacity) {
                    $list[] = array(
                        'class' => 1,
                        'newsector' => 0,
                        'newspecialit' => 0,
                        'taxi' => 'Ά Λυκείου',
                        'capacity' => $classcapacity->capacity_class_a->value,
                        'globalindex' => $i,

                       );
                }
                ++$i;
                $CourseB = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid));
                if ($CourseB) {
                    foreach ($CourseB as $object) {
                        $sectorid = $object->sector_id->entity->id();

                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'sector_id' => $sectorid));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $list[] = array(
                                'class' => 2,
                                'newsector' => $object->sector_id->entity->id(),
                                'newspecialit' => 0,
                                'taxi' => 'Β Λυκείου  '.$object->sector_id->entity->get('name')->value,
                                'capacity' => $classcapacity->capacity_class_sector->value,
                                'globalindex' => $i,
                                 );
                        }
                        ++$i;
                    }
                }
                $CourseC = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid));
                if ($CourseC) {
                    foreach ($CourseC as $object) {
                        $specialityid = $object->specialty_id->entity->id();
                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'specialty_id' => $specialityid));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $list[] = array(
                                'class' => 3,
                                    'newsector' => 0,
                                    'newspecialit' => $object->specialty_id->entity->id(),
                                    'taxi' => 'Γ Λυκείου  '.$object->specialty_id->entity->get('name')->value,
                                    'capacity' => $classcapacity->capacity_class_specialty->value,
                                    'globalindex' => $i,

                            );
                        }
                        ++$i;
                    }
                }

                if ($CourseC && $operation_shift != 'ΗΜΕΡΗΣΙΟ') {
                    foreach ($CourseC as $object) {
                        $specialityid = $object->specialty_id->entity->id();

                        $CapacityPerClass = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid, 'specialty_id' => $specialityid));
                        $classcapacity = reset($CapacityPerClass);
                        if ($classcapacity) {
                            $list[] = array(
                                    'class' => 4,
                                    'newsector' => 0,
                                    'newspecialit' => $object->specialty_id->entity->id(),
                                    'taxi' => 'Δ Λυκείου  '.$object->specialty_id->entity->get('name')->value,
                                    'capacity' => $classcapacity->capacity_class_specialty_d->value,
                                    'globalindex' => $i,
                                  );
                        }
                        ++$i;
                    }
                }

                return $this->respondWithStatus(
                                     $list, Response::HTTP_OK);
            }
        } else {
            return $this->respondWithStatus([
                    'message' => t('EPAL user not found'),
                ], Response::HTTP_FORBIDDEN);
        }
    }


    public function FindCoursesPerSchool(Request $request)
    {
        $i = 0;
        $authToken = $request->headers->get('PHP_AUTH_USER');

        $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
        $user = reset($users);
        if ($user) {
            $schoolid = $user->init->value;
            $schools = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));
            $school = reset($schools);
            if (!$school) {
                $this->logger->warning('no access to this school='.$user->id());
                $response = new Response();
                $response->setContent('No access to this school');
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->headers->set('Content-Type', 'application/json');

                return $response;
            }
            $operation_shift = $school -> operation_shift -> value;
            $userRoles = $user->getRoles();
            $userRole = '';
            foreach ($userRoles as $tmpRole) {
                if ($tmpRole === 'epal') {
                    $userRole = $tmpRole;
                }
            }
            if ($userRole === '') {
                return $this->respondWithStatus([
                             'error_code' => 4003,
                         ], Response::HTTP_FORBIDDEN);
            } elseif ($userRole === 'epal') {
                $categ = $school->metathesis_region->value;
                $list = array();
                $CourseA = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id' => $schoolid));

                if ($CourseA) {
                    $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 1, 'category' => $categ));
                    $limitdown = reset($limit_down);
                    if ($limitdown) {
                        $limit = $limitdown->limit_down->value;
                    }
                    $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => -1, 'currentclass' => 1));

                    $list[] = array(
                        'class' => 1,
                        'newsector' => 0,
                        'newspecialit' => 0,
                        'taxi' => 'Ά Λυκείου',
                        'globalindex' => $i,
                        'limitdown' => $limit,
                        'size' => sizeof($studentPerSchool),
                       );
                }
                ++$i;
                $CourseB = $this->entityTypeManager->getStorage('eepal_sectors_in_epal')->loadByProperties(array('epal_id' => $schoolid));
                if ($CourseB) {
                    $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 2, 'category' => $categ));
                    $limitdown = reset($limit_down);
                    if ($limitdown) {
                        $limit = $limitdown->limit_down->value;
                    }

                    foreach ($CourseB as $object) {
                        $sectorid = $object->sector_id->entity->id();
                        $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $sectorid, 'currentclass' => 2));


                            $list[] = array(
                                'class' => 2,
                                'newsector' => $object->sector_id->entity->id(),
                                'newspecialit' => 0,
                                'taxi' => 'Β Λυκείου  '.$object->sector_id->entity->get('name')->value,
                                'globalindex' => $i,
                                'limitdown' => $limit,
                                'size' => sizeof($studentPerSchool),
                                );

                        ++$i;
                    }
                }
                $CourseC = $this->entityTypeManager->getStorage('eepal_specialties_in_epal')->loadByProperties(array('epal_id' => $schoolid));
                if ($CourseC) {
                    $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 3, 'category' => $categ));
                        $limitdown = reset($limit_down);
                    if ($limitdown) {
                        $limit = $limitdown->limit_down->value;
                    }
                    foreach ($CourseC as $object) {
                        $specialityid = $object->specialty_id->entity->id();
                        $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $specialityid, 'currentclass' => 3));

                        $list[] = array(
                        'class' => 3,
                            'newsector' => 0,
                            'newspecialit' => $object->specialty_id->entity->id(),
                            'taxi' => 'Γ Λυκείου  '.$object->specialty_id->entity->get('name')->value,
                            'globalindex' => $i,
                            'limitdown' => $limit,
                            'size' => sizeof($studentPerSchool),
                        );

                        ++$i;
                    }
                }

                if ($CourseC && $operation_shift != 'ΗΜΕΡΗΣΙΟ') {
                        $limit_down = $this->entityTypeManager->getStorage('epal_class_limits')->loadByProperties(array('name' => 4, 'category' => $categ));
                        $limitdown = reset($limit_down);
                    if ($limitdown) {
                        $limit = $limitdown->limit_down->value;
                    }
                    foreach ($CourseC as $object) {
                        $specialityid = $object->specialty_id->entity->id();
                        $studentPerSchool = $this->entityTypeManager->getStorage('epal_student_class')->loadByProperties(array('epal_id' => $schoolid, 'specialization_id' => $specialityid, 'currentclass' => 4));

                            $list[] = array(
                                    'class' => 4,
                                    'newsector' => 0,
                                    'newspecialit' => $object->specialty_id->entity->id(),
                                    'taxi' => 'Δ Λυκείου  '.$object->specialty_id->entity->get('name')->value,
                                    'globalindex' => $i,
                                    'limitdown' => $limit,
                                    'size' => sizeof($studentPerSchool),

                                    );

                        ++$i;
                    }
                }

                return $this->respondWithStatus(
                                     $list, Response::HTTP_OK);
            }
        } else {
            return $this->respondWithStatus([
                    'message' => t('EPAL user not found'),
                ], Response::HTTP_FORBIDDEN);
        }
    }

    private function respondWithStatus($arr, $s)
    {
        $res = new JsonResponse($arr);
        $res->setStatusCode($s);

        return $res;
    }
}
