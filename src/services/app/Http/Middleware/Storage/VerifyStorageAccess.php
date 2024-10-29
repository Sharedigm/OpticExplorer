<?php 
/******************************************************************************\
|                                                                              |
|                           VerifyStorageAccess.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify that the user of a route            |
|        has access to the file storage system.                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Middleware\Storage;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Auth\UserSession;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Storage\UserStorage;
use App\Models\Storage\FileIndex;
use App\Models\Storage\Sharing\Link;
use App\Models\Storage\Sharing\Share;
use App\Models\Storage\Attachments\PostAttachment;
use App\Models\Storage\Attachments\CommentAttachment;
use App\Models\Storage\Attachments\ReplyAttachment;
use App\Models\Storage\Attachments\ChatAttachment;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Strings\StringUtils;

class VerifyStorageAccess
{
	/**
	 * The Guard implementation.
	 *
	 * @var Guard
	 */
	protected $auth;

	//
	// constructor
	//

	/**
	 * Create a new filter instance.
	 *
	 * @param  Guard  $auth
	 * @return void
	 */
	public function __construct(Guard $auth)
	{
		$this->auth = $auth;
	}

	//
	// setting methods
	//

	/**
	 * Set storage access to link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $linkId - the id of the link to set the context of
	 * @return void
	 */
	public function setLinkContext(Request $request, $linkId) {

		// find link
		//
		$link = Link::find($linkId);
		if (!$link) {
			return;
		}

		// find user's account
		//
		$userAccount = UserAccount::where('user_id', '=', $link->user_id)->first();

		// check to see if user is enabled
		//
		if ($userAccount && !$userAccount->isEnabled()) {
			Session::flush();
			return response("User account not enabled.", 401);
		}

		// check file limit
		//
		if ($link->restricted) {
			return redirect(config('app.client_url') . '/#links/restricted');
		}

		// check expiration date
		//
		if ($link->expired) {
			return redirect(config('app.client_url') . '/#links/expired');
		}

		// check authentication
		//
		if ($link->protected) {
			if ($request->input('password') != $link->password) {
				return redirect(config('app.client_url') . '/#links/' . $request->input('link_id') . '/password');
			}
		}

		// set file system root for absolute paths
		//
		if (str_starts_with($link->path, '/')) {
			FileStorage::push($link->path);
			return;
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount, $link->path);
	}

	/**
	 * Set storage access to file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $linkId - the id of the link to set the context of
	 * @return void
	 */
	public function setFileContext(Request $request, $fileId) {

		// find link
		//
		$fileIndex = FileIndex::find($fileId);
		if (!$fileIndex) {
			return response("File index not found.", 404);
		}

		// find user's account
		//
		$userAccount = UserAccount::where('user_id', '=', $fileIndex->user_id)->first();

		// check to see if user is enabled
		//
		if ($userAccount && !$userAccount->isEnabled()) {
			Session::flush();
			return response("User account not enabled.", 401);
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount);
	}

	/**
	 * Set storage access to map link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $linkId - the id of the link to set the context of
	 * @return void
	 */
	public function setMapLinkContext(Request $request, $mapLinkId) {

		// find link
		//
		$link = Link::find($mapLinkId);
		if (!$link) {
			return response("Link not found.", 404);
		}

		// find user's account
		//
		$userAccount = UserAccount::where('user_id', '=', $link->user_id)->first();

		// check to see if user is enabled
		//
		if ($userAccount && !$userAccount->isEnabled()) {
			Session::flush();
			return response("User account not enabled.", 401);
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount);
	}

	/**
	 * Set storage access to map share.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $linkId - the id of the link to set the context of
	 * @return void
	 */
	public function setMapShareContext(Request $request, $mapShareId) {

		// find share
		//
		$share = Share::find($mapShareId);
		if (!$share) {
			return response("Share not found.", 404);
		}

		// find user's account
		//
		$userAccount = UserAccount::where('user_id', '=', $share->owner_id)->first();

		// check to see if user is enabled
		//
		if ($userAccount && !$userAccount->isEnabled()) {
			Session::flush();
			return response("User account not enabled.", 401);
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount);
	}

	/**
	 * Set storage access to user's public folder.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get the public context of
	 * @return void
	 */
	public function setUserPublicContext(Request $request, $userId) {

		// find user's account
		//
		$userAccount = UserAccount::find($userId);

		// check to see if user is admin
		//
		if (!$userAccount) {
			return response("User account not found.", 404);
		}

		// check to see if user is enabled
		//
		if (!$userAccount->isEnabled()) {
			return response("User account not enabled.", 401);
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount, '/Public/');
	}

	/**
	 * Set storage access attachment's folder.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $attachment - the attachement to set context of
	 * @return void
	 */
	public function setAttachmentContext(Request $request, $attachment) {

		// check to see if we have an attachment
		//
		if (!$attachment) {
			return;
		}

		// find user's account
		//
		$item = $attachment->item;
		$userId = $item->user_id;
		$userAccount = UserAccount::find($userId);

		// check to see if user is enabled
		//
		if ($userAccount && !$userAccount->isEnabled()) {
			Session::flush();
			return response("User account not enabled.", 401);
		}

		// set file system root
		//
		$dirname = dirname($attachment->path);
		if ($dirname == '.') {
			$dirname = '';
		} else {
			$dirname = $dirname . '/';
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount, $dirname);
	}

	/**
	 * Set storage access post attachment's folder.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $postAttachmentId - the id of the attachement to set context of
	 * @return void
	 */
	public function setPostAttachmentContext(Request $request, $postAttachmentId) {
		self::setAttachmentContext($request, PostAttachment::find($postAttachmentId));
	}

	/**
	 * Set storage access comment attachment's folder.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $commentAttachmentId - the id of the comment attachment to set context of
	 * @return void
	 */
	public function setCommentAttachmentContext(Request $request, $commentAttachmentId) {
		self::setAttachmentContext($request, CommentAttachment::find($commentAttachmentId));
	}

	/**
	 * Set storage access reply attachment's folder.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $replyAttachmentId - the id of teh reply attachment to set context of
	 * @return void
	 */
	public function setReplyAttachmentContext(Request $request, $replyAttachmentId) {
		self::setAttachmentContext($request, ReplyAttachment::find($replyAttachmentId));
	}

	/**
	 * Set storage access chat attachment's folder.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $chatAttachmentId - the id of the chat attachment to set context of
	 * @return void
	 */
	public function setChatAttachmentContext(Request $request, $chatAttachmentId) {
		self::setAttachmentContext($request, ChatAttachment::find($chatAttachmentId));
	}
	
	/**
	 * Set storage access to user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to set context of
	 * @return void
	 */
	public function setUserContext(Request $request, $userId) {

		// find user's account
		//
		$userAccount = UserAccount::find($userId);

		// check to see if user is enabled
		//
		if (!$userAccount || !$userAccount->isEnabled()) {
			return response("User account not enabled.", 401);
		}

		// check for shared items
		//
		$path = $request->input('path');
		if (StringUtils::startsWith($path, '/Shared')) {
			return;
		}

		// check for admin users
		//
		if (!$userAccount || $userAccount->isAdmin()) {
			return;
		}

		// set user's file storage
		//
		FileStorage::setUserContext($userAccount);
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		// set file system context to link
		//
		if ($request->has('link_id')) {
			$response = $this->setLinkContext($request, $request->input('link_id'));
			if ($response) {
				return $response;
			}

		// set file system context to search
		//
		} else if ($request->has('file_id')) {
			$response = $this->setFileContext($request, $request->input('file_id'));
			if ($response) {
				return $response;
			}

		// set file system context to map link
		//
		} else if ($request->has('map_link_id')) {
			$response = $this->setMapLinkContext($request, $request->input('map_link_id'));
			if ($response) {
				return $response;
			}

		// set file system context to map share
		//
		} else if ($request->has('map_share_id')) {
			$response = $this->setMapShareContext($request, $request->input('map_share_id'));
			if ($response) {
				return $response;
			}

		// set file system context to public directory of user
		//
		} else if ($request->has('public_id')) {
			$response = $this->setUserPublicContext($request, $request->input('public_id'));
			if ($response) {
				return $response;
			}

		// set file system context to post attachment
		//
		} else if ($request->has('post_attachment_id')) {
			$response = $this->setPostAttachmentContext($request, $request->input('post_attachment_id'));
			if ($response) {
				return $response;
			}

		// set file system context to comment attachment
		//
		} else if ($request->has('comment_attachment_id')) {
			$response = $this->setCommentAttachmentContext($request, $request->input('comment_attachment_id'));
			if ($response) {
				return $response;
			}

		// set file system context to reply attachment
		//
		} else if ($request->has('reply_attachment_id')) {
			$response = $this->setReplyAttachmentContext($request, $request->input('reply_attachment_id'));
			if ($response) {
				return $response;
			}

		// set file system context to chat attachment
		//
		} else if ($request->has('chat_attachment_id')) {
			$response = $this->setChatAttachmentContext($request, $request->input('chat_attachment_id'));
			if ($response) {
				return $response;
			}

		// set file system context to current user's home directory
		//
		} else if (UserSession::exists()) {

			// get user from current session
			//
			if ($request->segment(1) != 'logout') {

				// set file system context to user
				//
				$response = $this->setUserContext($request, Session::get('user_id'));
				if ($response) {
					return $response;
				}
			} else {
				Session::flush();
				return response("Session invalid.", 401);
			}
		} else {

			// set file system root
			//
			$path = $request->input('path');
			if (!StringUtils::startsWith($path, '/Shared')) {

				// no current session exists
				//
				Session::flush();
				return response("No session.", 401);
			}
		}

		return $next($request);
	}
}