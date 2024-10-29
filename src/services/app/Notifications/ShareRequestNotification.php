<?php
/******************************************************************************\
|                                                                              |
|                         ShareRequestNotification.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification that a user has requested to share        |
|        a file or folder.                                                     |
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

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\NexmoMessage;
use App\Notifications\BaseNotification;
use App\Models\Storage\Sharing\ShareRequest;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class ShareRequestNotification extends BaseNotification
{
	//
	// attributes
	//

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'share_request',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'share_request'
	];

	//
	// constructor
	//

	/**
	 * Create a new notification instance.
	 *
	 * @return void
	 */
	public function __construct($attributes = null) {
		
		// set attributes
		//
		$this->id = Guid::create();
		if ($attributes) {
			$this->share_request_id = $attributes['share_request_id'];
		}
	}

	//
	// accessor methods
	//

	/**
	 * Get this notification's reply attribute.
	 *
	 * @return App\Models\Comments\Reply
	 */
	public function getReplyAttribute() {
		return Reply::find($this->data['share_request'])->first();
	}

	//
	// getting methods
	//

	/**
	 * Get the item associated with the notification.
	 *
	 * @return object
	 */
	public function getItem() {
		return $this->share_request;
	}

	/**
	 * Get the notification's delivery channels.
	 *
	 * @param mixed $notifiable
	 * @return string[]
	 */
	public function via($notifiable): array {
		$channels = ['database'];

		// add user's channels
		//
		if (!$notifiable->isActive()) {
			$userSetting = (UserSetting::where('user_id', '=', $notifiable->id)
				->where('category', '=', 'notifications')
				->where('key', '=', 'share_invitations'))->first();
			if ($userSetting) {
				$values = explode(',', $userSetting->value);
				for ($i = 0; $i < count($values); $i++) {
					$value = trim($values[$i]);
					array_push($channels, $value);
				}
			}
		}

		return $channels;
	}

	//
	// conversion methods
	//

	/**
	 * Get the array representation of the notification.
	 *
	 * @param mixed $notifiable
	 * @return object
	 */
	public function toDatabase($notifiable) {
		return [
			'share_request_id' => $this->share_request_id
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param  mixed  $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {
		$shareRequest = ShareRequest::find($this->share_request_id);
		$senderName = $shareRequest->user->short_name;
		$filename = basename($shareRequest->path);

		// compose mail message
		//
		return (new MailMessage)
			->greeting($senderName . " invited you to share " .
				($shareRequest->copy? "a copy of an item": "an item") . ":")
			->line('"' . $filename . '"')
			->salutation(' ');
	}

	/**
	* Get the Vonage / SMS representation of the notification.
	*
	* @param  mixed  $notifiable
	* @return NexmoMessage
	*/
	public function toNexmo($notifiable) {
		$shareRequest = ShareRequest::find($this->share_request_id);
		$senderName = $shareRequest->user->short_name;
		$filename = basename($shareRequest->path);

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content($senderName . " invited you to share " . ($shareRequest->copy? "a copy of an item": "an item") . ":" . '"' . $filename . '"');
	}
}