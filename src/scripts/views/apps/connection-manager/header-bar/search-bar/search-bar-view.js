/******************************************************************************\
|                                                                              |
|                              search-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching connections.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchBarView from '../../../../../views/apps/common/header-bar/search-bar/search-bar-view.js';

export default SearchBarView.extend({

	//
	// getting methods
	//

	getValue: function() {
		return this.getChildView('searches').getValue();
	},

	//
	// setting methods
	//

	setValue: function(value) {
		this.getChildView('searches').setValue(value);
	},

	//
	// rendering methods
	//

	showSearchByName: function() {
		import(
			'../../../../../views/apps/common/header-bar/search-bar/searches/search-by-name-view.js'
		).then((SearchByNameView) => {

			// show search
			//
			this.showChildView('searches', new SearchByNameView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByLocation: function() {
		import(
			'../../../../../views/apps/connection-manager/header-bar/search-bar/searches/search-by-location-view.js'
		).then((SearchByLocationView) => {

			// show search
			//
			this.showChildView('searches', new SearchByLocationView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByOccupation: function() {
		import(
			'../../../../../views/apps/connection-manager/header-bar/search-bar/searches/search-by-occupation-view.js'
		).then((SearchByOccupationView) => {

			// show search
			//
			this.showChildView('searches', new SearchByOccupationView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByAge: function() {
		import(
			'../../../../../views/apps/connection-manager/header-bar/search-bar/searches/search-by-age-view.js'
		).then((SearchByAgeView) => {

			// show search
			//
			this.showChildView('searches', new SearchByAgeView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByGender: function() {
		import(
			'../../../../../views/apps/connection-manager/header-bar/search-bar/searches/search-by-gender-view.js'
		).then((SearchByGenderView) => {

			// show search
			//
			this.showChildView('searches', new SearchByGenderView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByDate: function(kind) {
		import(
			'../../../../../views/apps/common/header-bar/search-bar/searches/search-by-date-view.js'
		).then((SearchByDateView) => {

			// show search
			//
			this.showChildView('searches', new SearchByDateView.default({
				model: this.model,

				// options
				//
				kind: kind
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	onRender: function() {

		// call superclass method
		//
		SearchBarView.prototype.onRender.call(this);

		// set search kind
		//
		switch (this.options.kind) {

			case 'name':
				this.showSearchByName();
				break;

			case 'location':
				this.showSearchByLocation();
				break;

			case 'occupation':
				this.showSearchByOccupation();
				break;

			case 'age':
				this.showSearchByAge();
				break;

			case 'gender':
				this.showSearchByGender();
				break;

			case 'birth_date':
			case 'join_date':
			case 'connect_date':
				this.showSearchByDate(this.options.kind);
				break;
				
			default:
				this.clear();
				break;
		}
	}
});