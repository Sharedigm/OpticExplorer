/******************************************************************************\
|                                                                              |
|                               app-card-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single application card item.                |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../views/items/cards/card-view.js';
import Browser from '../../../../../utilities/web/browser.js';

export default CardView.extend({

	//
	// attributes
	//

	className: 'item',

	template: template(`
		<div class="card">
			<div class="icon"<% if (typeof background != 'undefined') { %> style="background-image:<%= background %>"<% } %>>
				<image src="<%= image %>" />
				<!-- <i class="<%= icon %>"></i> -->
				<div class="spinner"></div>
			</div>

			<div class="info">
				<div class="name"><%= name %></div>

				<% if (typeof details != 'undefined') { %>
				<div class="row">
					<span class="details"><%= details %></span>
				</div>
				<% } %>
			</div>
		</div>
	`),

	events: _.extend({}, CardView.prototype.events, {
		'click': 'onClick'
	}),

	//
	// getting methods
	//

	getImage: function() {
		if (this.has('image')) {
			return 'images/icons/apps/' + this.get('image');
		} else {
			return 'images/icons/apps/' + this.get('app') + '.svg';
		}
	},

	getIcon: function() {
		return this.get('icon');
	},

	getName: function() {
		return this.get('name');
	},

	getColor: function() {
		return this.get('color');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			image: this.getImage(),
			icon: this.getIcon(),
			name: this.getName(),
			details: this.getDetails()
		};
	},

	onRender: function() {

		// call superclass method
		//
		CardView.prototype.onRender.call(this);

		// set disabled
		//
		if (this.model.has('disabled') && this.model.get('disabled')) {
			this.$el.addClass('disabled');
		}

		// add app color
		//
		let color = this.model.get('color');
		if (color) {
			this.$el.find('.icon').addClass(color + ' colored');
		}

		if (Browser.is_mobile) {

			// hide desktop only icons
			//
			if (this.model.has('platform') && this.model.get('platform') == 'desktop') {
				this.$el.hide();
			}
		} else {

			// hide mobile only icons
			//
			if (this.model.has('platform') && this.model.get('platform') == 'mobile') {
				this.$el.hide();
			}			
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// prevent multiple clicks
		//
		if (this.clicked || this.isLoading()) {
			return;
		}

		// call superclass method
		//
		CardView.prototype.onMouseDown.call(this, event);

		// perform callback
		//
		if (this.options.onclick) {
			this.options.onclick(this);
		}
	},

	onDoubleClick: function() {

		// do nothing
		//
	}
});