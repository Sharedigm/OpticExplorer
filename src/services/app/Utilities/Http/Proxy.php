<?php
/******************************************************************************\
|                                                                              |
|                                  Proxy.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for some proxy server operations.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Http;

use App\Utilities\Strings\StringUtils;

class Proxy
{
private static $beforeScript = <<<'EOD'
(function() {
	var proxied = window.XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function() {
		console.log(arguments);
		return proxied.apply(this, [].slice.call(arguments));
	};
})();
EOD;

private static $afterScript = <<<'EOD'
var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++) {
	var form = forms[i];
	if (form.action) {
		queryString = form.action.split('?')[1];
		//form.action = 'http://www.abemegahed.com/' + (queryString || '');
		form.actionUrl = form.action;
		var newUrl = 'http://localhost/sharedigm-server/public/api/proxy?url=' + encodeURI(form.actionUrl);
		//form.action = 'javascript:alert("action = " + form.actionUrl)';
		//form.action = 'javascript:alert("action = " + newUrl)';
		form.action = newUrl;
	}
}
EOD;

	private static function getBeforeScript($home) {
		return str_replace('$HOME', $home, self::$beforeScript);
	}

	private static function getAfterScript($home) {
		return str_replace('$HOME', $home, self::$afterScript);
	}

	private static function nonRelativeUrl($url, $home) {

		// add home url prefix
		//
		if (!StringUtils::startsWith($url, 'http') &&
			!StringUtils::startsWith($url, 'www')) {

			if (StringUtils::startsWith($url, '//')) {
				$url = 'http' . $url;
			} else if (StringUtils::startsWith($url, '/')) {
				$url = $home . $url;
			} else {
				$url = $home . '/' . $url;
			}
		}

		return $url;
	}

	public static function rewriteUrl($url, $home) {

		// strip off ./ prefix
		//
		/*
		if (!StringUtils::startsWith($url, './')) {
			$url = substr($url, 1);
		}
		*/

		if (StringUtils::startsWith($url, '/')) {
			return $home . $url;
		}

		if (StringUtils::startsWith($url, '//')) {
			return 'http:' . $url;
		}

		// check if url already starts with app url
		//
		if (StringUtils::startsWith($url, config('app.url'))) {
			return $url;
		}

		// make sure url is not relative
		//
		$url = self::nonRelativeUrl($url, $home);

		// add proxy url
		//
		return config('app.url') . '/public/api/proxy?url=' . urlencode($url);
	}

	public static function rewriteJS($script, $home) {
		$script = str_replace('url:"//', 'url:"' . $home . '/', $script);
		return $script;
	}

	public static function rewriteHtml($html, $home) {
		$dom = new \DOMDocument();
		$dom->encoding = 'utf-8';
		$dom->recover = true;
		$html = str_replace('&nbsp;', '@nbsp;', $html);
		$html = str_replace('url:"//', 'url:"http://', $html);
		$html = str_replace('url(/', 'url(' . $home . '/', $html);
		$html = str_replace('window.location.href', '"' . $home . '"' . ' + window.location.search', $html);
		$html = str_replace('action="/', 'action="' . $home . '/', $html);
		//$html = str_replace('action="/', 'action="'.self::rewriteUrl('/', $home), $html);
		@$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));

		// proxy hyperlinks
		//
		$links = $dom->getElementsByTagName('a');
		foreach ($links as $link) {
			$href = $link->getAttribute('href');
			if ($href) {
				$href = str_replace('/url?q=', '', $href);
				$href = substr($href, 0, strpos($href, "&"));
				//$href = self::rewriteUrl($href, $home);
				$link->setAttribute('href', $href);
				$link->setAttribute('target', '_blank');
			}
		}

		// proxy images
		//
		$images = $dom->getElementsByTagName('img');
		foreach ($images as $image) {
			$src = $image->getAttribute('src');
			if ($src) {
				$src = self::rewriteUrl($src, $home);
				$image->setAttribute('src', $src);
			}
		}

		// proxy style sheet links
		//
		$links = $dom->getElementsByTagName('link');
		foreach ($links as $link) {
			$href = $link->getAttribute('href');
			if ($href) {
				$href = self::rewriteUrl($href, $home);
				$link->setAttribute('href', $href);
			}
		}

		// proxy script links
		//
		$scripts = $dom->getElementsByTagName('script');
		foreach ($scripts as $script) {
			$src = $script->getAttribute('src');
			if ($src) {
				$src = self::rewriteUrl($src, $home);
				$script->setAttribute('src', $src);
			}
		}

		// insert before script element
		//
		$script = $dom->createElement('script', self::getBeforeScript($home));
		$script->setAttribute('type', 'text/javascript');
		$head = $dom->getElementsByTagName('head')->item(0);
		$head->insertBefore($script, $head->firstChild);

		// insert after script element
		//
		$script = $dom->createElement('script', self::getAfterScript($home));
		$script->setAttribute('type', 'text/javascript');
		$body = $dom->getElementsByTagName('body')->item(0);
		$body->appendChild($script);

		$html = $dom->saveHTML();
		$html = str_replace('@nbsp;', '&nbsp;', $html);
		return $html;
	}
}