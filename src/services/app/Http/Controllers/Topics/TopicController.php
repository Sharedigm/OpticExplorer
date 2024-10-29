<?php
/******************************************************************************\
|                                                                              |
|                              TopicController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing topics.                |
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
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Topics\Post;
use App\Models\Topics\Topic;
use App\Models\Topics\UserTopic;
use App\Models\Topics\Sharing\TopicInvitation;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Storage\Directory;
use App\Notifications\TopicInvitationNotification;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;
use App\Http\Filters\NameFilter;
use App\Http\Filters\SearchFilter;
use App\Http\Filters\LimitFilter;

class TopicController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Topics\Topic
	 */
	public function postCreate(Request $request) {

		// create new topic
		//
		$topic = new Topic([
			'id' => Guid::create(),
			'name' => $request->input('name'),
			'icon_path' => $request->input('icon_path'),
			'description' => $request->input('description'),
			'keywords' => $request->input('keywords'),
			'public' => $request->input('public'),
			'private' => $request->input('private'),
			'required' => false,
			'user_id' => Session::get('user_id'),
		]);
		$topic->save();

		return $topic;
	}

	//
	// querying methods
	//

	/**
	 * Get a topic.
	 *
	 * @param string $id - the id of the topic to get
	 * @return App\Models\Topics\Topic
	 */
	public function getIndex(string $id) {

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Topic not found.", 404);
		}

		return $topic;
	}

	/**
	 * Get a topic's thumbnail image.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getThumbnail(Request $request, string $id) {

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Topic not found.", 404);
		}

		// find topic's user account id
		//
		$userAccount = UserAccount::find($topic->user_id);
		if (!$userAccount) {
			return response("Topic owner not found.", 404);
		}

		// parse thumbnail params
		//
		$minSize = $request->input('min_size');
		$maxSize = $request->input('max_size');

		// create file
		//
		$path =  $topic->icon_path;
		if (!StringUtils::startsWith($topic->icon_path, '/') && !$userAccount->isAdmin()) {
			$path = '/' . $userAccount->username . '/' . $path;
		}
		$file = Directory::createFile([
			'path' => $path
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// return / resize image
		//
		return $file->getThumbnail($minSize, $maxSize);
	}

	/**
	 * Get users.
	 *
	 * @param string $id - the id of the topic to get users of
	 * @return App\Models\Users\User[]
	 */
	public function getUsers(string $id) {
		$topic = Topic::find($id);

		// check for topic
		//
		if (!$topic) {
			return response("Topic not found.", 404);
		}

		// add topic members
		//
		$users = [];
		$userIds = UserTopic::where('topic_id', '=', $id)->pluck('user_id');
		foreach ($userIds as $userId) {
			$users[] = User::find($userId);
		}
		
		return $users;
	}

	/**
	 * Get public topics.
	 *
	 * @param string $id
	 * @return Illuminate\Support\Collection
	 */
	public function getPublic(Request $request) {
		$query = Topic::where('public', '=', '1')
			->where('required', '=', '1')
			->orderBy('name', 'ASC');

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		return $query->get();
	}

	/**
	 * Get required topics.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getRequired(Request $request) {

		// get required topics 
		//
		$query = Topic::where('required', '=', true)
			->orderBy('name', 'ASC');

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// perform query
		//
		return $query->get();
	}

	/**
	 * Get owned or subscribed topics by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getOwnedOrSubscribed(Request $request) {

		// get current user
		//
		$userId = Session::get('user_id');
		
		// get topics by user
		//
		return $this->getOwned($request)
			->merge($this->getSubscribed($request));
	}

	/**
	 * Get owned topics by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getOwned(Request $request) {

		// get current user
		//
		$userId = Session::get('user_id');
		
		// get topics owned by user
		//
		$query = Topic::belongingTo($userId)
			->orderBy('name', 'ASC');

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		return $query->get();
	}

	/**
	 * Get topics subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */

	public function getSubscribed(Request $request) {

		// get required topics 
		//
		$required = $this->getRequired($request);
		
		// get user topics subscribed to by current user
		//
		$query2 = UserTopic::where('user_id', '=', Session::get('user_id'));

		// apply filters
		//
		// $query2 = NameFilter::applyTo($request, $query2);
		// $query2 = SearchFilter::applyTo($request, $query2);
		$query2 = LimitFilter::applyTo($request, $query2);

		// perform query
		//
		$subscribed = $query2->get()->pluck('topic');

		// apply filter
		//
		$search = $request->input('search', null);
		if ($search) {
			$subscribed = $subscribed->filter(function($item) use ($search) {
				$str1 = strtolower($item->name);
				$str2 = strtolower($search);
				return str_contains($str1, $str2);
			});
		}

		// add required topics to user specific topics
		//
		return $required->merge($subscribed);
	}

	/**
	 * Get topics subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getAll(Request $request) {
		$ownedOrSubscribed = $this->getOwnedOrSubscribed($request);
		$unsubscribed = $this->getUnsubscribed($request);
		$public = $this->getPublic($request);
		return $ownedOrSubscribed->merge($unsubscribed)->merge($public);
	}

	/**
	 * Get connections topics not subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getProtectedUnsubscribed(Request $request) {

		// get parameters
		//
		$name = $request->input('name');

		// get current user
		//
		$userId = Session::get('user_id');

		// find user by id
		//
		$user = User::find($userId);

		// get current user's connections
		//
		$connections = $user->getConnections();

		// collect protected topics owned by connections
		//
		$topics = collect();
		for ($i = 0; $i < count($connections); $i++) {

			// get user topics
			//
			$query = Topic::belongingTo($connections[$i]->id)
				->where('public', '=', 0)
				->where('private', '=', 0)
				->where('required', '=', 0);

			// apply sorting
			//
			$sort = $request->has('sort')? $request->get('sort') : 'name';
			$order = $request->has('order')? $request->get('order') : 'ASC';
			$query = $query->orderBy($sort, $order);

			// apply filters
			//
			$query = NameFilter::applyTo($request, $query);
			$query = SearchFilter::applyTo($request, $query);
			$query = LimitFilter::applyTo($request, $query);

			if ($query->exists()) {
				$topics = $topics->concat($query->get());
			}
		}

		// find topics unsubscribed by user
		//
		$unsubscribed = [];
		foreach ($topics as $topic) {
			if ($topic->user_id && !UserTopic::where('user_id', '=', $userId)
				->where('topic_id', '=', $topic->id)->exists()) {
				array_push($unsubscribed, $topic);
			}
		}

		return $unsubscribed;
	}

	/**
	 * Get public topics not subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPublicUnsubscribed(Request $request) {

		$name = $request->input('name', null);

		// get public topics not owned by user
		//
		$query = Topic::where('public', '=', 1)
			->where('required', '=', 0);

		// apply sorting
		//
		$sort = $request->has('sort')? $request->get('sort') : 'name';
		$order = $request->has('order')? $request->get('order') : 'ASC';
		$query = $query->orderBy($sort, $order);

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// perform query
		//
		$topics = $query->get();

		// find topics unsubscribed by current user
		//
		$userId = Session::get('user_id');
		$unsubscribed = [];
		foreach ($topics as $topic) {
			if (!UserTopic::where('user_id', '=', $userId)
				->where('topic_id', '=', $topic->id)->exists()) {
				array_push($unsubscribed, $topic);
			}
		}

		return $unsubscribed;
	}

	/**
	 * Get protected and public topics not subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getUnsubscribed(Request $request) {
		$protectedTopics = $this->getProtectedUnsubscribed($request);
		$publicTopics = $this->getPublicUnsubscribed($request);
		return array_merge($protectedTopics, $publicTopics);
	}

	//
	// updating methods
	//

	/**
	 * Update a topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the topic to update
	 * @return App\Models\Topics\Topic
	 */
	public function updateIndex(Request $request, string $id) {

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Topic not found.", 404);
		}

		// update topic
		//
		return $topic->change([
			'name' => $request->input('name'),
			'icon_path' => $request->input('icon_path'),
			'description' => $request->input('description'),
			'keywords' => $request->input('keywords'),
			'public' => $request->input('public'),
			'private' => $request->input('private')
		]);
	}

	/**
	 * Add a user to a topic.
	 *
	 * @param string $id - the id of the topic to add a user to
	 * @param string $userId - the id of the user to add
	 * @return App\Models\Topics\Topic
	 */
	public function addUser(string $id, string $userId) {

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Post topic not found.", 404);
		}

		// add user to topic
		//
		$topic->addUser($userId);

		return $topic;
	}

	/**
	 * Remove a user from a topic.
	 *
	 * @param string $id - the id of the user to remove
	 * @return App\Models\Topics\Topic
	 */
	public function removeUser(string $id, string $userId) {

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Post topic not found.", 404);
		}

		// remove user topics
		//
		$userTopic = UserTopic::where('topic_id', '=', $id)
			->where('user_id', '=', $userId)->delete();

		return $topic;
	}

	/**
	 * invite connections to a join topic.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the topic to invite users to
	 * @param string $userIds - the ids of the users to invite
	 * @return App\Models\Topics\Topic
	 */
	public function inviteUsers(Request $request, string $id, string $userIds) {

		// get params
		//
		$message = $request->input('message');

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Post topic not found.", 404);
		}

		// invite users
		//
		$userIds = explode('+', $userIds);
		foreach ($userIds as $userId) {

			// find user by id
			//
			$user = User::find($userId);
			
			if ($user) {

				// create new topic invitation
				//
				$topicInvitation = new TopicInvitation([
					'id' => Guid::create(),
					'sender_id' => Session::get('user_id'),
					'recipient_id' => $user->id,
					'topic_id' => $topic->id,
					'message' => $message
				]);
				$topicInvitation->save();

				// notify user
				//
				$user->notify(new TopicInvitationNotification([
					'topic_invitation_id' => $topicInvitation->id
				]));
			}
		}

		return $topic;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a topic.
	 *
	 * @param string $id - the id of the topic to delete
	 * @return App\Models\Topics\Topic
	 */
	public function deleteIndex(string $id) {

		// find topic by id
		//
		$topic = Topic::find($id);
		if (!$topic) {
			return response("Topic not found.", 404);
		}

		// delete all posts belonging to topic
		//
		$posts = Post::where('topic_id', '=', $id)->get();
		foreach ($posts as $post) {
			$post->delete();
		}

		// delete all user associations with topic
		//
		UserTopic::where('topic_id', '=', $id)->delete();

		// delete topic
		//
		$topic->delete();
		return $topic;
	}
}