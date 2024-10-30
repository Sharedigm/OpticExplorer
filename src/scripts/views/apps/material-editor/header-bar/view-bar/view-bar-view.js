/******************************************************************************\
|                                                                              |
|                               view-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a view toolbar.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import DataSheetButtonView from '../../../../../views/apps/material-editor/header-bar/view-bar/buttons/data-sheet-button-view.js';
import RefractionButtonView from '../../../../../views/apps/material-editor/header-bar/view-bar/buttons/refraction-button-view.js';
import ReflectionButtonView from '../../../../../views/apps/material-editor/header-bar/view-bar/buttons/reflection-button-view.js';
import TransmissionButtonView from '../../../../../views/apps/material-editor/header-bar/view-bar/buttons/transmission-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	className: 'toolbar',

	/*
	template: template(`
		<div class="data-sheet" data-toggle="tooltip" title="Data Sheet" data-placement="bottom"></div>
		<div class="refraction" data-toggle="tooltip" title="Refraction" data-placement="bottom"></div>
		<div class="reflection" data-toggle="tooltip" title="Reflection" data-placement="bottom"></div>
		<div class="transmission" data-toggle="tooltip" title="Transmission" data-placement="bottom"></div>
	`),
	*/

	template: template(`
		<div class="data-sheet" data-toggle="tooltip" title="Data Sheet" data-placement="bottom"></div>
		<div class="refraction"></div>
		<div class="reflection"></div>
		<div class="transmission"></div>
	`),

	regions: {
		data_sheet: '.data-sheet',
		refraction: '.refraction',
		reflection: '.reflection',
		transmission: '.transmission',
	},

	multiline: true,

	//
	// setting methods
	//

	setView: function(view) {
		switch (view) {
			case 'data_sheet':
				this.getChildView('data_sheet').select({
					silent: true
				});
				break;
			case 'refraction':
				this.getChildView('refraction').select({
					silent: true
				});
				break;
			case 'reflection':
				this.getChildView('reflection').select({
					silent: true
				});
				break;
			case 'transmission':
				this.getChildView('transmission').select({
					silent: true
				});
				break;
		}
	},

	//
	// selecting methods
	//

	select: function(button) {
		if (this.selectedButton) {
			this.selectedButton.deselect();
		}

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

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('data_sheet', new DataSheetButtonView());
		this.showChildView('refraction', new RefractionButtonView());
		this.showChildView('reflection', new ReflectionButtonView());
		this.showChildView('transmission', new TransmissionButtonView());

		// set initial state
		//
		let preferences = this.getParentView('app').preferences;
		let viewKind = preferences.get('view_kind');
		this.setView(viewKind);
	},

	onLoad: function() {
		this.getChildView('refraction').onLoad();
		this.getChildView('reflection').onLoad();
		this.getChildView('transmission').onLoad();
	}
});