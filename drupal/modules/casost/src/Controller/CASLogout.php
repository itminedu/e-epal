<?php

namespace Drupal\casost\Controller;

use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

class CASLogout extends ControllerBase
{
    protected $entity_query;
    protected $entityTypeManager;
    protected $logger;
    protected $connection;

    protected $consumer_key = '';
    protected $consumer_secret = '';
    protected $request_token_url;
    protected $user_authorization_url;
    protected $access_token_url;
    protected $signature_method;
    protected $api_url;
    protected $callback_url;
    protected $logout_url;

    public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    QueryFactory $entity_query,
    Connection $connection,
    LoggerChannelFactoryInterface $loggerChannel)
    {
        $this->entityTypeManager = $entityTypeManager;
        $this->entity_query = $entity_query;
        $this->connection = $connection;
        $this->logger = $loggerChannel->get('casost');
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity.manager'),
          $container->get('entity.query'),
          $container->get('database'),
          $container->get('logger.factory')
      );
    }

    public function logoutGo(Request $request)
    {
            $this->logger->warning($e->getMessage());
            $response = new Response();
            $response->setContent('logout ok');
            $response->setStatusCode(Response::HTTP_OK);
            $response->headers->set('Content-Type', 'application/json');
            $trx->rollback();
            return $response;
    }

}
