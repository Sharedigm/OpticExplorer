/******************************************************************************\
|                                                                              |
|                               display-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for performing calculations.                 |
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
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'lcd display',

	template: template(`
		<div class="trig-mode indicator">deg</div>
		<div class="hyp-mode indicator" style="display:none">hyp</div>
		<div class="mem-mode indicator" style="display:none">mem</div>
		<div class="base-mode indicator">dec</div>
		
		<div class="digits">0</div>
	`),

	//
	// display attributes
	//

	digits: [
		25, 13
	],

	//
	// querying methods
	//

	isHypMode: function() {
		return this.$el.find('.hyp-mode').is(':visible');
	},

	numDigits: function() {
		if (Browser.is_mobile && this.parent.getMode() != 'basic') {
			return this.parent.getPageOrientation() == 'landscape'? this.digits[0] : this.digits[1];
		} else {
			return this.digits[1];
		}
	},

	//
	// getting methods
	//

	getDigits: function() {
		return this.$el.find('.digits').text();
	},

	getTrigMode: function() {
		return this.$el.find('.trig-mode').text();
	},

	getBaseMode: function() {
		return this.$el.find('.base-mode').text();
	},

	//
	// setting methods
	//

	setDigits: function(string) {

		// limit string to length of display
		//
		let substring = string.substring(0, this.numDigits());

		// update display
		//
		this.$el.find('.digits').text(substring);
	},

	setBaseMode: function(baseMode) {

		// convert display
		//
		let digits = this.getDigits();
		digits = this.parent.convertDigits(digits, this.getBaseMode(), baseMode);
		this.setDigits(digits);

		// set mode indicator
		//
		this.$el.find('.base-mode').text(baseMode);
	},

	setTrigMode: function(trigMode) {
		this.$el.find('.trig-mode').text(trigMode);
	},

	toggleHypMode: function() {
		if (this.isHypMode()) {
			this.$el.find('.hyp-mode').hide();
		} else {
			this.$el.find('.hyp-mode').show();	
		}
	},

	//
	// rendering methods
	//

	clear: function() {
		this.$el.find('.digits').text('');
	},
});