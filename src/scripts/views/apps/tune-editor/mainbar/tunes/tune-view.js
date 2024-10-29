/******************************************************************************\
|                                                                              |
|                                 tune-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying tunes.                        |
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
import '../../../../../../vendor/abcjs/abcjs_basic_5.6.8-min.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(''),

	events: {
		'click': 'onClick'
	},

	//
	// setting methods
	//

	loadTune: function(text) {

		// set initial text 
		//
		this.setValue(text);
	},

	setValue: function(text) {

		// set attributes
		//
		this.text = text;

		// render tune from text
		//
		this.showTune(text);

		// reset change state
		//
		this.changed = false;
	},

	//
	// rendering methods
	//

	showTune: function(text) {
		ABCJS.renderAbc(this.el, text, {
			staffwidth: this.$el.width() - 50,
			scale: 1,
			add_classes: true,
			responsive: true,
			paddingtop: 10,
			paddingbottom: 0,
			paddingleft: 10,
			paddingright: 0
		});

		this.$el.css('overflow', '');
		this.unfill();
	},

	unfill: function() {
		this.$el.find('path').removeAttr('fill');
		this.$el.find('rect').removeAttr('fill');
		this.$el.find('text').removeAttr('fill');
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		if (event.target.nodeName == 'svg') {
			this.$el.find('.abcjs-note_selected').removeClass('abcjs-note_selected');
			this.unfill();
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {
		this.showTune(this.text);
	}
});