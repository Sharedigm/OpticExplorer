<?php

namespace App\Http\Controllers\Utilities;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{
	/**
	 * Create a new contact submission.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function postCreate(Request $request) {

		// parse parameters
		//
		$name = $request->input('name');
		$username = $request->input('username');
		$email = $request->input('email');
		$subject = $request->input('subject');
		$messageText = $request->input('message');
		$attachment = $request->file('attachment');

		// return error if email is not enabled
		//
		if (!config('mail.enabled')) {
			return response("Email has not been enabled.", 400);
		}
		
		// send email
		//
		Mail::send('emails.contact-us', [
			'name' => $name,
			'username' => $username,
			'email' => $email,
			'subject' => $subject,
			'message_text' => $messageText,
			'app_name' => config('app.name'),
			'client_url' => config('app.client_url')
		], function($message) use ($name, $username, $email, $subject, $messageText, $attachment) {
			$message->to(config('mail.contact.address'));
			$message->subject($subject);

			// add attachment
			//
			if ($attachment) {
				$message->attach($attachment->getRealPath(), array(
					'as' => $attachment->getClientOriginalName(),
					'mime' => $attachment->getMimeType())
				);
			}
		});

		// return sent information
		//
		return [
			'name' => $name,
			'username' => $username,
			'email' => $email,
			'subject' => $subject,
			'message' => $messageText
		];
	}
}