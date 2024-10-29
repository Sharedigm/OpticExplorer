<?php
/******************************************************************************\
|                                                                              |
|                                 AudioFile.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a storage system file.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Media;

use Intervention\Image\Image;
use Illuminate\Http\UploadedFile;
use App\Models\Storage\File;

class AudioFile extends File
{
	//
	// constants
	//

	public const EXTENSIONS = [
		'flac',
		'm4a',
		'm4p',
		'mp3',
		'wav'
	];
	
	// limit ID3 analysis to first 1MB of file
	//
	const ID3SizeLimit = 1048576;		// 1 MB
	// const ID3SizeLimit = 4194304;	// 4 MB
	// const ID3SizeLimit = null;

	public const ID3_ATTRS = [
		'album',
		'artist',
		'band',
		'composer',
		'genre',
		'publisher',
		'title',
		'track_number',
		'year',
		'length'
	];

	//
	// attributes
	//

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// address
		//
		'path',

		// metadata
		//
		'size', 
		'id3',
		'place',

		// access control
		//
		'permissions',

		// sharing
		//
		'link_id',
		'share_id',
		'owner',
		'num_shares',
		'num_links',

		// timestamps
		//
		'created_at',
		'modified_at',
		'accessed_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	public $appendables = [

		// metadata
		//
		'size',	
		'id3',
		'place',

		// access control
		//
		'permissions',

		// sharing
		//
		'owner',
		'num_shares',
		'num_links',

		// timestamps
		//
		'created_at',
		'modified_at',
		'accessed_at'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'num_shares' => 'integer',
		'num_links' => 'integer',
	];

	//
	// attributes accessor methods
	//

	/**
	 * Get this audio file's id3 attributes.
	 *
	 * @return array
	 */
	public function getId3Attribute(): ?array {
		return $this->getId3Tags();
	}

	//
	// creating methods
	//

	/**
	 * Get this file's metadata.
	 *
	 * @return array
	 */
	public function getNewMetadata(UploadedFile $file): array {

		// get id3 data from file
		//
		$id3 = self::getId3Data($file->getRealPath());
		$tags = self::id3ToTags($id3);

		// create metadata
		//
		$metadata = parent::getNewMetadata($file);
		if ($tags) {
			foreach (self::ID3_ATTRS as $key) {
				if (array_key_exists($key, $tags)) {
					$metadata[$key] = $tags[$key][0];
				}
			}
		}

		return $metadata;
	}
	
	//
	// querying methods
	//

	/**
	 * Get this audio file's id3 info.
	 *
	 * @return array
	 */
	public function getID3(): ?array {
		if (!$this->exists()) {
			return null;
		}

		// get local file
		//
		if ($this->isLocal()) {
			$path = $this->rootPath();
		} else {
			$path = $this->toTemp();
		}

		// get id3 info of local file
		//
		$id3 = self::getId3Data($path);

		// remove temp local file
		//
		if (!$this->isLocal()) {
			unlink($path);
		}

		return $id3;
	}

	/**
	 * Get this audio file's id3 tags.
	 *
	 * @return array
	 */
	public function getID3Tags(): ?array {
		$id3 = $this->getID3();
		if ($id3) {
			return self::id3ToTags($id3);
		} else {
			return null;
		}
	}

	/**
	 * Get this audio file's thumbnail image from the id3 info.
	 *
	 * @param int $minSize - the minimum size of the thumbnail image.
	 * @param int $maxSize - the maximum size of the thumbnail image.
	 * @return Intervention\Image\Image
	 */
	public function getThumbImage(?int $minSize, ?int $maxSize): ?Image {
		$id3 = $this->getID3();

		// check if id3 info contains an image
		//
		if ($id3 && $id3['comments']['picture']) {
			$data = utf8_decode($id3['comments']['picture'][0]['data']);

			// create image from data
			//
			$image = \Image::make($data);

			// resize image, if necessary
			//
			if ($minSize || $maxSize) {
				$image = self::resizeImage($image, null, null, $minSize, $maxSize);
			}

			return $image;
		}
	}

	/**
	 * Download this audio file.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function response() {
		return response($this->readContents())
			->header('Content-Type', 'audio/mpeg');
	}

	//
	// static methods
	//

	/**
	 * Get id3 data from file.
	 *
	 * @param string $path - the path to the file to query.
	 * @return array
	 */
	private static function getId3Data(string $path): ?array {

		// initialize getID3 engine
		//
		$getID3 = new \getID3;

		// try to read id3 data
		//
		try {

			// get id3 info of local file
			//
			$id3 = $getID3->analyze($path, self::ID3SizeLimit);

			// encode id3 info
			//
			Self::utf8_encode_deep($id3);

			/*
			 Optional: copies data from all subarrays of [tags] into [comments] so
			 metadata is all available in one location for all tag formats
			 metainformation is always available under [tags] even if this is not called
			*/
			\getid3_lib::CopyTagsToComments($id3);

			return $id3;
		} catch (\Exception $e) {
			return null;
		}	
	}

	/**
	 * Get tags from id3 data.
	 *
	 * @param array $id3 - the id3 data.
	 * @return array
	 */
	private static function id3ToTags(array $id3): array {
		if (isset($id3['tags'])) {
			
			// return tags
			//
			$tags = $id3['tags'];

			// check for id3v2 tags
			//
			if (isset($tags['id3v2'])) {
				$tags = $tags['id3v2'];
				$comments = $id3['comments'];
				if ($tags && is_array($tags)) {
					$tags['picture'] = $comments && is_array($comments) && array_key_exists('picture', $comments) && $comments['picture'] != null;
				}

				// convert arrays
				//
				foreach ($tags as $key => $value) {
					if (is_array($value)) {
						$tags[$key] = array_key_exists('0', $value)? $value[0] : null;
					}
				}

				return $tags;

			// check for quicktime tags
			//
			} else if (isset($tags['quicktime'])) {
				$tags = $tags['quicktime'];
				$comments = $id3["comments"];
				unset($tags['iTunSMPB']);
				unset($tags['iTunNORM']);
				unset($tags['Encoding Params']);
				if ($tags && is_array($tags)) {
					$tags['picture'] = $comments && is_array($comments) && array_key_exists('picture', $comments) && $comments['picture'] != null;
				}

				// convert arrays
				//
				foreach ($tags as $key => $value) {
					if (is_array($value)) {
						$tags[$key] = array_key_exists('0', $value)? $value[0] : null;
					}
				}

				return $tags;
			}
		} else if (isset($id3['id3v2']['comments'])) {

			// return comments
			//
			return $id3['id3v2']['comments'];
		} else {

			// return everything
			//
			return $id3;
		}

		return [];
	}

	/**
	 * Check if a path is valid for audio files.
	 *
	 * @param string $path - the path to validate.
	 * @return bool
	 */
	static public function isValidPath(?string $path): bool {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		return in_array(strtolower($extension), self::EXTENSIONS);
	}

	/**
	 * Encode binary data.
	 *
	 * @param string &$input - the input data to encode.
	 * @return void
	 */
	private static function utf8_encode_deep(&$input) {
		if (is_string($input)) {
			$input = utf8_encode($input);
		} else if (is_array($input)) {
			foreach ($input as &$value) {
				self::utf8_encode_deep($value);
			}

			unset($value);
		} else if (is_object($input)) {
			$vars = array_keys(get_object_vars($input));

			foreach ($vars as $var) {
				self::utf8_encode_deep($input->$var);
			}
		}
	}
}