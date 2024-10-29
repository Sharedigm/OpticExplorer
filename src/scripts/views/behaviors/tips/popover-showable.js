/******************************************************************************\
|                                                                              |
|                             popover-showable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying popovers.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../../vendor/bootstrap/js/tooltip.js';
import '../../../../vendor/bootstrap/js/popover.js';

export default {

	//
	// attributes
	//

	popover_defaults: {
		trigger: 'hover',
		placement: 'top',
		container: 'body'
	},

	//
	// querying methods
	//

	container: function() {
		return this.$el.closest(this.popover_container)[0] || this.el;
	},

	//
	// rendering methods
	//

	addPopoverAttrs: function() {
		this.$el.attr({
			'data-toggle': 'popover',
			'data-html': true,
			'title': this.getPopoverTitle(),
			'data-content': this.getPopoverContent()
		});
	},

	addPopovers: function(options) {
		
		// show popovers on trigger
		//
		this.$el.find('[data-toggle="popover"]').addClass('popover-trigger').popover(_.extend({}, this.popover_defaults, this.popovers, options));
	},

	removePopovers: function() {
		$('.popover').remove();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// remove any tooltips that might have been created
		//
		this.removePopovers();
	}
};
