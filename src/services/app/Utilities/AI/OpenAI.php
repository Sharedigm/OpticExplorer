<?php
/******************************************************************************\
|                                                                              |
|                                  OpenAI.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an interface to the OpenAI API                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\AI;

use Illuminate\Support\Facades\Http;

abstract class OpenAI
{
	const MAXLENGTH = 8192;

	/**
	 * Generate an image.
	 *
	 * @param $text - The text string to embed.
	 * @return scalar[] - The vector that was generated.
	 */
	static function embed($text) {
		$token = env('OPENAI_API_KEY');

		// check for token
		//
		if (!$token) {
			return response('No token provided', 400);
		}

		// get request endpoint
		//
		$url = env('OPENAI_API_ENDPOINT') . '/v1/embeddings';

		// clamp text
		//
		if (strlen($text) > self::MAXLENGTH) {
			$text = substr($text, 0, self::MAXLENGTH);
		}

		// make request
		//
		$response = Http::withToken($token)
			->timeout(60)
			->post($url, [
				"input" => $text,
				"model" => "text-embedding-3-small"
			]);

		// check response code
		//
		if ($response->status() != 200) {
			return $response;
		}

		return $response["data"][0]["embedding"];
	}
}