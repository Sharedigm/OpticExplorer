<?php
/******************************************************************************\
|                                                                              |
|                           NotificationController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for fetching and managing notifications.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Notifications;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Collection;
use Illuminate\Notifications\DatabaseNotification;
use App\Models\Users\User;
use App\Models\Comments\Info\LikeInfo;
use App\Models\Comments\Info\CommentInfo;
use App\Models\Comments\Info\ReplyInfo;
use App\Models\Storage\Sharing\Info\ShareRequestInfo;
use App\Models\Topics\Sharing\Info\TopicInvitationInfo;
use App\Models\Chats\Sharing\Info\ChatInvitationInfo;
use App\Models\Gestures\Info\GestureInfo;
use App\Notifications\BaseNotification;
use App\Http\Controllers\Controller;
use App\Http\Filters\MessageFilter;
use App\Http\Filters\DateFilter;
use App\Http\Filters\RangeFilter;
use App\Utilities\Strings\StringUtils;

class NotificationController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get the notifications for the current user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Notifications\Notification[]
	 */
	public function getCurrent(Request $request) {
		$notifications = User::current()->unreadNotifications->sortByDesc('created_at');
		$array = [];

		// parse filter parameters
		//
		if ($request->has('before')) {
			$before = $request->input('before');
			$notifications = $notifications->filter(function($notification) use ($before) {
    			return $notification->created_at < $before;
			});
		}
		if ($request->has('date')) {
			$date = $request->input('date');
			$notifications = $notifications->filter(function($notification) use ($date) {
    			return $notification->created_at == $date;
			});
		}
		if ($request->has('after')) {
			$after = $request->input('after');
			$notifications = $notifications->filter(function($notification) use ($after) {
    			return $notification->created_at > $after;
			});
		}
		if ($request->has('message')) {
			$message = strtolower($request->input('message'));
			$notifications = $notifications->filter(function($notification) use ($message) {
				$item = self::getItem($notification->data);
				$itemMessage = strtolower($item['message']);
    			return $item && StringUtils::contains($itemMessage,
    				$message);
			});
		}

		// append additional data to notifications
		//
		foreach ($notifications as $notification) {
			$notification = $this->appended($notification);
			if ($notification) {
				array_push($array, $notification);
			}
		}

		return $array;
	}

	/**
	 * Get a notification.
	 *
	 * @param string $id - the id of the notification to get
	 * @return App\Notifications\Notification
	 */
	public function getIndex(string $id) {

		// find notification by id
		//
		return $this->appended(DatabaseNotification::find($id));
	}

	//
	// setting methods
	//

	/**
	 * Dismiss a notification.
	 *
	 * @param string $id - the id of the notification to dismiss
	 * @return App\Notifications\Notification[]
	 */
	public function dismissIndex(string $id) {
		$notification = DatabaseNotification::find($id);
		$notification->markAsRead();
		return self::appended(DatabaseNotification::find($id));
	}

	//
	// private methods
	//

	/**
	 * Get item associated with a notification.
	 *
	 * @param object $data - the attributes of the item
	 * @return object
	 */
	private static function getItem($data) {
		if (array_key_exists('like_id', $data)) {
			return LikeInfo::find($data['like_id']);
		} else if (array_key_exists('comment_id', $data)) {
			return CommentInfo::find($data['comment_id']);
		} else if (array_key_exists('reply_id', $data)) {
			return ReplyInfo::find($data['reply_id']);
		} else if (array_key_exists('share_request_id', $data)) {
			return ShareRequestInfo::find($data['share_request_id']);
		} else if (array_key_exists('topic_invitation_id', $data)) {
			return TopicInvitationInfo::find($data['topic_invitation_id']);
		} else if (array_key_exists('chat_invitation_id', $data)) {
			return ChatInvitationInfo::find($data['chat_invitation_id']);
		} else if (array_key_exists('gesture_id', $data)) {
			return GestureInfo::find($data['gesture_id']);
		}
	}

	/**
	 * Append data to a notification.
	 *
	 * @param DatabaseNotification $notification - the notification to append to
	 * @return App\Notifications\Notification
	 */
	private static function appended(DatabaseNotification $notification) {
		$data = $notification->data;

		// append like data
		//
		if (array_key_exists('like_id', $data)) {
			$like = LikeInfo::find($data['like_id']);
			if ($like) {
				$notification['like'] = $like;
				return $notification;
			}

		// append comment data
		//
		} else if (array_key_exists('comment_id', $data)) {
			$comment = CommentInfo::find($data['comment_id']);
			if ($comment) {
				$notification['comment'] = $comment;
				return $notification;
			}

		// append reply data
		//
		} else if (array_key_exists('reply_id', $data)) {
			$reply = ReplyInfo::find($data['reply_id']);
			if ($reply) {
				$notification['reply'] = $reply;
				return $notification;
			}

		// append share request data
		//
		} else if (array_key_exists('share_request_id', $data)) {
			$shareRequest = ShareRequestInfo::find($data['share_request_id']);
			if ($shareRequest) {
				$notification['share_request'] = $shareRequest;
				return $notification;
			}

		// append topic invitation data
		//
		} else if (array_key_exists('topic_invitation_id', $data)) {
			$topicInvitation = TopicInvitationInfo::find($data['topic_invitation_id']);
			if ($topicInvitation) {
				$notification['topic_invitation'] = $topicInvitation;
				return $notification;
			}

		// append chat invitation data
		//
		} else if (array_key_exists('chat_invitation_id', $data)) {
			$chatInvitation = ChatInvitationInfo::find($data['chat_invitation_id']);
			if ($chatInvitation) {
				$notification['chat_invitation'] = $chatInvitation;
				return $notification;
			}

		// append gesture data
		//
		} else if (array_key_exists('gesture_id', $data)) {
			$gesture = GestureInfo::find($data['gesture_id']);
			if ($gesture) {
				$notification['gesture'] = $gesture;
				return $notification;
			}
		}

		return null;
	}
}