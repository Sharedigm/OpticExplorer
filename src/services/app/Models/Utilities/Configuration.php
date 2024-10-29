<?php
/******************************************************************************\
|                                                                              |
|                               Configuration.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of the server configuration information          |
|        that is communicated to the client.                                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Utilities;

use Illuminate\Support\Facades\Request;
use App\Models\BaseModel;
use App\Utilities\Translation\Translation;

class Configuration extends BaseModel
{
	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'user_storage',
		'email_enabled',
		'sign_up_enabled',
		'video_thumbnails_enabled',
		'max_upload_size',
		'client_ip',
		'identity_providers',
		'notification_channels',
		'languages'
	];

	//
	// accessor methods
	//

	public function getUserStorageAttribute() {
		return config('filesystems.users');
	}

	public function getEmailEnabledAttribute() {
		return config('mail.enabled');
	}

	public function getSignUpEnabledAttribute() {
		return config('app.sign_up_enabled');
	}

	public function getVideoThumbnailsEnabledAttribute() {
		return config('app.video_thumbnails_enabled');
	}

	public function getMaxUploadSizeAttribute() {
		return ini_get('post_max_size');
	}

	public function getClientIpAttribute() {
		return Request::ip();
	}

	public function getIdentityProvidersAttribute() {
		$providers = [];
		if (config('services.google.enabled')) {
			array_push($providers, 'Google');
		}
		if (config('services.facebook.enabled')) {
			array_push($providers, 'Facebook');
		}
		if (config('services.github.enabled')) {
			array_push($providers, 'Github');
		}
		return $providers;
	}

	public function getNotificationChannelsAttribute() {
		$channels = [];
		if (config('mail.enabled')) {
			array_push($channels, 'mail');
		}
		if (config('services.nexmo.enabled')) {
			array_push($channels, 'nexmo');
		}
		return $channels;
	}

	public function getLanguagesAttribute() {
		if (config('services.ibm_translation.enabled')) {
			return Translation::LANGUAGES;
		}
	}
}