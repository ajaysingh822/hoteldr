<?php

use CodeIgniter\Router\RouteCollection;
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');


/**
 * @var RouteCollection $routes
 */
//auth
$routes->post('api/login', 'AuthController::login');

$routes->group('api', ['filter' => 'auth'], function($routes) {

  $routes->get('/', 'Home::index');

  $routes->post('payment/save', 'PaymentController::save');

  $routes->get('admin/total-sale', 'AdminController::totalSale');

  // hotel
  $routes->post('check-in', 'GuestController::checkIn');
  $routes->get('guests/checked-in', 'GuestController::checkedInGuests');
  $routes->get('guest/(:num)', 'GuestController::getGuest/$1');
  $routes->post('checkout/(:num)', 'GuestController::checkout/$1');
  $routes->get('dashboard', 'HotelDashboardController::index');
  $routes->get('history', 'HistoryController::index');

  // extra charges
  $routes->post('extra-charges/bulk', 'ExtraChargeController::addBulk');
  $routes->get('extra-charges/(:num)', 'ExtraChargeController::getByGuest/$1');
  $routes->delete('extra-charges/(:num)', 'ExtraChargeController::delete/$1');
  $routes->get('history/(:num)', 'HistoryController::view/$1');

});
