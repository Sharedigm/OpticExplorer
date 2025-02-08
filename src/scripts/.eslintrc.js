module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"rules": {
	},
	"globals": {
		"_": "readonly",
		"$": "readonly",
		"config": "writable",
		"application": "writable",
		"module": "readonly",
		"template": "readonly",
		"require": "readonly",
		"Backbone": "readonly",
		"Marionette": "readonly",
		"Clipboard": "readonly",
		"Flickity": "readonly",
		"Split": "readonly",
		"dateFormat": "readonly",
		"ace": "readonly",
		"gapi": "readonly",
		"google": "readonly",
		"PDFJS": "readonly",
		"MIDI": "readonly",
		"ABCJS": "readonly",
		"Stripe": "readonly",
		"jsSHA": "readonly",
		"Dropbox": "readonly",
		"MathJax": "readonly"
	}
}