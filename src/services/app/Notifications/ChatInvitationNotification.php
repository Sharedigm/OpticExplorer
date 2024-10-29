<?php
/******************************************************************************\
|                                                                              |
|                        ChatInvitationNotification.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification that a user has invited you to            |
|        join a chat session.                                                  |
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
use Illuminate\Support\HtmlString;
use App\Notifications\BaseNotification;
use App\Models\Chats\Sharing\ChatInvitation;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class ChatInvitationNotification extends BaseNotification
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
		'chat_invitation',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'chat_invitation'
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
			$this->chat_invitation_id = $attributes['chat_invitation_id'];
		}
	}

	//
	// accessor methods
	//

	/**
	 * Get this notification's comment attribute.
	 *
	 * @return App\Models\Comments\Comment
	 */
	public function getChatInvitationAttribute() {
		return ChatInvitation::find($this->data['chat_invitation_id'])->first();
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
		return $this->chat_invitation;
	}

	//
	// notification methods
	//

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
				->where('key', '=', 'chat_invitations'))->first();
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
			'chat_invitation_id' => $this->chat_invitation_id
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param  mixed  $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {
		$chatInvitation = ChatInvitation::find($this->chat_invitation_id);

		// compose mail message
		//
		return (new MailMessage)
			->greeting($chatInvitation->sender->short_name . ' invited you to join a chat.')
			->salutation(' ');
	}

	/**
	* Get the Vonage / SMS representation of the notification.
	*
	* @param  mixed  $notifiable
	* @return NexmoMessage
	*/
	public function toNexmo($notifiable) {
		$chatInvitation = ChatInvitation::find($this->chat_invitation_id);

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content($chatInvitation->sender->short_name . ' invited you to join a chat.');
	}
}