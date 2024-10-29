<?php
/******************************************************************************\
|                                                                              |
|                         UserInvitationController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for new user invitations.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Connections;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use App\Models\Users\Sharing\UserInvitation;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserInvitationController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user invitation.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Sharing\UserInvitation
	 */
	public function postCreate(Request $request) {

		// create new user invitation
		//
		$userInvitation = new UserInvitation([
			'id' => Guid::create(),
			'inviter_id' => Session::get('user_id'),
			'invitee_name' => $request->input('invitee_name'),
			'invitee_email' => $request->input('invitee_email'),
			'message' => $request->input('message'),
		]);
		$userInvitation->save();

		// send invitation to invitee
		//
		$userInvitation->send($request->input('registration_url') . '/' . $userInvitation->id);

		return $userInvitation;
	}

	//
	// querying methods
	//

	/**
	 * Get a user invitation.
	 *
	 * @param string $id - the id of the user invitation to get
	 * @return App\Models\Users\Sharing\UserInvitation
	 */
	public function getIndex(string $id) {

		// find user invitation by id
		//
		$userInvitation = UserInvitation::find($id);
		if (!$userInvitation) {
			return response("User invitation not found.", 404);
		}

		return $userInvitation;
	}
}
