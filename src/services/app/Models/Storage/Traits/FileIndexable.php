<?php
/******************************************************************************\
|                                                                              |
|                              FileIndexable.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a geolocatable file system item.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Traits;

use Illuminate\Support\Facades\Session;
use App\Models\Storage\FileIndex;

trait FileIndexable
{
	//
	// accessor methods
	//

	/**
	 * Get this file's index id
	 *
	 * @return char
	 */
	public function getIndexIdAttribute() {
		$fileIndex = $this->getIndex();
		return $fileIndex? $fileIndex->id : null;
	}

	//
	// querying methods
	//

	/**
	 * Get this file's index
	 *
	 * @return App\Models\Places\FileIndex
	 */
	public function getIndex() {
		return FileIndex::where('user_id', '=', Session::get('user_id'))
			->where('path', '=', $this->path)
			->first();
	}

	/**
	 * Get whether this file is indexable.
	 *
	 * @return boolean
	 */
	public function isIndexable() {
		$extension = $this->getExtension();
		return strtolower($extension) == 'pdf' && !$this->isIndexed();
	}

	/**
	 * Get whether this file is already indexed.
	 *
	 * @return boolean
	 */
	public function isIndexed() {
		return $this->index_id != null;
	}

	/**
	 * Get whether this file's index contains content.
	 *
	 * @return boolean
	 */
	public function contains(string $content) {
		return FileIndex::where('user_id', '=', Session::get('user_id'))
			->where('path', '=', $this->path)
			->where('text', 'like', '%' . $content . '%')
			->exists();
	}
}