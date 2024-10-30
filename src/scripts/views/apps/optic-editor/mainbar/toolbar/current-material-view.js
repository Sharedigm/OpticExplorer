/******************************************************************************\
|                                                                              |
|                            current-material-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a current material tile / control.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'tile',

	attributes: {
		'data-toggle': 'tooltip'
	},

	events: {
		'dblclick': 'onDoubleClick'
	},

	//
	// methods
	//

	setColor: function(color) {
		this.$el.attr('style', 'background:' + color);
	},

	setMaterial: function(material) {
		this.model = material;

		// set background color
		//
		this.setColor(this.model.getColor());

		// set title
		//
		let title = this.model.toString();
		this.$el.attr('title', title);
	
		// update tooltip
		//
		this.setTooltip(title);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// get rid of region wrapping div
		//
		this.$el.parent().replaceWith(this.$el);

		// set current material
		//
		this.setMaterial(this.model);
	},

	onAttach: function() {

		// add tooltips
		//
		this.addTooltips();
	},

	update: function() {

		// set background color
		//
		this.setColor(this.model.getColor());
	},

	//
	// dialog rendering methods
	//

	showEditMaterialDialog: function() {
		application.launch('material_editor', {
			model: new File(),
			material: this.model
		});
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {

		// perform action
		//
		this.showEditMaterialDialog();
	}
});