<?php
/******************************************************************************\
|                                                                              |
|                         TopicInvitationController.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for managing topic invitations.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Topics\Sharing;

use App\Models\Topics\Sharing\TopicInvitation;
use App\Http\Controllers\Controller;

class TopicInvitationController extends Controller
{
	//
	// updating methods
	//

	/**
	 * Accept topic invitation.
	 *
	 * @param string $id
	 * @return App\Models\Topics\Sharing\TopicInvitation
	 */
	public function acceptIndex(string $id) {

		// find topic invitation by id
		//
		$topicInvitation = TopicInvitation::find($id);
		if (!$topicInvitation) {
			return response("Topic invitation not found.", 404);
		}

		// accept topic invitation
		//
		$topicInvitation->accept();
		return $topicInvitation;	
	}

	/**
	 * Decline topic invitation.
	 *
	 * @param string $id
	 * @return App\Models\Topics\Sharing\TopicInvitation
	 */
	public function declineIndex(string $id) {

		// find topic invitation by id
		//
		$topicInvitation = TopicInvitation::find($id);
		if (!$topicInvitation) {
			return response("Topic invitation not found.", 404);
		}

		// decline topic invitation
		//
		$topicInvitation->decline();
		return $topicInvitation;	
	}
}
