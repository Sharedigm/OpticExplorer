<?php
/******************************************************************************\
|                                                                              |
|                                  PdfFile.php                                 |
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

use App\Models\Storage\File;
use Spatie\PdfToText\Pdf;

class PdfFile extends File
{
	//
	// constants
	//

	public const EXTENSIONS = [
		'pdf'
	];

	//
	// getting methods
	//

	/**
	 * Get this pdf file's text.
	 *
	 * @return string
	 */
	public function toText() {
		$text = (new Pdf(config('app.pdftotext_path')))
			->setPdf($this->rootPath())
			->text();
		return $text;
	}
}