<?php

namespace Drupal\epal;

use Defuse\Crypto\Key;
use Defuse\Crypto\Crypto;
use \Exception;

class Crypt
{

    private $fname; // store

    public function __construct($fname)
    {
        if (is_string($fname)) {
            $this->fname = $fname;
        } else {
            $this->fname = __DIR__ . "/../../../../../../app.txt";
        }
    }

    /**
     * @throws \Exception If key is not found
     * @return string The key to use
     */
    protected function loadKey()
    {
        if (!is_readable($this->fname) || !is_file($this->fname)) {
            throw new \Exception(__METHOD__ . ':: No file');
        }
        $keystring = file_get_contents($this->fname);
        if ($keystring === false) {
            throw new \Exception(__METHOD__ . ':: Cannot load file');
        }
        return Key::loadFromAsciiSafeString($keystring);
    }

    /**
     * Provided a string value, encrypt and return encrypted value
     *
     * @throws \Defuse\Crypto\Exception\EnvironmentIsBrokenException if encryption cannot be performed
     * @throws \Exception If value to encode is not string
     * @return hex encoded encrypted value
     */
    public function encrypt($data)
    {
        if (!is_string($data)) {
            throw new \Exception("Data to be encoded can only be strings");
        }
        $key = $this->loadKey();
        $dataenc = Crypto::encrypt($data, $key);
        return $dataenc;
    }

    /**
     * Provided a hex encoded encrypted value, decrypt and return original value
     *
     * @throws \Defuse\Crypto\Exception\WrongKeyOrModifiedCiphertextException if decrypt failed!
     * @return string the original value
     */
    public function decrypt($dataenc)
    {
        $key = $this->loadKey();
        $data = Crypto::decrypt($dataenc, $key);
        return $data;
    }
}
