<?php
/******************************************************************************\
|                                                                              |
|                         ChatInvitationController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing chat session           |
|        invitations.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Chats\Sharing;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Chats\ChatMembership;
use App\Models\Chats\Sharing\ChatInvitation;
use App\Notifications\ChatInvitationNotification;
use App\Http\Controllers\Controller;
use App\Http\Filters\DateFilter;
use App\Utilities\Uuids\Guid;

class ChatInvitationController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new chat invitation.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Chats\Sharing\ChatInvitation
	 */
	public function postCreate(Request $request) {

		// create new chat invitation
		//
		$invitation = new ChatInvitation([
			'id' => Guid::create(),
			'chat_id' => $request->input('chat_id'),
			'sender_id' => Session::get('user_id'),
			'recipient_id' => $request->input('recipient_id'),
			'message' => $request->input('message')
		]);

		// check validity of invitation
		//
		if (!$invitation->recipient) {
			return response("Recipient not found.", 404);
		}

		$invitation->save();

		// notify recipient of chat invitation
		//
		$invitation->recipient->notify(new ChatInvitationNotification([
			'chat_invitation_id' => $invitation->id
		]));

		return $invitation;
	}

	/**
	 * Get chat invitations by id.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getIndex(Request $request, string $id) {

		// find chat message by id
		//
		$chatInvitation = ChatInvitation::find($id);
		if (!$chatInvitation) {
			return response("Chat invitation not found.", 404);
		}

		return $chatInvitation;
	}

	/**
	 * Get chat invitations by chat id.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getByChat(Request $request, string $chatId) {
		return ChatInvitation::where('chat_id', '=', $chatId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Accept a chat invitation.
	 *
	 * @param string $id
	 * @return App\Models\Chats\Sharing\ChatInvitation
	 */
	public function acceptIndex(string $id) {

		// find chat invitation
		//
		$invitation = ChatInvitation::find($id);
		if (!$invitation) {
			return response("Chat invitation not found.", 404);
		}

		$invitation->accept();

		// create new chat membership
		//
		$membership = new ChatMembership([
			'id' => Guid::create(),
			'chat_id' => $invitation->chat_id,
			'invitation_id' => $invitation->id,
			'member_id' => $invitation->recipient_id
		]);
		$membership->save();

		return $invitation;	
	}

	/**
	 * Decline a chat invitation.
	 *
	 * @param string $id
	 * @return App\Models\Chats\Sharing\ChatInvitation
	 */
	public function declineIndex(string $id) {

		// find chat invitation
		//
		$invitation = ChatInvitation::find($id);
		if (!$invitation) {
			return response("Chat invitation not found.", 404);
		}

		$invitation->decline();
		return $invitation;	
	}
}