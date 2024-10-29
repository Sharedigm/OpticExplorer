<?php
/******************************************************************************\
|                                                                              |
|                           ChatMessageController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing chat messages.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Chats;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Chats\ChatMessage;
use App\Models\Storage\Attachments\ChatAttachment;
use App\Models\Places\CheckIn;
use App\Http\Controllers\Controller;
use App\Http\Filters\MessageFilter;
use App\Http\Filters\DateFilter;
use App\Http\Filters\RangeFilter;
use App\Utilities\Uuids\Guid;

class ChatMessageController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new chat message.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Chats\ChatMessage
	 */
	public function postCreate(Request $request) {

		// parse parameters
		//
		$chatId = $request->input('chat_id');
		$message = $request->input('message');
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

		// create new chat message
		//
		$chatMessage = new ChatMessage([
			'id' => Guid::create(),
			'chat_id' => $chatId,
			'user_id' => Session::get('user_id'),
			'message' => $message,
			'check_in_id' => $checkIn? $checkIn->id : null
		]);
		$chatMessage->save();

		// create new message attachments
		//
		foreach ($attachments as $attachment) {
			$newAttachment = new ChatAttachment([
				'id' => Guid::create(),
				'message_id' => $chatMessage->id,
				'path' => $attachment['path'],
				'copy' => false
			]);
			$newAttachment->save();	
		}

		return $chatMessage;
	}

	//
	// querying methods
	//

	/**
	 * Get a chat message.
	 *
	 * @param string $id - the id of the chat message to get
	 * @return App\Models\Chats\ChatMessage
	 */
	public function getIndex(string $id) {

		// find chat message by id
		//
		$chatMessage = ChatMessage::find($id);
		if (!$chatMessage) {
			return response("Chat message not found.", 404);
		}

		return $chatMessage;
	}

	/**
	 * Get chat messages by chat.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $chatId - the id of the chat to get messages from
	 * @return Illuminate\Support\Collection
	 */
	public function getByChat(Request $request, $chatId) {

		// get chat messages associated with a particular chat
		//
		$query = ChatMessage::where('chat_id', '=', $chatId)
			->whereNull('deleted_at');

		// apply filters
		//
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);
		$query = RangeFilter::applyTo($request, $query);

		// apply sorting
		//
		$messages = $query->orderBy('created_at', 'DESC')->get()->reverse()->values();

		// apply translation
		//
		if ($request->has('language')) {
			$messages = ChatMessage::translateAll($messages, $request->get('language'));
		}

		return $messages;
	}

	/**
	 * Get sent chat messages by chat.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $chatId - the id of the chat to get messages from
	 * @return Illuminate\Support\Collection
	 */
	public function getSentByChat(Request $request, $chatId) {

		// get chat messages associated with a particular chat and current user
		//
		$query = ChatMessage::where('chat_id', '=', $chatId)
			->where('user_id', '=', Session::get('user_id'))
			->whereNull('deleted_at');

		// apply filters
		//
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);
		$query = RangeFilter::applyTo($request, $query);

		// apply sorting
		//
		$messages = $query->orderBy('created_at', 'DESC')->get()->reverse()->values();

		// apply translation
		//
		if ($request->has('language')) {
			$messages = ChatMessage::translateAll($messages, $request->get('language'));
		}

		return $messages;
	}

	/**
	 * Get received chat messages by chat.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $chatId - the id of the chat to get messages from
	 * @return Illuminate\Support\Collection
	 */
	public function getReceivedByChat(Request $request, $chatId) {

		// get chat messages associated with a particular chat and current user
		//
		$query = ChatMessage::where('chat_id', '=', $chatId)
			->where('user_id', '!=', Session::get('user_id'))
			->whereNull('deleted_at');

		// apply filters
		//
		$query = MessageFilter::applyTo($request, $query);
		$query = DateFilter::applyTo($request, $query);
		$query = RangeFilter::applyTo($request, $query);

		// get updated messages associated with a particular chat and current user
		//
		if ($request->has('after')) {
			$after = date($request->input('after'));

			// add updates
			//
			$query = $query->orWhere('chat_id', '=', $chatId)
				->where('user_id', '!=', Session::get('user_id'))
				->where('updated_at', '>', $after);

			// add deletes
			//
			$query = $query->orWhere('chat_id', '=', $chatId)
				->where('user_id', '!=', Session::get('user_id'))
				->where('deleted_at', '>', $after);

			// apply filters
			//
			$query = MessageFilter::applyTo($request, $query);
		}

		// apply sorting
		//
		$messages = $query->orderBy('created_at', 'DESC')->get()->reverse()->values();

		// apply translation
		//
		if ($request->has('language')) {
			$messages = ChatMessage::translateAll($messages, $request->get('language'));
		}

		return $messages;
	}

	//
	// updating methods
	//

	/**
	 * Update a chat message.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the message to update
	 * @return App\Models\Chats\ChatMessage
	 */
	public function updateIndex(Request $request, string $id) {

		// parse parameters
		//
		$message = $request->input('message');
		$attachments = $request->input('attachments');
		$checkIn = $request->input('check_in', null);

		// find chat message by id
		//
		$chatMessage = ChatMessage::find($id);
		if (!$chatMessage) {
			return response("Chat message not found.", 404);
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
		$chatMessage->change([
			'message' => $message,
			'check_in_id' => $checkInId
		]);	

		// remove deleted existing attachments
		//
		$existingAttachments = $chatMessage->attachments()->get();
		foreach ($existingAttachments as $existingAttachment) {
			$found = false;
			foreach ($attachments as $attachment) {
				if (array_key_exists('attachment_id', $attachment) && 
					$existingAttachment->id == $attachment['attachment_id']) {
					$found = true;
					break;
				}
			}
			if (!$found) {
				$existingAttachment->delete();
				$chatMessage->touch();
			}
		}

		// create new attachments
		//
		foreach ($attachments as $attachment) {
			if (!array_key_exists('attachment_id', $attachment)) {
				$newAttachment = new ChatAttachment([
					'id' => Guid::create(),
					'message_id' => $chatMessage->id,
					'path' => $attachment['path'],
					'copy' => false
				]);
				$newAttachment->save();
				$chatMessage->touch();
			}
		}

		return $chatMessage;
	}

	//
	// updating methods
	//

	/**
	 * Clean up deleted messages by chat.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $chatId - the id of the chat to delete messages from
	 * @return App\Models\Chats\ChatMessage[]
	 */
	public function updateByChat(Request $request, string $chatId) {

		// ge soft deleted messages by chat and current user
		//
		$messages = ChatMessage::where('chat_id', '=', $chatId)
			->where('user_id', '=', Session::get('user_id'))
			->whereNotNull('deleted_at')->get();

		// delete soft deleted messages
		//
		$messages->map(function($message) {
			$message->delete();
		});

		return $messages;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a chat message.
	 *
	 * @param string $id
	 * @return App\Models\Chats\ChatMessage
	 */
	public function deleteIndex(string $id) {

		// find chat message by id
		//
		$chatMessage = ChatMessage::find($id);
		if (!$chatMessage) {
			return response("Chat message not found.", 404);
		}

		// delete chat message
		//
		$chatMessage->deleted_at = new DateTime();
		$chatMessage->save();
		//$chatMessage->delete();
		
		return $chatMessage;
	}
}