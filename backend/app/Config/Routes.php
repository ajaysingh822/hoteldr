<?php

use CodeIgniter\Router\RouteCollection;
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');


/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('api/payment/save', 'PaymentController::save');
$routes->options('api/payment/save', function () {
    return service('response')->setStatusCode(200);
});
$routes->get('api/admin/total-sale', 'AdminController::totalSale');
