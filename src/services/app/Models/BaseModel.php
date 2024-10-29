<?php
/******************************************************************************\
|                                                                              |
|                                 BaseModel.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract superclass for models.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
	//
	// querying methods
	//

	/**
	 * Determine if this model has been previously saved (has a primary key).
	 *
	 * @return bool
	 */
	public function isNew(): bool {
		return $this[$this->primaryKey] == null;
	}

	/**
	 * Get the full class name of this object.
	 *
	 * @return string
	 */
	public function getFullClassName(): string {
		return get_class($this);
	}

	/**
	 * Get the short class name of this object.
	 *
	 * @return string
	 */
	public function getShortClassName(): string {
		return (new \ReflectionClass($this))->getShortName();
	}

	//
	// model updating methods
	//

	/**
	 * Update this object's attributes.
	 *
	 * @return array
	 */
	public function change(Array $attributes = []) {
		$this->fill($attributes);
		$changes = $this->getDirty();
		$this->save();
		return $changes;
	}

	/**
	 * Prepare a date for array / JSON serialization.
	 *
	 * @param  \DateTimeInterface  $date
	 * @return string
	 */
	 protected function serializeDate(DateTimeInterface $date)
	 {
	     return $date->format('Y-m-d H:i:s');
	 }
}