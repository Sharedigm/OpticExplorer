<?php
/******************************************************************************\
|                                                                              |
|                             FileIndexController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing file indices.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use App\Models\Users\User;
use App\Models\Storage\FileIndex;
use App\Models\Storage\Directory;
use App\Models\Storage\Media\PdfFile;
use App\Http\Controllers\Controller;
use App\Http\Filters\ItemFilters;
use App\Http\Filters\ImageFilters;
use App\Http\Filters\SharingFilters;
use App\Http\Filters\IndexingFilters;
use App\Http\Filters\DateFilter;
use App\Http\Filters\RangeFilter;
use App\Utilities\AI\OpenAI;
use App\Utilities\AI\Pinecone;
use App\Utilities\Uuids\Guid;

class FileIndexController extends Controller
{
	const MAXLENGTH = 65535;

	//
	// creating methods
	//

	/**
	 * Create a new file index.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function postCreate(Request $request) {

		// parse parameters
		//
		$path = $request->input('path');

		// read file
		//
		if (str_ends_with($path, '.pdf')) {
			$file = new PdfFile([
				'path' => $path
			]);
			$text = $file->toText();
		} else {
			$text = $path;
		}

		// create new link
		//
		$fileIndex = new FileIndex([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'path' => $path,
			'text' => strlen($text) > self::MAXLENGTH? substr($text, 0, self::MAXLENGTH) : $text
		]);
		$fileIndex->save();

		// use vector embedding
		//
		if (env('VECTOR_EMBEDDING')) {

			// get vector from text
			//
			$values = OpenAI::embed($text);

			// insert into vector database
			//
			$result = Pinecone::upsert($fileIndex->id, $values, [
				"path" => $path,
				"user_id" => $fileIndex->user_id
			]);
		}
		
		return $fileIndex;
	}

	//
	// getting methods
	//

	/**
	 * Get indexed files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File[]
	 */
	public function getIndexed(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		$details = $request->input('details');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		$files = $directory->getFiles();

		// filter and return contents
		//
		$files = ItemFilters::filter($request, $files);
		$files = ImageFilters::filter($request, $files);
		$files = SharingFilters::filter($request, $files);
		$files = IndexingFilters::filterByIndexed($request, $files);

		// append attributes
		//
		if ($details) {
			foreach ($contents as $item) {
				$item->append($details);
			}
		}

		return $files;
	}

	/**
	 * Get number of indexed files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getNumIndexed(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		return count($this->getIndexed($request));
	}

	/**
	 * Get indexed files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File[]
	 */
	public function getAllIndexed(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		$details = $request->input('details');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		$files = $directory->getFiles(true);

		// filter and return contents
		//
		$files = ItemFilters::filter($request, $files);
		$files = ImageFilters::filter($request, $files);
		$files = SharingFilters::filter($request, $files);
		$files = IndexingFilters::filterByIndexed($request, $files);

		// append attributes
		//
		if ($details) {
			foreach ($contents as $item) {
				$item->append($details);
			}
		}

		return $files;
	}

	/**
	 * Get number of indexed files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getNumAllIndexed(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		return count($this->getAllIndexed($request));
	}

	//
	// indexable getting methods
	//

	/**
	 * Get indexable files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getIndexable(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		$details = $request->input('details');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		$files = $directory->getFiles();

		// filter and return contents
		//
		$files = ItemFilters::filter($request, $files);
		$files = ImageFilters::filter($request, $files);
		$files = SharingFilters::filter($request, $files);
		$files = IndexingFilters::filter($request, $files);

		// append attributes
		//
		if ($details) {
			foreach ($contents as $item) {
				$item->append($details);
			}
		}

		return $files;
	}

	/**
	 * Get number of indexable files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getNumIndexable(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		return count($this->getIndexable($request));
	}

	/**
	 * Get indexable files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getAllIndexable(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		$details = $request->input('details');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		$files = $directory->getFiles(true);

		// filter and return contents
		//
		$files = ItemFilters::filter($request, $files);
		$files = ImageFilters::filter($request, $files);
		$files = SharingFilters::filter($request, $files);
		$files = IndexingFilters::filter($request, $files);

		// append attributes
		//
		if ($details) {
			foreach ($contents as $item) {
				$item->append($details);
			}
		}

		return $files;
	}

	/**
	 * Get number of indexable files.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getNumAllIndexable(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		return count($this->getAllIndexable($request));
	}

	//
	// deleting methods
	//

	/**
	 * Delete a file index.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function deleteIndex(Request $request, $id) {

		// look up index
		//
		$fileIndex = FileIndex::find($id);

		// delete item
		//
		if ($fileIndex) {
			$fileIndex->delete();
		}

		// use vector embedding
		//
		if (env('VECTOR_EMBEDDING')) {

			// remove from vector index
			//
			$result = Pinecone::remove([
				$id
			]);
		}

		return $fileIndex;
	}

	/**
	 * Delete file indices.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex[]
	 */
	public function deleteIndices(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		return $directory->deleteIndices();
	}

	/**
	 * Search the file index.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getSearch(Request $request) {

		// parse parameters
		//
		$keywords = $request->input('query');
		$limit = $request->input('limit', 1000);
		$details = $request->input('details');

		// use vector embedding
		//
		if (env('VECTOR_EMBEDDING')) {

			// lookup vector
			//
			$vector = OpenAI::embed($query);
			$topK = $limit;
			$threshold = 0.1;
			$includeValues = false;
			$result = Pinecone::query($vector, $topK, $includeValues);
			$results = $result['matches'];

			// look up file indices
			//
			$fileIndices = [];
			for ($i = 0; $i < count($results); $i++) {
				$result = $results[$i];
				$fileIndex = FileIndex::find($result['id']);
				if ($fileIndex && $result['score'] > $threshold) {
					$fileIndex['score'] = $result['score'];
					array_push($fileIndices, $fileIndex);
				}
			}

			// apply range parameters 
			//
			if ($request->has('from') || $request->input('to')) {

				// apply range parameters 
				//
				$from = $request->input('from');
				$to = $request->input('to');
				$from = filter_var($from, FILTER_VALIDATE_INT) ?? 0;
				$to =  filter_var($to, FILTER_VALIDATE_INT) ?? $from + $limit;
				$length = $to - $from;

				// apply range filter
				//
				$fileIndices = array_slice($fileIndices, $from, $length);
			}
		} else {

			// create query
			//
			$query = FileIndex::selectRaw('*, ROUND((length(text) - length(REPLACE(text, "' . $keywords . '", ""))) / LENGTH("' . $keywords . '")) AS score');

			// add text filter
			//
			if ($keywords != '*') {
				$query = $query->where('text', 'LIKE', '%' . $keywords . '%');
			}

			// apply filters
			//
			$query = RangeFilter::applyTo($request, $query);
			$query = DateFilter::applyTo($request, $query);

			// apply sorting
			//
			$query = $query->orderBy('score', 'DESC');

			// get query results
			//
			$fileIndices = $query->get();
		}

		return $fileIndices;
	}

	/**
	 * Get the number of items in the file index.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\FileIndex
	 */
	public function getSearchNum(Request $request) {

		// parse parameters
		//
		$keywords = $request->input('query');

		// use vector embedding
		//
		if (env('VECTOR_EMBEDDING')) {

			// lookup vector
			//
			$vector = OpenAI::embed($query);
			$topK = $limit;
			$threshold = 0.1;
			$includeValues = false;
			$result = Pinecone::query($vector, $topK, $includeValues);
			$results = $result['matches'];

			// look up file indices
			//
			return count($results);
		} else {

			// create query
			//
			$query = FileIndex::selectRaw('*');

			// apply text filter
			//
			if ($keywords != '*') {
				$query = $query->where('text', 'like', '%' . $keywords . '%');
			}

			// apply filters
			//
			$query = DateFilter::applyTo($request, $query);

			// perform count
			//
			return $query->count();
		}
	}
}