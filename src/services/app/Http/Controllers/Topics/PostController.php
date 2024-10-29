<?php
/******************************************************************************\
|                                                                              |
|                               PostController.php                             |
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

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Topics\Post;
use App\Models\Storage\Attachments\PostAttachment;
use App\Models\Places\CheckIn;
use App\Notifications\LikeNotification;
use App\Http\Controllers\Controller;
use App\Http\Filters\RangeFilter;
use App\Http\Filters\PublicFilter;
use App\Http\Filters\MessageFilter;
use App\Http\Filters\DateFilter;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;

class PostController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new post.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Topics\Post
	 */
	public function postCreate(Request $request) {

		// parse parameters
		//
		$topicId = $request->input('topic_id');
		$message = $request->input('message');
		$public = filter_var($request->input('public'), FILTER_VALIDATE_BOOLEAN);
		$attachments = $request->input('attachments');
		$checkIn = $request->input('check_in', null);

		// create new check in
		//
		if ($checkIn) {
			$checkIn = new CheckIn([
				'id' => Guid::create(),
				'user_id' => Session::get('user_id'),
				'name' => $checkIn['name'],
				'latitude' => $checkIn['latitude'],
				'longitude' => $checkIn['longitude'],
				'zoom_level' => $checkIn['zoom_level']
			]);
			$checkIn->save();
		}

		// create new post
		//
		$post = new Post([
			'id' => Guid::create(),
			'topic_id' => $topicId != 'none'? $topicId : null,
			'user_id' => Session::get('user_id'),
			'message' => $message,
			'public' => $public,
			'check_in_id' => $checkIn? $checkIn->id : null
		]);
		$post->save();

		// create new post attachments
		//
		foreach ($attachments as $attachment) {
			$newAttachment = new PostAttachment([
				'id' => Guid::create(),
				'post_id' => $post->id,
				'path' => $attachment['path'],
				'copy' => StringUtils::startsWith($attachment['path'], 'News')
			]);
			$newAttachment->save();	
		}

		return $post;
	}

	//
	// querying methods
	//

	/**
	 * Get a post.
	 *
	 * @param string $id - the id of the post to get
	 * @return App\Models\Topics\Post
	 */
	public function getIndex(string $id) {

		// find post by id
		//
		$post = Post::find($id);
		if (!$post) {
			return response("Post not found.", 404);
		}

		return $post;
	}

	/**
	 * Get all posts by current user and their connections with no topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Topics\Post[]
	 */
	public function getPosts(Request $request) {

		// find current user
		//
		$user = User::current();
		if (!$user) {
			return response("No current user.", 404);
		}

		// get users's posts
		//
		$query = Post::where('user_id', '=', $user->id)
			->whereNull('topic_id')
			->whereNull('deleted_at');

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// get user's connections' posts
		//
		$connections = $user->getConnections();
		foreach ($connections as $connection) {
			$query = $query->orWhere('user_id', '=', $connection->id)
				->whereNull('topic_id')
				->whereNull('deleted_at');

			// apply filters
			//
			$query = PublicFilter::applyTo($request, $query);
			$query = MessageFilter::applyTo($request, $query);
			$query = DateFilter::applyTo($request, $query);
		}

		// apply sorting
		//
		$posts = $this->filter($request, RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get());

		// apply translation
		//
		if ($request->has('language')) {
			$posts = Post::translateAll($posts, $request->get('language'));
		}

		return $posts;
	}

	/**
	 * Get all public posts matching message
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Topics\Post[]
	 */
	public function getPublic(Request $request) {

		// get public posts
		//
		$query = Post::where('public', '=', true)
			->whereNull('deleted_at');

		// apply filters
		//
		$query = MessageFilter::applyTo($request, $query);

		return $query->get();
	}

	/**
	 * Get posts by topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $topicId - the id of the topic to get posts of
	 * @return Illuminate\Support\Collection
	 */
	public function getByTopic(Request $request, string $topicId) {

		// get posts associated with a particular topic
		//
		$query = Post::associatedWith($topicId)
			->whereNull('deleted_at');

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// apply sorting
		//
		$posts = $this->filter($request, RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get());

		// apply translation
		//
		if ($request->has('language')) {
			$posts = Post::translateAll($posts, $request->get('language'));
		}

		return $posts;
	}

	/**
	 * Get posts created by a user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get posts belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(Request $request, string $userId) {
		
		// get posts made by user
		//
		$query = Post::belongingTo($userId == 'current'? Session::get('user_id') : $userId)
			->whereNull('deleted_at');

		// if showing current user's posts, show only default topic
		//
		if ($userId == 'current') {
			$query = $query->whereNull('topic_id');
		}

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// apply sorting
		//
		$posts = $this->filter($request, RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get());

		// apply translation
		//
		if ($request->has('language')) {
			$posts = Post::translateAll($posts, $request->get('language'));
		}

		return $posts;
	}

	/**
	 * Get posts by current user's connections with no topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getUpdates(Request $request) {
		$query = null;

		// find current user
		//
		$user = User::current();
		if (!$user) {
			return response("No current user.", 404);
		}

		// get user's connections' posts
		//
		$connections = $user->getConnections();
		foreach ($connections as $connection) {
			if (!$query) {
				$query = Post::where('user_id', '=', $connection->id)
					->whereNull('topic_id')
					->whereNull('deleted_at');
			} else {
				$query = $query->orWhere('user_id', '=', $connection->id)
					->whereNull('topic_id')
					->whereNull('deleted_at');			
			}

			// apply filters
			//
			$query = PublicFilter::applyTo($request, $query);
			$query = MessageFilter::applyTo($request, $query);
			$query = DateFilter::applyTo($request, $query);
		}

		// get post changes associated with no topic
		//
		if ($request->has('after')) {
			$after = date($request->input('after'));

			// get user's connections' changed posts
			//
			foreach ($connections as $connection) {

				// get users' connections' updated posts
				//
				if (!$query) {
					$query = Post::where('user_id', '=', $connection->id)
						->whereNull('topic_id')
						->where('updated_at', '>', $after)
						->whereNull('deleted_at');
				} else {
					$query = $query->orWhere('user_id', '=', $connection->id)
						->whereNull('topic_id')
						->where('updated_at', '>', $after)
						->whereNull('deleted_at');			
				}

				// get users' connections' deleted posts
				//
				if (!$query) {
					$query = Post::where('user_id', '=', $connection->id)
						->whereNull('topic_id')
						->where('deleted_at', '>', $after);
				} else {
					$query = $query->orWhere('user_id', '=', $connection->id)
						->whereNull('topic_id')
						->where('deleted_at', '>', $after);			
				}

				// apply filters
				//
				$query = PublicFilter::applyTo($request, $query);
				$query = MessageFilter::applyTo($request, $query);
				$query = DateFilter::applyTo($request, $query);
			}
		}

		// check for query
		//
		if (!$query) {
			return [];
		}

		// apply sorting
		//
		$posts = $this->filter($request, RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get());

		// apply translation
		//
		if ($request->has('language')) {
			$posts = Post::translateAll($posts, $request->get('language'));
		}

		return $posts;
	}

	/**
	 * Get updated posts by topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $topicId - the id of the topic to get updated posts of
	 * @return Illuminate\Support\Collection
	 */
	public function getUpdatesByTopic(Request $request, string $topicId) {

		// get posts associated with a particular topic
		//
		$query = Post::associatedWith($topicId)
			->whereNull('deleted_at');

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// get other users' updated posts associated with a particular topic
		//
		if ($request->has('after')) {
			$after = date($request->input('after'));

			// add updates
			//
			$query = $query->orWhere('topic_id', '=', $topicId)
				->where('user_id', '!=', Session::get('user_id'))
				->where('updated_at', '>', $after)
				->whereNull('deleted_at');

			// add deletes
			//
			$query = $query->orWhere('topic_id', '=', $topicId)
				->where('user_id', '!=', Session::get('user_id'))
				->where('deleted_at', '>', $after);

			// apply filters
			//
			$query = MessageFilter::applyTo($request, $query);
		}

		// apply sorting
		//
		$posts = $this->filter($request, RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get());

		// apply translation
		//
		if ($request->has('language')) {
			$posts = Post::translateAll($posts, $request->get('language'));
		}

		return $posts;
	}

	/**
	 * Get updated posts by user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get updated posts belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getUpdatesByUser(Request $request, string $userId) {

		// get posts belonging to a particular user
		//
		$query = Post::belongingTo($userId)
			->whereNull('deleted_at');

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// get users' updated posts associated with a particular topic
		//
		if ($request->has('after')) {
			$after = date($request->input('after'));

			// add updates
			//
			$query = $query->orWhere('user_id', '=', $userId)
				->where('user_id', '!=', Session::get('user_id'))
				->where('updated_at', '>', $after)
				->whereNull('deleted_at');

			// add deletes
			//
			$query = $query->orWhere('user_id', '=', $userId)
				->where('user_id', '!=', Session::get('user_id'))
				->where('deleted_at', '>', $after);

			// apply filters
			//
			$query = MessageFilter::applyTo($request, $query);
		}

		// apply sorting
		//
		$posts = $this->filter($request, RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get());

		// apply translation
		//
		if ($request->has('language')) {
			$posts = Post::translateAll($posts, $request->get('language'));
		}

		return $posts;
	}

	//
	// updating methods
	//

	/**
	 * Update a post.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the post to update
	 * @return App\Models\Topics\Post
	 */
	public function updateIndex(Request $request, string $id) {

		// parse parameters
		//	
		$topicId = $request->input('topic_id');
		$message = $request->input('message');
		$public = filter_var($request->input('public'), FILTER_VALIDATE_BOOLEAN);
		$attachments = $request->input('attachments');
		$checkIn = $request->input('check_in', null);

		// find post by id
		//
		$post = Post::find($id);
		if (!$post) {
			return response("Post not found.", 404);
		}

		// create new check in
		//
		$checkInId = null;
		if ($request->has('check_in')) {

			// update check in id
			//
			$checkIn = $request->input('check_in');
			if ($checkIn) {
				$checkIn = new CheckIn([
					'id' => Guid::create(),
					'user_id' => Session::get('user_id'),
					'name' => $checkIn['name'],
					'latitude' => $checkIn['latitude'],
					'longitude' => $checkIn['longitude'],
					'zoom_level' => $checkIn['zoom_level']
				]);
				$checkIn->save();
				$checkInId = $checkIn->id;
			} else {
				$checkInId = null;
			}
		} else {

			// use existing check in id
			//
			$checkInId = $post->check_in_id;
		}

		// update attributes
		//
		$post->change([
			'topic_id' => $topicId,
			'message' => $message,
			'public' => $request->has('public')? filter_var($request->input('public'), FILTER_VALIDATE_BOOLEAN) : null,
			'check_in_id' => $checkInId,
		]);

		// remove deleted existing attachments
		//
		$existingAttachments = $post->attachments()->get();
		foreach ($existingAttachments as $existingAttachment) {
			$found = false;
			foreach ($attachments as $attachment) {
				if (array_key_exists('post_attachment_id', $attachment) && 
					$existingAttachment->id == $attachment['post_attachment_id']) {
					$found = true;
					break;
				}
			}
			if (!$found) {
				$existingAttachment->delete();
				$post->touch();
			}
		}

		// create new attachments
		//
		foreach ($attachments as $attachment) {
			if (!array_key_exists('post_attachment_id', $attachment)) {
				$newAttachment = new PostAttachment([
					'id' => Guid::create(),
					'post_id' => $post->id,
					'path' => $attachment['path'],
					'copy' => StringUtils::startsWith($attachment['path'], 'Posts')
				]);
				$newAttachment->save();
				$post->touch();
			}
		}

		return $post;
	}

	/**
	 * Clean up deleted general posts.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function updateCurrent(Request $request) {

		// get soft deleted general posts by current user
		//
		$posts = Post::whereNull('topic_id')
			->where('user_id', '=', Session::get('user_id'))
			->whereNotNull('deleted_at')->get();

		// delete soft deleted posts
		//
		$posts->map(function($post) {
			$post->delete();
		});

		return $posts;
	}

	/**
	 * Clean up deleted posts by topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $topicId - the id of the topic to update posts of
	 * @return Illuminate\Support\Collection
	 */
	public function updateByTopic(Request $request, string $topicId) {

		// get soft deleted posts by topic and current user
		//
		$posts = Post::where('topic_id', '=', $topicId)
			->where('user_id', '=', Session::get('user_id'))
			->whereNotNull('deleted_at')->get();

		// delete soft deleted posts
		//
		$posts->map(function($post) {
			$post->delete();
		});

		return $posts;
	}

	/**
	 * Clean up deleted posts by user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to update posts belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function updateByUser(Request $request, string $userId) {

		// get soft deleted posts by user
		//
		$posts = Post::where('user_id', '=', $userId)
			->whereNotNull('deleted_at')->get();

		// delete soft deleted posts
		//
		$posts->map(function($post) {
			$post->delete();
		});

		return $posts;
	}

	/**
	 * Like a post.
	 *
	 * @param string $id - the id of the post to like
	 * @return App\Models\Topics\Post
	 */
	public function putLike(string $id) {

		// find post by id
		//
		$post = Post::find($id);
		if (!$post) {
			return response("Post not found.", 404);
		}

		// like post
		//
		$like = $post->likeBy(Session::get('user_id'));

		// notify user of like
		//
		if ($like) {
			$post->user->notify(new LikeNotification([
				'like_id' => $like->id
			]));
		}

		return $post;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a post.
	 *
	 * @param string $id - the id of the post to delete
	 * @return App\Models\Topics\Post
	 */
	public function deleteIndex(string $id) {

		// find post by id
		//
		$post = Post::find($id);
		if (!$post) {
			return response("Post not found.", 404);
		}

		// delete post
		//
		/*
		$post->deleted_at = new DateTime();
		$post->save();
		*/
		$post->delete();
		
		return $post;
	}

	//
	// filtering methods
	//

	/**
	 * Filter a collection of posts.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Collection $collection - the collection to filter
	 * @return Illuminate\Support\Collection
	 */
	private function filter(Request $request, $collection) {
		$collection = $this->filterByNumLikes($request, $collection);
		$collection = $this->filterByNumComments($request, $collection);
		return $collection;
	}

	/**
	 * Filter a collection of posts by number of likes.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Collection $collection - the collection to filter
	 * @return Illuminate\Support\Collection
	 */
	private function filterByNumLikes(Request $request, $collection) {
		if ($request->has('num_likes_greater_than')) {
			$numLikes = $request->input('num_likes_greater_than');
			$collection = $collection->filter(function($value) use ($numLikes) {
				return $value->num_likes > $numLikes;
			})->values();
		}
		if ($request->has('num_likes')) {
			$numLikes = $request->input('num_likes');
			$collection = $collection->filter(function($value) use ($numLikes) {
				return $value->num_likes == $numLikes;
			})->values();
		}
		if ($request->has('num_likes_less_than')) {
			$numLikes = $request->input('num_likes_less_than');
			$collection = $collection->filter(function($value) use ($numLikes) {
				return $value->num_likes < $numLikes;
			})->values();
		}

		return $collection;
	}

	/**
	 * Filter a collection of posts by number of comments.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Collection $collection - the collection to filter
	 * @return Illuminate\Support\Collection
	 */
	private function filterByNumComments(Request $request, $collection) {
		if ($request->has('num_comments_greater_than')) {
			$numComments = $request->input('num_comments_greater_than');
			$collection = $collection->filter(function($value) use ($numComments) {
				return $value->num_comments > $numComments;
			})->values();
		}
		if ($request->has('num_comments')) {
			$numComments = $request->input('num_comments');
			$collection = $collection->filter(function($value) use ($numComments) {
				return $value->num_comments == $numComments;
			})->values();
		}
		if ($request->has('num_comments_less_than')) {
			$numComments = $request->input('num_comments_less_than');
			$collection = $collection->filter(function($value) use ($numComments) {
				return $value->num_comments < $numComments;
			})->values();
		}
		
		return $collection;
	}
}