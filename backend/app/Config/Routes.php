<?php

namespace Config;

use CodeIgniter\Config\Services;
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes = Services::routes();

/*
 * Default Route Settings
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

// ================= AUTH =================
$routes->post('api/login', 'AuthController::login');
    $routes->post('api/admin/login', 'AdminController::login');
    $routes->post('api/admin/logout', 'AdminController::logout');
    $routes->get('me', 'AdminController::me');

// ============ HOTEL (AUTH REQUIRED) ============
$routes->group('api', ['filter' => 'auth'], function ($routes) {

    $routes->get('/', 'Home::index');

  $routes->get('admin/total-sale', 'AuthController::totalSale');
$routes->post('admin/change-password', 'AuthController::changePassword');

// $routes->get('admin/counters', 'AdminController::counters');


// ============ RESTAURANT (NO AUTH) ============
$routes->post('payment/save', 'PaymentController::save');
$routes->get('payment/history', 'PaymentController::history');


// RESTAURANT HISTORY (NO AUTH)
$routes->get('restaurant/history', 'RestaurantHistoryController::index');
// RESTAURANT HISTORY
$routes->get('restaurant/payments', 'PaymentController::all');
$routes->get('restaurant/payments/today', 'PaymentController::today');
$routes->get('extra-charges/today-grand', 'ExtraChargeController::todayGrandTotal');
$routes->get('extra-charges/month-grand', 'ExtraChargeController::monthGrandTotal');
$routes->get('extra-charges/range-grand', 'ExtraChargeController::rangeGrandTotal');



  // hotel
  $routes->post('check-in', 'GuestController::checkIn');
  $routes->get('guests/checked-in', 'GuestController::checkedInGuests');
  $routes->get('guest/(:num)', 'GuestController::getGuest/$1');
  $routes->post('checkout/(:num)', 'GuestController::checkout/$1');
  $routes->get('dashboard', 'HotelDashboardController::index');
  $routes->get('history', 'HistoryController::index');

    // EXTRA CHARGES
    $routes->post('extra-charges/bulk', 'ExtraChargeController::addBulk');
    $routes->get('extra-charges/(:num)', 'ExtraChargeController::getByGuest/$1');
    $routes->delete('extra-charges/(:num)', 'ExtraChargeController::delete/$1');
    $routes->get('history/(:num)', 'HistoryController::view/$1');
      $routes->get('extra-charges/today', 'ExtraChargeController::todayTotal');
    $routes->get('extra-charges/month', 'ExtraChargeController::monthTotal');
    $routes->get('api/extra-charges/range', 'ExtraChargesController::rangeTotal');

});
