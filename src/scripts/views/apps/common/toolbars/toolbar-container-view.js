/******************************************************************************\
|                                                                              |
|                          toolbar-container-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to display a collection of toolbars.         |
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
	// getting methods
	//

	getToolbarView: function(kind) {
		return this[kind]();
	},

	//
	// rendering methods
	//

	getTemplate: function() {
		let html = '';
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let regionName = regionNames[i];
			let className = regionName.replace(/_/g, '-') + '-bar';
			html += '<div class="' + className + '"></div>';
		}
		return template(html);
	},

	templateContext: function() {
		return {
			is_desktop: this.getParentView('app').isDesktop()
		};
	},

	onRender: function() {
		this.app = this.getParentView('app');
		
		// show child views
		//
		this.showToolbars();
	},

	showToolbars: function() {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			this.showToolbar(regionNames[i]);
		}
	},

	showToolbar: function(kind) {
		let toolbarView = this.getToolbarView(kind);
		if (toolbarView) {
			this.showChildView(kind, toolbarView);
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
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
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onChange) {
				childView.onChange();
			}
		}
	},

	onSave: function() {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onSave) {
				childView.onSave();
			}
		}
	},

	//
	// tab event handling methods
	//

	onChangeTab: function(index) {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onChangeTab) {
				childView.onChangeTab(index);
			}
		}
	},

	onCloseTab: function(index) {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onCloseTab) {
				childView.onCloseTab(index);
			}
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onSelect) {
				childView.onSelect(item);
			}
		}
	},

	onDeselect: function(item) {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onDeselect) {
				childView.onDeselect(item);
			}
		}
	},

	onChangeSelection: function() {
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onChangeSelection) {
				childView.onChangeSelection();
			}
		}
	}
});