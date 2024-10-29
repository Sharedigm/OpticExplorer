/******************************************************************************\
|                                                                              |
|                               buttons-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for handling timer buttons.                       |
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
		<button class="start success btn">
			<i class="fa fa-play" style="display:inline-block;  width:15px;"></i><span style="display:inline-block; width:30px">Start</span>
		</button>
		<button class="stop caution btn" style="display:none; margin-left:0">
			<i class="fa fa-stop" display:inline-block; style="width:15px;"></i><span style="display:inline-block; width:30px">Stop</span>
		</button>
		<button class="reset warning btn">
			<i class="fa fa-undo"></i>Reset
		</button>
		<button class="prefs btn">
			<i class="fa fa-gear"></i>Prefs
		</button>
	`),

	events: {

		// basic events
		//
		'click .start': 'onClickStart',
		'click .stop': 'onClickStop',
		'click .reset': 'onClickReset',
		'click .prefs': 'onClickPrefs'
	},

	//
	// timer methods
	//

	start: function() {

		// change start button to stop button
		//
		this.$el.find('.start').hide();
		this.$el.find('.stop').show();
	},

	stop: function() {

		// change stop button to start button
		//
		this.$el.find('.stop').hide();
		this.$el.find('.start').show();
	},

	//
	// mouse event handling methods
	//

	onClickStart: function() {
		this.parent.start();
	},

	onClickStop: function() {
		this.parent.stop();
	},

	onClickReset: function() {
		this.parent.reset();
	},

	onClickPrefs: function() {
		this.parent.showPreferencesDialog();
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