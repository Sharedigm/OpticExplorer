/******************************************************************************\
|                                                                              |
|                              search-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for a project finder search bar.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'search toolbar form-inline',

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="fa fa-hashtag"></i>
			</div>
		
			<input type="search" class="form-control" placeholder="Search projects" value="<%= search %>">
		
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	events: {
		'search input': 'onSearchInput',
		'click .btn': 'onSearchInput'
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('input').val();
	},

	//
	// setting methods
	//

	setValue: function(value) {
		this.$el.find('input').val(value);
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			search: this.options.search
		};
	},

	//
	// event handling methods
	//

	onSearchInput: function() {

		// perform callback
		//
		if (this.options.onsearch) {
			this.options.onsearch(this.getValue());
		}
	}
});