/******************************************************************************\
|                                                                              |
|                             tooltip-showable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying tooltips.                      |
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
import Browser from '../../../utilities/web/browser.js';

export default {

	//
	// attributes
	//

	tooltip_defaults: {
		html: true,
		trigger: 'hover',
		placement: undefined,
		container: 'body'
	},

	//
	// querying methods
	//

	isTooltipsEnabled: function() {
		return !Browser.is_mobile;
	},

	//
	// setting methods
	//

	setTooltip: function(title) {
		if (!this.isTooltipsEnabled()) {
			return;
		}

		// update attributes
		//
		this.$el.attr('title', title);
		this.$el.attr('data-original-title', title);

		// update view
		//
		this.removeTooltips();
		this.addTooltips(this.tooltip_options);
	},

	//
	// rendering methods
	//

	addTooltipAttrs: function() {
		$(this.el).attr({
			'data-toggle': 'tooltip',
			'title': _.result(this, 'title')
		});
	},

	addTooltips: function(options) {
		if (!this.isTooltipsEnabled()) {
			return;
		}

		// find tooltip target
		//
		let $el;
		if (options && options.el) {
			$el = $(options.el);
		} else if (!$el && this.$el.attr('data-toggle')) {
			$el = this.$el;
		} else {
			$el = this.$el.find('[data-toggle="tooltip"]').addClass('tooltip-trigger');	
		}
		
		// save options
		//
		if (options) {
			this.tooltip_options = options;
		}

		// show tooltips on trigger
		//
		$el.tooltip(_.extend({}, this.tooltip_defaults, this.tooltips, options));
	},

	findTooltipTriggers: function() {
		if (this.$el) {
			return this.$el.find('[data-toggle="tooltip"]');
		} else {
			return $('[data-toggle="tooltip"]');
		}
	},

	findTooltips: function() {
		if (this.$el) {
			return this.$el.find('.tooltip');
		} else {
			return $('.tooltip');
		}
	},

	showTooltips: function() {
		this.findTooltipTriggers().tooltip('show');
	},

	hideTooltips: function() {
		this.findTooltipTriggers().tooltip('hide');
	},

	disableTooltips: function() {
		this.findTooltipTriggers().tooltip('disable');
	},

	enableTooltips: function() {
		this.findTooltipTriggers().tooltip('enable');
	},

	removeTooltips: function() {
		$('.tooltip:not(.permanant)').remove();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// remove any tooltips that might have been created
		//
		this.removeTooltips();
	}
};