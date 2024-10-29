<?php
/******************************************************************************\
|                                                                              |
|                             IdentityProvider.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an identity provider.                         |
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
use App\Models\Users\User;

class IdentityProvider extends CreateStamped
{
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'identity_providers';

	/**
	 * The primary key associated with the table.
	 *
	 * @var string
	 */
	protected $primaryKey = 'provider_code';

	/**
	 * Indicates if the IDs are auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The "type" of the auto-incrementing ID.
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
		'provider_code', 
		'title',
		'description',
		'enabled_flag',

		// timestamp attributes
		//
		'create_date',
		'update_date'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'enabled_flag' => 'boolean',
		'create_date' => 'datetime',
		'update_date' => 'datetime'
	];
}
