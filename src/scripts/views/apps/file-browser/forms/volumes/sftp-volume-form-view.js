/******************************************************************************\
|                                                                              |
|                           sftp-volume-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing file volume information.                  |
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
		<div class="host form-group">
			<label class="required control-label"><i class="fa fa-laptop"></i>Host</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= host %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Host" data-content="This is the host name of your FTP site (i.e. ftp.mycompany.com)."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="username form-group">
			<label class="required control-label"><i class="fa fa-user"></i>Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= username %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="This is your account name at your FTP site."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="password form-group">
			<label class="required control-label"><i class="fa fa-key"></i>Password</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= password %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Password" data-content="This is the password of FTP account."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="port form-group">
			<label class="control-label"><i class="fa fa-ship"></i>Port</label>
			<div class="controls">
				<div class="input-group" style="width:100px">
					<input type="number" class="required form-control" value="<%= port %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Port" data-content="This is the port of your FTP server."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="root form-group">
			<label class="control-label"><i class="fa fa-sitemap"></i>Root</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= root %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Root" data-content="This is the root directory at your FTP server."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="options form-group">
			<label class="control-label"><i class="fa fa-check"></i>Options</label>
			<div class="controls">

				<div class="passive checkbox-inline">
					<label><input type="checkbox"<% if (passive) { %> checked<% } %> />Passive</label>
					<i class="active fa fa-question-circle" data-toggle="popover" title="Passive" data-content="This is whether to use passive mode."></i>
				</div>

				<div class="ssl checkbox-inline">
					<label><input type="checkbox"<% if (ssl) { %> checked<% } %> />SSL</label>
					<i class="active fa fa-question-circle" data-toggle="popover" title="SSL" data-content="This is whether to use SSL (secure sockets layer)."></i>
				</div>
			</div>
		</div>
	`),

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'host':
				return this.$el.find('.host input').val();
			case 'username':
				return this.$el.find('.username input').val();
			case 'password':
				return this.$el.find('.password input').val();
			case 'port':
				return parseInt(this.$el.find('.port input').val());
			case 'root':
				return this.$el.find('.root input').val();
			case 'passive':
				return this.$el.find('.passive input').is(':checked');
			case 'ssl':
				return this.$el.find('.ssl input').is(':checked');
		}
	},

	getValues: function() {
		return {
			host: this.getValue('host'),
			username: this.getValue('username'),
			password: this.getValue('password'),
			port: this.getValue('port'),
			root: this.getValue('root'),
			passive: this.getValue('passive'),
			ssl: this.getValue('ssl')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			host: undefined,
			username: undefined,
			password: undefined,
			port: 22,
			root: '/',
			passive: true,
			ssl: true
		};
	}
});