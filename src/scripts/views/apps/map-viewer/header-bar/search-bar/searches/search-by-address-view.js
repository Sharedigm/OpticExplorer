/******************************************************************************\
|                                                                              |
|                            search-by-address-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByTextView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-text-view.js';
import SearchOptionsListView from '../../../../../../views/apps/map-viewer/header-bar/search-bar/search-options-list/search-options-list-view.js';
import GoogleAutocomplete from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/autocomplete/google-autocomplete.js';

export default SearchByTextView.extend({

	//
	// attributes
	//

	icon: 'fa fa-home',
	placeholder: "Search by Address",

	template: template(`
		<div class="search-by-address input-group">
			<div class="input-group-addon">
				<i class="<%= icon %>"></i>
			</div>
		
			<input type="search" class="form-control" placeholder="<%= placeholder %>" spellcheck="false" value="<%= value %>">
			
			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
		<div id="autocomplete" class="dropdown open"></div>
	`),

	regions: {
		autocomplete: '#autocomplete'
	},

	//
	// form methods
	//

	searchFor: function(value) {
		this.parent.app.searchFor({
			address: value
		});
	},

	autocomplete: function() {
		if (config.geocoding.google) {
			let value = this.$el.find('input').val();
			GoogleAutocomplete.submit(value, (suggestions) => {
				this.showAutocompleteList(suggestions);
			});
		}
	},

	//
	// rendering methods
	//

	showAutocompleteList: function(suggestions) {
		this.showChildView('autocomplete', new SearchOptionsListView({
			suggestions: suggestions,

			// callbacks
			//
			onclick: (value) => {
				this.setValue(value);
				this.submit();
			}
		}));
	},

	//
	// form methods
	//

	onInput: function() {
		this.autocomplete();
	},

	submit: function() {
		this.searchFor(this.getValue());
	}
});