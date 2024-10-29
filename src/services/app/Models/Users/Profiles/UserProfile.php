<?php
/******************************************************************************\
|                                                                              |
|                                UserProfile.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal profile information.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Profiles;

use Illuminate\Support\Collection;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\UserOwned;
use App\Models\Users\Profiles\UserHome;
use App\Models\Users\Profiles\UserJob;
use App\Models\Users\Profiles\UserFamilyMember;
use App\Models\Users\Profiles\UserSchool;
use App\Models\Users\Profiles\UserBook;
use App\Models\Users\Profiles\UserArticle;
use App\Models\Users\Profiles\UserPatent;
use App\Models\Users\Profiles\UserPhone;
use App\Models\Users\Profiles\UserAddress;
use App\Models\Users\Profiles\UserEmailAddr;
use App\Models\Users\Profiles\UserWebsite;
use App\Models\Users\Profiles\UserAffiliation;
use App\Models\Places\CheckIn;
use App\Models\Topics\Post;
use App\Models\Comments\Comment;
use App\Models\Chats\ChatMembership;
use App\Models\Storage\Sharing\Share;

class UserProfile extends TimeStamped
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use UserOwned;

	//
	// attributes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'user_profiles';

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

		// user attributes
		//
		'user_id',

		// user profile photos
		//
		'profile_photo_path',
		'cover_photo_path',

		// user profile info
		//
		'bio',
		'birth_date',
		'gender',

		// user preferences
		//
		'interests',
		'likes',
		'dislikes',

		// user talents
		//
		'skills',
		'experiences',
		'goals'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// user attributes
		//
		'user_id',
		
		// user profile photos
		//
		'profile_photo_path',
		'cover_photo_path',
		'profile_photo_share_id',
		'cover_photo_share_id',

		// user profile info
		//
		'bio',
		'birth_date',
		'gender',

		// user preferences
		//
		'interests',
		'likes',
		'dislikes',

		// user talents
		//
		'skills',
		'experiences',
		'goals',

		// summary info
		//
		'age',
		'home',
		'occupation',
		'family',
		'education',
		'affiliation_names',

		// personal info
		//
		'homes',
		'jobs',
		'family_members',
		'schools',
		'affiliations',

		// publication info
		//
		'books',
		'articles',
		'patents',

		// contact info
		//
		'phones',
		'addresses',
		'email_addrs',
		'websites',

		// appended counts
		//
		'num_connections',
		'num_posts',
		'num_comments',
		'num_chats'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [

		// profile photos
		//
		'profile_photo_share_id',
		'cover_photo_share_id',

		// summary info
		//
		'age',
		'home',
		'occupation',
		'family',
		'education',
		'affiliation_names',

		// personal info
		//
		'homes',
		'jobs',
		'family_members',
		'schools',
		'affiliations',

		// publication info
		//
		'books',
		'articles',
		'patents',

		// contact info
		//
		'phones',
		'addresses',
		'email_addrs',
		'websites',

		// appended counts
		//
		'num_connections',
		'num_posts',
		'num_comments',
		'num_chats'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user profile photo's share id attribute.
	 *
	 * @return int
	 */
	public function getProfilePhotoShareIdAttribute(): ?string {

		// check for shared item
		//
		$share = Share::where('user_id', '=', $this->user_id)
			->where('path', '=', $this->profile_photo_path)
			->first();

		// check for shared parent directory
		//
		if (!$share) {
			$dirname = dirname($this->profile_photo_path);
			if ($dirname) {
				$share = Share::where('user_id', '=', $this->user_id)
				->where('path', '=', $dirname . '/')
				->first();
			}
		}

		if ($share) {
			return $share->id;
		} else {
			return null;
		}
	}

	/**
	 * Get this user cover photo's share id attribute.
	 *
	 * @return int
	 */
	public function getCoverPhotoShareIdAttribute(): ?string {

		// check for shared item
		//
		$share = Share::where('user_id', '=', $this->user_id)
			->where('path', '=', $this->cover_photo_path)
			->first();

		// check for shared parent directory
		//
		if (!$share) {
			$dirname = dirname($this->cover_photo_path);
			if ($dirname) {
				$share = Share::where('user_id', '=', $this->user_id)
					->where('path', '=', $dirname . '/')
					->first();
			}
		}

		if ($share) {
			return $share->id;
		} else {
			return null;
		}
	}

	/**
	 * Get this user profile's age attribute.
	 *
	 * @return int
	 */
	public function getAgeAttribute(): ?int {
		if ($this->birth_date) {
			$diff = time() - strtotime($this->birth_date);
			return floor($diff / (365 * 60 * 60 * 24));
		} else {
			return null;
		}
	}

	/**
	 * Get this user profile's home attribute.
	 *
	 * @return string
	 */
	public function getHomeAttribute(): ?string {
		$userHome = UserHome::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->first();
		return $userHome? $userHome->toString() : null;
	}

	/**
	 * Get this user profile's job attribute.
	 *
	 * @return string
	 */
	public function getOccupationAttribute(): ?string {
		$userJob = UserJob::where('user_id', '=', $this->user_id)
			->orderBy('from_date', 'desc')
			->first();
		return $userJob? $userJob->toString() : null;
	}

	/**
	 * Get this user profile's family attribute.
	 *
	 * @return string
	 */
	public function getFamilyAttribute() {
		$keys = UserFamilyMember::where('user_id', '=', $this->user_id)->select('relationship')->distinct()->get()->pluck('relationship');
		$counts = [];
		foreach ($keys as $key) {
			$counts[$key] = UserFamilyMember::where('user_id', '=', $this->user_id)
				->where('relationship', '=', $key)
				->count();
		}
		return $counts;
	}

	/**
	 * Get this user profile's education attribute.
	 *
	 * @return string
	 */
	public function getEducationAttribute(): ?string {
		$userSchool = UserSchool::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->first();
		return $userSchool? $userSchool->toString() : null;
	}

	/**
	 * Get this user profile's affilations attribute.
	 *
	 * @return string
	 */
	public function getAffiliationNamesAttribute(): Collection {
		return UserAffiliation::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->get()
			->pluck('organization_name');
	}

	/**
	 * Get this user profile's homes attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getHomesAttribute(): Collection {
		return UserHome::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->get();
	}

	/**
	 * Get this user profile's jobs attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getJobsAttribute(): Collection {
		return UserJob::where('user_id', '=', $this->user_id)
			->orderBy('from_date', 'desc')
			->get();
	}

	/**
	 * Get this user profile's family attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getFamilyMembersAttribute(): Collection {
		return UserFamilyMember::where('user_id', '=', $this->user_id)->get();
	}

	/**
	 * Get this user profile's schools attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSchoolsAttribute(): Collection {
		return UserSchool::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->get();
	}

	/**
	 * Get this user profile's books attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getBooksAttribute(): Collection {
		return UserBook::where('user_id', '=', $this->user_id)
			->orderBy('year', 'desc')
			->get();
	}

	/**
	 * Get this user profile's articles attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getArticlesAttribute(): Collection {
		return UserArticle::where('user_id', '=', $this->user_id)
			->orderBy('date', 'desc')
			->get();
	}

	/**
	 * Get this user profile's patents attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPatentsAttribute(): Collection {
		return UserPatent::where('user_id', '=', $this->user_id)
			->orderBy('year', 'desc')
			->get();
	}

	/**
	 * Get this user profile's phones attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPhonesAttribute(): Collection {
		return UserPhone::where('user_id', '=', $this->user_id)->get();
	}

	/**
	 * Get this user profile's addresses attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getAddressesAttribute(): Collection {
		return UserAddress::where('user_id', '=', $this->user_id)->get();
	}

	/**
	 * Get this user profile's email addresses attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getEmailAddrsAttribute(): Collection {
		return UserEmailAddr::where('user_id', '=', $this->user_id)->get();
	}

	/**
	 * Get this user profile's websites attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getWebsitesAttribute(): Collection {
		return UserWebsite::where('user_id', '=', $this->user_id)->get();
	}

	/**
	 * Get this user profile's affiliations attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getAffiliationsAttribute(): Collection {
		return UserAffiliation::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->get();
	}

	/**
	 * Get this user's num posts attribute.
	 *
	 * @return string
	 */
	public function getNumConnectionsAttribute() {
		return $this->user->numConnections();
	}

	/**
	 * Get this user's num posts attribute.
	 *
	 * @return string
	 */
	public function getNumPostsAttribute() {
		return Post::where('user_id', '=', $this->user_id)->count();
	}

	/**
	 * Get this user's num comments attribute.
	 *
	 * @return string
	 */
	public function getNumCommentsAttribute() {
		return Comment::where('user_id', '=', $this->user_id)->count();
	}

	/**
	 * Get this user's num chats attribute.
	 *
	 * @return string
	 */
	public function getNumChatsAttribute() {
		return ChatMembership::where('member_id', '=', $this->user_id)->count();
	}

	/**
	 * Get this link's hidden attributes.
	 *
	 * @return array
	 */
	public function getHidden(): array {
		if (!$this->user->is_current && !$this->user->is_connection) {
			return [

				// profile info
				//
				'birth_date',

				// personal info
				//
				'homes',
				'jobs',
				'family_members',
				'schools',
				'affiliations',

				// publication info
				//
				'books',
				'articles',
				'patents',

				// contact info
				//
				'phones',
				'addresses',
				'email_addrs',
				'websites'
			];
		} else {
			return [];
		}
	}

	//
	// conversion methods
	//

	/**
	 * Converts an array of comma separated lists into an array of arrays.
	 *
	 * @param array $attributes - array of comma separated lists.
	 * @return array
	 */
	public function convertAttrs(array $attributes): array {
		foreach ($attributes as $key => $value) {
			switch ($key) {

				// convert comma separated lists to arrays
				//
				case 'interests':
				case 'likes':
				case 'dislikes':
				case 'skills':
				case 'experiences':
				case 'goals':
					$attributes[$key] = $attributes[$key]? array_map('trim', explode(',', $attributes[$key])) : null;
					break;
			}
		}
		return $attributes;
	}

	/**
	 * Delete this user profile and associated items.
	 *
	 * @return App\Models\Users\Profiles\UserProfile
	 */
	public function delete() {

		// delete related models
		//
		UserHome::where('user_id', '=', $this->user_id)->delete();
		UserJob::where('user_id', '=', $this->user_id)->delete();
		UserFamilyMember::where('user_id', '=', $this->user_id)->delete();
		UserSchool::where('user_id', '=', $this->user_id)->delete();

		// delete publication info
		//
		UserBook::where('user_id', '=', $this->user_id)->delete();
		UserArticle::where('user_id', '=', $this->user_id)->delete();
		UserPatent::where('user_id', '=', $this->user_id)->delete();

		// delete contact info
		//
		UserPhone::where('user_id', '=', $this->user_id)->delete();
		UserAddress::where('user_id', '=', $this->user_id)->delete();
		UserEmailAddr::where('user_id', '=', $this->user_id)->delete();
		UserWebsite::where('user_id', '=', $this->user_id)->delete();
		UserAffiliation::where('user_id', '=', $this->user_id)->delete();

		// delete the user profile
		//
		return parent::delete();
	}

	//
	// overridden methods
	//

	/**
	 * Update this object's attributes.
	 *
	 * @return array
	 */
	public function change(array $attributes = []): array {
		return $this->convertAttrs(parent::change($attributes));
	}

	/**
	 * Convert this object to an array.
	 *
	 * @return array
	 */
	public function toArray(): array {
		return $this->convertAttrs(parent::toArray());
	}
}