<?php
/******************************************************************************\
|                                                                              |
|                                   test.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the REST API routes used by the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//
// sms test
//

Route::get('test/sms', function() {
	try {
		Nexmo::message()->send([
			'to'   => '16083355955',
			'from' => '18665207192',
			'text' => 'Using the facade to send a message.'
		]);  
	} catch (Exception $e) {
		dd("Error: ". $e->getMessage());
	}
});

Route::get('test/sms2', function() {
	try {
		$basic  = new \Nexmo\Client\Credentials\Basic(getenv("NEXMO_KEY"), getenv("NEXMO_SECRET"));
		$client = new \Nexmo\Client($basic);

		$message = $client->message()->send([
			'to' => '16083355955',
			'from' => config('services.nexmo.sms_from'),
			'text' => "This is a Nexmo test!"
		]);

		dd('SMS Sent Successfully.');	  
	} catch (Exception $e) {
		dd("Error: ". $e->getMessage());
	}
});