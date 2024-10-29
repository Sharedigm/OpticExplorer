<?php
/******************************************************************************\
|                                                                              |
|                           CommentNotification.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification that a user has commented on an item.     |
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
use App\Models\Comments\Comment;
use App\Models\Settings\UserSetting;
use App\Utilities\Uuids\Guid;

class CommentNotification extends BaseNotification
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
		'comment',
		'created_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'comment'
	];

	//
	// accessor methods
	//

	/**
	 * Get this notification's comment attribute.
	 *
	 * @return App\Models\Comments\Comment
	 */
	public function getCommentAttribute() {
		return Comment::find($this->data['comment_id'])->first();
	}

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
			$this->comment_id = $attributes['comment_id'];
		}
	}

	/**
	 * Get the item associated with the notification.
	 *
	 * @return object
	 */
	public function getItem() {
		return $this->comment;
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
				->where('key', '=', 'comments'))->first();
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
			'comment_id' => $this->comment_id
		];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param mixed $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable) {
		$comment = Comment::find($this->comment_id);
		$authorName = $comment->user->short_name;
		$url = $comment->post->url();

		// compose mail message
		//
		return (new MailMessage)
			->greeting($authorName . ' commented on your post:')
			->line('"' . $comment->message . '"')
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
		$comment = Comment::find($this->comment_id);
		$authorName = $comment->user->short_name;
		$url = $comment->post->url();

		// compose nexmo message
		//
		return (new NexmoMessage)
			->content($authorName . ' commented on your post: ' . '"' . $comment->message . '".  See: ' . $url);
	}
}
