/******************************************************************************\
|                                                                              |
|                              button-group-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
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
import GroupedButtonView from '../../../../../views/apps/common/toolbars/button-groups/grouped-button-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	className: 'tool-group',

	template: template(`
		<div class="current"></div>
		<div class="tools">
			<%= tools %>
		</div>
	`),

	events: {
		'mouseenter': 'onMouseEnter',
		'mouseleave': 'onMouseLeave'
	},

	tooltips: {
		placement: 'right'
	},

	//
	// querying methods
	//

	first: function() {
		return this.getChildView(Object.keys(this._regions)[0]);
	},

	//
	// getting methods
	//

	getButtonView: function() {
		return new GroupedButtonView();
	},

	//
	// setting methods
	//

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
	// selecting methods
	//

	select: function(button) {
		if (!button) {
			return;
		}

		// deselect previously selected button
		//
		if (this.selectedButton) {
			this.selectedButton.deselect();
		}

		// set current icon
		//
		this.getChildView('current').setIcon(button.getIcon());

		// select button
		//
		button.setSelected(true);
		this.selectedButton = button;
	},

	deselect: function(button) {

		// deselect button
		//
		button.setSelected(false);
		this.selectedButton = null;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tools: this.tools()
		};
	},

	onRender: function() {

		// add current region
		//
		this.addRegion('current', '.current');

		// show current button
		//
		this.showChildView('current', this.getButtonView());

		// start with options hidden
		//
		this.$el.find('.tools').hide();

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// event handling methods
	//

	onAttach: function() {

		// set current button
		//
		if (this.hasChildView('current')) {
			let first = this.first();

			this.getChildView('current').setIcon(first.getIcon());

			// set initial state
			//
			if (first.options.selected) {
				this.getChildView('current').setSelected(true);
			}
		}

		// set selected button
		//
		if (this.options.selected) {
			this.selectedButton = this.getChildView(this.options.selected);
		}
	},

	onActivate: function() {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onActivate) {
				childView.onActivate();
			}
		}
	},

	//
	// mouse event handling methods
	//

	onMouseEnter: function() {

		// make sure that previously shown options are hidden
		//
		this.parent.$el.find('.tools').hide();

		// show options
		//
		this.$el.find('.tools').show();
	},

	onMouseLeave: function() {
		this.$el.find('.tools').fadeOut();
	}
});