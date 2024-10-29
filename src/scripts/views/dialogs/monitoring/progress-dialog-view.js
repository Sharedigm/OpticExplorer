/******************************************************************************\
|                                                                              |
|                            progress-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification dialog that is used to show a             |
|        progress dialog box.                                                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../views/dialogs/dialog-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	className: 'progressive modal',

	template: template(`
		<div class="modal-dialog" style="width:450px">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<% if (icon) { %>
						<%= icon %>
						<% } else { %>
						<i class="fa fa-spinner"></i>
						<% } %>
					</div>
					<div class="title">
						<%= title || "Progress" %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body" style="padding:10px">
					<div style="float:left; margin-right:10px;">
						<%= message %>
						<div class="amount" style="display:inline-block"><%= amount %></div>
					</div>
					<% if (cancelable) { %>
					<div style="float:right; margin-left:10px;">
						<button type="button" class="cancel warning btn btn-sm" style="margin-top:-4px">
							<i class="fa fa-xmark"></i>
						</button>
					</div>
					<% } %>
					<div class="progress" style="margin-top:6px">
						<div class="bar" style="width:0"></div>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, DialogView.prototype.events, {
		'click .cancel': 'onClickCancel'
	}),

	//
	// dialog attributes
	//

	resizable: false,
	maximizable: false,
	closeable: false,

	//
	// setting methods
	//

	setAmount: function(amount, options) {
		if (options && options.digits) {
			this.$el.find('.amount').html('<div style="width:' + options.digits + 'ch">' + amount + '</div>');
		} else {
			this.$el.find('.amount').html(amount);
		}
	},

	setBarPercent: function(percent) {
		this.$el.find('.progress .bar').css('width', percent + '%');
	},
	
	//
	// percent setting methods
	//

	setPercentAmount: function(percent) {
		this.setAmount(percent + '%', {
			digits: (percent + '%').length
		});
	},

	setPercent: function(percent) {
		this.setPercentAmount(Math.round(percent));
		this.setBarPercent(percent);
	},

	//
	// fraction setting methods
	//

	setFractionAmount: function(numerator, denominator) {
		this.setAmount(numerator + ' / ' + denominator, {
			digits: (numerator + '/' + denominator).length
		});
	},

	setFraction: function(numerator, denominator) {
		this.setFractionAmount(numerator, denominator);
		this.setBarPercent(numerator / denominator * 100);
	},

	//
	// dialog methods
	//

	cancel: function() {

		// perform callback
		//
		if (this.options.cancel) {
			this.options.cancel();
		}

		// close dialog
		//
		this.close();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.options.icon,
			title: this.options.title,
			amount: this.options.amount,
			message: this.options.message,
			cancelable: this.options.cancelable
		};
	},

	onRender: function() {

		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// set initial value
		//
		if (this.options.fraction) {
			this.setFraction(this.options.fraction.numerator, this.options.fraction.denominator);
		}
		if (this.options.percent != undefined) {
			this.setPercent(this.options.percent);
		}
	},

	//
	// mouse event handling methods
	//

	onClickCancel: function() {
		this.cancel();
	}
});
