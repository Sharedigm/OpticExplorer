<?php
/******************************************************************************\
|                                                                              |
|                       TopicInvitationNotification.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification that a user has been invited to           |
|        join a post topic.                                                    |
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
use App\Models\Topics\Sharing\TopicInvitation;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class TopicInvitationNotification extends BaseNotification
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
		'topic_invitation',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'topic_invitation'
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
			$this->topic_invitation_id = $attributes['topic_invitation_id'];
		}
	}

	//
	// accessor methods
	//

	/**
	 * Get this notification's topic invitation attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getTopicInvitationAttribute() {
		return TopicInvitation::find($this->data['comment_id'])->first();
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
		return $this->topic_invitation;
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
				->where('key', '=', 'topic_invitations'))->first();
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
			'topic_invitation_id' => $this->topic_invitation_id,
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param mixed $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {
		$topicInvitation = TopicInvitation::find($this->topic_invitation_id);
		$senderName = $topicInvitation->sender->short_name;
		$topicName = $topicInvitation->topic->name;

		// compose mail message
		//
		return (new MailMessage)
			->greeting($senderName . " invited you to join the topic: ")
			->line('"' . $topicName . '"')
			->salutation(' ');
	}

	/**
	* Get the Vonage / SMS representation of the notification.
	*
	* @param  mixed  $notifiable
	* @return NexmoMessage
	*/
	public function toNexmo($notifiable) {
		$topicInvitation = TopicInvitation::find($this->topic_invitation_id);
		$senderName = $topicInvitation->sender->short_name;
		$topicName = $topicInvitation->topic->name;

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content($senderName . " invited you to join the topic: " . '"' . $topicName . '"');
	}
}