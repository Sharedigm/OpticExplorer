/******************************************************************************\
|                                                                              |
|                        connection-request-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a connection request.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ConnectionRequest from '../../../../../models/connections/connection-request.js';
import ConnectionRequests from '../../../../../collections/connections/connection-requests.js';
import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="recipient form-group">
			<label class="control-label"><i class="fa fa-user"></i>To</label>
			<div class="controls">
				<p class="form-control-static">
					<%= names.join(', ') %>
				</p>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" name="message" rows="4" maxlength="1000"><%= message || "Let's connect!" %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is a message to send along with your connection request."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getNames: function() {
		let names = [];
		for (let i = 0; i < this.collection.length; i++) {
			names.push(this.collection.at(i).get('full_name'));
		}
		return names;
	},

	getConnectionRequests: function(data) {
		let collection = new ConnectionRequests();
		for (let i = 0; i < this.collection.length; i++) {
			collection.add(new ConnectionRequest(_.extend(data, {
				connection_id: this.collection.at(i).get('id')
			})));
		}
		return collection;
	},

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	},

	getValues: function() {
		return {
			message: this.getValue('message')
		};
	},

	submit: function(options) {
		this.getConnectionRequests({
			message: this.getValue('message'),
			user_id: this.model.get('id')
		}).save(options);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			names: this.getNames(),
			message: this.options.message
		};
	}
});