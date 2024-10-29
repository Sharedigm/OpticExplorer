<?php
/******************************************************************************\
|                                                                              |
|                           GestureNotification.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification of a gesture (poke etc).                  |
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
use App\Models\Gestures\Gesture;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class GestureNotification extends BaseNotification
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
		'gesture',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'gesture'
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
			$this->gesture_id = $attributes['gesture_id'];
		}
	}

	//
	// accessor methods
	//

	/**
	 * Get this notification's gesture attribute.
	 *
	 * @return App\Models\Gestures\Gesture
	 */
	public function getGestureAttribute() {
		return Like::find($this->data['gesture_id'])->first();
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
		return $this->gesture;
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
				->where('key', '=', 'gesture_invitations'))->first();
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
			'gesture_id' => $this->gesture_id
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param mixed $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {

		// compose mail message
		//
		return (new MailMessage)
			->greeting('Hello!')
			->line('Somebody just gestured to you!');
	}

	/**
	* Get the Vonage / SMS representation of the notification.
	*
	* @param  mixed  $notifiable
	* @return NexmoMessage
	*/
	public function toNexmo($notifiable) {

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content('Somebody just gestured to you!');
	}
}
