/******************************************************************************\
|                                                                              |
|                               toolbar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for a general collapsible side toolbar.           |
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

export default BaseView.extend({

	//
	// attributes
	//

	className: 'toolbar',

	// initial state
	//
	disabled: {},
	hidden: {},

	//
	// getting methods
	//

	getItems: function(name) {
		if (!name) {
			return this.$el.find('> div > button');
		} else {
			return this.$el.find('.' + name.replace(' ', '.') + ' > button');
		}
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

	setItemVisible: function(name, visible) {
		let items = this.getItems(name);
		if (visible || visible == undefined) {
			items.removeClass('hidden');
		} else {
			items.addClass('hidden');
		}
	},

	setItemHidden: function(name, hidden) {
		let items = this.getItems(name);
		if (hidden || hidden == undefined) {
			items.addClass('hidden');
		} else {
			items.removeClass('hidden');
		}
	},

	setItemEnabled: function(name, enabled) {
		let items = this.getItems(name);
		if (enabled || enabled == undefined) {
			items.removeClass('disabled');
		} else {
			items.addClass('disabled');
		}
	},

	setItemDisabled: function(name, disabled) {
		let items = this.getItems(name);
		if (disabled || disabled == undefined) {
			items.addClass('disabled');
		} else {
			items.removeClass('disabled');
		}
	},

	setItemSelected: function(name, selected) {
		let items = this.getItems(name);
		if (selected || selected == undefined) {
			items.addClass('selected');
		} else {
			items.removeClass('selected');
		}
	},

	setItemDeselected: function(name, deselected) {
		let items = this.getItems(name);
		if (deselected || deselected == undefined) {
			items.removeClass('selected');
		} else {
			items.addClass('selected');
		}
	},

	//
	// group setting methods
	//

	setItemsVisible: function(visible) {
		switch (typeof visible) {

			case 'boolean': {

				// set items to value
				//
				let items = this.getItems();
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class');
					this.setItemVisible(className, visible);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in visible) {
					this.setItemVisible(name, visible[name]);
				}
				break;
			}
		}
	},

	setItemsHidden: function(hidden) {
		switch (typeof hidden) {

			case 'boolean': {

				// set items to value
				//
				let items = this.getItems();
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class');
					this.setItemHidden(className, hidden);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in hidden) {
					this.setItemHidden(name, hidden[name]);
				}
				break;
			}
		}
	},

	setItemsEnabled: function (enabled) {
		switch (typeof enabled) {

			case 'boolean': {

				// set items to value
				//
				let items = this.getItems();
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemEnabled(className, enabled);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in enabled) {
					this.setItemEnabled(name, enabled[name]);
				}
				break;
			}
		}
	},

	setItemsDisabled: function(disabled) {
		switch (typeof disabled) {

			case 'boolean': {

				// set items to value
				//
				let items = this.getItems();
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemDisabled(className, disabled);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in disabled) {
					this.setItemDisabled(name, disabled[name]);
				}
				break;
			}
		}
	},

	setItemsSelected: function(selected) {
		switch (typeof selected) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemSelected(className, selected);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in selected) {
					this.setItemSelected(name, selected[name]);
				}
				break;
			}
		}
	},

	setItemsDeselected: function(deselected) {
		switch (typeof deselected) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemDeselected(className, deselected);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in deselected) {
					this.setItemDeselected(name, deselected[name]);
				}
				break;
			}
		}
	},

	// 
	// rendering methods
	//

	onRender: function() {

		// set attributes
		//
		this.app = this.getParentView('app');

		// set toolbar visibility
		//
		if (this.options.hidden) {
			this.setVisible(false);
		}

		// allow wrapping
		//
		if (this.multiline) {
			this.$el.addClass('multiline');
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// updating methods
	//

	updateVisible: function() {

		// set visible / hidden
		//
		if (this.visible) {
			this.setItemsVisible(_.result(this, 'visible'));
		} else if (this.hidden) {
			this.setItemsHidden(_.result(this, 'hidden'));
		}
	},

	updateEnabled: function() {

		// set enabled / disabled
		//
		if (this.enabled) {
			this.setItemsEnabled(_.result(this, 'enabled'));
		} else if (this.disabled) {
			this.setItemsDisabled(_.result(this, 'disabled'));
		}
	},

	updateSelected: function() {

		// set selected / deselected
		//
		if (this.selected) {
			this.setItemsSelected(_.result(this, 'selected'));
		} else if (this.deselected) {
			this.setItemsDeselected(_.result(this, 'deselected'));
		}
	},

	update: function() {
		this.updateVisible();
		this.updateEnabled();
		this.updateSelected();
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.loaded = true;
		this.update();

		// load buttons
		//
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onLoad) {
				childView.onLoad();
			}
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

	onChange: function() {
		if (this.loaded) {
			this.update();
		}

		// load buttons
		//
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onChange) {
				childView.onChange();
			}
		}
	},

	onChangeSelection: function() {
		if (this.loaded) {
			this.updateVisible();
			this.updateEnabled();
		}

		// load buttons
		//
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onChangeSelection) {
				childView.onChangeSelection();
			}
		}
	}
});
