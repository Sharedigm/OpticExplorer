<?php
/******************************************************************************\
|                                                                              |
|                               UserIdentity.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's third party auth identity.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Auth;

use App\Models\TimeStamps\CreateStamped;
use App\Models\Users\Auth\IdentityProvider;
use App\Models\Users\User;

class UserIdentity extends CreateStamped
{
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'user_identities';

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
		'id',
		'user_id',
		'provider_code', 
		'user_external_id', 
		'enabled_flag'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'user_id',
		'provider_code',
		'user_external_id',
		'enabled_flag',
		'title',
		'description',

		// timestamp attributes
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
		'title',
		'description'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'enabled_flag' => 'boolean'
	];

	//
	// accessor methods
	//

	public function getTitleAttribute() {
		return IdentityProvider::where('provider_code','=',$this->provider_code)->first()->title;
	}

	public function getDescriptionAttribute(){
		return IdentityProvider::where('provider_code','=',$this->provider_code)->first()->description;
	}
}
