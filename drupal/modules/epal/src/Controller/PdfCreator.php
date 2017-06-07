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
			 /*
			 return $this->respondWithStatus([
							 'message' => t("User:") . $authToken,
					 ], Response::HTTP_FORBIDDEN);
			 */

			 if (!$user) {
					 return $this->respondWithStatus([
									 'message' => t("User not found"),
							 ], Response::HTTP_FORBIDDEN);
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
				$this->createGuardianInfo($epalStudent);
				$this->createStudentInfo($epalStudent);
				$this->createStudentChoices($epalStudent);





			/*
			// $pdf->SetFont('Arial','B',16);
			$pdf->AddFont('Ubuntu', '', 'Ubuntu-Regular.php');
			$pdf->SetFont('Ubuntu', '', 16);
			$pdf->Cell(40, 10, $this->prepareString('Tούτη εδώ είναι η αίτηση σου'));
			$pdf->Ln(10);
			$pdf->Cell(40, 10, $this->prepareString('Χρονοσήμανση: ') . date('d/m/Y H:i:s'));
			$pdf->Ln(10);
			$pdf->SetFont('Ubuntu','',10);
			for ($i=1; $i<=30; $i++) {
				$pdf->Cell(0, 8 , $this->prepareString('Στοιχείο: ') . $i, 0, 1);
				$pdf->Cell(0, 8 , 'Item: ' . $i, 0, 1);
			}
			*/



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

	}

	private function createHeader($student)	{

		$this->pdf->SetFont($this->fontBold, '', 16);
		$this->pdf->MultiCell(0, 8, $this->prepareString('Ηλεκτρονική Αίτηση Εγγραφής Μαθητή σε ΕΠΑΛ'), 0, 'C');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->MultiCell(0, 8, $this->prepareString('με αριθμό αίτησης: ' . $student->id->value . ' / ' .  date('d-m-y (ώρα: H:i:s)',  $student->created->value)), 0, 'C');
		$this->pdf->Ln();

	}

	private function createGuardianInfo($student)	{

		$width = 45;
		$height = 8;


		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->SetFillColor(255,178,102);
		$this->pdf->MultiCell(0, $height, $this->prepareString('Στοιχεία αιτούμενου'), 0, 'C',true);
		$this->pdf->Ln(4);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->guardian_name->value), 0, 'L');

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Επώνυμο:'), 0, 'L');
		//$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->guardian_surname->value), 0, 'L');
		//$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα πατέρα:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->guardian_fathername->value), 0, 'L');

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μητέρας:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->guardian_mothername->value), 0, 'L');
		//$this->pdf->Ln();

		//$fullAddressTxt = $student->regionaddress->value . ', ΤΚ: ' . $student->regiontk->value . ', ' . $student->regionarea->value;
		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$regAddressTxt = 'ΤΚ: ' . $student->regiontk->value . ', ' . $student->regionarea->value;
		$this->pdf->Cell($width, $height, $this->prepareString('Διεύθυνση κατοικίας: '), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->regionaddress->value), 0, 'L');

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('ΤΚ - Πόλη: '), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($regAddressTxt), 0, 'L');
		$this->pdf->Ln();

		$this->pdf->Ln();


	}

	private function createStudentInfo($student)	{

		$width = 45;
		$height = 8;
		$heightln = 4;

		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeHeader);
		$this->pdf->SetFillColor(255,178,102);
		$this->pdf->MultiCell(0, $height, $this->prepareString('Στοιχεία μαθητή'), 0, 'C',true);
		$this->pdf->Ln(4);

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μαθητή:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->name->value), 0, 'L');

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Επώνυμο μαθητή:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->studentsurname->value), 0, 'L');
		//$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα πατέρα:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->fatherfirstname->value), 0, 'L');

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μητέρας:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->motherfirstname->value), 0, 'L');
		//$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString('Ημ/νία γέννησης:'), 0, 'L');
		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->birthdate->value), 0, 'L');

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->SetXY($x+$width,$y);
		$this->pdf->Cell($width, $height, $this->prepareString('Τηλ. επικ/νίας:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->multiCell($width, $height, $this->prepareString($student->telnum->value), 0, 'L');
		$this->pdf->Ln();
		//$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Τύπος απολυτηρίου:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($student->certificatetype->value), 0, 'L');
		$this->pdf->Ln();

		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
		$this->pdf->Cell($width+15, $height, $this->prepareString('Έτος κτήσης απολυτηρίου:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($student->graduation_year->value), 0, 'L');
		$this->pdf->Ln();

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
		$this->pdf->Cell($width+15, $height, $this->prepareString('Αίτηση από:'), 0, 'L');
		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		$this->pdf->Cell($width, $height, $this->prepareString($student->relationtostudent->value), 0, 'L');
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

	 //$this->pdf->Ln();
	 //$x=$this->pdf->GetX(); $y=$this->pdf->GetY();

	 $epalSchools = $this->entityTypeManager->getStorage('epal_student_epal_chosen')->loadByProperties(array('student_id'=> $student->id->value));
	 foreach ($epalSchools as $epalSchool)	{

		 $epalSchoolNames = $this->entityTypeManager->getStorage('eepal_school')->loadByProperties(array('id'=> $epalSchool->epal_id->getString()));
		 $epalSchoolName = reset($epalSchoolNames);

		 $this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
		 //$epalSchool->choice_no->value

		 $this->pdf->Cell($width, $height, $this->prepareString($epalSchool->choice_no->value), 0, 0,  'C');
		 $this->pdf->multiCell(4*width, $height, $this->prepareString($epalSchoolName->name->value), 0, 'L');
		 //$this->pdf->Ln();




		 //....
		 /*
		 $this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
 		$this->pdf->Cell($width, $height, $this->prepareString('Όνομα μαθητή:'), 0, 'L');
 		$x=$this->pdf->GetX(); $y=$this->pdf->GetY();
 		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
 		$this->pdf->multiCell($width, $height, $this->prepareString($student->name->value), 0, 'L');

 		$this->pdf->SetFont($this->fontLight, '', $this->fontSizeRegular);
 		$this->pdf->SetXY($x+$width,$y);
 		$this->pdf->Cell($width, $height, $this->prepareString('Επώνυμο μαθητή:'), 0, 'L');
 		$this->pdf->SetFont($this->fontBold, '', $this->fontSizeRegular);
 		$this->pdf->multiCell($width, $height, $this->prepareString($student->studentsurname->value), 0, 'L');
		*/

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
