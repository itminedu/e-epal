<?php

namespace Drupal\epal;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\epal\Client;

class ClientConsumer 
{
    protected $entityTypeManager;
    protected $logger;
    protected $client;
    protected $settings;
    protected $cached_didactic_years = [
        "1" => "2008 - 2009",
        "2" => "2011 - 2012",
        "3" => "1999 - 2000",
        "4" => "2000 - 2001",
        "5" => "2009 - 2010",
        "6" => "2010 - 2011",
        "7" => "2001 - 2002",
        "8" => "2002 - 2003",
        "9" => "2003 - 2004",
        "10" => "2004 - 2005",
        "11" => "2005 - 2006",
        "12" => "2006 - 2007",
        "13" => "2007 - 2008",
        "17" => "2012 - 2013",
        "18" => "2013 - 2014",
        "22" => "2014 - 2015",
        "23" => "2015 - 2016",
        "24" => "2016 - 2017"
    ];
    protected $cached_level_names = [
        "1" => "Α",
        "2" => "Β",
        "3" => "Γ",
        "4" => "Δ"
    ];

    public function __construct($settings, EntityTypeManagerInterface $entityTypeManager, LoggerChannelFactoryInterface $loggerChannel)
    {
        $this->settings = $settings;
        $this->entityTypeManager = $entityTypeManager;
        $this->logger = $loggerChannel->get('epal-school');
        $this->client = new Client($this->settings, $this->logger);
    }

    public function getAllDidactiYear()
    {
        $ts_start = microtime(true);

        // try {
        //     $catalog = $this->client->getAllDidactiYear();
        // } catch (\Exception $e) {
        //     $catalog = [];
        // }
        $catalog = $this->cached_didactic_years;

        $duration = microtime(true) - $ts_start;
        $this->logger->info(__METHOD__ . " :: timed [{$duration}]");

        return $catalog;
    }

    public function getStudentEpalPromotion($didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name)
    {
        $ts_start = microtime(true);

        try {
            $result = $this->client->getStudentEpalPromotion($didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name);
        } catch (\Exception $e) {
            $result = -1;
        }

        $duration = microtime(true) - $ts_start;
        $this->logger->info(__METHOD__ . " :: timed [{$duration}]");

        return $result;
    }

    public function getStudentEpalCertification($didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name)
    {
        $ts_start = microtime(true);

        try {
            $result = $this->client->getStudentEpalCertification($didactic_year_id, $lastname, $firstname, $father_firstname, $mother_firstname, $birthdate, $registry_no, $level_name);
        } catch (\Exception $e) {
            $result = -1;
        }

        $duration = microtime(true) - $ts_start;
        $this->logger->info(__METHOD__ . " :: timed [{$duration}]");

        return $result;
    }

    /**
     * If $ending is provided 
     *  it is assumed as the second part of the academic-year (i.e. 2017 for 2016-2017),
     *  the function returns the corresponding id to match first;
     * If $id is provided, return the corresponding label.
     * $id has priority over $ending, if both are supplied.
     * 
     * @return null|string null if no input or no info located 
     */
    public function getDidacticYear($ending = null, $id = null)
    {
        $value = null;
        if ($id !== null) {
            if (array_key_exists($id, $this->cached_didactic_years)) {
                $value = $this->cached_didactic_years[$id];
            }
        } elseif ($ending !== null) {
            $remain = array_filter($this->cached_didactic_years, function ($v) use ($ending) {
                $pos = strpos($v, "$ending");
                return ($pos !== false && $pos > 4);
            });
            if (count($remain) > 0) {
                $values = array_keys($remain);
                $value = $values[0];
            }
        }
        return $value;
    }

    /**
     * Get the level name of the denoted class level
     * 
     * @return string|mixed The level name of the provided failsafe value if not found
     */
    public function getLevelName($id, $failsafe_value = 'X')
    {
        $value = $failsafe_value;
        if (array_key_exists($id, $this->cached_level_names)) {
            $value = $this->cached_level_names["$id"];
        }
        return $value;
    }

    private function generateRandomString($length)
    {
        $characters = ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'];
        $charactersLength = count($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
