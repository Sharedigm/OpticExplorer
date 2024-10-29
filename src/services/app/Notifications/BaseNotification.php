<?php
/******************************************************************************\
|                                                                              |
|                              BaseNotification.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification that a user has liked a post.             |
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

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Utilities\Uuids\Guid;

class BaseNotification extends Notification
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use Queueable;

	//
	// attributes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'notifications';

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

	//
	// querying methods
	//

	/**
	 * Get the notification's delivery channels.
	 *
	 * @param mixed $notifiable
	 * @return string[]
	 */
	public function via($notifiable): array {
		return ['database', 'mail'];
		// return ['database'];
	}
}