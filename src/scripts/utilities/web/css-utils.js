/******************************************************************************\
|                                                                              |
|                                 css-utils.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a set of utilities for handling cascading style sheets.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../scripting/string-utils.js';

// globals
//
let loaded = {};

export default {

	//
	// querying methods
	//

	hasClass: function(element, className) {
		let $className = $(element).attr('class');
		return $className && $className.contains(className);
	},

	//
	// getting methods
	//

	getProperty: function(property, className) {

		// create temporary element
		//
		let $inspector = $("<div>").css('display', 'none').addClass(className);

		// add to DOM, in order to read the CSS property
		//
		$("body").append($inspector);

		// read css value
		//
		try {
			return $inspector.css(property);
		} finally {

			// remove from DOM
			//
			$inspector.remove(); 
		}
	},

	getStyleSheet: function(href) {
		for (let i = 0; i < document.styleSheets.length; i++) {
			let sheet = document.styleSheets[i];
			if (sheet.href == window.location.origin + window.location.pathname + href) {
				return sheet;
			}
		}
	},

	//
	// setting methods
	//

	addCssRule: function(selector, attributes) {

		// create new rule
		//
		let style = document.createElement("style");
		style.type = 'text/css';
		let html = selector + ' {';
		for (let key in attributes) {
			let value = attributes[key];
			html += key + ':' + value + ';';
		}
		html += '}';
		style.innerHTML = html;

		// append rule to document
		//
		let head = document.getElementsByTagName("head")[0];
		if (head) {
			head.appendChild(style);
		}
		
		return style;
	},

	addCssRules: function(cssRules) {
		let keys = Object.keys(cssRules);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = cssRules[key];
			this.addCssRule(key, value);
		}
	},

	//
	// loading methods
	//

	load: function(attributes, callback) {
		if (!attributes.href) {
			return;
		}

		// check if css file is already loaded
		//
		if (loaded[attributes.href]) {

			// perform callback
			//
			if (callback) {
				callback();
			}
			return;
		}

		// mark css as loaded
		//
		loaded[attributes.href] = true;

		// create new link element
		//
		let element = document.getElementById(attributes.id);
		if (!element) {
			let link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			for (let key in attributes) {
				link.setAttribute(key, attributes[key]);
			}
			link.onload = callback;

			// append link element to document
			//
			let head = document.getElementsByTagName("head")[0];
			if (head) {
				head.appendChild(link);
			}
		}
	},

	apply: function(element, styles) {

		// remove comments from styles
		//
		styles = this.removeComments(styles);

		// remove line breaks from styles
		//
		styles = styles.replace(/(\r\n|\n|\r)/gm,"");

		// create styles
		//
		let style = document.createElement('style');
		style.textContent = styles;

		// apply styles
		//
		element.appendChild(style);
	},

	//
	// adding methods
	//

	addClass: function(element, className) {
		let $element = $(element);
		let $className = $element.attr('class');

		if ($className) {
			if (!$className.contains(className)) {

				// add new class name
				//
				$element.attr('class', $className + ' ' + className);
			}
		} else {

			// set class name to new class name
			//
			$element.attr('class', className);
		}
	},
	
	//
	// removing methods
	//

	removeClass: function(element, className) {
		let $element = $(element);
		let $className = $element.attr('class');

		if ($className) {
			if ($className.contains(className)) {

				// remove non-first instances of class name
				//
				$className = $className.replace(' ' + className, '');

				// remove first instances of class name
				//
				$className = $className.replace(className, '');

				// replace class
				//
				$element.attr('class', $className);
			}
		}
	},

	removeHoverStyles: function(sheet) {

		// check if style sheet is empty
		//
		if (!sheet.cssRules) {
			return;
		}

		for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
			let rule = sheet.cssRules[i];

			// remove css rule
			//
			if (rule.type === CSSRule.STYLE_RULE && 
				rule.selectorText.contains(':hover')) {
				sheet.deleteRule(i);
			}
		}	
	},

	removeAllHoverStyles: function() {
		for (let i = 0; i < document.styleSheets.length; i++) {
			let sheet = document.styleSheets[i];
			this.removeHoverStyles(sheet);
		}
	},

	/* 
		This function is loosely based on the one found here:
		http://www.weanswer.it/blog/optimize-css-javascript-remove-comments-php/
	*/

	removeComments: function(str) {
		str = ('__' + str + '__').split('');
		let mode = {
			singleQuote: false,
			doubleQuote: false,
			regex: false,
			blockComment: false,
			lineComment: false,
			condComp: false 
		};
		for (let i = 0, l = str.length; i < l; i++) {

			if (mode.regex) {
				if (str[i] === '/' && str[i-1] !== '\\') {
					mode.regex = false;
				}
				continue;
			}

			if (mode.singleQuote) {
				if (str[i] === "'" && str[i-1] !== '\\') {
					mode.singleQuote = false;
				}
				continue;
			}

			if (mode.doubleQuote) {
				if (str[i] === '"' && str[i-1] !== '\\') {
					mode.doubleQuote = false;
				}
				continue;
			}

			if (mode.blockComment) {
				if (str[i] === '*' && str[i+1] === '/') {
					str[i+1] = '';
					mode.blockComment = false;
				}
				str[i] = '';
				continue;
			}

			if (mode.lineComment) {
				if (str[i+1] === 'n' || str[i+1] === 'r') {
					mode.lineComment = false;
				}
				str[i] = '';
				continue;
			}

			if (mode.condComp) {
				if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
					mode.condComp = false;
				}
				continue;
			}

			mode.doubleQuote = str[i] === '"';
			mode.singleQuote = str[i] === "'";

			if (str[i] === '/') {
				if (str[i+1] === '*' && str[i+2] === '@') {
					mode.condComp = true;
					continue;
				}
				if (str[i+1] === '*') {
					str[i] = '';
					mode.blockComment = true;
					continue;
				}
				if (str[i+1] === '/') {
					str[i] = '';
					mode.lineComment = true;
					continue;
				}
				mode.regex = true;
			}

		}
		return str.join('').slice(2, -2);
	},

	//
	// parsing methods
	//

	parse: function(string) {
		let array = {};
		let pairs = string.split(';');
		for (let i = 0; i < pairs.length; i++) {
			let pair = pairs[i].split(':');
			let key = pair[0];
			let value = pair[1];
			array[key] = value;
		}
		return array;
	},

	parseTransforms: function(string) {
		let transforms = {};
		for (let i in string = string.match(/(\w+\((-?\d+.?\d*e?-?\d*,?)+\))+/g)) {
			let parameters = string[i].match(/[\w.-]+/g);

			// first parameter is transform
			//
			parameters.shift();

			// convert parameters to numbers
			//
			for (let i = 0; i < parameters.length; i++) {
				parameters[i] = parseFloat(parameters[i]);
			}
		}
		return transforms;
	}
};