/******************************************************************************\
|                                                                              |
|                        connection-info-pane-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing connection general information.       |
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
		<div class="connection-name form-group">
			<label class="control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<p class="form-control-static">
					<%= full_name %>
				</p>
			</div>
		</div>
		
		<div class="online-status form-group">
			<label class="control-label"><i class="fa fa-wifi"></i>Online</label>
			<div class="controls">
				<p class="form-control-static">
					<%= online? "yes" : "no" %>
				</p>
			</div>
		</div>
		
		<div class="active-status form-group">
			<label class="control-label"><i class="fa fa-bed"></i>Active</label>
			<div class="controls">
				<p class="form-control-static">
					<%= active? "yes" : "no" %>
				</p>
			</div>
		</div>
		
		<div class="mutual-connections form-group" style="display:none">
			<label class="control-label"><i class="fa fa-user-friends"></i>Mutual Connections</label>
			<div class="controls">
				<p class="form-control-static count">
				</p>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			online: this.model.isOnline(),
			active: this.model.isActive()
		};
	},
});