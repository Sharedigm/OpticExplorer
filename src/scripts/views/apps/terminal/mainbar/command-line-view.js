/******************************************************************************\
|                                                                              |
|                              command-line-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying a command line.               |
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
import Scrollable from '../../../../views/behaviors/layout/scrollable.js';
import Keyboard from '../../../../views/keyboard/keyboard.js';

export default BaseView.extend(_.extend({}, Scrollable, {

	//
	// attributes
	//

	className: 'command-line-interface',

	template: template(`
		<div class="command-line">
			<span class="prompt"></span>
			<span class="command"></span>
			<span class="blinking cursor"></span>
		</div>
	`),

	events: {
		'keydown': 'onKeyDown'
	},

	//
	// initialize
	//

	initialize: function() {
		this.directory = '';
	},

	//
	// getting methods
	//

	getLine: function() {
		return this.$el.find('.command-line:last-child .command').text();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'font_size':
				this.$el.css('font-size', value);
				break;
		}
	},

	setLine: function(line) {
		this.$el.find('.command-line:last-child .command').text(line);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.options.preferences.applyTo(this);
	},

	newLine: function(text) {
		this.deleteCursor();
		this.$el.append(this.template());
		if (text) {
			this.setLine(text);
		}
		this.scrollToBottom();
	},

	addChar: function(char) {
		this.setLine(this.getLine() + char);
	},

	addLine: function(text) {
		this.setLine(this.getLine() + '\n' + text);
		this.scrollToBottom();
	},

	deleteChar: function() {
		let line = this.getLine();
		if (line.length > 0) {
			this.setLine(line.substring(0, line.length - 1));
		}
	},

	deleteCursor: function() {
		this.$el.find('.cursor').remove();
	},

	clear: function() {
		this.$el.empty();
		this.newLine();
	},

	exit: function() {
		this.parent.close();
	},

	//
	// command executing methods
	//

	execute: function(command) {
		return $.ajax({
			url: config.servers.api + '/shell/exec',
			type: 'POST',
			data: {
				directory: this.directory,
				command: command
			},

			// callbacks
			//
			success: (data) => {

				// update context
				//
				this.directory = data.directory;

				// update display
				//
				this.addLine(data.output);
				this.newLine();
			}
		});
	},

	submit: function() {
		let command = this.getLine();

		this.deleteCursor();

		if (!command) {
			this.newLine();
		} else if (command == 'clear') {
			this.clear();
		} else if (command == 'exit') {
			this.exit();
		} else {
			this.execute(command);
		}
	},

	//
	// keyboard handling methods
	//

	onKeyDown: function(event) {

		// check for return key
		//
		switch (event.keyCode) {
			case Keyboard.keyCodes['enter']:

				// submit command
				//
				this.submit();
				break;
			case Keyboard.keyCodes['space']:

				// handle spaces
				//
				this.addChar(' ');
				break;
			case Keyboard.keyCodes['delete']:

				// handle delete
				//
				this.deleteChar();
				break;
			default: {
				let key = event.key;

				// add character to line
				//
				if (key.length == 1) {

					// control-c
					//
					if (key == 'c' && (event.metaKey || event.ctrlKey)) {
						this.newLine();
					} else {
						this.addChar(key);
					}
				}
			}
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {
		this.scrollToBottom();
	}
}));