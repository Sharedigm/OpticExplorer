<?php
/******************************************************************************\
|                                                                              |
|                               Translation.php                                |
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

use App\Utilities\Translation\Translator;
use App\Utilities\Translation\DuckTranslator;
use App\Utilities\Translation\IBMTranslator;

class Translation
{
	//
	// attributes
	//

	public const LANGUAGES = [
		'English', 'French', 'German', 'Spanish', 'Arabic'
	];

	//
	// static methods
	//

	/**
	 * Translate messages from one language to another.
	 *
	 * @param string $messages - the messages to translate.
	 * @param string $fromLanguage - the source language.
	 * @param string $toLanguage - the target language.
	 * @return string[]
	 */
	public static function translate(array $messages, string $fromLanguage, string $toLanguage) {

		// no translation required
		//
		if ($fromLanguage == $toLanguage) {
			return $messages;

		// translate using IBM translator
		//
		} else if (IBMTranslator::canTranslate($fromLanguage, $toLanguage)) {
			return IBMTranslator::translate($messages, $fromLanguage, $toLanguage);

		// translate using Duck translator
		//
		} else if (DuckTranslator::canTranslate($fromLanguage, $toLanguage)) {
			return DuckTranslator::translate($messages, $fromLanguage, $toLanguage);
		}

		return $messages;
	}
}