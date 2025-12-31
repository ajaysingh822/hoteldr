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
//api
//admin 

$routes->get('api/admin/total-sale', 'AdminController::totalSale');

//hotel dr api routes
$routes->post('api/check-in', 'GuestController::checkIn');
$routes->get('api/guests/checked-in', 'GuestController::checkedInGuests');
$routes->get('api/guest/(:num)', 'GuestController::getGuest/$1');
$routes->post('api/checkout/(:num)', 'GuestController::checkout/$1');
$routes->get('api/dashboard', 'HotelDashboardController::index');
$routes->get('api/history', 'HistoryController::index');

 // Extra Charges
 // Extra Charges
$routes->post('api/extra-charges/bulk', 'ExtraChargeController::addBulk');
$routes->get('api/extra-charges/(:num)', 'ExtraChargeController::getByGuest/$1');
$routes->delete('api/extra-charges/(:num)', 'ExtraChargeController::delete/$1');
$routes->get('api/history/(:num)', 'HistoryController::view/$1');

