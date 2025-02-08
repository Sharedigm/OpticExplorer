/******************************************************************************\
|                                                                              |
|                           contact-address-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a contact's street address.             |
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
import Expandable from '../../../../../../views/behaviors/expanders/expandable.js';
import '../../../../../../utilities/scripting/string-utils.js';
import '../../../../../../utilities/time/date-utils.js';

export default CardView.extend(_.extend({}, Expandable, {

	//
	// attributes
	//

	className: 'expandable item',

	template: template(`
		<div class="card">
		
			<div class="icon">
				<%= icon %>
			</div>
		
			<div class="info">
		
				<span class="row">
					<div class="title">			
						<% if (street_address) { %>
						<%= street_address %>
						<% } %>
						<% if (apartment) { %>
						Apt. <%= apartment %>
						<% } %>
					</div>
				</span>
		
				<span class="row">		
					<a class="map-marker">
						<% if (city || state || postal_code || country) { %>
						<%= city %>, <%= state %> <%= postal_code %> <%= country != 'United States'? country : '' %>
						<% } %>
		
						<img src='vendor/flags/blank.gif' class='flag flag-<%= flag %>' />
						<i class="fa fa-map-marker-alt" data-toggle="tooltip" title="Visit Address"></i>
					</a>
				</span>
		
				<div class="row">
					<span class="details"><%= (address_kind || 'Home').toTitleCase() %> Address</span>
				</div>
			</div>
		</div>
	`),
	editable: false,

	events: _.extend({}, CardView.prototype.events, Expandable.events, {
		'click .map-marker': 'onClickMapMarker'
	}),

	//
	// getting methods
	//

	getIcon: function() {
		switch (this.model.get('address_kind')) {
			case 'home':
				return '<i class="fa fa-home"></i>'; 
			case 'work':
				return '<i class="fa fa-briefcase"></i>';
			default:
				return '<i class="fa fa-home"></i>'; 
		}
	},

	getCountry: function() {
		return this.options.countries? this.options.countries.findWhere({
			'name': this.model.getCountryName()
		}) : undefined;
	},

	getFlag: function() {
		let country = this.getCountry();
		if (country) {
			return country.getFlag();
		}
	},

	getDescription: function() {
		return this.model.get('street_address') || "this address";
	},

	//
	// opening methods
	//

	open: function() {
		if (this.options.editable) {
			this.edit();
		}
	},

	edit: function() {
		import(
			'../../../../../../views/apps/contact-editor/dialogs/contacts/edit/contacts/edit-user-address-dialog-view.js'
		).then((EditUserAddressDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserAddressDialogView.default({
				model: this.model,

				// callbacks
				//
				onchange: () => this.render()
			}));
		});
	},

	delete: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + this.getDescription() + " from your contacts?",

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user address
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			country: this.model.getCountryName(),
			flag: this.getFlag(),

			// capabilities
			//
			expandable: this.options.expandable
		};
	},

	onRender: function() {
		this.addTooltips();
	},

	showMap: function() {
		application.launch('map_viewer', {
			search: {
				address: this.model.toString()
			}
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update
		//
		this.render();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	},

	onClickMapMarker: function() {
		this.showMap();
	}
}));