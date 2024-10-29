/******************************************************************************\
|                                                                              |
|                              layers-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a layers toolbar.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import LayerButtonsView from '../../../../../views/apps/map-viewer/header-bar/annotations-bar/annotation-buttons-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div data-toggle="tooltip" title="Annotations" data-placement="right">
			<button class="button">
				<i class="fa fa-pencil"></i>
			</button>
		</div>
		<div class="buttons"></div>
	`),

	regions: {
		buttons: {
			el: '.buttons',
			replaceElement: true
		}
	},

	events: {
		'mouseenter': 'onMouseEnter',
		'mouseleave': 'onMouseLeave'
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
		this.showChildView('buttons', new LayerButtonsView({
			model: this.model,
			preferences: this.options.preferences
		}));

		// initially hide buttons
		//
		this.getChildView('buttons').$el.hide();
	},

	//
	// event handling methods
	//
	
	onActivate: function() {
		this.getChildView('buttons').onActivate();
	},

	//
	// mouse event handling methods
	//

	onMouseEnter: function() {
		this.getChildView('buttons').$el.show();
	},

	onMouseLeave: function() {
		this.getChildView('buttons').$el.fadeOut();
	}
});
