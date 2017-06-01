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

	public function createApplicantPDF(Request $request) {

		try {
			 if (!$request->isMethod('GET')) {
				return $this->respondWithStatus([
					"message" => t("Method Not Allowed")
				], Response::HTTP_METHOD_NOT_ALLOWED);
			 }

			 /*
			 $authToken = $request->headers->get('PHP_AUTH_USER');
			 $epalUsers = $this->entityTypeManager->getStorage('epal_users')->loadByProperties(array('authtoken' => $authToken));
			 $epalUser = reset($epalUsers);
			 if ($epalUser)	{
					 //$userid = $epalUser -> id();
					 $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
					 $user = reset($users);
					 if (!$user) {
							 return $this->respondWithStatus([
											 'message' => t("User not found"),
									 ], Response::HTTP_FORBIDDEN);
					 }
				 }
				 */

			 //user validation
			 /*
			 $authToken = $request->headers->get('PHP_AUTH_USER');
			 $users = $this->entityTypeManager->getStorage('user')->loadByProperties(array('name' => $authToken));
			 $user = reset($users);


			 return $this->respondWithStatus([
							 'message' => t("User:") . $authToken,
					 ], Response::HTTP_FORBIDDEN);


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


 				 return $this->respondWithStatus([
 	 							'message' => t("User Role:") . $role,
 	 					], Response::HTTP_FORBIDDEN);


			 if (!$validRole) {
					 return $this->respondWithStatus([
									 'message' => t("User Invalid Role"),
							 ], Response::HTTP_FORBIDDEN);
			 }
			 */
			 //$user->id()

			$pdf = new FPDF();
			$pdf->AliasNbPages();
			$pdf->AddPage();

			//Mine
			//$pdf->SetFont('Arial','B',16);
			//$pdf->Cell(40,10,'Hello World! This is a funny day!!!!Hello World! This is a funny day!!!!Hello World! This is a funny day!!!!');
			$pdf->AddFont('open-sans.light', '', 'open-sans.light.php');
			$pdf->SetFont('open-sans.light', '', 16);
			$pdf->Cell(40,10, $this->prepareString('Καλό Καλοκαίρι!!!'));
			//End Mine

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



			$pdf->Close(); // Δεν χρειάζεται, το κάνει η Output
			//$s = $pdf->Output("S", "export.pdf", true);
			$s = $pdf->Output("S", "export.pdf", true);

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

	private function prepareString($string, $from_encoding = 'UTF-8', $to_encoding = 'ISO-8859-7') {
		return iconv($from_encoding, $to_encoding, $string);
	}
		// OBSOLETE
		// public  function array_utf8_encode($dat)
		// {
		//     if (is_string($dat))
		//         return utf8_encode($dat);
		//     if (!is_array($dat))
		//         return $dat;
		//     $ret = array();
		//     foreach ($dat as $i => $d)
		//         $ret[$i] = self::array_utf8_encode($d);
		//     return $ret;
		// }

	private function respondWithStatus($arr, $s) {
		$res = new JsonResponse($arr);
		$res->setStatusCode($s);
		return $res;
	}

}
