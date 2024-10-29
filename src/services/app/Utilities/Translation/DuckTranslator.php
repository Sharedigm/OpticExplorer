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

class DuckTranslator extends Translator
{
	//
	// attributes
	//

	public const LANGUAGES = [
		'English', 'French', 'German', 'Spanish', 'Arabic', 'Duck'
	];

	//
	// public static methods
	//

	/**
	 * Find if we can translate from and to specific languages.
	 *
	 * @param string $fromLanguage - the language to translate from.
	 * @param string $toLanguage - the language to translate to.
	 * @return bool
	 */
	public static function canTranslate(string $fromLangauge, string $toLangauge) {
		return in_array($fromLangauge, self::LANGUAGES) && 
			in_array($toLangauge, self::LANGUAGES);
	}

	/**
	 * Translate messages from one language to another.
	 *
	 * @param string $messages - the messages to translate.
	 * @param string $fromLanguage - the source language.
	 * @param string $toLanguage - the target language.
	 * @return string[]
	 */
	public static function translate(array $messages, string $fromLanguage, string $toLanguage): array {
		for ($i = 0; $i < count($messages); $i++) {
			$messages[$i] = self::toDuck($messages[$i]);
		}
		return $messages;
	}

	//
	// private static methods
	//

	/**
	 * Translate a single messages to Duck language.
	 *
	 * @param string $message - the message to translate.
	 * @return string
	 */
	private static function toDuck($message) {
		$words = explode(' ', $message);
		for ($j = 0; $j < count($words); $j++) {
			$words[$j] = 'quack';
		}
		return implode(' ', $words);
	}
}