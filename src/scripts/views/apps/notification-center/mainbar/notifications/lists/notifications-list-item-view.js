/******************************************************************************\
|                                                                              |
|                       notifications-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single notifications list item.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModelView from '../../../../../../views/items/model-view.js';
import Expandable from '../../../../../../views/behaviors/expanders/expandable.js';
import '../../../../../../utilities/time/date-format.js';

export default ModelView.extend(_.extend({}, Expandable, {

	//
	// attributes
	//

	tagName: 'li',
	
	attributes: {
		'role': 'presentation'
	},

	// image attributes
	//
	thumbnailSize: 50,
	
	//
	// rendering methods
	//

	onRender: function() {

		// add hover class
		//
		if (this.clickable) {
			this.$el.addClass('active');
		}
	},

	//
	// updating methods
	//

	update: function() {
		this.$el.find('.when .elapsed-time').text(this.model.when());
	},
	
	dismiss: function() {
		
		// dismiss notification
		//
		this.model.dismiss({

			// callbacks
			//
			success: () => {

				// remove model from collection
				//
				this.parent.collection.remove(this.model);

				// destroy view
				//
				this.destroy();
			}
		});
	},

	showWhen: function() {
		application.launch('calendar', {
			date: this.model.get('created_at')
		});
	},

	//
	// mouse event handling methods
	//

	onClickWhen: function(event) {
		this.showWhen();

		// block event from parent
		//
		this.block(event);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.removeTooltips();
	}
}));