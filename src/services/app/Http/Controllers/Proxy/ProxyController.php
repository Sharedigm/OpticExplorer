<?php
/******************************************************************************\
|                                                                              |
|                              ProxyController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for fetching web data through a proxy.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Proxy;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\Controller;
use App\Utilities\Strings\StringUtils;
use App\Utilities\Http\Proxy;

class ProxyController extends Controller
{
	const USE_CURL = true;

	//
	// querying methods
	//

	/**
	 * Get web content by url.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getUrlSource(Request $request) {

		$url = $request->input('url');
		if (!$url) {
			return;
		}
		
		/*
		if (!StringUtils::startsWith($url, 'http')) {
			$url = 'http://' . $url;
		}
		*/
		
		if (self::USE_CURL) {
			@$contents = trim($this->curl($url, $header));
		} else {
			@$contents = trim(file_get_contents($url));
		}

		return $contents;
	}

	/**
	 * Get web content by url.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getUrl(Request $request) {
		$url = $request->input('url');
		if (!$url) {
			return;
		}
		
		/*
		if (!StringUtils::startsWith($url, 'http')) {
			$url = 'http://' . $url;
		}
		*/
		
		if (self::USE_CURL) {
			@$contents = trim($this->curl($url, $header));
			$header = $this->trimArray(explode("\n", $header));
		} else {
			$context = stream_context_create([
				'http' => [
					'header' => 'User-Agent:' . $_SERVER['HTTP_USER_AGENT']
				]
			]);
			@$contents = trim(file_get_contents($url, false, $context));
			$header = $http_response_header;	
		}

		/*
		if ($contents === false) {
			return response("File not found.", 404);
		}
		*/

		/*
		if (StringUtils::startsWith($contents, '<html') ||
			StringUtils::startsWith($contents, '<HTML') ||
			StringUtils::startsWith($contents, '<!doctype') ||
			StringUtils::startsWith($contents, '<!DOCTYPE')) {

			// html
			//
			$contents = Proxy::rewriteHtml($contents, $url);
		}
		*/

		// replace references to url
		//
		/*
		$contents = str_replace($url, config('app.url') . '/public/api/proxy?url=' . $url, $contents);
		*/

		// create response
		//
		$response = response($contents);
		/*
		if ($header) {
			$this->addResponseHeaders($response, $header);
		}
		*/
		return $response;
	}

	/**
	 * Get http headers by url.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return string[]
	 */
	public function getUrlHeaders(Request $request) {

		// get parameters
		//
		$url = $request->input('url');

		// add implicit protocol
		//
		if (!StringUtils::startsWith($url, 'http')) {
			$url = 'http://' . $url;
		}

		// use http for headers
		//
		if (StringUtils::startsWith($url, 'https')) {
			$url = 'http' . substr($url, 5);
		}

		// check for response headers from url
		//
		@$contents = file_get_contents($url);
		if (isset($http_response_header)) {
			return $http_response_header;
		} else {
			return response("No response headers from " . $url, 404);
		}
	}

	//
	// private methods
	//

	/**
	 * Get web content by url using curl.
	 *
	 * @param string $url - the url to get content from
	 * @param Object $header - the headers from this url
	 * @return string
	 */
	private function curl(string $url, &$header) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);

		// $proxy = 'http://proxy.company.com:8080';
		// $proxyauth = 'domain\proxy_username:proxy_password';
		// curl_setopt($ch, CURLOPT_PROXY, $proxy);
		// curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);

		curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		$data = curl_exec($ch);

		// separate header and body data
		//
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$header = substr($data, 0, $header_size);
		$data = substr($data, $header_size);

		curl_close($ch);
		return $data;
	}

	/**
	 * Add headers to response.
	 *
	 * @param Object $response - the Http response object
	 * @param Object $header - the header to add
	 * @return void
	 */
	private function addResponseHeaders($response, $header) {
		$pairs = $this->headerToPairs($header);
		
		// set response headers
		//
		foreach ($pairs as $pair) {
			if (count($pair) == 2) {
				$key = $pair[0];
				$value = $pair[1];

				if ($key != 'X-Frame-Options' &&
					$key != 'Content-Security-Policy' && 
					$key != 'X-XSS-Protection' &&
					$key != 'Content-Length' &&
					$key != 'Transfer-Encoding') {
					$response->header($key, $value);
				}
			}
		}

		$response->header('X-Frame-Options', 'ALLOW-FROM ' . config('app.url'));
		$response->header('Content-Location', config('app.url'));
	}

	/**
	 * Trim the whitespace from an array of strings.
	 *
	 * @param string[] $array - the array of strings to trim
	 * @return string[]
	 */
	private function trimArray($array) {
		$trimmed = [];
		for ($i = 0; $i < sizeof($array); $i++) {
			$str = trim($array[$i]);
			if ($str && $str != '' && $str != ' ') {
				array_push($trimmed, $str);
			}
		}
		return $trimmed;
	}

	/**
	 * Convert a header to key value pairs.
	 *
	 * @param string[] $header - the header to convert
	 * @return string[][]
	 */
	private function headerToPairs($header) {
		$pairs = [];
		$count = 0;
		foreach ($header as $string) {
			if ($count == 0) {
				$pair = preg_split('/ /', $string, 2);
			} else {
				$pair = preg_split('/:/', $string, 2);
				if ($pair && sizeof($pair) > 1) {
					$pair[0] = trim($pair[0]);
					$pair[1] = trim($pair[1]);
				}
			}
			array_push($pairs, $pair);
			$count++;
		}
		return $pairs;
	}
}
