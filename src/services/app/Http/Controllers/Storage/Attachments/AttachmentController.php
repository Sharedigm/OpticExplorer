<?php
/******************************************************************************\
|                                                                              |
|                            AttachmentController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing attachments.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage\Attachments;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Storage\Attachments\PostAttachment;
use App\Models\Storage\Attachments\CommentAttachment;
use App\Models\Storage\Attachments\ReplyAttachment;
use App\Models\Storage\Attachments\ChatAttachment;
use App\Models\Topics\Post;
use App\Models\Comments\Comment;
use App\Models\Comments\Reply;
use App\Models\Chats\ChatMessage;
use App\Http\Controllers\Controller;

class AttachmentController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get an item's attachments.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getByPath(Request $request) {
		$userId = Session::get('user_id');
		$attachments = collect();

		// parse params
		//
		$path = $request->input('path');

		// find post attachments by user id and path
		//
		$attachments = $attachments->merge(PostAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->get());

		// find comment attachments by user id and path
		//
		$attachments = $attachments->merge(CommentAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->get());

		// find reply attachments by user id and path
		//
		$attachments = $attachments->merge(ReplyAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->get());

		// find chat attachments by user id and path
		//
		$attachments = $attachments->merge(ChatAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->get());

		return $attachments;
	}

	/**
	 * Get an item's number of attachments.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumByPath(Request $request) {
		$userId = Session::get('user_id');
		$count = 0;

		// parse params
		//
		$path = $request->input('path');

		// find post attachments by user id and path
		//
		$count += PostAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->count();

		// find comment attachments by user id and path
		//
		$count += CommentAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->count();

		// find reply attachments by user id and path
		//
		$count += ReplyAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->count();

		// find chat attachments by user id and path
		//
		$count += ChatAttachment::whereHas('item', function($query) use ($userId, $path) {
			$query->where('user_id', '=', $userId)
				->where('path', '=', $path);
		})->count();

		return $count;
	}

	/**
	 * Get invalid attachments (attachments belonging to no item).
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Attachments\Attachment[]
	 */
	public function getInvalid(Request $request) {
		$invalid = collect();

		// delete invalid post attachments
		//
		$attachments = PostAttachment::all();
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!Post::where('id', '=', $attachment->post_id)->exists()) {
				$invalid->push($attachment);
			}
		}

		// delete invalid comment attachments
		//
		$attachments = CommentAttachment::all();
		$invalid = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!Post::where('id', '=', $attachment->comment_id)->exists()) {
				$invalid->push($attachment);
			}
		}

		// delete invalid reply attachments
		//
		$attachments = ReplyAttachment::all();
		$invalid = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!Reply::where('id', '=', $attachment->reply_id)->exists()) {
				$invalid->push($attachment);
			}
		}

		// delete invalid chat attachments
		//
		$attachments = ChatAttachment::all();
		$deleted = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!ChatMessage::where('id', '=', $attachment->message_id)->exists()) {
				$invalid->push($attachment);
			}
		}

		return $invalid;
	}

	/**
	 * Clean attachments.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return string
	 */
	public function getClean(Request $request) {
		$message = 'deleted ';

		// delete invalid post attachments
		//
		$attachments = PostAttachment::all();
		$deleted = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!Post::where('id', '=', $attachment->post_id)->exists()) {
				$attachment->delete();
				$deleted++;
			}
		}
		$message .= $deleted . " post attachments, ";

		// delete invalid comment attachments
		//
		$attachments = CommentAttachment::all();
		$deleted = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!Comment::where('id', '=', $attachment->comment_id)->exists()) {
				$attachment->delete();
				$deleted++;
			}
		}
		$message .= $deleted . " comment attachments, ";

		// delete invalid reply attachments
		//
		$attachments = ReplyAttachment::all();
		$deleted = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!Reply::where('id', '=', $attachment->reply_id)->exists()) {
				$attachment->delete();
				$deleted++;
			}
		}
		$message .= $deleted . " reply attachments, ";

		// delete invalid chat attachments
		//
		$attachments = ChatAttachment::all();
		$deleted = 0;
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			if (!ChatMessage::where('id', '=', $attachment->message_id)->exists()) {
				$attachment->delete();
				$deleted++;
			}
		}
		$message .= $deleted . " chat attachments, ";

		return $message;
	}
}