/******************************************************************************\
|                                                                              |
|                             editable-text-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for creating editable text regions.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import Chars from '../../../../utilities/scripting/chars.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'textarea',
	template: template(`
	`),

	events: {
		'input': 'onInput',
		'mouseup': 'onMouseUp'
	},

	//
	// querying methods
	//

	hasSelected: function() {
		return this.el.selectionStart != this.el.selectionEnd;
	},

	//
	// counting methods
	//

	numLines: function() {
		let numLines = 1;
		for (let i = 0; i < this.el.value.length; i++) {
			if (this.el.value[i] == Chars.carriageReturn) {
				numLines++;
			}
		}
		return numLines;
	},

	//
	// getting methods
	//

	get: function() {
		return this.el.value;
	},

	getSelected: function() {
		return (this.el.value).substring(this.el.selectionStart, this.el.selectionEnd);
	},

	getLineNumber: function() {
		let position = this.el.selectionStart;
		let line = 1;
		for (let i = 0; i < position; i++) {
			if (this.el.value[i] == Chars.carriageReturn) {
				line++;
			}
		}
		
		return line;
	},

	getCursor: function() {
		let position = this.el.selectionStart;
		let line = 1;
		let lineStart = 0;
		for (let i = 0; i < position; i++) {
			if (this.el.value[i] == Chars.carriageReturn) {
				line++;
				lineStart = i;
			}
		}

		return {
			row: line,
			column: position - lineStart + 1
		};
	},

	getLineStart: function(line) {
		let start = 0;
		let position = start;
		for (let i = 1; i < line; i++) {
			while (this.el.value[position] != Chars.carriageReturn && 
				position < this.el.value.length) {
				position++;
			}
			position++;
			start = position;	
		}
		return start;
	},

	getLineEnd: function(line) {
		let position = 1;
		for (let i = 1; i <= line; i++) {
			while (this.el.value[position] != Chars.carriageReturn && 
				position < this.el.value.length) {
				position++;
			}
			position++;
		}
		return position;
	},

	//
	// setting methods
	//

	set: function(text) {

		// set text contents
		//
		if (text) {
			this.el.value = text;
		} else {
			this.el.value = '';
		}
	},

	setOption: function(key, value) {
		switch (key) {
			case 'background_color':
				this.$el.css('background-color', value || '');
				break;
			case 'font':
				this.loadFont(value);
				this.$el.css('font-family', value);
				break;
			case 'font_size':
				this.$el.css('font-size', value);
				break;
		}
	},

	setCursorPosition: function(position) {
		/*
		this.el.focus();
		if (this.el.setSelectionRange) {
			this.el.setSelectionRange(position, position);
		} else if (this.el.createTextRange) {
			let range = this.el.createTextRange();
			range.collapse(true);
			if (position < 0) {
				position = this.$el.val().length + position;
			}
			range.moveEnd('character', position);
			range.moveStart('character', position);
			range.select();
		}
		*/

		this.el.setSelectionRange(position, position);
	},

	//
	// loading methods
	//

	loadFont: function(fontName) {
		let font = config.fonts[fontName];

		if (font && font.url) {
			application.loadFont(fontName, font.url);
		}
	},

	//
	// editing methods
	//

	cut: function() {

		// get selection
		//
		let selected = this.getSelected();
		let start = this.el.selectionStart;
		let end = this.el.selectionEnd;

		// update text
		//
		this.el.value = this.el.value.substring(0, start) +
			this.el.value.substring(end, this.el.value.length);

		// update
		//
		this.setCursorPosition(start);
		this.changed = true;

		return selected;
	},

	paste: function(text) {
		if (!text) {
			return;
		}
		
		// get selection
		//
		let start = this.el.selectionStart;
		let end = this.el.selectionEnd;

		// IE support
		//
		if (document.selection) {
			this.el.focus();
			let range = document.selection.createRange();
			range.text = text;
		}

		// Safari, Firefox, etc. 
		//
		else if (start || start == '0') {
			this.el.value = this.el.value.substring(0, start) + 
				text + this.el.value.substring(end, this.el.value.length);
		} else {
			this.el.value += text;
		}

		// update
		//
		this.setCursorPosition(start + text.length);
		this.changed = true;
	},

	//
	// selecting methods
	//

	select: function(which) {
		switch (which) {
			case 'all':
				this.selectAll();
				break;
			case 'none':
				this.selectNone();
				break;
			case 'word':
				this.selectWord();
				break;
			case 'line':
				this.selectLine();
				break;
			case 'paragraph':
				this.selectParagraph();
				break;
			case 'before':
				this.selectBefore();
				break;
			case 'after':
				this.selectAfter();
				break;
		}
	},

	selectAll: function() {
		this.el.select();
	},

	selectNone: function() {
		this.el.selectionStart = 0;
		this.el.selectionEnd = 0;
	},

	selectWord: function() {

		// find start
		//
		let start = this.el.selectionStart;
		while (!Chars.blank.contains(this.el.value[start]) && start > 0) {
			start--;
		}
		if (start > 0) {
			start++;
		}

		// find end
		//
		let end = start;
		while (!Chars.blank.contains(this.el.value[end]) && end < this.el.value.length) {
			end++;
		}

		// select range
		//
		this.el.focus();
		this.el.setSelectionRange(start, end);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	selectLine: function() {

		// find start
		//
		let start = this.el.selectionStart;
		while (this.el.value[start] != Chars.carriageReturn && start > 0) {
			start--;
		}
		if (start > 0) {
			start++;
		}

		// find end
		//
		let end = start;
		while (this.el.value[end] != Chars.carriageReturn && end < this.el.value.length) {
			end++;
		}

		// select range
		//
		this.el.focus();
		this.el.setSelectionRange(start, end);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	selectParagraph: function() {

		// find start
		//
		let start = this.el.selectionStart;
		while ((this.el.value[start] != Chars.carriageReturn || 
			!Chars.blank.contains(this.el.value[start - 1])) && 
			start > 0) {
			start--;
		}
		if (start > 0) {
			start++;
		}

		// find end
		//
		let end = start;
		while ((this.el.value[end] != Chars.carriageReturn || 
			!Chars.blank.contains(this.el.value[end + 1])) && 
			end < this.el.value.length) {
			end++;
		}

		// select range
		//
		this.el.focus();
		this.el.setSelectionRange(start, end);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	selectBefore: function() {

		// find start
		//
		let start = 0;
		let end = this.el.selectionStart;

		// select range
		//
		this.el.focus();
		this.el.setSelectionRange(start, end);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	selectAfter: function() {

		// find start
		//
		let start = this.el.selectionEnd;
		let end = this.el.value.length;

		// select range
		//
		this.el.focus();
		this.el.setSelectionRange(start, end);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	selectRange: function(start, end) {

		// set parameter defaults
		//
		if (start == '') {
			start = 0;
		}
		if (end == '') {
			end = this.numLines();
		}

		// select range
		//
		this.el.focus();
		this.el.setSelectionRange(this.getLineStart(start), this.getLineEnd(end));

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (this.options.preferences) {
			this.setOption('font', this.options.preferences.get('font'));
			this.setOption('font_size', this.options.preferences.get('font_size'));
		}
	},

	onAttach: function() {
		window.setTimeout(() => {
			this.$el.focus();
		}, 1000);
	},

	//
	// event handling methods
	//

	onInput: function() {

		// set change flag
		//
		this.changed = true;

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onMouseUp: function() {

		if (this.hasSelected()) {
			this.selected = this.getSelected();

			// perform callback
			//
			if (this.options.onselect) {
				this.options.onselect();
			}
		} else if (this.selectedText) {

			// unset change flag
			//
			this.selected = null;
			
			// perform callback
			//
			if (this.options.ondeselect) {
				this.options.ondeselect();
			}
		}

		// perform callback
		//
		if (this.options.onmouseup) {
			this.options.onmouseup();
		}
	},
});