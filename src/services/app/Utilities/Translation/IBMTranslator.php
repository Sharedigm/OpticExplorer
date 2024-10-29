<?php
/******************************************************************************\
|                                                                              |
|                               IBMTranslator.php                              |
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

use Illuminate\Support\Facades\Http;

class IBMTranslator extends Translator
{
	//
	// attributes
	//

	public const LANGUAGES = [
		'English', 'French', 'German', 'Spanish', 'Arabic'
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
		return config('services.ibm_translation.enabled') && 
			in_array($fromLangauge, self::LANGUAGES) && 
			in_array($toLangauge, self::LANGUAGES);
	}

	/**
	 * Translate messages from one language to another.
	 *
	 * @param string $messages - the messages to translate.
	 * @param string $fromLanguage - the language to translate from.
	 * @param string $toLanguage - the language to translate to.
	 * @return string[]
	 */
	public static function translate(array $messages, string $fromLanguage, string $toLanguage) {

		// find translation between designated languages
		//
		$translationCode = self::toTranslationCode($fromLanguage, $toLanguage);

		// translate messages using specified translation
		//
		if ($translationCode) {

			// translate messages using api
			//
			$response = Http::withBasicAuth('apikey', config('services.ibm_translation.api_key'))->post(config('services.ibm_translation.api_url'), [
				'model_id' => $translationCode,
				'text' => $messages
			]);

			// return translations
			//
			if (isset($response['translations'])) {
				$translations = [];
				for ($i = 0; $i < count($response['translations']); $i++) {
					array_push($translations, $response['translations'][$i]['translation']);
				}
				return $translations;
			}
		}

		// no translation found, return original messages
		//
		return $messages;
	}

	//
	// private static methods
	//

	/**
	 * Get the language code for a particular language.
	 *
	 * @param string $language - the language to get the code for.
	 * @return string
	 */
	private static function toLanguageCode(string $language): string {
		switch ($language) {
			case 'English':
				return 'en';
			case 'French':
				return 'fr';
			case 'German':
				return 'de';
			case 'Spanish':
				return 'es';
			case 'Arabic':
				return 'ar';
			default:
				return null;
		}
	}

	/**
	 * Get the translation code for a particular pair of languages.
	 *
	 * @param string $fromLanguage - the language to translate from.
	 * @param string $toLanguage - the language to translate to.
	 * @return string
	 */
	private static function toTranslationCode(string $fromLanguage, string $toLanguage): string {
		$fromLanguageCode = self::toLanguageCode($fromLanguage);
		$toLanguageCode = self::toLanguageCode($toLanguage);
		if ($fromLanguageCode && $toLanguageCode) {
			return $fromLanguageCode . '-' . $toLanguageCode;
		}
	}
}