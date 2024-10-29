/******************************************************************************\
|                                                                              |
|                            editable-code-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and editing source code.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CodeView from '../../../../../views/apps/code-editor/mainbar/code/code-view.js';

export default CodeView.extend({

	//
	// attributes
	//

	readOnly: false,

	//
	// tab converting methods
	//

	tabify: function() {
		Promise.all([
			import('../../../../../../vendor/ace/ext-whitespace.js'), 
		]).then(([Whitespace]) => {
			Whitespace.default.convertIndentation(this.editor.session, '\t');
		});
	},

	untabify: function() {
		Promise.all([
			import('../../../../../../vendor/ace/ext-whitespace.js'), 
		]).then(([Whitespace]) => {
			Whitespace.default.convertIndentation(this.editor.session, ' ');
		});
	},

	//
	// editing methods
	//

	undo: function() {
		this.editor.undo();
	},

	redo: function() {
		this.editor.redo();
	},

	cut: function() {
		let text = this.editor.getCopyText();
		this.editor.remove(this.editor.selection);
		return text;
	},

	copy: function() {
		return this.editor.getCopyText();
	},

	paste: function(text) {
		return this.editor.insert(text);
	},

	//
	// indenting methods
	//

	indent: function() {
		let range = this.getSelectedRange();
		this.editor.session.indentRows(range.start.row, range.end.row, '\t');
	},

	outdent: function() {
		let range = this.getSelectedRange();
		this.editor.session.outdentRows(range);
	},

	//
	// finding / replacing methods
	//

	replace: function(replacement) {
		let range = this.editor.selection.getRange();
		if (!range.isEmpty()) {
			this.editor.session.replace(range, replacement);
		}
	},

	findReplace: function(replacement, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// perform find
		//
		return this.editor.replace(replacement, {
			needle: options.needle,
			backwards: options.backwards != undefined? options.backwards : false,
			wrap: options.wrap != undefined? options.wrap : true,
			caseSensitive: options.caseSensitive != undefined? options.caseSensitive : false,
			wholeWord: options.wholeWord != undefined? options.wholeWord : false,
			regExp: options.regExp != undefined? options.regExp : false,
			start: options.start != undefined? options.start : this.editor.selection.getCursor(),
			preventScroll: options.preventScroll != undefined? options.preventScroll : false
		});
	},

	replaceAll: function(replacement, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// perform find
		//
		return this.editor.replaceAll(replacement, {
			needle: options.needle,
			backwards: options.backwards != undefined? options.backwards : false,
			wrap: options.wrap != undefined? options.wrap : true,
			caseSensitive: options.caseSensitive != undefined? options.caseSensitive : false,
			wholeWord: options.wholeWord != undefined? options.wholeWord : false,
			regExp: options.regExp != undefined? options.regExp : false,
			start: options.start != undefined? options.start : this.editor.selection.getCursor(),
			preventScroll: options.preventScroll != undefined? options.preventScroll : false
		});
	}
});