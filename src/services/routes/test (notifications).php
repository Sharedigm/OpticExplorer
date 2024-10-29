<?php
/******************************************************************************\
|                                                                              |
|                                   test.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the REST API routes used by the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;
use League\Flysystem\Filesystem;
use App\Models\Users\User;
use App\Models\News\Like;
use App\Models\News\Comment;
use App\Models\News\Reply;
use App\Notifications\LikeNotification;
use App\Notifications\CommentNotification;
use App\Notifications\ReplyNotification;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('environment', function() {
	return App::environment();
});

Route::get('test', function() {
	// return print_r(Storage::disk('local')->getAdapter()->prefixer->prefix, 1);
	return print_r(Storage::disk('local')->path(''), 1);
});

//
// notification tests
//

Route::get('test/notifications/likes', function() {
	$like = Like::find('3e1ed99e-afc3-9e48-d27c-300ad82ff240');
	$notification = new LikeNotification([
		'like_id' => $like->id
	]);
	return print_r($notification->toNexmo($like->item->user), 1);
});

Route::get('test/notifications/comments', function() {
	$comment = Comment::find('562f9904-2b61-c914-bd64-2fbd65605c58');
	$notification = new CommentNotification([
		'comment_id' => $comment->id
	]);
	return $notification->toMail($comment->post->user);
});

Route::get('test/notifications/replies', function() {
	$reply = Reply::find('e1e13f2f-90eb-59c5-e060-6693247c16ff');
	$notification = new ReplyNotification([
		'reply_id' => $reply->id
	]);
	return $notification->toMail($reply->item->user);
});

Route::get('test/notifications/reply-replies', function() {
	$reply = Reply::find('1b5eda3a-41ed-7bca-1a6c-ce5890b19595');

	// return $reply;
	/*
	if ($reply->item == null) {
		return "No reply item!";
	} else {
		return $reply->item;
	}
	*/

	$notification = new ReplyNotification([
		'reply_id' => $reply->id
	]);
	return $notification->toMail($reply->item->user);
});