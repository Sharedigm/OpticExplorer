<?php
/******************************************************************************\
|                                                                              |
|                                 Pinecone.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an interface to the Pinecone API                         |
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

abstract class Pinecone
{
	/**
	 * List all indexes in a project.
	 *
	 * @param $text - The text string to embed.
	 * @return object - Metadata about the indices.
	 */
	static function list() {
		$token = env('PINECONE_API_KEY');

		// check for token
		//
		if (!$token) {
			return response('No token provided', 400);
		}

		// get request endpoint
		//
		$url = env('PINECONE_API_ENDPOINT') . '/indexes';

		// make request
		//
		$response = Http::withHeaders([
			'Api-Key' => $token
		])->timeout(60)->get($url);

		return $response;
	}

	/**
	 * List all indexes in a project.
	 *
	 * @param $text - The text string to embed.
	 * @return object - Metadata about the indices.
	 */
	static function upsert($id, $values, $metadata) {
		$token = env('PINECONE_API_KEY');

		// check for token
		//
		if (!$token) {
			return response('No token provided', 400);
		}

		// get request endpoint
		//
		$url = env('PINECONE_INDEX_HOST_ENDPOINT') . '/vectors/upsert';

		// make request
		//
		$response = Http::withHeaders([
			'Api-Key' => $token
		])->timeout(60)->post($url, [
			"vectors" => [
				"id" => $id,
				"values" => $values,
				"metadata" => $metadata
			]
		]);

		return $response;
	}

	/**
	 * List all indexes in a project.
	 *
	 * @param $vector - The vector to search for.
	 * @param $topK - The top number of results to return.
	 * @param $includeValues - Whether or not to return metadata values.
	 * @return object[]
	 */
	static function query($vector, $topK, $includeValues) {
		$token = env('PINECONE_API_KEY');

		// check for token
		//
		if (!$token) {
			return response('No token provided', 400);
		}

		// get request endpoint
		//
		$url = env('PINECONE_INDEX_HOST_ENDPOINT') . '/query';

		// make request
		//
		$response = Http::withHeaders([
			'Api-Key' => $token
		])->timeout(60)->post($url, [
			"vector" => $vector,
			"topK" => $topK,
			"includeValues" => $includeValues
		]);

		return $response;
	}

	/**
	 * Remove item from vector database.
	 *
	 * @param $id - The id of the item to remove.
	 * @return object
	 */
	static function remove($ids) {
		$token = env('PINECONE_API_KEY');

		// check for token
		//
		if (!$token) {
			return response('No token provided', 400);
		}

		// get request endpoint
		//
		$url = env('PINECONE_INDEX_HOST_ENDPOINT') . '/vectors/delete';

		// make request
		//
		$response = Http::withHeaders([
			'Api-Key' => $token
		])->timeout(60)->post($url, [
			"ids" => $ids,
			"namespace" => env('PINECONE_NAMESPACE')
		]);

		return $response;
	}
}