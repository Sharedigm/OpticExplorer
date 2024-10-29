<?php
/******************************************************************************\
|                                                                              |
|                              AuthController.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a controller used for handling registration and          |
|        authentication with third party identity providers.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Auth;

use Socialite;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use App\Models\Users\Auth\IdentityProvider;
use App\Models\Users\Auth\UserIdentity;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Profiles\UserProfile;
use App\Models\Storage\File;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;
use App\Utilities\Uuids\Guid;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Token\AccessToken;
use ErrorException;

class AuthController extends Controller
{
	/**
	 * Redirect the user to the provider's authentication page.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	public function registerWithProvider(Request $request, string $provider)
	{
		// save action to perform by callback
		//
		self::put('action', 'registering');

		// redirect to identity provider
		//
		return self::redirectToProvider($request, $provider);
	}

	/**
	 * Redirect the user to the provider's authentication page.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	public function loginWithProvider(Request $request, string $provider)
	{
		// save action to perform by callback
		//
		self::put('action', 'authenticating');

		// redirect to identity provider
		//
		return self::redirectToProvider($request, $provider);
	}

	/**
	 * Redirect the user to the provider's authentication page.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	public function addLoginWithProvider(Request $request, string $provider)
	{
		// save action to perform by callback
		//
		self::put('action', 'adding-provider');

		// redirect to identity provider
		//
		return self::redirectToProvider($request, $provider);
	}

	/**
	 * Handle callbacks from the selected identity provider.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	public function handleProviderCallback(Request $request, string $provider)
	{
		// get user info from identity provider
		//
		try {
			// $info = Socialite::driver($provider)->user();
			$info = Socialite::driver($provider)->stateless()->user();
		} catch (Exception $e) {
			
			// redirect to home page
			//
			return redirect(config('app.client_url'));		
		}

		// get action to perform
		//
		$action = self::get('action');

		// perform callback action
		//
		switch ($action) {
			case 'registering':
				return $this->addNewUser($info, $provider);
			case 'authenticating':
				return $this->authenticateUser($info, $provider);
			case 'adding-provider':
				return $this->addProvider($info, $provider);
		}
	}

	//
	// static methods
	//

	/**
	 * Redirect to the specified identity provider.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	static function redirectToProvider(Request $request, string $provider) {

		// check that provider is supported
		//
		if (!in_array($provider, ['google', 'facebook', 'github'])) {
			return redirect(config('app.client_url') . '#register/' . $provider . '/error/no-provider');
		}

		// parse optional parameters
		//
		if ($provider == 'cilogon') {
			$entityId = $request->input('entityid');
		}

		// check to see that user provider is not disabled
		//
		$providerCode = $provider != 'cilogon'? $provider : $entityId;
		$userIdentity = UserIdentity::find($providerCode);
		if ($userIdentity && !$userIdentity->enabled_flag) {
			return redirect(config('app.client_url') . '#register/' . $providerCode . '/error/provider-disabled');
		}

		// redirect to provider
		//
		return Socialite::driver($provider)->redirect();
	}

	//
	// private methods
	//

	/**
	 * Register a new user with the specified identity provider.
	 *
	 * @param Object $info - the user's identity profile info
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	private function addNewUser($info, string $provider) {

		// check if user identity already exists
		//
		$userIdentity = UserIdentity::where('user_external_id', '=', $info->id)->first();
		if ($userIdentity) {
			return redirect(config('app.client_url') . '#providers/' . $provider . '/register/error/account-exists');
		}

		// find suggested username
		//
		if (array_key_exists('given_name', $info->user) && 
			array_key_exists('family_name', $info->user)) {
			$username = substr($info->user['given_name'], 0, 1) . $info->user['family_name'];
		} else if ($info->name) {
			$username = $info->name;
		} else if ($info->nickname) {
			$username = $info->nickname;
		} else {
			$username = 'anonymous';
		}

		// format username
		//
		$username = strtolower($username);
		$username = str_replace(' ', '', $username);

		// find unique username
		//
		$username = UserAccount::getUniqueUsername($username);
		if (!$username) {
			return redirect(config('app.client_url') . '#providers/' . $provider . '/register/error/general-error');
		}

		// find first and last name
		//
		$firstName = array_key_exists('given_name', $info->user)? $info->user['given_name'] : null;
		$lastName = array_key_exists('family_name', $info->user)? $info->user['family_name'] : null;
		if (!$firstName && !$lastName && $info->name) {
			$parts = explode(' ', $info->name);
			$firstName = $parts[0];
			if (count($parts) > 1) {
				$lastName = $parts[1];
			}
		}

		// create new user record
		//
		$user = new User([
			'id' => Guid::create(),
			'first_name' => ucwords(strtolower($firstName)),
			'last_name' => ucwords(strtolower($lastName)),
			'preferred_name' => ucwords(strtolower(ucfirst($info->nickname)))
		]);
		
		// create new user profile
		//
		$userProfile = new UserProfile([
			'user_id' => $user->id,
		]);

		// create new user account
		//
		$userAccount = new UserAccount([
			'user_id' => $user->id,
			'username' => strtolower($username),
			'password' => null,
			'enabled_flag' => 1,
			'email' => strtolower($info->email),
			'email_verified_flag' => 1,
			'admin_flag' => 0
		]);

		// create new user identity
		//
		$userIdentity = new UserIdentity([
			'id' => Guid::create(),
			'user_id' => $user->id,
			'user_external_id' => $info->id,
			'provider_code' => $provider,
			'enabled_flag' => true
		]);
		
		// check if user account has already been taken
		//
		$errors = [];
		if (!$userAccount->isTaken($errors)) {
			return response(json_encode($errors), 409);
		}
		
		// save new user items
		//
		$user->save();
		$userIdentity->save();
		$userProfile->save();
		$userAccount->add();

		// download avatar image
		//
		if ($info->avatar) {

			// get avatar image contents
			//
			$contents = file_get_contents($info->avatar);

			// store avatar image
			//
			if ($contents) {

				// find image type / filename
				//
				$mime = get_headers($info->avatar, 1)["Content-Type"];
				if (is_array($mime)) {
					$mime = $mime[0];
				}
				$extension = explode('/', $mime)[1];
				$path = 'Profile/Profile Photo' . '.' . $extension;

				// write image file to user storage
				//
				$file = new File([
					'path' => $username . '/' . $path
				]);
				$file->writeContents($contents);

				// update user profile
				//
				$userProfile->profile_photo_path = $path;
				$userProfile->save();
			}
		}

		// set session info
		//
		session([
			'user_id' => $user->id,
			'timestamp' => time()
		]);

		// update user account timestamps
		//
		$user->account->updateLoginDates();

		// redirect to home page
		//
		return redirect(config('app.client_url'));
	}

	/**
	 * Authentiate a new user with the specified identity provider.
	 *
	 * @param Object $info - the user's identity profile info
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	private function authenticateUser($info, string $provider) {

		// find user
		//
		$userIdentity = UserIdentity::where('user_external_id', '=', $info->id)->first();
		$user = $userIdentity? User::find($userIdentity->user_id) : null;
		if (!$user) {
			return redirect(config('app.client_url') . '#providers/' . $provider . '/sign-in/error/no-account');
		}

		// check if user account has been enabled
		//
		if (!$user->account->isEnabled()) {
			return redirect(config('app.client_url') . '#providers/' . $provider . '/sign-in/error/not-enabled');
		}

		// set session info
		//
		session([
			'user_id' => $user->id,
			'timestamp' => time()
		]);

		// update user account timestamps
		//
		$user->account->updateLoginDates();

		// redirect to home page
		//
		return redirect(config('app.client_url'));
	}

	/**
	 * Add identity from new provider to an existing user.
	 *
	 * @param Object $info - the user's identity profile info
	 * @param string $provider - the name of the identity provider
	 * @return \Illuminate\Http\Response
	 */
	private function addProvider($info, string $provider) {

		// check if user identity already exists
		//
		$userIdentity = UserIdentity::where('user_external_id', '=', $info->id)->first();
		if ($userIdentity) {
			return redirect(config('app.client_url') . '#providers/' . $provider . '/sign-in/error/account-exists');
		}

		// create new user identity
		//
		$userIdentity = new UserIdentity([
			'id' => Guid::create(),
			'user_id' => session('user_id'),
			'user_external_id' => $info->id,
			'provider_code' => $provider,
			'enabled_flag' => true
		]);
		$userIdentity->save();

		// redirect to home page
		//
		return redirect(config('app.client_url'));
	}

	//
	// private static methods
	//

	/**
	 * Put the specified key value pair.
	 *
	 * @param string $key - the name of the value to update
	 * @param string $value - the new value to update the key to
	 * @return void
	 */
	private static function put(string $key, $value) {
		Cache::put($key, $value, 600);
	}

	/**
	 * Check for the specified key value pair.
	 *
	 * @param string $key - the name of the value to query for
	 * @return void
	 */
	private static function has(string $key) {
		return Cache::has($key);
	}

	/**
	 * Get the specified key value pair.
	 *
	 * @param string $key - the name of the value to get
	 * @return void
	 */
	private static function get(string $key) {
		return Cache::get($key);	
	}

	/**
	 * Pull the specified key value pair.
	 *
	 * @param string $key - the name of the value to pull
	 * @return void
	 */
	private static function pull(string $key) {
		return Cache::pull($key);
	}
}