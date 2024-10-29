<?php
/******************************************************************************\
|                                                                              |
|                             CommentController.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing comments.              |
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
use App\Models\Topics\Post;
use App\Models\Comments\Comment;
use App\Models\Storage\Attachments\CommentAttachment;
use App\Notifications\CommentNotification;
use App\Notifications\LikeNotification;
use App\Http\Controllers\Topics\PostController;
use App\Http\Filters\RangeFilter;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;

class CommentController extends PostController
{
	//
	// creating methods
	//

	/**
	 * Create a new comment.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Comments\Comment
	 */
	public function postCreate(Request $request) {

		// find item that we are commenting on
		//
		$post = Post::find($request->input('post_id'));
		if (!$post) {
			return response("Post not found.", 404);
		}

		// create new comment
		//
		$comment = new Comment([
			'id' => Guid::create(),
			'post_id' => $post->id,
			'user_id' => Session::get('user_id'),
			'message' => $request->input('message'),
		]);
		$comment->save();

		// create new comment attachments
		//
		$attachments = $request->input('attachments');
		foreach ($attachments as $attachment) {
			$newAttachment = new CommentAttachment([
				'id' => Guid::create(),
				'comment_id' => $comment->id,
				'path' => $attachment['path'],
				'copy' => StringUtils::startsWith($attachment['path'], 'News')
			]);
			$newAttachment->save();	
		}

		// notify user of comment
		//
		if (!$post->user->isCurrent()) {
			$post->user->notify(new CommentNotification([
				'comment_id' => $comment->id
			]));
		}

		return $comment;
	}

	//
	// querying methods
	//

	/**
	 * Get a comment.
	 *
	 * @param string $id - the id of the comment to get
	 * @return App\Models\Comments\Comment
	 */
	public function getIndex(string $id) {

		// find comment by id
		//
		$comment = Comment::find($id);
		if (!$comment) {
			return response("Comment not found.", 404);
		}

		return $comment;
	}

	/**
	 * Get comments by post.
	 *
	 * @param string $id - the id of the post to get comments of
	 * @return Illuminate\Support\Collection
	 */
	public function getByPost(string $postId) {
		return Comment::where('post_id', '=', $postId)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get comments sent by user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user to get comments belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get comments made by user
		//
		$query = Comment::belongingTo($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get comments received by user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user to get comments received by
	 * @return Illuminate\Support\Collection
	 */
	public function getReceivedByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// get comments received on user's posts
		//
		$query = Comment::notBelongingTo($userId)
			->whereHas('post', function($query) {
				$query->belongingTo($userId);
			});

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get a comment's notifications.
	 *
	 * @param string $id - the id of the comment to get notifications of
	 * @return Illuminate\Support\Collection
	 */
	public function getNotifications(string $id) {
		$comment = Comment::find($id);

		// check for comment
		//
		if (!$comment) {
			return response("Comment not found.", 404);
		}

		return $comment->notifications()->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a comment.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the comment to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find comment by id
		//
		$comment = Comment::find($id);
		if (!$comment) {
			return response("Comment not found.", 404);
		}

		// update attachments
		//
		$attachments = $request->input('attachments');

		// remove deleted existing attachments
		//
		$existingAttachments = $comment->attachments()->get();
		foreach ($existingAttachments as $existingAttachment) {
			$found = false;
			foreach ($attachments as $attachment) {
				if (array_key_exists('comment_attachment_id', $attachment) && 
					$existingAttachment->id == $attachment['comment_attachment_id']) {
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
			if (!array_key_exists('comment_attachment_id', $attachment)) {
				$newAttachment = new CommentAttachment([
					'id' => Guid::create(),
					'comment_id' => $comment->id,
					'path' => $attachment['path'],
					'copy' => StringUtils::startsWith($attachment['path'], 'Posts')
				]);
				$newAttachment->save();
			}
		}

		// update attributes
		//
		$comment->change([
			'message' => $request->input('message')
		]);

		return $comment;
	}

	/**
	 * Like a comment.
	 *
	 * @param string $id - the id of the comment to like
	 * @return App\Models\Comments\Comment
	 */
	public function putLike(string $id) {

		// find comment by id
		//
		$comment = Comment::find($id);
		if (!$comment) {
			return response("Comment not found.", 404);
		}

		// like comment
		//
		$like = $comment->likeBy(Session::get('user_id'));

		// notify user of like
		//
		if ($like) {
			$comment->user->notify(new LikeNotification([
				'like_id' => $like->id
			]));
		}

		return $comment;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a comment.
	 *
	 * @param string $id - the id of the comment to delete
	 * @return App\Models\Comments\Comment
	 */
	public function deleteIndex(string $id) {

		// find comment by id
		//
		$comment = Comment::find($id);
		if (!$comment) {
			return response("Comment not found.", 404);
		}

		// delete comment
		//
		$comment->delete();
		
		return $comment;
	}
}