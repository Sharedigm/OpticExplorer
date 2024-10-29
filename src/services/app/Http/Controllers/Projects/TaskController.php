<?php
/******************************************************************************\
|                                                                              |
|                               TaskController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing tasks.                 |
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
use App\Models\Storage\Attachments\TaskAttachment;
use App\Models\Places\CheckIn;
use App\Http\Controllers\Controller;
use App\Http\Filters\RangeFilter;
use App\Http\Filters\PublicFilter;
use App\Http\Filters\MessageFilter;
use App\Http\Filters\DateFilter;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;

class TaskController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new task.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Topics\Task
	 */
	public function postCreate(Request $request) {

		// parse parameters
		//
		$projectId = $request->input('project_id');
		$kind = $request->input('kind');
		$title = $request->input('title');
		$description = $request->input('description');
		$keywords = $request->input('keywords');
		$priority = $request->input('priority');
		$status = $request->input('status');
		$dueDate = $request->input('due_date');
		$attachments = $request->input('attachments');

		// create new task
		//
		$task = new Task([
			'id' => Guid::create(),
			'project_id' => $projectId != 'none'? $projectId : null,
			'user_id' => Session::get('user_id'),
			'kind' => $kind,
			'title' => $title,
			'description' => $description,
			'keywords' => $keywords,
			'priority' => $priority,
			'due_date' => $dueDate != ''? $dueDate : null,
			'status' => $status
		]);
		$task->save();

		// create new task attachments
		//
		/*
		foreach ($attachments as $attachment) {
			$newAttachment = new TaskAttachment([
				'id' => Guid::create(),
				'task_id' => $task->id,
				'path' => $attachment['path'],
				'copy' => StringUtils::startsWith($attachment['path'], 'News')
			]);
			$newAttachment->save();	
		}
		*/

		return $task;
	}

	//
	// querying methods
	//

	/**
	 * Get a task.
	 *
	 * @param string $id - the id of the task to get
	 * @return App\Models\Topics\Task
	 */
	public function getIndex(string $id) {

		// find task by id
		//
		$task = Task::find($id);
		if (!$task) {
			return response("Task not found.", 404);
		}

		return $task;
	}

	/**
	 * Get all tasks by current user with no project.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Projects\Task[]
	 */
	public function getCurrent(Request $request) {

		// find current user
		//
		$user = User::current();
		if (!$user) {
			return response("No current user.", 404);
		}

		// get users's posts
		//
		$query = Task::where('user_id', '=', $user->id)
			->whereNull('project_id')
			->whereNull('deleted_at');

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// apply sorting
		//
		$tasks = RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();

		return $tasks;
	}

	/**
	 * Get tasks by project.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $projectId - the id of the project to get tasks of
	 * @return Illuminate\Support\Collection
	 */
	public function getByProject(Request $request, string $projectId) {

		// get tasks associated with a particular project
		//
		$query = Task::associatedWith($projectId)
			->whereNull('deleted_at');

		// apply filters
		//
		$query = PublicFilter::applyTo($request, $query);
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);

		// apply sorting
		//
		$tasks = RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();

		return $tasks;
	}

	//
	// updating methods
	//

	/**
	 * Update a task.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the task to update
	 * @return App\Models\Topics\Task
	 */
	public function updateIndex(Request $request, string $id) {

		// parse parameters
		//	
		$projectId = $request->input('project_id');
		$kind = $request->input('kind');
		$title = $request->input('title');
		$description = $request->input('description');
		$keywords = $request->input('keywords');
		$priority = $request->input('priority');
		$status = $request->input('status');
		$dueDate = $request->input('due_date');
		// $attachments = $request->input('attachments');

		// find task by id
		//
		$task = Task::find($id);
		if (!$task) {
			return response("Task not found.", 404);
		}

		// update attributes
		//
		$task->change([
			'project_id' => $projectId != 'none'? $projectId : null,
			'user_id' => Session::get('user_id'),
			'kind' => $kind,
			'title' => $title,
			'description' => $description,
			'keywords' => $keywords,
			'priority' => $priority,
			'status' => $status,
			'due_date' => $dueDate != ''? $dueDate : null
		]);

		/*
		// remove deleted existing attachments
		//
		$existingAttachments = $task->attachments()->get();
		foreach ($existingAttachments as $existingAttachment) {
			$found = false;
			foreach ($attachments as $attachment) {
				if (array_key_exists('task_attachment_id', $attachment) && 
					$existingAttachment->id == $attachment['task_attachment_id']) {
					$found = true;
					break;
				}
			}
			if (!$found) {
				$existingAttachment->delete();
				$task->touch();
			}
		}

		// create new attachments
		//
		foreach ($attachments as $attachment) {
			if (!array_key_exists('task_attachment_id', $attachment)) {
				$newAttachment = new TaskAttachment([
					'id' => Guid::create(),
					'task_id' => $task->id,
					'path' => $attachment['path'],
					'copy' => StringUtils::startsWith($attachment['path'], 'Tasks')
				]);
				$newAttachment->save();
				$task->touch();
			}
		}
		*/

		return $task;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a task.
	 *
	 * @param string $id - the id of the task to delete
	 * @return App\Models\Topics\Task
	 */
	public function deleteIndex(string $id) {

		// find task by id
		//
		$task = Task::find($id);
		if (!$task) {
			return response("Task not found.", 404);
		}

		// delete task
		//
		$task->delete();
		
		return $task;
	}
}