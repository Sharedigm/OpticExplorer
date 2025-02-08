/******************************************************************************\
|                                                                              |
|                           user-website-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's website.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<% if (website_kinds) { %>
		<div class="website-kind form-group">
			<label class="control-label"><i class="fa fa-cloud"></i>Kind</label>
			<div class="controls">
				<select>
					<% let categories = Object.keys(website_kinds); %>
					<% for (let i = 0; i < categories.length; i++) { %>
					<% let category = categories[i]; %>
					<optgroup label="<%= category %>">
					<% let options = website_kinds[category]; %>
					<% let kinds = Object.keys(options); %>
					<% for (let j = 0; j < kinds.length; j++) { %>
						<% let kind = kinds[j]; %>;
						<% let option = options[kind]; %>
						<option value="<%= kind %>"<% if (website_kind == kind) { %> selected<% } %>><i class="<%= option.icon %>"></i><%= option.label %></option>	
					<% } %>
					<% } %>
				</select>
			</div>
		</div>
		<% } %>
		
		<div class="url form-group">
			<label class="control-label"><i class="fa fa-user"></i>URL</label>
			<div class="controls">
				<div class="input-group">
					<div class="input-group-addon">
						<select>
							<option value="http"<% if (protocol == 'http') { %> selected<% } %>>http://</option>
							<option value="https"<% if (protocol == 'https') { %> selected<% } %>>https://</option>
						</select>
					</div>
					<input type="text" class="form-control" value="<%= url %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="URL" data-content="This is the url / location / web address of your website."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'website_kind':
				return this.$el.find('.website-kind option:selected').val() || 'homepage';
			case 'protocol':
				return this.$el.find('.url option:selected').val();
			case 'url':
				return this.$el.find('.url input').val();
		}
	},

	getValues: function() {
		return {
			website_kind: this.getValue('website_kind'),
			protocol: this.getValue('protocol'),
			url: this.getValue('url')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let url = this.model.get('url');
		let pair = url? url.split('://') : null;

		return {
			protocol: pair && pair.length == 2? pair[0] : 'http',
			url: pair && pair.length == 2? pair[1] : url,
			website_kinds: config.defaults.websites || {}
		};
	}
});