<?php
/******************************************************************************\
|                                                                              |
|                             ReplyNotification.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification that a user has replied to an item.       |
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
use App\Models\Comments\Reply;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class ReplyNotification extends BaseNotification
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
		'reply',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'reply',
		'post_id'
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
			$this->reply_id = $attributes['reply_id'];
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
		return Reply::find($this->data['reply_id'])->first();
	}

	/**
	 * Get this reply's post id attribute.
	 *
	 * @return string
	 */
	public function getPostIdAttribute(): ?string {
		return $this->reply()->post()->id;
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
		return $this->reply;
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
				->where('key', '=', 'replies'))->first();
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
			'reply_id' => $this->reply_id
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param mixed $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {
		$reply = Reply::find($this->reply_id);
		$authorName = $reply->user->short_name;
		$itemType = $reply->getItemType();
		$url = $reply->post()->url();

		// compose mail message
		//
		return (new MailMessage)
			->greeting($authorName . ' replied to your ' . $itemType . ':')
			->line('"' . $reply->message . '"')
			->line(new HtmlString('<a href="' . $url . '">' . $url . '</a>'))
			->salutation(' ');
	}

	/**
	* Get the Vonage / SMS representation of the notification.
	*
	* @param  mixed  $notifiable
	* @return NexmoMessage
	*/
	public function toNexmo($notifiable) {
		$reply = Reply::find($this->reply_id);
		$authorName = $reply->user->short_name;
		$itemType = $reply->getItemType();
		$url = $reply->post()->url();

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content($authorName . ' replied to your ' . $itemType . ': ' . '"' . $reply->message . '". See: ' . $url);
	}
}
