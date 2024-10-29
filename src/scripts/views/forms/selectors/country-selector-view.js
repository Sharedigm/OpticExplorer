/******************************************************************************\
|                                                                              |
|                              country-selector-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for selecting a country from a list.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Country from '../../../models/utilities/country.js';
import Countries from '../../../collections/utilities/countries.js';
import ModelSelectorView from '../../../views/forms/selectors/model-selector-view.js';
import '../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

let countries = new Countries();

export default ModelSelectorView.extend({

	//
	// attributes
	//

	/*
	tagName: 'select',
	className: 'selectpicker',
	*/

	tagName: 'div',
	className: 'country selector',

	template: template(`
		<select class="selectpicker">
			<% for (let i = 0; i < items.length; i++) { %>
				<option data-subtext="<img src='vendor/flags/blank.gif' style='margin-top:2px; margin-right:10px' class='pull-left flag flag-<%= items[i].iso.toLowerCase() %>' />">
					<%= items[i].name %>
				</option>
			<% } %>
		</select>
	`),

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.initialValue) {

			// convert type of initial value to a country
			//
			if (typeof this.options.initialValue == 'string') {
				this.options.initialValue = new Country({
					name: this.options.initialValue
				});
			}
			this.selected = this.options.initialValue;
		}

		// fetch countries
		//
		this.collection = countries;
		if (countries.length == 0) {
			this.collection.fetch({

				// callbacks
				//
				success: (collection) => {

					// add blank item in case users don't want
					// to specify a country
					//
					collection.unshift({
						name: '',
						iso: ''
					});

					// render the template
					//
					this.render();
				}
			});
		}
	},

	//
	// getting methods
	//

	getSelectedIndex: function() {
		return this.$el.find('select')[0].selectedIndex;
	},

	//
	// setting methods
	//

	setSelectedIndex: function(index) {
		this.$el.find('select')[0].selectedIndex = index;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set initial selection
		//
		if (this.options.initialValue) {

			// set selected item
			//
			this.$el.find('select')[0].selectedIndex = this.collection.indexOf(this.collection.findWhere({
				'name': this.options.initialValue.get('name')
			}));
		}

		// enable custom select
		//
		this.$el.find('select').selectpicker({
			showSubtext: true
		});

		// perform callback
		//
		if (this.options.onRender) {
			this.options.onRender();
		}
	}
});