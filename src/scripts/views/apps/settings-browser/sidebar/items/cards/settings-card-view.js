/******************************************************************************\
|                                                                              |
|                             settings-card-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a settings card.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../views/items/cards/card-view.js';
import Browser from '../../../../../../utilities/web/browser.js';

export default CardView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="card">
			<div class="icon"<% if (typeof background != 'undefined') { %> style="background-image:<%= background %>"<% } %>>
				<image src="<%= image %>" />
				<i class="<%= icon %>"></i>
				<div class="spinner"></div>
			</div>

			<div class="info">
				<div class="name" spellcheck="false"><%= name %></div>

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

	tooltips: {
		placement: 'top'
	},

	// prevent editing of app names
	//
	editable: false,

	// prevent multiple clicks
	//
	timeoutDuration: 300,

	//
	// querying methods
	//

	className: function() {
		let id = this.has('id')? this.get('id').replace('_', '-') : undefined;
		return (Browser.is_mobile? '' : 'unflickable ') + id + ' item';
	},

	//
	// getting methods
	//

	getImage: function() {
		return this.model.get('image');
	},

	getIcon: function() {
		return this.model.get('icon');
	},

	getName: function() {
		return this.model.get('name');
	},

	getColor: function() {
		return 'grey';
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			image: this.getImage(),
			icon: this.getIcon(),
			name: this.getName(),
			color: this.getColor()
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

		this.$el.find('.icon').addClass('colored').addClass(this.getColor());
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

		// perform open action
		//
		this.open();
	},

	onDoubleClick: function() {

		// do nothing
		//
	}
});