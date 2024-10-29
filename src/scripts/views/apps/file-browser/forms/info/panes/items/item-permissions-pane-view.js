/******************************************************************************\
|                                                                              |
|                         item-permissions-pane-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing file permissions information.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../../views/forms/form-view.js';
import Permissions from '../../../../../../../utilities/files/permissions.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="owner form-group">
			<label class="control-label"><i class="fa fa-user"></i>Owner</label>
			<div class="controls">
		
				<div class="read checkbox-inline">
					<label><input type="checkbox" disabled<% if (permissions['owner']['readable']) { %> checked<% } %>>Read</label>
				</div>
		
				<div class="write checkbox-inline">
					<label><input type="checkbox"<% if (permissions['owner']['writable']) { %> checked<% } %>>Write</label>
				</div>
		
				<div class="execute checkbox-inline" style="display:none">
					<label><input type="checkbox" disabled<% if (permissions['owner']['executable']) { %> checked<% } %>>Execute</label>
				</div>
			</div>
		</div>
		
		<div class="connections form-group">
			<label class="control-label"><i class="fa fa-user-friends"></i>Connections</label>
			<div class="controls">
		
				<div class="read checkbox-inline">
					<label><input type="checkbox"<% if (permissions['group']['readable']) { %> checked<% } %>>Read</label>
				</div>
		
				<div class="write checkbox-inline">
					<label><input type="checkbox"<% if (permissions['group']['writable']) { %> checked<% } %>>Write</label>
				</div>
		
				<div class="execute checkbox-inline" style="display:none">
					<label><input type="checkbox" disabled<% if (permissions['group']['executable']) { %> checked<% } %>>Execute</label>
				</div>
			</div>
		</div>
		
		<div class="everyone form-group">
			<label class="control-label"><i class="fa fa-globe"></i>Everyone</label>
			<div class="controls">
		
				<div class="read checkbox-inline">
					<label><input type="checkbox"<% if (permissions['other']['readable']) { %> checked<% } %>>Read</label>
				</div>
		
				<div class="write checkbox-inline">
					<label><input type="checkbox"<% if (permissions['other']['writable']) { %> checked<% } %>>Write</label>
				</div>
		
				<div class="execute checkbox-inline" style="display:none">
					<label><input type="checkbox" disabled<% if (permissions['other']['executable']) { %> checked<% } %>>Execute</label>
				</div>
			</div>
		</div>
		
		<div class="recursive form-group" style="display:none">
			<label class="control-label"></label>
			<div class="controls">
			
				<div class="checkbox-inline">
					<input type="checkbox">Apply to contained files and folders
				</div>
			</div>
		</div>
	`),

	events: {
		'click input[type="checkbox"]': 'onClickCheckbox'
	},

	//
	// form querying methods
	//

	getPermissions: function() {
		let permissions = '';
		
		permissions += this.$el.find('.owner .read input').is(':checked')? 'r' : '-';
		permissions += this.$el.find('.owner .write input').is(':checked')? 'w' : '-';
		permissions += this.$el.find('.owner .execute input').is(':checked')? 'x' : '-';

		permissions += this.$el.find('.connections .read input').is(':checked')? 'r' : '-';
		permissions += this.$el.find('.connections .write input').is(':checked')? 'w' : '-';
		permissions += this.$el.find('.connections .execute input').is(':checked')? 'x' : '-';

		permissions += this.$el.find('.everyone .read input').is(':checked')? 'r' : '-';
		permissions += this.$el.find('.everyone .write input').is(':checked')? 'w' : '-';
		permissions += this.$el.find('.everyone .execute input').is(':checked')? 'x' : '-';

		return Permissions.stringToOctal(permissions);
	},

	isRecursive: function() {
		return this.$el.find('.recursive input').is(':checked');
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			permissions: Permissions.toObject(this.model.get('permissions'))
		};
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function() {

		// set model permissions
		//
		this.model.set({
			permissions: this.getPermissions()
		});

		// show recursive checkbox
		//
		if (this.options.recursive) {
			this.$el.find('.recursive').show();
		}
	}
});
