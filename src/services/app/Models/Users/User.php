<?php
/******************************************************************************\
|                                                                              |
|                                   User.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal information. This           |
|        model is used in conjunction with the UserAccount model, which        |
|        stores a user's account information.                                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users;

use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\Auth\UserSession;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Connections\Connection;
use App\Models\Users\Connections\ConnectionRequest;
use App\Models\Users\Connections\Group;
use App\Models\Users\Connections\GroupMember;
use App\Models\Users\Profiles\UserProfile;
use App\Models\Users\Profiles\UserLocation;
use App\Models\Users\Profiles\UserJob;
use App\Models\Storage\Sharing\Link;
use App\Models\Storage\Sharing\Share;
use App\Models\Storage\Sharing\ShareRequest;
use App\Models\Settings\UserSetting;
use App\Models\Settings\UserFavorite;
use App\Models\Settings\UserPreference;
use App\Models\Topics\Post;
use App\Models\Topics\Topic;
use App\Models\Topics\UserTopic;
use App\Models\Chats\Sharing\ChatInvitation;
use App\Models\Chats\ChatMembership;
use App\Models\Chats\ChatMessage;
use App\Models\Chats\Chat;
use App\Notifications\Traits\Notifiable;
use App\Utilities\Uuids\Guid;

class User extends TimeStamped
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use Notifiable;
	
	//
	// attributes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

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

		// user attributes
		//
		'id',

		// user name
		//
		'honorific',
		'first_name',
		'preferred_name',
		'middle_name',
		'last_name',
		'titles',
		'phone_number'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// user attributes
		//
		'id',

		// user name
		//
		'honorific',
		'first_name',
		'preferred_name',
		'middle_name',
		'last_name',
		'titles',
		'phone_number',

		// appended info
		//
		'short_name',
		'full_name',
		'username',
		'email',
		'gender',
		'location',
		'occupation',

		// appended flags
		//
		'is_new',
		'is_current',
		'is_connection',
		'is_admin',
		'is_online',
		'is_active',
		'has_profile_photo',
		'has_cover_photo',

		// timestamp
		//
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'short_name',
		'full_name',
		'username',
		'email',
		'gender',
		'location',
		'occupation',

		// appended flags
		//
		'is_new',
		'is_current',
		'is_connection',
		'is_admin',
		'is_online',
		'is_active',
		'has_profile_photo',
		'has_cover_photo'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user's short name attribute.
	 *
	 * @return string
	 */
	public function getShortNameAttribute(): string {
		return utf8_encode($this->getShortName());
	}

	/**
	 * Get this user's full name attribute.
	 *
	 * @return string
	 */
	public function getFullNameAttribute(): string {
		return utf8_encode($this->getFullName());
	}

	/**
	 * Get this user's username attribute.
	 *
	 * @return App\Models\Users\UserJob
	 */
	public function getUsernameAttribute(): string {
		return utf8_encode($this->account? $this->account->username : '');
	}

	/**
	 * Get this user's username attribute.
	 *
	 * @return string
	 */
	public function getEmailAttribute(): ?string {
		return $this->account? $this->account->email : '';
	}

	/**
	 * Get this user's gender attribute.
	 *
	 * @return string
	 */
	public function getGenderAttribute(): ?string {
		return $this->getGender();
	}

	/**
	 * Get this user's location attribute.
	 *
	 * @return string
	 */
	public function getLocationAttribute(): ?string {
		return $this->getLocation();
	}
	
	/**
	 * Get this user's occupation attribute.
	 *
	 * @return string
	 */
	public function getOccupationAttribute(): ?string {
		return $this->getOccupation();
	}

	/**
	 * Get this user's 'is_current' attribute.
	 *
	 * @return bool
	 */
	public function getIsNewAttribute(): bool {
		return $this->isNewUser();
	}

	/**
	 * Get this user's 'is current' attribute.
	 *
	 * @return bool
	 */
	public function getIsCurrentAttribute(): bool {
		return $this->isCurrent();
	}

	/**
	 * Get this user's 'is connection' attribute.
	 *
	 * @return bool
	 */
	public function getIsConnectionAttribute(): bool {
		return $this->isConnection();
	}

	/**
	 * Get this user's 'is admin' attribute.
	 *
	 * @return bool
	 */
	public function getIsAdminAttribute(): bool {
		return $this->isAdmin();
	}

	/**
	 * Get this user's 'is online' attribute.
	 *
	 * @return bool
	 */
	public function getIsOnlineAttribute(): bool {

		// we must be logged in to see this attribute
		//
		if (!UserSession::exists()) {
			return false;
		}

		return $this->isOnline();
	}

	/**
	 * Get this user's 'is active' attribute.
	 *
	 * @return bool
	 */
	public function getIsActiveAttribute(): bool {

		// we must be logged in to see this attribute
		//
		if (!UserSession::exists()) {
			return false;
		}

		return $this->isActive();
	}

	/**
	 * Get this user's 'has profile photo' attribute.
	 *
	 * @return bool
	 */
	public function getHasProfilePhotoAttribute(): bool {
		return $this->hasProfilePhoto();
	}

	/**
	 * Get this user's 'has cover photo' attribute.
	 *
	 * @return bool
	 */
	public function getHasCoverPhotoAttribute(): bool {
		return $this->hasCoverPhoto();
	}

	//
	// relationship methods
	//

	/**
	 * Get this users's relationship to its account.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function account() {
		return $this->hasOne('App\Models\Users\Accounts\UserAccount');
	}

	/**
	 * Get this users's relationship to its profile.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function profile() {
		return $this->hasOne('App\Models\Users\Profiles\UserProfile');
	}

	/**
	 * Get this users's relationship to its settings.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function settings() {
		return $this->hasMany('App\Models\Settings\UserSetting');
	}

	/**
	 * Get this users's relationship to its incoming share requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function incomingShareRequests() {
		return $this->hasMany('App\Models\Storage\Sharing\ShareRequest', 'connection_id');
	}

	/**
	 * Get this users's relationship to its outgoing share request.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function outgoingShareRequests() {
		return $this->hasMany('App\Models\Storage\Sharing\ShareRequest');
	}

	/**
	 * Get this users's relationship to its incoming connection requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function incomingConnectionRequests() {
		return $this->hasMany('App\Models\Users\Connections\ConnectionRequest', 'connection_id');
	}

	/**
	 * Get this users's relationship to its outgoing connection requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function outgoingConnectionRequests() {
		return $this->hasMany('App\Models\Users\Connections\ConnectionRequest');
	}

	/**
	 * Get this users's relationship to its pending incoming connection requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function pendingIncomingConnectionRequests() {
		return $this->hasMany('App\Models\Users\Connections\ConnectionRequest', 'connection_id')
			->whereNull('accepted_at')
			->whereNull('deleted_at');
	}

	/**
	 * Get this users's relationship to its pending outgoing connection requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function pendingOutgoingConnectionRequests() {
		return $this->hasMany('App\Models\Users\Connections\ConnectionRequest')
			->whereNull('accepted_at')
			->whereNull('deleted_at');
	}

	/**
	 * Get this users's relationship to its accepted incoming connection requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function acceptedIncomingConnectionRequests() {
		return $this->hasMany('App\Models\Users\Connections\ConnectionRequest', 'connection_id')
			->whereNotNull('accepted_at')
			->whereNull('deleted_at');
	}

	/**
	 * Get this users's relationship to its outgoing connection requests.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function acceptedOutgoingConnectionRequests() {
		return $this->hasMany('App\Models\Users\Connections\ConnectionRequest')
			->whereNotNull('accepted_at')
			->whereNull('deleted_at');
	}

	/**
	 * Get this users's relationship to its posts.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function posts() {
		return $this->hasMany('App\Models\Topics\Post');
	}

	//
	// querying methods
	//

	/**
	 * Whether or not this user is a new user.
	 *
	 * @return bool
	 */
	public function isNewUser(): bool {
		return $this->account? $this->account->penultimate_login_at == null : false;
	}

	/**
	 * Whether or not this user is the currently logged in user.
	 *
	 * @return bool
	 */
	public function isCurrent(): bool {
		return $this->id == Session::get('user_id');
	}

	/**
	 * Whether or not this users is an administrator.
	 *
	 * @return bool
	 */
	public function isAdmin(): bool {
		return $this->account? $this->account->isAdmin() : false;
	}

	/**
	 * Whether or not this user is currently logged in.
	 *
	 * @return bool
	 */
	public function isOnline(): bool {
		return UserSession::where('user_id', '=', $this->id)->exists();
	}

	/**
	 * Whether or not this user is currently active.
	 *
	 * @return bool
	 */
	public function isActive(): bool {
		$userSession = UserSession::where('user_id', '=', $this->id)->first();
		if ($userSession) {
			$elapsedTime = time() - $userSession->last_activity;
			return $elapsedTime < (60 * 5);
		} else {
			return false;
		}
	}

	/**
	 * Get whether this user has an email address.
	 *
	 * @return bool
	 */
	public function hasEmail(): bool {
		return $this->account && $this->account->hasEmail();
	}

	//
	// getting methods
	//

	/**
	 * Get this users's short name.
	 *
	 * @return string
	 */
	public function getShortName(): string {
		$name = '';

		if ($this->preferred_name) {
			$name .= $this->preferred_name;
		} else {
			$name .= $this->first_name;
		}
		if ($this->last_name) {
			if ($name) {
				$name .= ' ';
			}
			$name .= $this->last_name;
		}

		return ucwords($name);
	}

	/**
	 * Get this users's full name.
	 *
	 * @return string
	 */
	public function getFullName(): string {
		$name = '';

		if ($this->honorific) {
			$name .= $this->honorific;
		}
		if ($this->first_name) {
			if ($name) {
				$name .= ' ';
			}
			$name .= $this->first_name;
		}
		if ($this->preferred_name) {
			if ($name) {
				$name .= ' ';
			}
			$name .= '(' . $this->preferred_name . ')';
		}
		if ($this->middle_name) {
			if ($name) {
				$name .= ' ';
			}
			$name .= $this->middle_name;
		}
		if ($this->last_name) {
			if ($name) {
				$name .= ' ';
			}
			$name .= $this->last_name;
		}
		if ($this->titles) {
			if ($name) {
				$name .= ' ';
			}
			$name .= $this->titles;
		}
		
		return ucwords($name);
	}

	/**
	 * Get this users's email address.
	 *
	 * @return string
	 */
	public function getEmail(): ?string {
		return $this->account? $this->account->email : null;
	}

	//
	// profile querying methods
	//

	/**
	 * Whether or not this user has a profile photo.
	 *
	 * @return bool
	 */
	public function hasProfilePhoto(): bool {
		return $this->profile? $this->profile->profile_photo_path != null : false;
	}

	/**
	 * Whether or not this user has a cover photo.
	 *
	 * @return bool
	 */
	public function hasCoverPhoto(): bool {
		return $this->profile? $this->profile->cover_photo_path != null : false;
	}

	//
	// profile getting methods
	//

	/**
	 * Get this users's birth date.
	 *
	 * @return string
	 */
	public function getBirthDate(): ?string {
		return $this->profile? $this->profile->birth_date : null;
	}

	/**
	 * Get this users's gender.
	 *
	 * @return string
	 */
	public function getGender(): ?string {
		return $this->profile? $this->profile->gender : null;
	}

	/**
	 * Get this users's location.
	 *
	 * @return App\Models\Users\UserLocation
	 */
	public function getLocation(): ?string {
		$location = UserLocation::where('user_id', '=', $this->id)->first();
		return $location? $location->toString() : null;
	}

	/**
	 * Get this users's occupation.
	 *
	 * @return App\Models\Users\UserJob
	 */
	public function getOccupation(): ?string {
		$job = UserJob::where('user_id', '=', $this->id)->first();
		return $job? $job->toString() : null;
	}

	//
	// connection querying methods
	//

	/**
	 * Whether or not this user is connections with the current user.
	 *
	 * @return bool
	 */
	public function isConnection(): bool {
		if ($this->isCurrent()) {
			return false;	
		}
		return $this->isConnectionsWith(User::current());
	}

	/**
	 * Whether or not this users is connections with a particular user.
	 *
	 * @return bool
	 */
	public function isConnectionsWith($user): bool {
		if (!$user) {
			return false;
		}
		return ConnectionRequest::where('user_id', '=', $this->id)
			->where('connection_id', '=', $user->id)
			->whereNotNull('accepted_at')->exists()  ||
			ConnectionRequest::where('user_id', '=', $user->id)
			->where('connection_id', '=', $this->id)
			->whereNotNull('accepted_at')->exists();
	}

	//
	// connection getting methods
	//

	/**
	 * Get the connections that this user has requested.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getRequestedConnections() {
		return $this->acceptedOutgoingConnectionRequests->pluck('connection')->filter();
	}

	/**
	 * Get the connections that have requested this user as a connection.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getConnectionsRequested() {
		return $this->acceptedIncomingConnectionRequests->pluck('user')->filter();
	}

	/**
	 * Get this user's number of connections.
	 *
	 * @return int
	 */
	public function numConnections() {
		return $this->acceptedOutgoingConnectionRequests->count() + $this->acceptedIncomingConnectionRequests->count();
	}

	/**
	 * Get this user's connections.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getConnections() {
		return $this->getRequestedConnections()->merge($this->getConnectionsRequested());
	}

	/**
	 * Find the users that are not yet connections with this user.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function findStrangersByName($name) {
		return User::where('id', '!=', $this->id)

			// exclude root admin
			//
			// ->whereNotNull('users.last_name')

			// where first or last name starts with name
			//
			->where('first_name', 'like', $name . '%')
			->orWhere('last_name', 'like', $name . '%')

			// where not already a connection
			//
			->get()->filter(function($user) {
				return !$user->isConnectionsWith($this);
			})->values();
	}

	//
	// connectioning methods
	//

	/**
	 * Accept a connection invitation.
	 *
	 * @return void
	 */
	public function acceptInvitation($userInvitation) {
		if (!$userInvitation) {
			return;
		}
		$connectionRequest = new ConnectionRequest([
			'id' => Guid::create(),
			'user_id' => $userInvitation->inviter_id,
			'connection_id' => $this->id,
			'message' => $userInvitation->message
		]);
		$connectionRequest->save();
		$connectionRequest->accept();
	}

	//
	// access control methods
	//

	/**
	 * Whether or not this user is readable by a particular user.
	 *
	 * @return bool
	 */
	public function isReadableBy($user): bool {
		if ($user->isAdmin()) {
			return true;
		} else if ($this->is($user)) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Whether or not this user is writable by a particular user.
	 *
	 * @return bool
	 */
	public function isWritableBy($user): bool {
		if ($user->isAdmin()) {
			return true;
		} else if ($this->is($user)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Route notifications for the Nexmo channel.
	 *
	 * @param  \Illuminate\Notifications\Notification  $notification
	 * @return string
	 */
	public function routeNotificationForNexmo($notification)
	{
		// find user's sms number
		//
		$userSetting = (UserSetting::where('user_id', '=', $this->id)
			->where('category', '=', 'system')
			->where('key', '=', 'sms_number'))->first();

		// remove spaces and dashes from phone number
		//
		if ($userSetting) {
			$smsNumber = $userSetting->value;
			$smsNumber = str_replace(' ', '', $smsNumber);
			$smsNumber = str_replace('-', '', $smsNumber);
			return $smsNumber;
		}
	}

	//
	// deleting method
	//

	/**
	 * Delete this user.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete user notifications
		//
		$this->notifications()->delete();

		// delete user profile
		//
		UserProfile::where('user_id', '=', $this->id)->get()->each(function($userProfile) {
			$userProfile->delete();
		});

		// delete user sharing
		//
		Link::where('user_id', '=', $this->id)->delete();
		ShareRequest::where('user_id', '=', $this->id)->delete();
		Share::where('user_id', '=', $this->id)->delete();

		// delete user connections
		//
		ConnectionRequest::where('user_id', '=', $this->id)->delete();
		ConnectionRequest::where('connection_id', '=', $this->id)->delete();
		GroupMember::where('user_id', '=', $this->id)->delete();
		Group::where('user_id', '=', $this->id)->delete();

		// delete user customizations
		//
		UserSetting::where('user_id', '=', $this->id)->delete();
		UserFavorite::where('user_id', '=', $this->id)->delete();
		UserPreference::where('user_id', '=', $this->id)->delete();

		// delete user discussions
		//
		Post::where('user_id', '=', $this->id)->get()->each(function($post) {
			$post->delete();
		});
		Topic::where('user_id', '=', $this->id)->get()->each(function($topic) {
			$topic->delete();
		});
		UserTopic::where('user_id', '=', $this->id)->get()->each(function($userTopic) {
			$userTopic->delete();
		});

		// delete user chats
		//
		ChatInvitation::where('sender_id', '=', $this->id)->delete();
		ChatInvitation::where('recipient_id', '=', $this->id)->delete();
		ChatMembership::where('member_id', '=', $this->id)->delete();
		ChatMessage::where('user_id', '=', $this->id)->delete();
		Chat::where('user_id', '=', $this->id)->get()->each(function($chat) {
			$chat->delete();
		});

		// delete user account
		//
		if ($this->account) {
			$this->account->delete();
		}
		
		// delete the user
		//
		return parent::delete();
	}

	//
	// static querying methods
	//

	/**
	 * Find a user by id (or 'current')
	 *
	 * @return App\Models\Users\User
	 */
	public static function find($id): ?User {

		// get current user
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// get user
		//
		return self::where('id', '=', $id)->first();
	}

	/**
	 * Get the current user.
	 *
	 * @return App\Models\Users\User
	 */
	public static function current(): ?User {
		return self::find(Session::get('user_id'));
	}

	/**
	 * Find if the current user is an admin.
	 *
	 * @return bool
	 */
	public static function isCurrentAdmin(): bool {
		$currentUser = self::current();
		return $currentUser != null && $currentUser->isAdmin();
	}

	/**
	 * Get a list of all users.
	 *
	 * @return App\Models\Users\User[]
	 */
	public static function getAll(): array {
		return self::all();
	}
}