<?php
/******************************************************************************\
|                                                                              |
|                              ReplyController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing replies.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Comments;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Comments\Comment;
use App\Models\Comments\Reply;
use App\Models\Storage\Attachments\ReplyAttachment;
use App\Notifications\ReplyNotification;
use App\Notifications\LikeNotification;
use App\Http\Controllers\Comments\CommentsController;
use App\Http\Filters\RangeFilter;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;

class ReplyController extends CommentController
{
	//
	// creating methods
	//

	/**
	 * Create a new reply.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Comments\Reply
	 */
	public function postCreate(Request $request) {

		// find item that we are replying to
		//
		$item = $this->getItem($request);
		if (!$item) {
			return response("Reply item not found.", 404);
		}

		// create new reply
		//
		$reply = new Reply([
			'id' => Guid::create(),
			'item_id' => $item->id,
			'item_type' => get_class($item),
			'user_id' => Session::get('user_id'),
			'message' => $request->input('message'),
		]);
		$reply->save();

		// create new reply attachments
		//
		$attachments = $request->input('attachments');
		foreach ($attachments as $attachment) {
			$newAttachment = new ReplyAttachment([
				'id' => Guid::create(),
				'reply_id' => $reply->id,
				'path' => $attachment['path'],
				'copy' => StringUtils::startsWith($attachment['path'], 'News')
			]);
			$newAttachment->save();	
		}

		// notify user of reply
		//
		if (!$item->user->isCurrent()) {
			$item->user->notify(new ReplyNotification([
				'reply_id' => $reply->id
			]));
		}

		return $reply;
	}

	/**
	 * Get reply item from request
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\BaseModel
	 */
	public function getItem(Request $request) {
		if ($request->has('comment_id')) {
			return Comment::find($request->input('comment_id'));
		} else if ($request->has('reply_id')) {
			return Reply::find($request->input('reply_id'));
		};
	}

	//
	// querying methods
	//

	/**
	 * Get a reply.
	 *
	 * @param string $id - the id of the reply to get
	 * @return App\Models\Comments\Reply
	 */
	public function getIndex(string $id) {

		// find reply by id
		//
		$reply = Reply::find($id);
		if (!$reply) {
			return response("Reply not found.", 404);
		}

		return $reply;
	}

	/**
	 * Get a users's replies.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get replies belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get replies made by user
		//
		$query = Reply::belongingTo($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get a replies received by a user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get replies received by
	 * @return Illuminate\Support\Collection
	 */
	public function getReceivedByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get replies received on user's comments
		//
		$query = Reply::belongingTo($userId)
			->whereHas('comment', function($query) {
				$query->where('user_id', '=', $userId);
			});

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get a reply's notifications.
	 *
	 * @param string $id - the id of the reply to get notifications of
	 * @return Illuminate\Support\Collection
	 */
	public function getNotifications(string $id) {
		$reply = Reply::find($id);

		// check for comment
		//
		if (!$reply) {
			return response("Reply not found.", 404);
		}

		return $reply->notifications()->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a reply.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the reply to update
	 * @return App\Models\Comments\Reply
	 */
	public function updateIndex(Request $request, string $id) {

		// find reply by id
		//
		$reply = Reply::find($id);
		if (!$reply) {
			return response("Reply not found.", 404);
		}

		// update attachments
		//
		$attachments = $request->input('attachments');

		// remove deleted existing attachments
		//
		$existingAttachments = $reply->attachments()->get();
		foreach ($existingAttachments as $existingAttachment) {
			$found = false;
			foreach ($attachments as $attachment) {
				if (array_key_exists('reply_attachment_id', $attachment) && 
					$existingAttachment->id == $attachment['reply_attachment_id']) {
					$found = true;
					break;
				}
			}
			if (!$found) {
				$existingAttachment->delete();
			}
		}

		// create new attachments
		//
		foreach ($attachments as $attachment) {
			if (!array_key_exists('reply_attachment_id', $attachment)) {
				$newAttachment = new ReplyAttachment([
					'id' => Guid::create(),
					'reply_id' => $reply->id,
					'path' => $attachment['path'],
					'copy' => StringUtils::startsWith($attachment['path'], 'Posts')
				]);
				$newAttachment->save();
			}
		}

		// update attributes
		//
		$reply->change([
			'message' => $request->input('message')
		]);

		return $reply;
	}

	/**
	 * Like a reply.
	 *
	 * @param string $id - the id of the reply to like
	 * @return App\Models\Comments\Reply
	 */
	public function putLike(string $id) {

		// find reply by id
		//
		$reply = Reply::find($id);
		if (!$reply) {
			return response("Reply not found.", 404);
		}

		// like reply
		//
		$like = $reply->likeBy(Session::get('user_id'));

		// notify user of like
		//
		if ($like) {
			$reply->user->notify(new LikeNotification([
				'like_id' => $like->id
			]));
		}

		return $reply;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a reply.
	 *
	 * @param string $id - the id of the reply to delete
	 * @return App\Models\Comments\Reply
	 */
	public function deleteIndex(string $id) {

		// find reply by id
		//
		$reply = Reply::find($id);
		if (!$reply) {
			return response("Reply not found.", 404);
		}

		// delete reply
		//
		$reply->delete();
		
		return $reply;
	}
}