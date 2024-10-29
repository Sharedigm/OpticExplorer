<?php
/******************************************************************************\
|                                                                              |
|                            ThumbnailViewable.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait for items containing other items.                |
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

use Intervention\Image\Image;
use Illuminate\Support\Collection;
use App\Models\Storage\Media\ImageFile;
use App\Models\Storage\Directory;
use App\Utilities\Strings\StringUtils;
use App\Utilities\Storage\FileStorage;

trait ThumbnailViewable
{
	/**
	 * Get this file's thumbnail directory path.
	 *
	 * @return string
	 */
	public function getThumbdir($thumbDir = self::THUMBDIR): string {
		$dirname = dirname($this->path);
		return $dirname == '.'? $thumbDir : $dirname . '/' . $thumbDir;
	}

	/**
	 * Get this file's thumbnail image file name.
	 *
	 * @param string $suffix - a string to append to the thumbnail's file name before the file extension
	 * @return string
	 */
	public function getThumbname(string $suffix = ''): string {
		$filename = basename($this->getPath());
		$basename = pathinfo($filename, PATHINFO_FILENAME);
		$extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

		// determine extension to use
		//
		if ($extension != 'jpg' && $extension != 'png' && $extension != 'gif') {
			if ($extension != '') {
				$extension .= '.jpg';
			} else {
				$extension = 'jpg';
			}
		}

		return $basename . $suffix . '.' . $extension;
	}

	/**
	 * Get this file's thumbnail image path.
	 *
	 * @param string $suffix - a string to append to the thumbnail's file name before the file extension
	 * @return string
	 */
	public function getThumbPath(string $suffix = ''): string {
		$thumbdir = $this->getThumbdir();
		$thumbname = $this->getThumbname($suffix);
		return $thumbdir . $thumbname;
	}

	/**
	 * Get this file's thumbnail image.
	 *
	 * @param int $minSize - the minimum size of the thumbnail image.
	 * @param int $maxSize - the maximum size of the thumbnail image.
	 * @return Image
	 */
	public function getThumbImage(?int $minSize, ?int $maxSize): ?Image {

		// create image thumbnail
		//
		if ($this instanceof ImageFile) {
			$image = $this->readImage();

		// create pdf thumbnail
		//
		} else if (strtolower($this->getExtension()) == 'pdf') {
			$image = $this->getPdfThumbImage($minSize, $maxSize);

		// create file thumbnail
		//
		} else if ($this->isLocal()) {
			$image = \Image::make($this->rootPath());
		}

		// resize image to thumbnail size
		//
		return $this->resizeImage($image, 0, 0, $minSize, $maxSize);
	}

	/**
	 * Get this pdf file's thumbnail image.
	 *
	 * @param int $minSize - the minimum size of the thumbnail image.
	 * @param int $maxSize - the maximum size of the thumbnail image.
	 * @return Image
	 */
	public function getPdfThumbImage(?int $minSize, ?int $maxSize): ?Image {

		if ($this->isLocal()) {

			// create image from file
			//
			$imagick = new \Imagick($this->rootPath() . '[0]');
		} else {

			// read image data
			//
			$data = $this->readContents();

			// write image data to file
			//
			$filepath = FileStorage::temp() . '/' . basename($this->path);
			file_put_contents($filepath, $data);

			// create image from temp file
			//
			$imagick = new \Imagick($filepath . '[0]');

			// remove temp file
			//
			unlink($filepath);	
		}

		// go to first page
		//
		$imagick->setIteratorIndex(0);

		// set image format
		//
		$imagick->setImageFormat('jpg');

		// set image quality
		//
		$imagick->setImageCompressionQuality(0);

		// disable transparent backgrounds
		//
		$imagick->setImageAlphaChannel(\Imagick::VIRTUALPIXELMETHOD_WHITE);

		// set background color
		//
		$imagick->setImageBackgroundColor('#ffffff');

		// set image size
		//
		if ($maxSize) {
			$imagick->scaleImage(0, $maxSize); 
		}

		// rasterize image
		//
		return \Image::make($imagick->getImageBlob());
	}

	/**
	 * Get this file's thumbnail image.
	 *
	 * @param int $minSize - the minimum size of the thumbnail image
	 * @param int $maxSize - the maximum size of the thumbnail image
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getThumbnail(?int $minSize, ?int $maxSize, int $quality = 75) {

		// svg files need no resizing for thumbnails
		//
		if ($this->getExtension() == 'svg') {
			return $this->response('svg');
		}

		// use pngs or jpgs for thumbnails
		//
		$extension = $this->getExtension();
		if ($extension != 'png') {
			$extension = 'jpg';
		}
			
		// create thumbnail suffix
		//
		if (!$minSize && !$maxSize) {
			$maxSize = 100;
		}
		if ($minSize) {
			$suffix = '(min=' . $minSize . ')';
		} else if ($maxSize) {
			$suffix = '(max=' . $maxSize . ')';
		}

		// create thumbnail file object
		//
		$thumbnail = new ImageFile([
			'path' => $this->getThumbPath($suffix),
			'volume' => $this->volume,
			'link_id' => $this->link_id,
			'share_id' => $this->share_id
		]);
		if ($this->share) {
			$thumbnail->copyShare($this);
		}

		// check if thumbnail file already exists
		//
		if ($thumbnail->exists()) {
			return $thumbnail->response($extension);
		}

		// create thumbnail image
		//
		$image = $this->getThumbImage($minSize, $maxSize);
		
		// save thumbnail
		//
		if (!$this->link_id && !StringUtils::contains($this->path, self::THUMBDIR)) {

			// create thumbnail directory
			//
			$directory = new Directory([
				'path' => $this->getThumbdir(),
				'volume' => $this->volume,
				'link_id' => $this->link_id,
				'share_id' => $this->share_id
			]);

			if ($this->share) {
				$directory->copyShare($this);
			}
			if (!$directory->exists()) {
				if (!$directory->make()) {
					return response("Unable to create thumbnail directory " . '"' . $directory->path . '".', 500);
				}
			}

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return response("Storage not found.", 404);
			}

			// save thumbnail image
			//
			$storage->write($thumbnail->getPath(), (string)$image->encode($extension, $quality));
		}

		// return image
		//
		return $image->response($extension);
	}

	/**
	 * Delete this file's thumbnail image.
	 *
	 * @param int $minSize - the minimum size of the thumbnail image
	 * @param int $maxSize - the maximum size of the thumbnail image
	 * @return App\Models\Storage\Media\ImageFile
	 */
	public function deleteThumbnail(?int $minSize, ?int $maxSize) {

		// create thumbnail suffix
		//
		if (!$minSize && !$maxSize) {
			$maxSize = 100;
		}
		if ($minSize) {
			$suffix = '(min=' . $minSize . ')';
		} else if ($maxSize) {
			$suffix = '(max=' . $maxSize . ')';
		}

		// create thumbnail file object
		//
		$thumbnail = new ImageFile([
			'path' => $this->getThumbPath($suffix),
		]);
		if ($this->share) {
			$thumbnail->copyShare($this);
		}

		// delete thumbnail, if it exists
		//
		if ($thumbnail->exists()) {
			return $thumbnail->delete();
		}
	}

	/**
	 * Delete this file's thumbnail images.
	 *
	 * @return App\Models\Storage\Media\ImageFile[]
	 */
	public function deleteThumbnails() {
		return [
			$this->deleteThumbnail(75, 75),
			$this->deleteThumbnail(100, 100),
			$this->deleteThumbnail(150, 150)
		];
	}

	/**
	 * Resize an image.
	 *
	 * @param Image $image - the image to resize.
	 * @param int $width - the preferred with to resize to.
	 * @param int $height - the preferred height to resize to.
	 * @param int $minSize - the minimum dimension to resize to.
	 * @param int $maxSize - the maximum dimension to resize to.
	 * @return \Image
	 */
	protected static function resizeImage(Image $image, ?int $width, ?int $height, ?int $minSize = null, ?int $maxSize = null) {
		if ($width && !$height) {

			// resize to width preserving aspect ratio
			//
			$image->resize($width, null, function ($constraint) {
				$constraint->aspectRatio();
			});
		} else if ($height && !$width) {

			// resize to width preserving aspect ratio
			//
			$image->resize($maxSize, null, function ($constraint) {
				$constraint->aspectRatio();
			});
		} else if ($width && !$height) {
		
			// resize to width and height not preserving aspect ratio
			//
			$image->resize($width, null, function ($constraint) {
				$constraint->aspectRatio();
			});	
		} else if ($maxSize) {

			// resize to max of width and height
			//
			if ($image->width() > $image->height()) {

				// resize to width preserving aspect ratio
				//
				$image->resize($maxSize, null, function ($constraint) {
					$constraint->aspectRatio();
				});
			} else {

				// resize to height preserving aspect ratio
				//
				$image->resize(null, $maxSize, function ($constraint) {
					$constraint->aspectRatio();
				});
			}
		} else if ($minSize) {

			// resize to min of width and height
			//
			if ($image->width() < $image->height()) {

				// resize to width preserving aspect ratio
				//
				$image->resize($minSize, null, function ($constraint) {
					$constraint->aspectRatio();
				});
			} else {

				// resize to height preserving aspect ratio
				//
				$image->resize(null, $minSize, function ($constraint) {
					$constraint->aspectRatio();
				});
			}
		}

		return $image;
	}
}