<?php
/******************************************************************************\
|                                                                              |
|                               Notification.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base type of notification database base class.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Notifications;

use DateTimeInterface;
use Illuminate\Notifications\DatabaseNotification;

class DatedNotification extends DatabaseNotification
{
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