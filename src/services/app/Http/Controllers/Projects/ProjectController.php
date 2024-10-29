<?php
/******************************************************************************\
|                                                                              |
|                             ProjectController.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing projects.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Projects;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Projects\Task;
use App\Models\Projects\Project;
use App\Models\Projects\UserProject;
use App\Models\Projects\Sharing\ProjectInvitation;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Storage\Directory;
use App\Notifications\ProjectInvitationNotification;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;
use App\Http\Filters\NameFilter;
use App\Http\Filters\SearchFilter;
use App\Http\Filters\LimitFilter;

class ProjectController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new project.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Projects\Project
	 */
	public function postCreate(Request $request) {

		// create new project
		//
		$project = new Project([
			'id' => Guid::create(),
			'name' => $request->input('name'),
			'icon_path' => $request->input('icon_path'),
			'description' => $request->input('description'),
			'keywords' => $request->input('keywords'),
			'public' => $request->input('public'),
			'private' => $request->input('private'),
			'user_id' => Session::get('user_id'),
		]);
		$project->save();

		return $project;
	}

	//
	// querying methods
	//

	/**
	 * Get a project.
	 *
	 * @param string $id - the id of the project to get
	 * @return App\Models\Projects\Project
	 */
	public function getIndex(string $id) {

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Project not found.", 404);
		}

		return $project;
	}

	/**
	 * Get a project's thumbnail image.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getThumbnail(Request $request, string $id) {

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Project not found.", 404);
		}

		// find project's user account id
		//
		$userAccount = UserAccount::find($project->user_id);
		if (!$userAccount) {
			return response("Project owner not found.", 404);
		}

		// parse thumbnail params
		//
		$minSize = $request->input('min_size');
		$maxSize = $request->input('max_size');

		// create file
		//
		$path =  $project->icon_path;
		if (!StringUtils::startsWith($project->icon_path, '/') && !$userAccount->isAdmin()) {
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
	 * @param string $id - the id of the project to get users of
	 * @return App\Models\Users\User[]
	 */
	public function getUsers(string $id) {
		$project = Project::find($id);

		// check for project
		//
		if (!$project) {
			return response("Project not found.", 404);
		}

		// add project members
		//
		$users = [];
		$userIds = UserProject::where('project_id', '=', $id)->pluck('user_id');
		foreach ($userIds as $userId) {
			$users[] = User::find($userId);
		}
		
		return $users;
	}

	/**
	 * Get public projects.
	 *
	 * @param string $id
	 * @return Illuminate\Support\Collection
	 */
	public function getPublic(Request $request) {
		$query = Project::where('public', '=', '1')
			->orderBy('name', 'ASC');

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		return $query->get();
	}

	/**
	 * Get owned or subscribed projects by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getOwnedOrSubscribed(Request $request) {

		// get current user
		//
		$userId = Session::get('user_id');
		
		// get projects by user
		//
		return $this->getOwned($request)
			->merge($this->getSubscribed($request));
	}

	/**
	 * Get owned projects by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getOwned(Request $request) {

		// get current user
		//
		$userId = Session::get('user_id');
		
		// get projects made by user
		//
		$query = Project::belongingTo($userId)
			->orderBy('name', 'ASC');

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		return $query->get();
	}

	/**
	 * Get projects subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSubscribed(Request $request) {
		
		// get user projects subscribed to by current user
		//
		$query = UserProject::where('user_id', '=', Session::get('user_id'));

		// apply filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = SearchFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// return projects
		//
		return $query->get()->pluck('project');
	}

	/**
	 * Get connections projects not subscribed to by current user.
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

		// collect protected projects owned by connections
		//
		$projects = collect();
		for ($i = 0; $i < count($connections); $i++) {

			// get user projects
			//
			$query = Project::belongingTo($connections[$i]->id)
				->where('public', '=', 0)
				->where('private', '=', 0);

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
				$projects = $projects->concat($query->get());
			}
		}

		// find projects unsubscribed by user
		//
		$unsubscribed = [];
		foreach ($projects as $project) {
			if ($project->user_id && !UserProject::where('user_id', '=', $userId)
				->where('project_id', '=', $project->id)->exists()) {
				array_push($unsubscribed, $project);
			}
		}

		return $unsubscribed;
	}

	/**
	 * Get public projects not subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPublicUnsubscribed(Request $request) {

		$name = $request->input('name', null);

		// get public projects not owned by user
		//
		$query = Project::where('public', '=', 1);

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
		$projects = $query->get();

		// find projects unsubscribed by current user
		//
		$userId = Session::get('user_id');
		$unsubscribed = [];
		foreach ($projects as $project) {
			if (!UserProject::where('user_id', '=', $userId)
				->where('project_id', '=', $project->id)->exists()) {
				array_push($unsubscribed, $project);
			}
		}

		return $unsubscribed;
	}

	/**
	 * Get protected and public projects not subscribed to by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getUnsubscribed(Request $request) {
		$protectedProjects = $this->getProtectedUnsubscribed($request);
		$publicProjects = $this->getPublicUnsubscribed($request);
		return array_merge($protectedProjects, $publicProjects);
	}

	//
	// updating methods
	//

	/**
	 * Update a project.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the project to update
	 * @return App\Models\Projects\Project
	 */
	public function updateIndex(Request $request, string $id) {

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Project not found.", 404);
		}

		// update project
		//
		return $project->change([
			'name' => $request->input('name'),
			'icon_path' => $request->input('icon_path'),
			'description' => $request->input('description'),
			'keywords' => $request->input('keywords'),
			'public' => $request->input('public'),
			'private' => $request->input('private')
		]);
	}

	/**
	 * Add a user to a project.
	 *
	 * @param string $id - the id of the project to add a user to
	 * @param string $userId - the id of the user to add
	 * @return App\Models\Projects\Project
	 */
	public function addUser(string $id, string $userId) {

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Project not found.", 404);
		}

		// add user to project
		//
		$project->addUser($userId);

		return $project;
	}

	/**
	 * Remove a user from a project.
	 *
	 * @param string $id - the id of the user to remove
	 * @return App\Models\Projects\Project
	 */
	public function removeUser(string $id, string $userId) {

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Project not found.", 404);
		}

		// remove user projects
		//
		$userProject = UserProject::where('project_id', '=', $id)
			->where('user_id', '=', $userId)->delete();

		return $project;
	}

	/**
	 * invite connections to a join project.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the project to invite users to
	 * @param string $userIds - the ids of the users to invite
	 * @return App\Models\Projects\Project
	 */
	public function inviteUsers(Request $request, string $id, string $userIds) {

		// get params
		//
		$message = $request->input('message');

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Task project not found.", 404);
		}

		// invite users
		//
		$userIds = explode('+', $userIds);
		foreach ($userIds as $userId) {

			// find user by id
			//
			$user = User::find($userId);
			
			if ($user) {

				// create new project invitation
				//
				$projectInvitation = new ProjectInvitation([
					'id' => Guid::create(),
					'sender_id' => Session::get('user_id'),
					'recipient_id' => $user->id,
					'project_id' => $project->id,
					'message' => $message
				]);
				$projectInvitation->save();

				// notify user
				//
				$user->notify(new ProjectInvitationNotification([
					'project_invitation_id' => $projectInvitation->id
				]));
			}
		}

		return $project;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a project.
	 *
	 * @param string $id - the id of the project to delete
	 * @return App\Models\Projects\Project
	 */
	public function deleteIndex(string $id) {

		// find project by id
		//
		$project = Project::find($id);
		if (!$project) {
			return response("Project not found.", 404);
		}

		// delete all tasks belonging to project
		//
		$tasks = Task::where('project_id', '=', $id)->get();
		foreach ($tasks as $task) {
			$task->delete();
		}

		// delete all user associations with project
		//
		UserProject::where('project_id', '=', $id)->delete();

		// delete project
		//
		$project->delete();
		return $project;
	}
}