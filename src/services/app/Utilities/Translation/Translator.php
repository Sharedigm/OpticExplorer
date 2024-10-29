<?php
/******************************************************************************\
|                                                                              |
|                                Translator.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for performing language translation.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Translation;

abstract class Translator
{
	//
	// attributes
	//

	public static $languages = [];

	//
	// methods
	//

	/**
	 * Translate messages from one language to another.
	 *
	 * @param string $messages - the messages to translate.
	 * @param string $fromLanguage - the source language.
	 * @param string $toLanguage - the target language.
	 * @return string[]
	 */
	abstract public static function translate(array $messages, string $fromLanguage, string $toLanguage);
}