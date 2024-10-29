<?php
/******************************************************************************\
|                                                                              |
|                                 Country.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a country's phone system information.         |
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

use App\Models\BaseModel;

class Country extends BaseModel
{
	//
	// attributes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'countries';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'name',
		'iso',
		'iso3',
		'num_code',
		'phone_code'
	];

	//
	// constructor
	//
	
	public function __construct(array $attributes = []) {
		parent::__construct($attributes);

		// override properties set by base model
		//
		$this->timestamps = false;
	}
}
