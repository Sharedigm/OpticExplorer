/******************************************************************************\
|                                                                              |
|                            add-items-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing information about a file.             |
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

	template: template(`
		<% if (description) { %>
		<br />
		<p style="text-align:center"><%= description %></p>
		<br />
		<% } %>
		
		<div class="items-source form-group">
			<label class="control-label"></label>
			<div class="controls controls-grid container">
				<div class="row">
		
					<div class="col-sm-6">
						<label class="grid-item">
							<div>
								<i class="normal icon fa fa-upload fa-3x"></i>
							</div>
							<div class="radio-inline">
								<input type="radio" name="photos-source" value="upload-files" checked>My Computer
							</div>		
						</label>
					</div>
		
					<div class="col-sm-6">
						<label class="grid-item">
							<div>
								<img <% if (pixelated) { %>class="pixelated" <% } %>src="<%= logo_url %>" style="height:3em" />
							</div>
							<div class="radio-inline">
								<input type="radio" name="photos-source" value="my-files"><%= application.name %>
							</div>
						</label>
					</div>
		
					<div class="col-sm-6">
						<label class="grid-item">
							<div>
								<i class="icon fab fa-google fa-3x"></i>
							</div>
							<div class="radio-inline">
								<input type="radio" name="photos-source" value="google-drive">Google Drive
							</div>	
						</label>
					</div>
		
					<div class="col-sm-6">
						<label class="grid-item">
							<div>
								<i class="icon fab fa-dropbox fa-3x"></i>
							</div>
							<div class="radio-inline">
								<input type="radio" name="photos-source" value="dropbox">Dropbox</label>
							</div>	
						</label>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'dblclick .grid-item': 'onDoubleClickItem'
	},

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'items-source':
				return this.$el.find('.items-source input:checked').val();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			description: this.options.description,
			logo_url: config.branding.welcome.splash.brand.logo.src,
			pixelated: config.branding.welcome.splash.brand.logo.rendering
		};
	},

	//
	// event handling methods
	//

	onDoubleClickItem: function(event) {

		// find double clicked item kind
		//
		let kind = $(event.target).closest('.grid-item').find('input').val();

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(kind);
		}
	}
});