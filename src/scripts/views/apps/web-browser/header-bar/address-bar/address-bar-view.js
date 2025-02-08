/******************************************************************************\
|                                                                              |
|                               address-bar-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for a web browser address / search bar.           |
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

	className: 'address toolbar form-inline',

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="fa fa-globe"></i>
			</div>
		
			<input type="search" class="form-control" placeholder="Address or Search" value="<%= address %>">
		
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	events: {
		'change input': 'onChangeInput',
		'click .btn': 'onClickButton'
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
			address: this.options.url
		};
	},

	//
	// event handling methods
	//

	onChangeInput: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.getValue());
		}
	},

	onClickButton: function() {

		// perform callback
		//
		if (this.options.onReload) {
			this.options.onReload(this.getValue());
		}
	}
});