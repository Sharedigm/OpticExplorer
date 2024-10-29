/******************************************************************************\
|                                                                              |
|                                  button-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
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
import Svg from '../../../../../utilities/web/svg.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'button',
	className: 'button',

	events: {
		'click': 'onClick'
	},

	//
	// querying methods
	//

	isEnabled: function() {
		return !this.$el.hasClass('disabled');
	},

	isDisabled: function() {
		return this.$el.hasClass('disabled');
	},

	//
	// getting methods
	//

	getIcon: function() {
		return this.$el.children();
	},

	//
	// setting methods
	//

	setIcon: function(icon) {
		this.$el.empty();
		this.$el.append(icon.clone());

		// convert image svgs to inline svgs
		//
		Svg.inline(this.$el.find('img.svg'));
	},

	setEnabled: function(enabled) {
		if (enabled) {
			this.$el.removeClass('disabled');
		} else {
			this.$el.addClass('disabled');
		}
	},

	setDisabled: function(disabled) {
		if (disabled) {
			this.$el.addClass('disabled');
		} else {
			this.$el.removeClass('disabled');
		}
	},

	//
	// rendering methods
	//

	render: function() {

		// render template
		//
		let context = this.templateContext? this.templateContext() : undefined;
		if (this.template) {
			this.$el.html(typeof this.template == 'string'? this.template : this.template(context));
		} else if (this.options.template) {
			this.$el.html(typeof this.options.template == 'string'? this.template : this.options.template(context));
		}

		// convert image svgs to inline svgs
		//
		Svg.inline(this.$el.find('img.svg'));

		// perform callback
		//
		if (this.onRender) {
			this.onRender();
		}
	},

	onRender: function() {

		// set initial state
		//
		if (this.options.disabled) {
			this.setDisabled(true);
		}
	}
});