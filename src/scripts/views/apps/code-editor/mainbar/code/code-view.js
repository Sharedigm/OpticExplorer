/******************************************************************************\
|                                                                              |
|                                 code-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying source code.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import '../../../../../../vendor/ace/ace.js';
import '../../../../../../vendor/ace/keybinding-vim.js'

// configure ace
//
let Ace = ace;
ace.config.set('basePath', 'vendor/ace');
ace.config.set("themePath", 'vendor/ace');

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'pre',
	template: template(''),

	//
	// editor attributes
	//

	readOnly: true,

	//
	// constructor
	//

	initialize: function() {

		// listen to system settings for theme changes
		//
		if (application.settings.theme) {
			this.listenTo(application.settings.theme, 'change', () => {
				this.setTheme(application.settings.theme.getCurrentTheme());
			});
		}
	},

	//
	// querying methods
	//

	isBefore: function(cursor1, cursor2) {
		if (cursor1.row != cursor2.row) {
			return cursor1.row < cursor2.row;
		} else {
			return cursor1.column < cursor2.column;
		}
	},

	isAfter: function(cursor1, cursor2) {
		if (cursor1.row != cursor2.row) {
			return cursor1.row > cursor2.row;
		} else {
			return cursor1.column > cursor2.column;
		}
	},

	hasSelected: function() {
		return !this.editor.selection.isEmpty();
	},

	//
	// counting methods
	//

	numLines: function() {
		return this.editor.session.getLength();
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.editor.selection.getRange();
	},

	getSelectedText: function() {
		return this.editor.getSelectedText();
	},
	
	getValue: function() {
		return this.editor.getValue();
	},

	getCursor: function() {
		return this.editor.selection.getCursor();
	},

	getCopyText: function() {
		return this.editor.getCopyText();
	},

	getSelectedRange: function() {
		return this.editor.selection.getRange();
	},

	getBlockStart: function(cursor, delimeters) {
		let counter = 1;
		while (counter > 0) {

			// find preceding opening brace
			//
			let open = this.find(delimeters[0], {
				start: cursor,
				wrap: false,
				backwards: true,
				preventScroll: true,			
			});

			// find preceding closing brace
			//
			let close = this.find(delimeters[1], {
				start: cursor,
				wrap: false,
				backwards: true,
				preventScroll: true
			});

			if (!open) {

				// no open
				//
				return null;
			} else if (open && !close) {

				// found open but no close
				//
				counter--;
				cursor = open.start;
			} else if (this.isAfter(open.start, close.start)) {

				// found open after close
				//
				counter--;
				cursor = open.start;
			} else {

				// found close
				//
				counter++;
				cursor = close.start;
			}
		}

		return cursor;
	},

	getBlockEnd: function(cursor, delimeters) {
		let counter = 1;
		while (counter > 0) {

			// find following closing brace
			//
			let close = this.find(delimeters[1], {
				start: cursor,
				wrap: false,
				backwards: false,
				preventScroll: true
			});

			// find following opening brace
			//
			let open = this.find(delimeters[0], {
				start: cursor,
				wrap: false,
				backwards: false,
				preventScroll: true
			});

			if (!close) {
				return null;
			} else if (close && !open) {

				// found close but no open
				//
				counter--;
				cursor = close.end;
			} else if (this.isBefore(close.end, open.end)) {

				// found close before open
				//
				counter--;
				cursor = close.end;
			} else {

				// found open
				//
				counter++;
				cursor = open.end;
			}
		}

		return cursor;
	},
	
	//
	// setting methods
	//

	loadText: function(text) {

		// set initial text 
		//
		this.setValue(text);

		// perform callbacks
		//
		if (this.options.onchange) {
			this.editor.session.on('change', this.options.onchange);
		}
		if (this.options.onchangecursor) {
			this.editor.selection.on('changeCursor', this.options.onchangecursor);
		}
		if (this.options.onchangeselection) {
			this.editor.selection.on('changeSelection', this.options.onchangeselection);
		}
		if (this.options.oncopy) {
			this.editor.selection.on('copy', this.options.oncopy);
		}
	},

	setValue: function(text) {
		this.editor.session.setValue(text || '');
		this.editor.clearSelection();
		this.editor.selection.moveCursorFileStart();

		// reset change state
		//
		this.dirty = false;
	},

	setLanguage: function(language) {
		this.editor.getSession().setMode('ace/mode/' + language);
	},

	setTheme: function(theme) {
		switch (theme) {
			case 'dark':
				this.editor.setTheme('ace/theme/monokai');
				break;
			case 'medium':
			case 'light':
				this.editor.setTheme('ace/theme/chrome');
				break;
		}
	},

	parseBooleanOrInteger: function(string) {
		switch (string) {
			case 'on':
			case 'true':
				return true;
			case 'off':
			case 'false':
				return false;
			default:
				return parseInt(string);
		}
	},

	setOption: function(key, value) {
		switch (key) {
			
			case 'show_gutter':
				this.editor.renderer.setShowGutter(value);
				break;
			case 'show_indent_guides':
				this.editor.setOption('displayIndentGuides', value);
				break;
			case 'show_print_margin':
				this.editor.setShowPrintMargin(value);
				break;
			case 'show_invisibles':
				this.editor.setShowInvisibles(value);
				break;
			case 'font_size':
				this.editor.setFontSize(value);
				break;
			case 'tab_size':
				this.editor.setOption('tabSize', value);
				break;
			case 'soft_tabs':
				this.editor.setOption('useSoftTabs', value);
				break;
			case 'soft_wrap':
				this.editor.setOption('wrap', this.parseBooleanOrInteger(value));
				break;
			case 'key_binding':
				this.editor.setKeyboardHandler(value != 'default'? 'ace/keyboard/' + value : '');
				break;
			case 'highlight_active_line':
				this.editor.setHighlightActiveLine(value);
				break;
			case 'highlight_selected':
				this.editor.setHighlightSelectedWord(value);
				break;
			case 'select_full_line':
				this.editor.setSelectionStyle(value? 'line' : 'text');
				break;
			case 'animated_scroll':
				this.editor.setAnimatedScroll(value);
				break;
		}
	},

	//
	// selecting methods
	//

	select: function(which) {
		switch (which) {
			case 'all':
				this.editor.selection.selectAll();
				break;
			case 'word':
				this.editor.selection.selectWord();
				break;
			case 'line':
				this.editor.selection.selectLine();
				break;
			case 'block': {
				let cursor = this.editor.selection.getCursor();
				let start, end;

				// find enclosing block
				//
				let start1 = this.getBlockStart(cursor, ['{', '}']);
				let start2 = this.getBlockStart(cursor, ['(', ')']);
				let start3 = this.getBlockStart(cursor, ['[', ']']);
				let start4 = this.getBlockStart(cursor, ['/*', '*/']);

				// find latest start
				//
				start = start1;
				if (start2 && (!start || this.isAfter(start2, start))) {
					start = start2;
				}
				if (start3 && (!start || this.isAfter(start3, start))) {
					start = start3;
				}
				if (start4 && (!start || this.isAfter(start4, start))) {
					start = start4;
				}

				// find matching end
				//
				if (start) {
					switch (start) {
						case start1:

							// for curly braces, start at first column
							//
							start.column = 0;
							end = this.getBlockEnd(cursor, ['{', '}']);
							break;
						case start2:
							end = this.getBlockEnd(cursor, ['(', ')']);
							break;
						case start3:
							end = this.getBlockEnd(cursor, ['[', ']']);	
							break;
						case start4:
							end = this.getBlockEnd(cursor, ['/*', '*/']);	
							break;
					}
				} else {

					// no block, select all
					//
					start = {
						row: 0,
						column: 0
					};
					end = {
						row: this.editor.session.getLength() + 1,
						column: 0
					};
				}

				let Range = ace.require('ace/range').Range;
				let range = new Range(start.row, start.column, end.row, end.column);
				let reverse = false;
				this.editor.selection.setSelectionRange(range, reverse);
				break;
			}
			case 'before':
				this.editor.selection.selectFileStart();
				break;
			case 'after':
				this.editor.selection.selectFileEnd();
				break;
			case 'range':
				this.editor.selection.selectRange();
				break;
		}
	},

	selectRange: function(start, end) {
		let Range = ace.require('ace/range').Range;
		let range = new Range(start - 1, 0, end, 0);
		let reverse = false;
		this.editor.selection.setSelectionRange(range, reverse);
	},

	deselect: function() {
		this.editor.clearSelection();
	},

	//
	// finding methods
	//

	find: function(needle, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// perform find
		//
		return this.editor.find(needle, {
			backwards: options.backwards != undefined? options.backwards : false,
			wrap: options.wrap != undefined? options.wrap : true,
			caseSensitive: options.caseSensitive != undefined? options.caseSensitive : false,
			wholeWord: options.wholeWord != undefined? options.wholeWord : false,
			regExp: options.regExp != undefined? options.regExp : false,
			start: options.start != undefined? options.start : this.editor.selection.getCursor(),
			preventScroll: options.preventScroll != undefined? options.preventScroll : false
		});
	},

	//
	// command methods
	//

	execCommand: function(commandName, args, options) {
		switch (commandName) {
			case 'write':
				this.parent.save(options);
				break;
			case 'quit':
				this.parent.close(options);
				break;
		}
	},

	addVimKeyBindings: function() {
		let Vim = require("ace/keyboard/vim").Vim;

		Vim.defineEx('write', 'w', () => {
			this.execCommand('write');
		});
		Vim.defineEx('quit', 'q', () => {
			this.execCommand('quit');
		});
		Vim.defineEx('wquit', 'wq', () => {
			this.execCommand('write', [], {

				// callbacks
				//
				success: () => {
					this.execCommand('quit');
				}
			});
		});
	},

	//
	// rendering methods
	//

	onRender: function() {
		
		// create new editor
		//
		this.editor = Ace.edit(this.el);

		// set theme
		//
		this.setTheme(application.settings.theme.getCurrentTheme());

		// apply preferences
		//
		this.options.preferences.applyTo(this);
		this.editor.setReadOnly(this.readOnly);
		this.addVimKeyBindings();

		// scroll to top
		//
		this.editor.$blockScrolling = Infinity;

		// replace default key bindings
		//
		this.editor.commands.bindKey('Command-F', null);
		this.editor.commands.bindKey('Command-G', null);
		this.editor.commands.bindKey('Command-Shift-F', null);
		this.editor.commands.bindKey('Command-Shift-G', null);

		// set initial focus
		//
		// this.focus();
	},

	focus: function() {
		if (this.editor) {
			this.editor.focus();
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.editor) {
			this.editor.resize();
		}
	}
});