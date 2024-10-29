<?php
/******************************************************************************\
|                                                                              |
|                           MetadataAssociatable.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a shareable storage system item.              |
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

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait MetadataAssociatable
{
	/**
	 * Get new item's initial metadata.
	 *
	 * @return array
	 */
	public function getNewMetadata(UploadedFile $file): array {
		return [
			'permissions' => '755',
			'timestamp' => time()
		];
	}

	/**
	 * Get this item's metadata.
	 *
	 * @return array
	 */
	public function getMetadata(): ?array {

		// check if metadata has already been found
		//
		if ($this->metadata || $this->metadata === false) {
			$path = $this->fullPath();

			// check if metadata is empty
			//
			if ($this->metadata === false) {
				return null;
			}

			return $this->metadata;
		}

		// check if file exists
		//
		if (!$this->exists()) {
			return null;
		}

		// retreive metadata
		//
		if ($this->volume) {
			$storage = $this->getStorage();
			if (!$storage) {
				return null;
			}

			/*
			try {
				$this->metadata = $storage->getMetadata($this->path);
			} catch (Exception $e) {
				$this->metadata = null;
			}
			*/
		} else {
			$this->metadata = Storage::getMetadata($this->fullPath());
		}
		if ($this->metadata == null) {
			$this->metadata = false;
		}

		// check if metadata was not found
		//
		if ($this->metadata === false) {
			return null;
		}

		return $this->metadata;
	}

	/**
	 * Get a value from this item's metadata.
	 *	
	 * @param $key - the name of the value to get.
	 * @return mixed
	 */
	public function getMetadataValue(string $key) {
		$metadata = $this->getMetadata();

		// return metadata attribute if it exists
		//
		if ($metadata && array_key_exists($key, $metadata)) {
			return $metadata[$key];
		}

		return null;
	}

	/**
	 * Get a value from this item's custom metadata.
	 *
	 * @param $key - the name of the value to get.
	 * @return string
	 */
	public function getCustomMetadataValue(string $key) {
		$metadata = $this->getMetadataValue('metadata');

		// return metadata attribute if it exists
		//
		if ($metadata && array_key_exists($key, $metadata)) {
			return $metadata[$key];
		}

		return null;
	}
}
