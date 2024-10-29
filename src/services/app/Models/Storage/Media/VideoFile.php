<?php
/******************************************************************************\
|                                                                              |
|                                 VideoFile.php                                |
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

use FFMpeg;
use Intervention\Image\Image;
use App\Models\Storage\File;
use App\Models\Storage\Traits\ExifReadable;
use App\Utilities\Strings\StringUtils;
use App\Utilities\Storage\FileStorage;

class VideoFile extends File
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use ExifReadable;

	//
	// constants
	//

	public const EXTENSIONS = [
		'avi',
		'mp4',
		'mov',
		'mpg',
		'mpeg',
		'ogg',
		'webm',
		'wmv'
	];

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
		'place',

		// video metadata
		//
		'resolution',
		'tags',
		'exif',

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
		'place',

		// video metadata
		//
		'resolution',
		'tags',
		'exif',

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
	
	/**
	 * The time (offset from the start) when then thumbnail is taken.
	 *
	 * @var float
	 */
	public const THUMBNAIL_TIME = 10;

	//
	// video attributes accessor methods
	//

	/**
	 * Get this image file's resolution attribute.
	 *
	 * @return array
	 */
	public function getResolutionAttribute(): ?array {
		$this->append('tags');
		return $this->tags? $this->tags['resolution'] : null;
	}

	/**
	 * Get this video file's metadata tags attribute.
	 *
	 * @return array
	 */
	public function getTagsAttribute(): array {	

		// attempt to get tags from file
		//
		try {
			$ffprobe = \FFMpeg\FFProbe::create([
				'ffmpeg.binaries'  => config('app.ffmpeg_binary_path'),
				'ffprobe.binaries' => config('app.ffprobe_binary_path') 
			]);
			$rootPath = $this->getRootPath();
			$streams = $ffprobe->streams($rootPath);
			$video = $streams->videos()->first();
			$dimensions = $video->getDimensions();
			$info = $ffprobe->format($rootPath);
			
			// return video tags
			//
			return [
				'resolution' => [
					$dimensions->getWidth(),
					$dimensions->getHeight()
				],
				'duration' => $info->get('duration'),
				'bit_rate' => $video->get('bit_rate'),
			];
		} catch (\Exception $e) {
			return [];
		}
	}

	/**
	 * Get this image file's exif attribute.
	 *
	 * @return array
	 */
	public function getExifAttribute(): ?array {

		// check for non exif images
		//
		if (!$this->hasExif()) {
			return null;
		}

		// check which file system to use
		//
		if ($this->isLocal()) {
			return $this->readExif();
		} else {

			// get dimensions from metadata
			//
			// return $this->getMetadataExif();
			return null;
		}
	}

	//
	// querying methods
	//

	/**
	 * Find if this image has exif data.
	 *
	 * @return bool
	 */
	public function hasExif(): bool {
		return true;
	}

	//
	// getting methods
	//

	/**
	 * Get video resolution from metadata.
	 *
	 * @return float
	 */
	public function getResolution() {
		$this->append('tags');
		return $this->tags['resolution'];
	}

	/**
	 * Get video duration from metadata.
	 *
	 * @return float
	 */
	public function getDuration() {
		$this->append('tags');
		return $this->tags['duration'];
	}

	/**
	 * Get bit rate duration from metadata.
	 *
	 * @return float
	 */
	public function getBitRate() {
		$this->append('tags');
		return $this->tags['bit_rate'];
	}

	//
	// thumbnail methods
	//

	/**
	 * Get this audio file's thumbnail image from the id3 info.
	 *
	 * @param int $minSize - the minimum size of the thumbnail image.
	 * @param int $maxSize - the maximum size of the thumbnail image.
	 * @return Intervention\Image\Image
	 */
	public function getThumbImage(?int $minSize, ?int $maxSize): ?Image {
		$path = $this->getRootPath();
		$thumbPath = FileStorage::temp() . '/' . $this->getThumbname();

		// grab frame from video
		//
		$ffmpeg = \FFMpeg\FFMpeg::create([
			'ffmpeg.binaries'  => config('app.ffmpeg_binary_path'),
			'ffprobe.binaries' => config('app.ffprobe_binary_path') 
		]);

		$video = $ffmpeg->open($path);
		$duration = $this->getDuration() ?? 0;

		// $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(self::THUMBNAIL_TIME))

		// save frame halfway through video
		//
		$video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($duration / 2))
			->save($thumbPath);

		// create image from file
		//
		$image = \Image::make($thumbPath);

		// resize thumbnail
		//
		return $this->resizeImage($image, null, null, $minSize, $maxSize);
	}

	/**
	 * Read this image file's exif data.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function readExif(): ?array {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exits
			//
			if (!$this->exists()) {
				return null;
			}

			// read exif data of local file
			//
			try {
				$basepath = (str_starts_with(config('app.exif_tool_path'), '/')? '' : base_path(''));
				$toolpath = $basepath . '/' . config('app.exif_tool_path');
				$command = $toolpath  . ' ' . $this->rootPath();
				$output = shell_exec($command);
				$lines = explode("\n", $output);
				$attributes = [];
				for ($i = 0; $i < count($lines); $i++) {
					$line = $lines[$i];
					$pair = explode(":", $line, 2);
					if (count($pair) == 2) {
						$key = trim($pair[0]);
						$value = trim($pair[1]);
						$attributes[$key] = $value;
					}
				}
				return $attributes;
			} catch (\Exception $e) {
				return null;
			}
		}

		return null;
	}

	//
	// static methods
	//

	/**
	 * Check if a path is valid for video files.
	 *
	 * @param string $path - the video file path to query.
	 * @return bool
	 */
	static public function isValidPath(?string $path): bool {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		return in_array(strtolower($extension), self::EXTENSIONS);
	}
}