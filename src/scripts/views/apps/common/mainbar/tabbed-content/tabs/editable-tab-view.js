/******************************************************************************\
|                                                                              |
|                             editable-tab-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a single editable tab.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tab-view.js';

export default TabView.extend({

	//
	// attributes
	//

	dirty: false,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		TabView.prototype.initialize.call(this);

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// querying methods
	//

	isDirty: function() {

		// get dirty flag of pane
		//
		return this.dirty;
	},

	//
	// getting methods
	//

	getName: function() {
		return (this.isDirty()? '*' : '') + this.model.getName();
	},

	//
	// setting methods
	//

	setDirty: function(dirty) {

		// set optional parameter defaults
		//
		if (dirty == undefined) {
			dirty = true;
		}

		// set attributes
		//
		this.dirty = dirty;

		// update
		//
		this.onChange();
	},

	//
	// event handling methods
	//

	onChange: function() {
		
		// update active tab
		//
		this.update();
	}
});