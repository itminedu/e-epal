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

use FPDF;
use Drupal\epal\Crypt;

define("ERROR_DECODING", -1);

class PDFCreator extends ControllerBase {

	protected $entity_query;
	protected $entityTypeManager;
	protected $logger;
	protected $connection;
	protected $pdf;
	protected $fontLight;
	protected $fontBold;
	protected $fontSizeHeader;
	protected $fontSizeRegular;
	protected $crypt;

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

	public function createApplicantPDF(Request $request, $studentId) {

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

			 //test
			 /*
			return $this->respondWithStatus([
							'message' => t("User:") . $authToken,
					], Response::HTTP_FORBIDDEN);
			*/

			 //Epal-user validation

			 $authToken = $request->headers->get('PHP_AUTH_USER');
			 $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
			 $epalUser = reset($epalUsers);
			 if ($epalUser) {
					 $userid = $epalUser->id();
					 $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('epaluser_id' => $userid));
					   if (!$epalStudents) {
							 return $this->respondWithStatus([
											'message' => t("EPAL User not found"),
									], Response::HTTP_FORBIDDEN);
						 }
			 }

			 //user role validation

			 $roles = $user->getRoles();
			 $validRole = false;
			 foreach ($roles as $role)
				 if ($role === "applicant") {
					 $validRole = true;
					 break;
				 }

				 /*
 				 return $this->respondWithStatus([
 	 							'message' => t("User Role:") . $role,
 	 					], Response::HTTP_FORBIDDEN);
				 */

			 if (!$validRole) {
					 return $this->respondWithStatus([
									 'message' => t("User Invalid Role"),
							 ], Response::HTTP_FORBIDDEN);
			 }

			 //$user->id()


			 $epalStudents = $this->entityTypeManager->getStorage('epal_student')->loadByProperties(array('id'=> $studentId));
			  if (sizeof($epalStudents) === 1) {
						$epalStudent = reset($epalStudents);
				}
				else {
					return $this->respondWithStatus([
						"message" => t("No such a studentId Or double studentId")
					], Response::HTTP_INTERNAL_SERVER_ERROR);
				}

			 $this->fontLight = "open-sans.light";
			 $this->fontBold = "open-sans.bold";
			 $this->fontSizeHeader = 14;
			 $this->fontSizeRegular = 11;

			 $this->initPdfHandler();
			 $this->createHeader($epalStudent);
			 $ret = $this->createGuardianInfo($epalStudent);
			 if ($ret === ERROR_DECODING)
				 return $this->respondWithStatus([
	 				"message" => t("An unexpected error occured during DECODING data in createGuardianInfo Method ")
	 			], Response::HTTP_INTERNAL_SERVER_ERROR);
			 $ret = $this->createStudentInfo($epalStudent);
			 if ($ret === ERROR_DECODING)
				 return $this->respondWithStatus([
	 				"message" => t("An unexpected error occured during DECODING data in createStudentInfo Method ")
	 			], Response::HTTP_INTERNAL_SERVER_ERROR);
			 $this->createStudentChoices($epalStudent);

			 //$this->pdf->Close(); // Δεν χρειάζεται, το κάνει η Output
			 $s = $this->pdf->Output("S", "export.pdf", true);

			 $response = new Response($s, Response::HTTP_OK, ['Content-Type', 'application/pdf']);
			 return $response;
		} //end try
		catch (\Exception $e) {
			$this->logger->warning($e->getMessage());
			return $this->respondWithStatus([
				"message" => t("An unexpected problem occured during createApplicantPDF Method ")
			], Response::HTTP_INTERNAL_SERVER_ERROR);
		}

	}



	private function initPdfHandler()	{

		$this->pdf = new FPDF();
		$this->pdf->AliasNbPages();
		$this->pdf->AddPage();

		$this->pdf->AddFont($this->fontLight, '', 'open-sans.light.php');
		$this->pdf->AddFont($this->fontBold, '', 'open-sans.bold.php');

		$this->crypt = new Crypt();

	}

	private function createHeader($student)	{

		$this->pdf->SetFont($this->fontBold, '', 16);
		$this->pdf->MultiCell(0, 8, $this->prepareString('Ηλεκτρονική Δήλωση Προτίμησης ΕΠΑΛ'), 0, 'C');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->MultiCell(0, 8, $this->prepareString('με αριθμό δήλωσης: ' . $student->id->value . ' / ' .  date('d-m-y (ώρα: H:i:s)',  $student->created->value)), 0, 'C');
		$this->pdf->Ln();

	}

	private function createGuardianInfo($student)	{

		$width = 45;
		$height = 8;

		try  {
			$guardian_name_decoded = $this->crypt->decrypt($student->guardian_name->value);
			$guardian_surname_decoded = $this->crypt->decrypt($student->guardian_surname->value);
			$guardian_fathername_decoded = $this->crypt->decrypt($student->guardian_fathername->value);
			$guardian_mothername_decoded = $this->crypt->decrypt($student->guardian_mothername->value);
			$regionaddress_decoded = $this->crypt->decrypt($student->regionaddress->value);
			$regiontk_decoded = $this->crypt->decrypt($student->regiontk->value);
			$regionarea_decoded = $this->crypt->decrypt($student->regionarea->value);
		}
		catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return ERROR_DECODING;
		}

		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->SetFillColor(255,178,102);
		$this->pdf->MultiCell(0, $height, $this->prepareString('Στοιχεία αιτούμενου'), 0, 'C',true);
		$this->pdf->Ln(4);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($guardian_name_decoded), 0, 'L');
		$x_col1=$this->pdf->GetX();$y_col1=$this->pdf->GetY();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Επώνυμο:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($guardian_surname_decoded), 0, 'L');
		$x_col2=$this->pdf->GetX();;$y_col2=$this->pdf->GetY();

		$x = ($y_col1 > $y_col2) ? $x_col1 : $x_col2;
		$y = ($y_col1 > $y_col2) ? $y_col1 : $y_col2;
		$this->pdf->SetXY($x,$y);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα πατέρα:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->guardian_fathername->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($guardian_fathername_decoded), 0, 'L');
		$x_col1=$this->pdf->GetX();$y_col1=$this->pdf->GetY();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μητέρας:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->guardian_mothername->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($guardian_mothername_decoded), 0, 'L');
		$x_col2=$this->pdf->GetX();;$y_col2=$this->pdf->GetY();

		$x = ($y_col1 > $y_col2) ? $x_col1 : $x_col2;
		$y = ($y_col1 > $y_col2) ? $y_col1 : $y_col2;
		$this->pdf->SetXY($x,$y);

		//$fullAddressTxt = $student->regionaddress->value . ', ΤΚ: ' . $student->regiontk->value . ', ' . $student->regionarea->value;
		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		//$regAddressTxt = 'ΤΚ: ' . $student->regiontk->value . ', ' . $student->regionarea->value;
		$regAddressTxt = 'ΤΚ: ' . $regiontk_decoded . ', ' . $regionarea_decoded;
		$this->pdf->Cell($width, $height, $this->prepareString('Διεύθυνση κατοικίας: '), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->regionaddress->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($regionaddress_decoded), 0, 'L');
		$x_col1=$this->pdf->GetX();$y_col1=$this->pdf->GetY();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('ΤΚ - Πόλη: '), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($regAddressTxt), 0, 'L');
		$x_col2=$this->pdf->GetX();;$y_col2=$this->pdf->GetY();

		$x = ($y_col1 > $y_col2) ? $x_col1 : $x_col2;
		$y = ($y_col1 > $y_col2) ? $y_col1 : $y_col2;
		$this->pdf->SetXY($x,$y);

		$this->pdf->Ln();
		//$this->pdf->Ln();

	}

	private function createStudentInfo($student)	{

		$width = 45;
		$height = 8;
		$heightln = 4;

		try  {
			$name_decoded = $this->crypt->decrypt($student->name->value);
			$studentsurname_decoded = $this->crypt->decrypt($student->studentsurname->value);
			$fatherfirstname_decoded = $this->crypt->decrypt($student->fatherfirstname->value);
			$motherfirstname_decoded = $this->crypt->decrypt($student->motherfirstname->value);
			//$certificatetype_decoded = $this->crypt->decrypt($student->certificatetype->value);
			$relationtostudent_decoded = $this->crypt->decrypt($student->relationtostudent->value);
			$telnum_decoded = $this->crypt->decrypt($student->telnum->value);
		}
		catch (\Exception $e) {
				$this->logger->warning($e->getMessage());
				return ERROR_DECODING;
		}

		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->SetFillColor(255,178,102);
		$this->pdf->MultiCell(0, $height, $this->prepareString('Στοιχεία μαθητή'), 0, 'C',true);
		$this->pdf->Ln(4);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μαθητή:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($name_decoded), 0, 'L');
		$x_col1=$this->pdf->GetX();$y_col1=$this->pdf->GetY();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Επώνυμο μαθητή:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->studentsurname->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($studentsurname_decoded), 0, 'L');
		$x_col2=$this->pdf->GetX();;$y_col2=$this->pdf->GetY();

		$x = ($y_col1 > $y_col2) ? $x_col1 : $x_col2;
		$y = ($y_col1 > $y_col2) ? $y_col1 : $y_col2;
		$this->pdf->SetXY($x,$y);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα πατέρα:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->fatherfirstname->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($fatherfirstname_decoded), 0, 'L');
		$x_col1=$this->pdf->GetX();$y_col1=$this->pdf->GetY();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μητέρας:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->motherfirstname->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($motherfirstname_decoded), 0, 'L');
		$x_col2=$this->pdf->GetX();;$y_col2=$this->pdf->GetY();

		$x = ($y_col1 > $y_col2) ? $x_col1 : $x_col2;
		$y = ($y_col1 > $y_col2) ? $y_col1 : $y_col2;
		$this->pdf->SetXY($x,$y);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Ημ/νία γέννησης:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$temp = $student->birthdate->value;
		//$temp2 = date_format(date($temp),'d-m-Y');
		//$temp2 = date("d-m-Y", strtotime($temp));
		$this->pdf->multiCell($width, $height, $this->prepareString(date("d-m-Y", strtotime($student->birthdate->value))), 0, 'L');
		//$this->pdf->multiCell($width, $height, $this->prepareString( $student->birthdate->value), 0, 'L');
		$x_col1=$this->pdf->GetX();$y_col1=$this->pdf->GetY();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Τηλ. επικ/νίας:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->multiCell($width, $height, $this->prepareString($student->telnum->value), 0, 'L');
		$this->pdf->multiCell($width, $height, $this->prepareString($telnum_decoded), 0, 'L');
		$x_col2=$this->pdf->GetX();;$y_col2=$this->pdf->GetY();

		$x = ($y_col1 > $y_col2) ? $x_col1 : $x_col2;
		$y = ($y_col1 > $y_col2) ? $y_col1 : $y_col2;
		$this->pdf->SetXY($x,$y);

		$this->pdf->Ln();

		/*
		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Τύπος απολυτηρίου:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($certificatetype_decoded), 0, 'L');
		$this->pdf->Ln();
		*/

		/*
		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Έτος κτήσης απολυτηρίου:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($student->graduation_year->value), 0, 'L');
		$this->pdf->Ln();
		*/

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Σχολείο τελευταίας φοίτησης:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell(0, $height, $this->prepareString($student->lastschool_schoolname->value), 0, 'L');
		//$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Τάξη τελευταίας φοίτησης:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($this->retrieveClassName($student->lastschool_class->value)), 0, 'L');
		$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Σχ.έτος τελευταίας φοίτησης:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($student->lastschool_schoolyear->value), 0, 'L');
		$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Δήλωση από:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		//$this->pdf->Cell($width, $height, $this->prepareString($student->relationtostudent->value), 0, 'L');
		$this->pdf->Cell($width, $height, $this->prepareString($relationtostudent_decoded), 0, 'L');
		$this->pdf->Ln();
		$this->pdf->Ln();

	}

	private function createStudentChoices($student)	{

		$width = 45;
		$height = 8;

		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->SetFillColor(255,178,102);
		$this->pdf->MultiCell(0, $height, $this->prepareString('Επιλεχθέντα σχολεία'), 0, 'C',true);
		$this->pdf->Ln(4);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Τάξη εγγραφής:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($this->retrieveClassName($student->currentclass->value)), 0, 'L');
		$this->pdf->Ln();

		if ($student->currentclass->value === "2")
			$this->createSectorChoice($student);
		else if ($student->currentclass->value === "3" || $student->currentclass->value === "4")
			$this->createCourseChoice($student);

		$this->createSchoolChoices($student);

	}

	private function createSectorChoice($student)	{

		 $width = 45;
		 $height = 8;
		 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);

		 $epalSectors = $this->entityTypeManager->getStorage('epal_student_sector_field')->loadByProperties(array('student_id'=> $student->id->value));
		 $this->pdf->Cell($width, $height, $this->prepareString('Τομέας Επιλογής:'), 0, 'L');
		 if (sizeof($epalSectors) !== 1)	{
	 		 $this->pdf->multiCell(0, $height, $this->prepareString(""), 0, 'L');
		 }
		 else {
			 $epalSector = reset($epalSectors);
			 $sectorId = $epalSector->sectorfield_id->getString();
			 $sectorNames = $this->entityTypeManager->getStorage('eepal_sectors')->loadByProperties(array('id'=> $sectorId));
			 if (sizeof($sectorNames) !== 1)	{
					$this->pdf->multiCell(0, $height, $this->prepareString(""), 0, 'L');
			 }
			 else {
				 $sectorName = reset($sectorNames);
				 $this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		 		 $this->pdf->multiCell(0, $height, $this->prepareString($sectorName->name->value), 0, 'L');
			 }
	 	 }
	   //$this->pdf->Ln();

}

private function createCourseChoice($student)	{

	 $width = 45;
	 $height = 8;
	 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);

	 $epalCourses = $this->entityTypeManager->getStorage('epal_student_course_field')->loadByProperties(array('student_id'=> $student->id->value));
	 $this->pdf->Cell($width, $height, $this->prepareString('Ειδικότητα Επιλογής:'), 0, 'L');
	 if (sizeof($epalCourses) !== 1)	{
		 $this->pdf->multiCell(0, $height, $this->prepareString(""), 0, 'L');
	 }
	 else {
		 $epalCourse = reset($epalCourses);
		 $courseId = $epalCourse->coursefield_id->getString();
		 $courseNames = $this->entityTypeManager->getStorage('eepal_specialty')->loadByProperties(array('id'=> $courseId));
		 if (sizeof($courseNames) !== 1)	{
				$this->pdf->multiCell(0, $height, $this->prepareString(""), 0, 'L');
		 }
		 else {
			 $courseName = reset($courseNames);
			 $this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
			 $this->pdf->multiCell(0, $height, $this->prepareString($courseName->name->value), 0, 'L');
		 }
	 }
	// $this->pdf->Ln();

	 $this->createCorresponingSector($courseName);

	 $this->pdf->Ln();


}

private function createSchoolChoices_Ver1($student)	{

	 //$width = 45;
	 $height = 8;
	 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);

	 $this->pdf->Ln(4);

	 $epalSchools = $this->entityTypeManager->getStorage('epal_student_epal_chosen')->loadByProperties(array('student_id'=> $student->id->value));
	 foreach ($epalSchools as $epalSchool)	{
		 $msg = "";
		 if ($epalSchool->choice_no->value === "1")
		 	$msg = "Πρώτη";
		 else if ($epalSchool->choice_no->value === "2")
			 $msg = "Δεύτερη";
		 else if ($epalSchool->choice_no->value === "3")
			 $msg = "Τρίτη";
		 //$this->pdf->Cell($width, $height, $this->prepareString($txtOrder . ' επιλογή σχολείου προτίμησης :'), 0, 'L');
		 $msg .= " επιλογή σχολείου προτίμησης: ";

		 $epalSchoolNames = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id'=> $epalSchool->epal_id->getString()));
		 $epalSchoolName = reset($epalSchoolNames);

		 $schName = $epalSchoolName->name->value;
		 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		 $this->pdf->Cell(80, $height, $this->prepareString($msg), 0, 'L');
		 $this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		 $this->pdf->multiCell(0, $height, $this->prepareString($schName), 0, 'L');

	 }

}

private function createSchoolChoices($student)	{

	 $width = 45;
	 $height = 8;
	 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);

	 $this->pdf->Ln(4);

	 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
	 $this->pdf->Cell($width, $height, $this->prepareString('Σειρά προτίμησης'), 0, 0,  'L');
	 $this->pdf->multiCell($width, $height, $this->prepareString('ΕΠΑΛ επιλογής'), 0, 'L');


	 /*
	 $epalSchools = $this->entityTypeManager->getStorage('epal_student_epal_chosen')->loadByProperties(array('student_id'=> $student->id->value));
	 foreach ($epalSchools as $epalSchool)	{

		 $epalSchoolNames = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id'=> $epalSchool->epal_id->getString()));
		 $epalSchoolName = reset($epalSchoolNames);

		 $this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		 //$epalSchool->choice_no->value

		 $this->pdf->Cell($width, $height, $this->prepareString($epalSchool->choice_no->value), 0, 0,  'C');
		 $this->pdf->multiCell(4*width, $height, $this->prepareString($epalSchoolName->name->value), 0, 'L');

	 }
	 */

	 for ($i = 0; $i < 3; $i++)	{
		 $epalSchools = $this->entityTypeManager->getStorage('epal_student_epal_chosen')->loadByProperties(array('student_id'=> $student->id->value, 'choice_no'=> $i+1 ));
		 if ($epalSchools)	{
			 $epalSchool = reset($epalSchools);
			 $epalSchoolNames = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id'=> $epalSchool->epal_id->getString()));
			 $epalSchoolName = reset($epalSchoolNames);

			 $this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
			 $this->pdf->Cell($width, $height, $this->prepareString($epalSchool->choice_no->value), 0, 0,  'C');
			 $this->pdf->multiCell(4*width, $height, $this->prepareString($epalSchoolName->name->value), 0, 'L');
		 }
	 }

}





private function createCorresponingSector($course)	{

	$width = 45;
	$height = 8;

	//$this->pdf->Ln();
	$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
	$this->pdf->Cell($width, $height, $this->prepareString('(Τομέας ειδικότητας: '), 0, 'L');
	$sectorId = $course->sector_id->getString();
	$sectorNames = $this->entityTypeManager->getStorage('eepal_sectors')->loadByProperties(array('id'=> $sectorId));
	if (sizeof($sectorNames) !== 1)	{
		 $this->pdf->Cell($width, $height, $this->prepareString(""), 0, 'L');
	}
	else {
		$sectorName = reset($sectorNames);
		$this->pdf->Cell($width, $height, $this->prepareString($sectorName->name->value) . ')', 0, 'L');
	}

}

	private function retrieveClassName($classId)	{
			if ($classId === "1")
				return 'Α\' τάξη';
			else if ($classId === "2")
				return 'Β\' τάξη';
			else if ($classId === "3")
				return 'Γ\' τάξη';
			else if ($classId === "4")
				return 'Δ\' τάξη';
			else
				return 'Μη διαθέσιμη τάξη';
	}

	private function retrieveAgreementLiteral($aggreeId)	{
		if ($aggreeId === "1")
			return 'ΝΑΙ';
		else
			return 'ΟΧΙ';
	}





	private function prepareString($string, $from_encoding = 'UTF-8', $to_encoding = 'ISO-8859-7') {
		return iconv($from_encoding, $to_encoding, $string);
	}



	private function respondWithStatus($arr, $s) {
		$res = new JsonResponse($arr);
		$res->setStatusCode($s);
		return $res;
	}

}
