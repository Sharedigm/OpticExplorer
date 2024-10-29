<?php
/******************************************************************************\
|                                                                              |
|                                 ImageFile.php                                |
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
use Illuminate\Support\Facades\Storage;
use App\Models\Storage\File;
use App\Models\Storage\Traits\ExifReadable;
use App\Utilities\Strings\StringUtils;

class ImageFile extends File
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
		'bmp',
		'dng',
		'gif',
		'jpg',
		'jpeg',
		'png',
		'psd',
		'svg',
		'tga',
		'tif',
		'tiff'
	];

	public const RESPONSE_TYPES = [
		'gif',
		'jpg',
		'jpeg',
		'png',
		'svg'
	];

	public const EXIF_ATTRS = [
		'Model',
		'FocalLength',
		'FNumber',
		'ExposureTime',
		'ISOSpeedRatings',
		'DateTimeOriginal'
	];

	public const MAX_SVG_SIZE = 1000000;

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
		'place',

		// image metadata
		//
		'resolution',
		'dimensions',
		'exif',
		'geocoords',

		// access control
		//
		'permissions',

		// sharing
		//
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

		// image metadata
		//
		'resolution',
		'dimensions',
		'exif',
		'geocoords',

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
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [

		// access control
		//
		'permissions',

		// sharing
		//
		'owner',

		// metadata
		//
		'resolution',
		'dimensions'
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
	// image attributes accessor methods
	//

	/**
	 * Get this image file's resolution attribute.
	 *
	 * @return array
	 */
	public function getResolutionAttribute(): ?array {
		$resolution = null;
		$orientation = null;

		// check for non raster images
		//
		if ($this->getExtension() == 'svg') {
			return null;
		}

		// check which file system to use
		//
		if ($this->isLocal()) {

			// get resolution from local storage
			//
			$resolution = $this->getResolution();
			$orientation = $this->getExifValue('Orientation');
		} else {

			// read resolution from image data
			//
			// $resolution = $this->readResolution();
			// $orientation = 0;

			// get resolution from metadata
			//
			/*
			$resolution = $this->getCustomMetadataValue('resolution');
			$orientation = $this->getCustomMetadataValue('orientation');

			// parse resolution
			//
			if ($resolution) {
				$resolution = explode('x', $resolution);
				$resolution[0] = intval($resolution[0]);
				$resolution[1] = intval($resolution[1]);
			}
			*/

			// read resolution from image data
			//
			if (!$resolution) {
				$resolution = $this->readResolution();
				$orientation = 0;
			}
		}

		// flip orientation
		//
		if ($orientation == -90 || $orientation == 90) {
			$temp = $resolution[0];
			$resolution[0] = $resolution[1];
			$resolution[1] = $temp;
		}

		return $resolution;
	}

	/**
	 * Get this image file's dimensions attribute.
	 *
	 * @return array
	 */
	public function getDimensionsAttribute(): ?array {

		// check for non svg images
		//
		if ($this->getExtension() != 'svg') {
			return null;
		}

		// get dimensions from file contents
		//
		return $this->readDimensions();
	}

	/**
	 * Get this image file's exif attribute.
	 *
	 * @return array
	 */
	public function getExifAttribute(): ?array {

		// get exif data from file contents
		//
		if ($this->isLocal()) {
			return $this->readExif();
		} else {
			return null;
		}
	}

	/**
	 * Get this image file's geolocation attribute.
	 *
	 * @return array
	 */
	public function getGeocoordsAttribute(): ?array {

		// check for non svg images
		//
		if ($this->getExtension() != 'tif' && $this->getExtension() != 'tiff') {
			return null;
		}

		// read geocoords from file contents
		//
		return $this->readGeocoords();
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
		return in_array(strtolower($this->getExtension()), ['dng', 'jpg', 'jpeg']);
	}

	/**
	 * Find if this image file has a particular exif value.
	 *
	 * @param string $kind
	 * @return bool
	 */
	public function hasExifValue($kind): bool {
		$exif = $this->getExifAttribute();

		if (!$exif || !array_key_exists($kind, $exif)) {
			return false;
		}

		switch ($kind) {
			case 'Model':
				return true;
			case 'FocalLength':
				return $this->getExifValue($kind) != 0;
			case 'FNumber':
				return $this->getExifValue($kind) != 0;
			case 'ExposureTime':
				return $this->getExifValue($kind) != 0;
			case 'ISOSpeedRatings':
				return $this->getExifValue($kind) != 0;
			case 'DateTimeOriginal':
				return true;
		}
	}

	//
	// getting methods
	//

	/**
	 * Get this image file's exif value.
	 *
	 * @param string $kind
	 * @return mixed
	 */
	public function getExifValue($kind) {
		$exif = $this->getExifAttribute();

		if (!$exif) {
			return null;
		}

		switch ($kind) {
			case 'Model':
				return $exif['Model'];
			case 'FocalLength':
				$value = $exif['FocalLength'];
				if (StringUtils::endsWith($value, '/10')) {
					return intval(substr($value, 0, -3)) / 10;
				} else if (StringUtils::endsWith($value, 'mm')) {
					return intval(substr($value, 0, -2));
				} else {
					return intval($value);
				}
			case 'FNumber':
				$value = $exif['FNumber'];
				if (StringUtils::endsWith($value, '/10')) {
					return floatval(substr($value, 0, -3)) / 10;
				} else {
					return floatval($value);
				}
			case 'ExposureTime':
				$value = $exif['ExposureTime'];
				if (StringUtils::startsWith($value, '10/')) {
					return 10 / floatval(substr($value, 3));
				} else {
					return floatval($value);
				}
			case 'ISOSpeedRatings':
				$value = $exif['ISOSpeedRatings'];
				return intval($value);
			case 'DateTimeOriginal':
				return date_parse($exif['DateTimeOriginal']);
			case 'Orientation':
				if (array_key_exists('Orientation', $exif)) {
					switch ($exif['Orientation']) {
						case 3:
							return 180;
						case 6:
							return 90;
						case 8:
							return -90;
						default:
							return 0;
					}
				} else {
					return 0;
				}
		}
	}

	/**
	 * Get this image file's resolution.
	 *
	 * @return array
	 */
	public function getResolution(): ?array {

		// check if file exists
		//
		if (!$this->exists()) {
			return null;
		}

		// find resolution of local image file
		//
		$imageSize = getimagesize($this->rootPath());
		return $imageSize? [$imageSize[0], $imageSize[1]] : null;
	}

	/**
	 * Get an uploaded file's initial metadata.
	 *
	 * @return array
	 */
	public function getNewMetadata(UploadedFile $file): array {
		
		// get image size from file
		//
		$path = $file->getRealPath();
		$imageSize = getimagesize($path);

		// read exif data from file
		//
		if ($this->hasExif()) {
			try {
				$exif = exif_read_data($path);
				Self::utf8_encode_deep($exif);
			} catch (\Exception $e) {
				$exif = null;
			}
		} else {
			$exif = null;
		}
		
		// create metadata
		//
		$metadata = parent::getNewMetadata($file);

		// append resolution attributes
		//
		if ($imageSize) {
			$metadata['resolution'] = $imageSize[0] . 'x' . $imageSize[1];
		}

		// append exif attributes
		//
		if ($exif) {
			foreach (self::EXIF_ATTRS as $key) {
				if (array_key_exists($key, $exif)) {
					$metadata[$key] = $exif[$key];
				}
			}
		}

		return $metadata;
	}

	/**
	 * Get this item's metadata exif info.
	 *
	 * @return array
	 */
	public function getMetadataExif() {
		$metadata = $this->getMetadataValue('metadata');

		// check if metadata exists
		//
		if (!$metadata) {
			return null;
		}

		// return metadata attribute if it exists
		//
		$exif = [];
		foreach (self::EXIF_ATTRS as $attr) {
			if (array_key_exists(strtolower($attr), $metadata)) {
				$exif[$attr] = $metadata[strtolower($attr)];
			}
		}

		return $exif;
	}
	
	//
	// reading methods
	//

	/**
	 * Get this image file's image.
	 *
	 * @param int $width - the preferred width to resize to.
	 * @param int $height - the preferred height to resize to.
	 * @param int $minSize - the minimum dimension to resize to.
	 * @param int $maxSize - the maximum dimension to reisze to.
	 * @return \Image
	 */
	public function readImage(?int $width = 0, ?int $height = 0, ?int $minSize = 0, ?int $maxSize = 0): Image {

		// create image from file contents
		//
		if ($this->isLocal()) {
			$image = \Image::make($this->rootPath());
		} else {
			$image = \Image::make($this->readContents());
		}

		// reorient image
		//
		$orientation = $image->exif('Orientation');
		switch ($orientation) {

			case 6: 

				// rotate 90 degrees CW
				//
				$image->rotate(-90);
				break;

			case 8: 

				// rotate 90 degrees CCW
				//
				$image->rotate(90);
				break;
		}
		
		// resize image
		//
		if ($width || $height || $minSize || $maxSize) {
			$image = self::resizeImage($image, $width, $height, $minSize, $maxSize);
		}

		// return resized image
		//
		return $image;
	}

	/**
	 * Read this image file's resolution from the file contents.
	 *
	 * @return array
	 */
	public function readResolution(): ?array {

		// check if file exists
		//
		if (!$this->exists()) {
			return null;
		}

		// find resolution of local image file
		//
		$imageSize = getimagesizefromstring($this->readContents());
		return [$imageSize[0], $imageSize[1]];
	}

	/**
	 * Read this image file's svg dimensions.
	 *
	 * @return array
	 */
	public function readDimensions(): ?array {

		// check if file exists
		//
		if (!$this->exists()) {
			return null;
		}

		// check for upper limit on svg size
		//
		if ($this->size > self::MAX_SVG_SIZE) {
			return null;
		}

		// find read image contents
		//
		$contents = $this->readContents();
		if ($contents) {
			$xml = simplexml_load_string($contents);
			if ($xml) {

				// parse resolution from image contents
				//
				$width = explode(':', $xml['width'])[0];
				$height = explode(':', $xml['height'])[0];

				// return width and height
				//
				if ($width || $height) {
					return [
						$width? str_replace('px', '', $width) : 'auto',
						$height? str_replace('px', '', $height) : 'auto'
					];
				}
			}
		}

		return null;
	}

	/**
	 * Read this image file's geocoordinates.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function readGeocoords(): ?array {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exits
			//
			if (!$this->exists()) {
				return null;
			}

			// read geocoordinates of local file
			//
			try {
				$command = config('app.listgeo_path')  . ' ' . $this->rootPath();
				$output = shell_exec($command);
				$lines = explode("\n", $output);
				$attributes = [];
				for ($i = 0; $i < count($lines); $i++) {
					$line = $lines[$i];

					if ($line == 'Corner Coordinates:') {
						return [
							'upper_left' => substr($lines[$i + 1], 45, 28),
							'lower_left' => substr($lines[$i + 2], 45, 28),
							'upper_right' => substr($lines[$i + 3], 45, 28),
							'lower_right' => substr($lines[$i + 4], 45, 28),
							'center' => substr($lines[$i + 5], 45, 28),
						];
					}
				}
				return null;
			} catch (\Exception $e) {
				return null;
			}
		}
	}

	/**
	 * Return this image file's data as a response.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function response(string $responseType = 'jpg') {

		// return image file response
		//
		if ($responseType == 'svg') {
			return response($this->readContents())->header(
				'Content-Type', 'image/svg+xml'
			);
		} else {
			return response($this->readContents())->header(
				'Content-Type', 'image/jpg'
			);
		}
	}

	//
	// static methods
	//

	/**
	 * Find this file's response type from its extension.
	 *
	 * @param string $extension - the file extension.
	 * @return string
	 */
	public static function getResponseType($extension): string {

		// convert image if necessary
		//
		if (in_array($extension, self::RESPONSE_TYPES)) {
			return $extension;
		} else {
			return 'jpg';	
		}
	}

	/**
	 * Find if a path is valid for image files.
	 *
	 * @param string $path - the path to validate.
	 * @return bool
	 */
	public static function isValidPath(?string $path): bool {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		return in_array(strtolower($extension), self::EXTENSIONS);
	}

	/**
	 * Encode binary data.
	 *
	 * @param string &$input - the data to encode.
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