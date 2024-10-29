<?php
/******************************************************************************\
|                                                                              |
|                                Notifiable.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait for notifications.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Notifications\Traits;

use App\Notifications\DatedNotification;
use Illuminate\Notifications\Notifiable as BaseNotifiable;

trait Notifiable
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use BaseNotifiable;

	//
	// methods
	//

	/**
	 * Get the entity's notifications.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\MorphMany
	 */
	public function notifications()
	{
		return $this->morphMany(DatedNotification::class, 'notifiable')->orderBy('created_at', 'desc');;
	}
}