<?php
/******************************************************************************\
|                                                                              |
|                          PostAttachmentController.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing posts.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Topics;

use Illuminate\Http\Request;
use App\Models\Storage\Attachments\PostAttachment;
use App\Models\Topics\Post;
use App\Models\Topics\Topic;
use App\Http\Controllers\Controller;

class PostAttachmentController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Get public post attachments.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Topics\PostAttachment[]
	 */
	public function getPublic(Request $request) {

		// parse parameters
		//
		$limit = $request->input('limit', 100);
		$sorting = $request->input('sorting', 'date');

		// get public post attachments
		//
		$attachments = PostAttachment::whereHas('item', function($query) {
			$query->where('public', '=', 1);
		})->limit($limit)->orderBy('created_at', 'DESC')->get();

		// skip post attachments for required topics
		//
		/*
		$array = [];
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			$post = Post::find($attachment->post_id);
			$topic = Topic::find($post->topic_id);
			if (!$topic || !$topic->required) {
				$array[] = $attachment;
			}
		}
		$attachments = $array;
		*/

		switch ($sorting) {
			case 'comments':
				$attachments = $attachments->sortByDesc(function($attachment) {
					return $attachment->post->num_comments;
				})->values();
				break;
			case 'likes':
				$attachments = $attachments->sortByDesc(function($attachment) {
					return $attachment->post->num_likes;
				})->values();
				break;
		}

		return $attachments;
	}
}