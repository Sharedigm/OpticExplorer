<?php
/******************************************************************************\
|                                                                              |
|                               UserAccount.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's account information. This            |
|        model is used in conjunction with the User model, which               |
|        stores a user's personal information.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Accounts;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\UserOwned;
use App\Models\Users\User;
use App\Models\Users\Accounts\PasswordReset;
use App\Models\Users\Accounts\EmailVerification;
use App\Models\Users\Auth\UserIdentity;
use App\Models\Users\Connections\Group;
use App\Models\Users\Storage\UserStorage;
use App\Models\Topics\Topic;
use App\Models\Topics\UserTopic;
use App\Models\Storage\Directory;
use App\Models\Storage\Traits\ItemSizeConvertable;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Security\Password;
use App\Utilities\Uuids\Guid;

class UserAccount extends TimeStamped
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use UserOwned;
	use ItemSizeConvertable;

	//
	// constants
	//

	const INVALID_USERNAMES = [
		'temp',
		'anonymous'
	];

	//
	// attributes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'user_accounts';

	/**
	 * The primary key for the model.
	 *
	 * @var string
	 */
	public $primaryKey = 'user_id';

	/**
	 * Indicates if the IDs are auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The "type" of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'string';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'user_id',
		'username',
		'password',
		'email',
		'user_disk_quota',

		// flags
		//
		'enabled_flag',
		'email_verified_flag',
		'admin_flag',
		'logged_in',

		// timestamps
		//
		'ultimate_login_at',
		'penultimate_login_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'user_id',
		'username',
		'email',
		'disk_usage',
		'disk_quota',

		// flags
		//
		'enabled_flag',
		'email_verified_flag',
		'admin_flag',
		'logged_in',
		'has_ssh_access',

		// timestamps
		//
		'ultimate_login_at',
		'penultimate_login_at',
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'disk_usage',
		'disk_quota',
		'has_ssh_access'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'enabled_flag' => 'boolean',
		'email_verified_flag' => 'boolean',
		'admin_flag' => 'boolean',
		'logged_in' => 'boolean',
		'has_ssh_access' => 'boolean'
	];

	/**
	 * The maximum number of usernames to try when creating new linked accounts
	 *
	 * @var int
	 */
	const MAXTRIES = 500;
	
	//
	// accessor methods
	//

	/**
	 * Get this user account's disk usage
	 *
	 * @return string
	 */
	public function getDiskUsageAttribute(): string {
		if (FileStorage::isLocal()) {
			$output = shell_exec('du -sh "' . FileStorage::root() . '/' . FileStorage::current() . '"');
			return explode("\t", $output)[0];
		} else {
			return '0G';
		}
	}

	/**
	 * Get this user account's disk usage
	 *
	 * @return string
	 */
	public function getDiskQuotaAttribute(): ?string {
		if ($this->user_disk_quota) {
			return $this->user_disk_quota;
		} else if (!$this->isAdmin()) {
			return config('app.default_disk_quota');
		} else {
			return null;
		}
	}

	/**
	 * Get this user account's 'has ssh access' attribute.
	 *
	 * @return bool
	 */
	public function getHasSshAccessAttribute(): ?bool {
		return config('app.ssh_access_enabled');
	}

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its email verification.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function email_verification() {
		return $this->hasOne('App\Models\Users\Accounts\EmailVerification', 'user_id');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items with a particular username.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $username
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeByUsername($query, $username) {
		return $query->where('username', '=', $username);
	}

	/**
	 * Allow queries for this item to return only items with a particular email.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Users\User $user
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeByEmail($query, $email) {
		return $query->where('email', '=', $email);
	}

	//
	// querying methods
	//

	/**
	 * Find if this user account is enabled.
	 *
	 * @return bool
	 */
	public function isEnabled(): bool {
		return strval($this->enabled_flag) == '1';
	}

	/**
	 * Find if this user account is an administrator account.
	 *
	 * @return bool
	 */
	public function isAdmin(): bool {
		return strval($this->admin_flag) == '1';
	}

	/**
	 * Find if the email address of this user account has been verified.
	 *
	 * @return bool
	 */
	public function hasBeenVerified(): bool {
		return strval($this->email_verified_flag) == '1';
	}

	/**
	 * Find if this user account has an associated email address.
	 *
	 * @return bool
	 */
	public function hasEmail(): bool {
		return $this->email != null &&  $this->email != '';
	}

	//
	// validation methods
	//

	/**
	 * Find if this new user account is valid.
	 *
	 * @return bool
	 */
	public function isTaken(&$errors, $anyEmail = false): bool {

		// check to see if username has been taken
		//
		if ($this->username) {
			if (in_array($this->username, self::INVALID_USERNAMES)) {
				$errors[] = 'The username "' . $this->username . '" may not be used.';
			}
			if (self::where('username', '=', $this->username)->exists()) {
				$errors[] = 'The username "' . $this->username . '" is already in use.';
			}
		}

		// check to see if email has been taken
		//
		if ($this->email) {
			if (self::emailInUse($this->email)) {
				$errors[] = 'The email address "' . $this->email . '" is already in use.';
			}
		}

		return (sizeof($errors) == 0);
	}

	/**
	 * Find if this user account is valid after a change.
	 *
	 * @return bool
	 */
	public function isValid(&$errors, $anyEmail = false): bool {

		// check to see if username has changed
		//
		$userAccount = self::find($this->user_id);
		if ($userAccount) {
			if ($this->username != $userAccount->username) {

				// check to see if username has been taken
				//
				if ($this->username) {
					if (in_array($this->username, self::INVALID_USERNAMES)) {
						$errors[] = 'The username "' . $this->username . '" may not be used.';
					}
					if (self::where('username', '=', $this->username)->exists()) {
						$errors[] = 'The username "' . $this->username . '" is already in use.';
					}
				}
			}
		} else {
			$errors[] = "User not found.";
		}

		// check to see if email has changed
		//
		$userAccount = self::find($this->user_id);
		if ($userAccount) {
			if ($this->email != $userAccount->email) {

				// check to see if email has been taken
				//
				if ($this->email) {
					if (self::emailInUse($this->email)) {
						$errors[] = 'The email address "' . $this->email . '" is already in use.';
					}
				}
			}
		} else {
			$errors[] = "User account not found.";
		}

		return (sizeof($errors) == 0);
	}

	//
	// creating methods
	//

	/**
	 * Create new user account folders.
	 *
	 * @return void
	 */
	public function create() {

		// create new default items
		//
		$this->createDefaultGroups();
		$this->createDefaultTopics();
	}

	/**
	 * Create new default home directory folders.
	 *
	 * @return void
	 */
	public function createDefaultFolders() {

		// create new user folder
		//
		Storage::makeDirectory($this->username);

		// check if default folders exist
		//
		if (!config('app.default_folders')) {
			return;
		}

		// create default folders
		//
		foreach (config('app.default_folders') as $folder) {
			Storage::makeDirectory($this->username . '/' . $folder);
		}
	}

	/**
	 * Create new default groups.
	 *
	 * @return void
	 */
	public function createDefaultGroups() {

		// check if default groups exists
		//
		if (!config('app.default_groups')) {
			return;
		}

		// create default groups
		//
		foreach (config('app.default_groups') as $key => $value) {

			// create new group
			//
			$group = new Group([
				'id' => Guid::create(),
				'name' => $key,
				'icon_path' => $value,
				'user_id' => $this->user_id
			]);
			$group->save();
		}
	}

	/**
	 * Create new default topic memberships.
	 *
	 * @return void
	 */
	public function createDefaultTopics() {

		// check if default topics exists
		//
		if (!config('app.default_topics')) {
			return;
		}

		// create default topics
		//
		foreach (config('app.default_topics') as $key => $value) {

			// find topic by name
			//
			$topic = Topic::where('name', '=', $key)
				->where('user_id', '=', $value)->first();

			// create topic membership
			//
			if ($topic) {
				$userTopic = new UserTopic([
					'id' => Guid::create(),
					'user_id' => $this->user_id,
					'topic_id' => $topic->id
				]);
				$userTopic->save();
			}
		}
	}

	/**
	 * Add this new user account, encrypting its password and creating folders.
	 *
	 * @return void
	 */
	public function add() {
		
		// encrypt password
		//
		if ($this->password) {
			$encryption = config('app.password_encryption_method');
			$this->password = Password::getEncrypted($this->password, '{' . $encryption . '}');
		}

		// save changes
		//
		$this->save();

		// create new user folders
		//
		$this->create();

		return $this;
	}

	//
	// updating methods
	//

	/**
	 * Update a user account's timestamps.
	 *
	 * @return void
	 */
	public function updateLoginDates() {

		// set logged in flag
		//
		$this->logged_in = true;

		// update login dates
		//
		$this->penultimate_login_at = $this->ultimate_login_at;
		$this->ultimate_login_at = gmdate('Y-m-d H:i:s');

		// save changes
		//
		$this->save();
		return $this;
	}

	/**
	 * Change a user account's password.
	 *
	 * @param string $password
	 * @return void
	 */
	public function modifyPassword(string $password) {
		
		// encrypt password
		//
		$encryption = config('app.password_encryption_method');
		$this->password = Password::getEncrypted($password, '{' . $encryption . '}', $this->password);

		// save changes
		//
		$this->save();
		return $this;
	}

	/**
	 * Increment a user account's disk quota.
	 *
	 * @param string $password
	 * @return void
	 */
	public function incrementDiskQuota(string $increment) {
		$kilobytes = self::sizeToUnits($this->disk_quota, 'K');
		$incrementKilobytes = self::sizeToUnits($increment, 'K');
		$newSize = ($kilobytes + $incrementKilobytes) . 'K';
		$this->user_disk_quota = (self::sizeToUnits($newSize, 'M') / 1000). 'G';
		$this->save();
	}

	/**
	 * Set the attributes of a user account.
	 *
	 * @param object $attributes
	 * @return void
	 */
	public function setAttributes($attributes) {
		
		// check to see if enabled flag has changed
		//	
		if ($attributes['enabled_flag'] != $this->enabled_flag) {

			// send notification email
			//
			$user = $this->user();
			if ($user && !$user->hasEmail() && config('mail.enabled')) {
				switch ($attributes['enabled_flag']) {

					// user account has been disabled
					//
					case 0:
						Mail::send('emails.user-account-disabled', [
							'name' => $user->getFullName(),
							'app_name' => config('app.name'),
							'client_url' => config('app.client_url')
						], function($message) use ($user) {
							$message->to($user->getEmail(), $user->getFullName());
							$message->subject('User Account Disabled');
						});
						break;

					// user account has been enabled
					//
					case 1:
						Mail::send('emails.user-account-enabled', [
							'name' => $user->getFullName(),
							'app_name' => config('app.name'),
							'client_url' => config('app.client_url')
						], function($message) use ($user) {
							$message->to($user->getEmail(), $user->getFullName());
							$message->subject('User Account Enabled');
						});
						break;
				}
			}
		}

		// check to see if email verified flag has changed
		// which indicates transition from pending to enabled
		//
		else if ($attributes['email_verified_flag'] != $this->email_verified_flag) {
			if ($this->email_verified_flag != 1) {

				// send welcome email
				//			
				$user = $this->user();
				if ($user && !$user->hasEmail()) {
					Mail::send('emails.welcome', [
						'name' => $user->getFullName(),
						'app_name' => config('app.name'),
						'client_url' => config('app.client_url')
					], function($message) use ($user) {
						$message->to($user->getEmail(), $user->getFullName());
						$message->subject('Welcome');
					});
				}
			}
		}

		// save user account attributes
		//
		if (array_key_exists('enabled_flag', $attributes)) {
			$this->enabled_flag = $attributes['enabled_flag'] ? 1 : 0;
		}
		if (array_key_exists('email_verified_flag', $attributes)) {
			$this->email_verified_flag = $attributes['email_verified_flag'] ? 1 : 0;
		}
		if (array_key_exists('admin_flag', $attributes)) {
			$this->admin_flag = $attributes['admin_flag'] ? 1 : 0;
		}
		
		$this->save();
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user account and its associated items.
	 *
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public function delete() {

		// check permissions
		//
		if (!$this->user->isCurrent() && !User::isCurrentAdmin()) {
			return Reponse("You do not have permission to delete this user.");
		}
		
		// delete related models
		//
		PasswordReset::where('user_id', '=', $this->user_id)->delete();
		EmailVerification::where('user_id', '=', $this->user_id)->delete();
		UserIdentity::where('user_id', '=', $this->user_id)->delete();

		// delete user files
		// 
		if (UserStorage::where('user_id', '=', $this->user_id)->exists()) {

			// delete remote storage
			//
			UserStorage::where('user_id', '=', $this->user_id)->delete();
		} else {

			// delete local storage
			//
			Storage::deleteDirectory($this->username);
		}

		// call superclass method
		//
		return parent::delete();
	}

	//
	// static querying methods
	//

	/**
	 * Find a user account by its id or 'current'
	 *
	 * @param string $userId
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function find($userId): ?UserAccount {
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		return self::where('user_id', '=', $userId)->first();
	}

	/**
	 * Find a user account by its unique username
	 *
	 * @param string $username
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function getByUsername(string $username) {
		return UserAccount::where('username', '=', $username)->first();
	}

	/**
	 * Find a user account by its unique email address
	 *
	 * @param string $email
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function getByEmail(string $email) {
		return User::where('email', '=', $email)->first();
	}

	/**
	 * Find user account of current user.
	 *
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public static function current(): ?UserAccount {
		return self::find(Session::get('user_id'));
	}

	/**
	 * Find if an username is in use in a user account.
	 *
	 * @param string $username
	 * @return bool
	 */
	public static function usernameInUse($username): bool {
		return UserAccount::where('username', '=', $username)->exists();
	}

	/**
	 * Find if an email address is in use in a user account.
	 *
	 * @param string $email
	 * @return bool
	 */
	public static function emailInUse($email): bool {
		$values = [];
		if (preg_match("/(\w*)(\+.*)(@.*)/", $email, $values)) {
			$email = $values[1] . $values[3];
		}

		foreach (self::all() as $account) {
			$values = [];
			if (preg_match("/(\w*)(\+.*)(@.*)/", $account->email, $values)) {
				$account->email = $values[1] . $values[3];
			}
			if (strtolower($email) == strtolower($account->email)) {
				return true;
			}
		}

		return false;		
	}

	/**
	 * Get the domain of an email address.
	 *
	 * @param string $email
	 * @return string
	 */
	static function getEmailDomain($email): string {
		$domain = implode('.',
			array_slice( preg_split("/(\.|@)/", $email), -2)
		);
		return strtolower($domain);
	}

	/**
	 * Get a unique username matching a particular pattern.
	 *
	 * @param string $username
	 * @return string
	 */
	public static function getUniqueUsername(string $username) {

		// check if username is taken
		//
		if (!self::getByUsername($username)) {
			return $username;
		}

		// attempt username permutations
		//
		for ($i = 1; $i <= self::MAXTRIES; $i++) {
			$uniqueName = $username . $i;

			if (!self::getByUsername($uniqueName)) {
				return $uniqueName;
			}
		}

		return false;
	}
}