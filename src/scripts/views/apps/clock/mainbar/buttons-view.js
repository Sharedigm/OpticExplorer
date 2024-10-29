/******************************************************************************\
|                                                                              |
|                               buttons-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying and managing clock buttons.        |
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
import Keyboard from '../../../../views/keyboard/keyboard.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'buttons',

	template: template(`
		<button class="analog success btn"<% if (mode == 'digital') { %> style="display:none"<% } %>><span style="display:inline-block; width:100px">
			<i class="fa fa-clock"></i>To Analog</span>
		</button>
		
		<button class="digital success btn" style="margin-left:0"<% if (mode == 'analog') { %> style="display:none"<% } %>><span style="display:inline-block; width:100px">
			<i class="fa fa-circle-notch"></i>To Digital</span>
		</button>
	`),

	events: {

		// basic events
		//
		'click .analog': 'onClickAnalog',
		'click .digital': 'onClickDigital'
	},

	//
	// setting methods
	//

	setMode: function(mode) {
		this.mode = mode;

		// update display
		//
		switch (mode) {
			case 'analog':
				this.$el.find('button.analog').hide();
				this.$el.find('button.digital').show();
				break;
			case 'digital':
				this.$el.find('button.analog').show();
				this.$el.find('button.digital').hide();
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			mode: this.options.mode,
		};
	},

	onRender: function() {
		this.setMode(this.options.mode);
	},
	
	//
	// mouse event handling methods
	//

	onClickAnalog: function() {

		// set current mode
		//
		this.parent.setMode('analog', true);
	},

	onClickDigital: function() {

		// set current mode
		//
		this.parent.setMode('digital', true);
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		switch (event.keyCode) {

			// delete key
			//
			case Keyboard.keyCodes.backspace:
				this.reset();
				break;

			default:
				return;
		}

		// block event from parent
		//
		this.block(event);
	}
});