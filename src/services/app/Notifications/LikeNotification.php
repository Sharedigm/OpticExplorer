<?php
/******************************************************************************\
|                                                                              |
|                             LikeNotification.php                             |
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

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\NexmoMessage;
use Illuminate\Support\HtmlString;
use App\Notifications\BaseNotification;
use App\Models\Topics\Like;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class LikeNotification extends BaseNotification
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
		'like',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'like'
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
			$this->like_id = $attributes['like_id'];
		}
	}

	//
	// accessor methods
	//

	/**
	 * Get this notification's like attribute.
	 *
	 * @return App\Models\Topics\Like
	 */
	public function getLikeAttribute() {
		return Like::find($this->data['like_id'])->first();
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
		return $this->like;
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
				->where('key', '=', 'likes'))->first();
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
			'like_id' => $this->like_id
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param mixed $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {
		$like = Like::find($this->like_id);
		$url = $like->item->url();

		// compose mail message
		//
		return (new MailMessage)
			->greeting($like->user->short_name . ' liked your ' . $like->item_kind . ':')
			->line('"' . $like->item->message . '"')
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
		$like = Like::find($this->like_id);
		$url = $like->item->url();

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content($like->user->short_name . ' liked your ' . $like->item_kind . ': ' . '"' . $like->item->message . '". See: ' . $url);
	}
}
