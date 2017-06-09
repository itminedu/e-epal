<?php

namespace Drupal\epal;

use Symfony\Component\HttpFoundation\Response;
use Exception;

use Drupal\epal\Crypt;

/**
 * Description of Client
 *
 */
class Client
{

    private $_settings = [
        'verbose' => false,
        'ws_endpoint' => '',
        'ws_username' => '',
        'ws_password' => '',
        'NO_SAFE_CURL' => false
    ];
    private $logger; // if this is set and settings sets verbose mode, it will be used for logging

    private $_token = null; // cache JWT
    private $_tokenExpirationTS = null; // try to calculate token expiration time

    public function __construct($settings = [], $logger = null)
    {
        $this->logger = $logger;
        $this->_settings = array_merge($this->_settings, $settings);
        $this->_settings['ws_endpoint_token'] = "{$this->_settings['ws_endpoint']}/oauth2/token";
        $this->_settings['ws_endpoint_token_granttype'] = 'password';
        $this->_settings['ws_endpoint_studentepalcertification'] = "{$this->_settings['ws_endpoint']}/api/epal/GetStudentEpalCertification";
        $this->_settings['ws_endpoint_studentepalpromotion'] = "{$this->_settings['ws_endpoint']}/api/epal/GetStudentEpalPromotion";
        $this->_settings['ws_endpoint_alldidactiyear'] = "{$this->_settings['ws_endpoint']}/api/general/GetAllDidactiYear";
    }

    /**
     * Λαμβάνει το authentication token
     *
     * @return string To authentication header (Bearer <token>) έτοιμο για να μπει στο authorization
     * @throws \Exception
     */
    public function getTokenBearer()
    {
        if ($this->_token !== null && $this->_tokenExpirationTS !== null && intval($this->_tokenExpirationTS) >= time()) {
            $this->log(__METHOD__ . " reusing token");
            return $this->_token;
        }
        $this->_token = null;
        $this->_tokenExpirationTS = null;

        $this->log(__METHOD__ . " new token");

        $headers = [
            'Accept: application/json',
            'Accept-Language: en-gb',
            'Audience: Any',
            // 'Content-Type: application/x-www-form-urlencoded' // should be set by post
            'User-Agent: OSTEAM Client/v1.1 osteam'
        ];

        $payload = http_build_query([
            'username' => $this->_settings['ws_username'],
            'password' => $this->_settings['ws_password'],
            'grant_type' => $this->_settings['ws_endpoint_token_granttype']
        ]);
        $result = $this->post($this->_settings['ws_endpoint_token'], $payload, $headers);
        if ($result['success'] === false) {
            $this->log(__METHOD__ . " Error while calling ws. Diagnostic: {$result['response']}. Response code: {$result['http_status']}", "error");
            throw new Exception("Προέκυψε λάθος κατά την άντληση των στοιχείων.");
        }

        if (($response = json_decode($result['response'], true)) !== null) {
            $this->_tokenExpirationTS = time() + intval($response['expires_in']) - 15; // skip 15 seconds... just in case
            $this->_token = ucfirst($response['token_type']) . " {$response['access_token']}";
            return $this->_token;
        } else {
            $this->log(__METHOD__ . " Error while getting token from response {$result['response']}.", "error");
            throw new Exception("Προέκυψε λάθος κατά την λήψη του token. Αδυναμία άντλησης του token από το response.");
        }
    }

    /**
     * Επιστρέφει λίστα των διδακτικών ετών με κλειδί το id και τιμή το λεκτικό.
     *
     * @return array Associative array με κλειδί το id και τιμή το λεκτικό. Π.χ.
     *  Array (
     *  [1] => 2008 - 2009
     *  [2] => 2011 - 2012
     *  [18] => 2013 - 2014
     *  [24] => 2016 - 2017
     * )
     *
     * @throws \Exception Σε περίπτωση οποιουδήποτε λάθους
     */
    public function getAllDidactiYear()
    {
        $this->log(__METHOD__);

        $headers = [
            'Accept: application/json',
            'Accept-Language: en-gb',
            'Audience: Any',
            'Authorization: ' . $this->getTokenBearer(),
            'User-Agent: OSTEAM Client/v1.1 osteam'
        ];

        $result = $this->get($this->_settings['ws_endpoint_alldidactiyear'], [], $headers); // data as path params...
        if ($result['success'] === false) {
            $this->log(__METHOD__ . " Error while calling ws. Diagnostic: {$result['response']}. Response code: {$result['http_status']}", "error");
            throw new Exception("Προέκυψε λάθος κατά την άντληση των στοιχείων.");
        }

        if (($response = json_decode($result['response'], true)) !== null) {
            return $response;
        } else {
            $this->log(__METHOD__ . " Error while getting data from response {$result['response']}.", "error");
            throw new Exception("Προέκυψε λάθος κατά την λήψη των στοιχείων. Αδυναμία άντλησης στοιχείων από την απάντηση.");
        }
    }

    /**
     *
     * @param string $endpoint_base_url web service url
     * @param int $didactic_year_id {@see getAllDidactiYear()}
     * @param string $lastname  μόνο χαρακτήρες, κενά και μεσαίες παύλες
     * @param string $firstname  μόνο χαρακτήρες, κενά και μεσαίες παύλες
     * @param string $father_firstname μόνο χαρακτήρες, κενά και μεσαίες παύλες
     * @param string $mother_firstname μόνο χαρακτήρες, κενά και μεσαίες παύλες
     * @param string $birthdate ημερομηνίες στη μορφή 4-1-1997 (d-M-yyyy)
     *
     * @return boolean|null
     * @throws \Exception Σε περίπτωση οποιουδήποτε λάθους
     */
    public function getStudentEpalPromotionOrCertification($endpoint_base_url, $didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name)
    {
        $parts = explode('-', $birthdate, 3);
        if (($parts === false) || count($parts) != 3 || checkdate(intval($parts[1]), intval($parts[0]), intval($parts[2])) === false) {
            $this->log(__METHOD__ . " Mallformed birthdate", "error");
            throw new Exception('Η ημερομηνία γέννησης πρέπει να είναι της μορφής Η/Μ/Ε', Response::HTTP_BAD_REQUEST);
        }
        if (mb_strlen($lastname) == 0 || mb_strlen($firstname) == 0 || mb_strlen($father_firstname) == 0 || mb_strlen($mother_firstname) == 0) {
            $this->log(__METHOD__ . " Missing parameters", "error");
            throw new Exception('Όλες οι παράμετροι είναι υποχρεωτικοί', Response::HTTP_BAD_REQUEST);
        }

        $data = [
            'DidacticYearId' => intval($didactic_year_id),
            'LastName' => $lastname,
            'FirstName' => $firstname,
            'FatherFirstName' => $father_firstname,
            'MotherFirstname' => $mother_firstname,
            'BirthDate' => $birthdate,
            'RegistryNo' => $registry_no,
            'LevelName' => $level_name
        ];

        $headers = [
            'Accept: application/json',
            // 'Accept-Language: en-gb',
            'Accept-Language: {"Accept-Language":"en-gb"}', // as per spec provided...
            'Audience: Any',
            'Authorization: ' . $this->getTokenBearer(),
            'User-Agent: OSTEAM Client/v1.1 osteam'
        ];

        $endpoint = $endpoint_base_url . array_reduce($data, function ($c, $v) {
            $c .= "/" . urlencode($v);
            return $c;
        }, '');

        $result = $this->get($endpoint, [], $headers); // data as path params...
        try {
            $crypt = new Crypt();
            $val = 'call:' . print_r($endpoint, true) . ':rcv:' . print_r($result, true);
            $val_enc = $crypt->encrypt($val); 
            $this->log(__METHOD__ . $val_enc, 'info');
        } catch (\Exception $e) {
            $this->log(__METHOD__ . " cannot log encrypted", 'info');
        }

        if ($result['success'] === false) {
            $this->log(__METHOD__ . " Error while calling ws. Diagnostic: {$result['response']}. Response code: {$result['http_status']}", "error");
            throw new Exception("Προέκυψε λάθος κατά την άντληση των στοιχείων.");
        }

        return $result['response'];
    }

    public function getStudentEpalPromotion($didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name)
    {
        $this->log(__METHOD__);
        return $this->getStudentEpalPromotionOrCertification($this->_settings['ws_endpoint_studentepalpromotion'], $didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name);
    }

    public function getStudentEpalCertification($didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name)
    {
        $this->log(__METHOD__);
        return $this->getStudentEpalPromotionOrCertification($this->_settings['ws_endpoint_studentepalcertification'], $didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name);
    }

    protected function setCommonCurlOptions($ch, $uri, $headers)
    {
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_USERAGENT, "OSTEAM Client/v1.1 osteam");
        if (isset($this->_settings['NO_SAFE_CURL']) && $this->_settings['NO_SAFE_CURL'] === true) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        }

        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        if ($this->_settings['verbose']) {
            curl_setopt($ch, CURLOPT_VERBOSE, true);
        }
    }

    public function post($uri, $payload, $headers = [])
    {
        $ch = curl_init();

        $this->setCommonCurlOptions($ch, $uri, $headers);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);

        // log url as appropriate
        try {
            $crypt = new Crypt();
            $uri = $crypt->encrypt($uri);
        } catch (\Exception $e) {
            $uri = '-cannot encrypt-';
        }

        if (curl_errno($ch)) {
            $this->log(__METHOD__ . " Error calling {$uri}. Curl error: " . curl_error($ch) . " Curl info: " . var_export(curl_getinfo($ch), true), "error");
            throw new Exception("Λάθος κατά την κλήση της υπηρεσίας.");
        }
        if (intval(($http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE)) / 100) != 2) {
            return [
                'success' => false,
                'http_status' => $http_code,
                'response' => $result
            ];
        }
        curl_close($ch);
        return [
            'success' => true,
            'http_status' => $http_code,
            'response' => $result
        ];
    }

    public function get($uri, $params = [], $headers = [])
    {
        $ch = curl_init();

        if (is_array($params) && count($params) > 0) {
            $qs = '?' . http_build_query($params);
        } else {
            $qs = '';
        }
        $this->setCommonCurlOptions($ch, "{$uri}{$qs}", $headers);

        // curl_setopt($ch, CURLOPT_HTTPGET, true); // default
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);

        // log url as appropriate
        try {
            $crypt = new Crypt();
            $uri = $crypt->encrypt($uri);
        } catch (\Exception $e) {
            $uri = '-cannot encrypt-';
        }

        if (curl_errno($ch)) {
            $this->log(__METHOD__ . " Error calling {$uri}. Curl error: " . curl_error($ch) . " Curl info: " . var_export(curl_getinfo($ch), true), "error");
            throw new Exception("Λάθος κατά την κλήση της υπηρεσίας.");
        }
        if (intval(($http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE)) / 100) != 2) {
            return [
                'success' => false,
                'http_status' => $http_code,
                'response' => $result
            ];
        }
        curl_close($ch);
        return [
            'success' => true,
            'http_status' => $http_code,
            'response' => $result
        ];
    }

    protected function log($msg, $level = 'info')
    {
        if ($this->logger !== null && $this->_settings['verbose']) {
            switch ($level) {
                case 'info':
                case 'warning':
                case 'error':
                    $this->logger->$level($msg);
                    break;
                default:
                    $this->logger->error($msg);
                    break;
            }
        }
        return;
    }
}
