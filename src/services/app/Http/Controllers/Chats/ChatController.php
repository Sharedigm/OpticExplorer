<?php
/******************************************************************************\
|                                                                              |
|                              ChatController.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing chat sessions.         |
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

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Chats\Chat;
use App\Models\Chats\ChatMessage;
use App\Models\Chats\ChatMembership;
use App\Http\Controllers\Controller;
use App\Http\Filters\DateFilter;
use App\Utilities\Uuids\Guid;

class ChatController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new chat.
	 *
	 * @return App\Models\Chats\Chat
	 */
	public function postCreate() {

		// create new chat
		//
		$chat = new Chat([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id')
		]);
		$chat->save();

		// create new chat membership
		//
		$member = new ChatMembership([
			'id' => Guid::create(),
			'chat_id' => $chat->id,
			'invitation_id' => null,
			'member_id' => Session::get('user_id')
		]);
		$member->save();

		return $chat;
	}

	//
	// querying methods
	//

	/**
	 * Get a chat.
	 *
	 * @param string $id - the id of the chat to get
	 * @return App\Models\Chats\Chat
	 */
	public function getIndex(string $id) {

		// find chat by id
		//
		$chat = Chat::find($id);
		if (!$chat) {
			return response("Chat not found.", 404);
		}

		return $chat;
	}
	
	/**
	 * Get all chats by the current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getAll() {

		// get all chats that we are a member of
		//
		$chats = collect();
		$memberships = ChatMembership::where('member_id', '=', Session::get('user_id'))
			->get();
		foreach ($memberships as $membership) {
			$chat = $membership->chat()->first();
			if (count($chat->members) > 1) {
				$chats->push($chat);
			}
		}

		return $chats;
	}

	/**
	 * Get a chat's members.
	 *
	 * @param string $id - the id of the chat to get members of
	 * @return Illuminate\Support\Collection
	 */
	public function getMembers(string $id) {

		// find chat by id
		//
		$chat = Chat::find($id);
		if (!$chat) {
			return collect();
		}

		return $chat->members()->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a chat.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the chat to update
	 * @return App\Models\Chats\Chat
	 */
	public function updateIndex(Request $request, string $id) {

		// find chat by id
		//
		$chat = Chat::find($id);
		if (!$chat) {
			return response("Chat not found.", 404);
		}

		// update chat attributes
		//
		$chat->change([
			'user_id' => $request->input('user_id')
		]);

		return $chat;
	}

	/**
	 * Remove a member from a chat.
	 *
	 * @param string $userId - the id of the chat to remove members from
	 * @param string $memberId - the id of the user member to remove
	 * @return App\Models\Chats\Chat
	 */
	public function removeMember(string $id, string $memberId) {

		// find chat by id
		//
		$chat = Chat::find($id);
		if (!$chat) {
			return response("Chat not found.", 404);
		}

		// remove chat messages
		//
		ChatMessage::where('chat_id', '=', $id)
			->where('user_id', '=', $memberId)->delete();

		// get membership
		//
		$membership = ChatMembership::where('chat_id', '=', $id)
			->where('member_id', '=', $memberId)->first();
		if (!$membership) {
			return response("Chat membership not found.", 404);
		}

		// delete membership
		//
		$membership->delete();

		// delete chat
		//
		if ($chat->memberships()->count() <= 1) {
			$chat->delete();
		}

		return $chat;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a chat.
	 *
	 * @param string $id - the id of the chat to delete
	 * @return App\Models\Chats\Chat
	 */
	public function deleteIndex(string $id) {

		// find chat by id
		//
		$chat = Chat::find($id);
		if (!$chat) {
			return response("Chat not found.", 404);
		}

		// delete chat
		//
		$chat->delete();

		return $chat;
	}
}