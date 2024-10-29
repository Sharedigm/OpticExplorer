/******************************************************************************\
|                                                                              |
|                             volume-form-view.js                              |
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
import FtpVolumeFormView from '../../../../../views/apps/file-browser/forms/volumes/ftp-volume-form-view.js';
import SftpVolumeFormView from '../../../../../views/apps/file-browser/forms/volumes/sftp-volume-form-view.js';
import S3VolumeFormView from '../../../../../views/apps/file-browser/forms/volumes/s3-volume-form-view.js';
import DropboxVolumeFormView from '../../../../../views/apps/file-browser/forms/volumes/dropbox-volume-form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="volume-type form-group">
			<label class="control-label"><i class="fa fa-database"></i>Type</label>
			<div class="controls">
				<select>
					<% let keys = Object.keys(types); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<option value="<%= keys[i] %>"<% if (type == keys[i]) { %> selected<% } %>><%= types[keys[i]] %></option>
					<% } %>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Volume Type" data-content="This is the type of remote volume."></i>
			</div>
		</div>
		
		<div class="form"></form>
	`),

	regions: {
		'form': '.form'
	},

	events: {
		'change .volume-type': 'onChangeVolumeType'
	},

	//
	// form querying methods
	//

	getType: function() {
		return this.$el.find('.volume-type select').val();
	},

	getValues: function() {
		return _.extend({
			type: this.getType()
		}, this.getChildView('form').getValues());
	},

	getFormClass: function() {
		switch (this.getType()) {
			case 'ftp':
				return FtpVolumeFormView;
			case 'sftp':
				return SftpVolumeFormView;
			case 's3':
				return S3VolumeFormView;
			case 'dpbx':
				return DropboxVolumeFormView;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			type: 'sftp',
			types: {
				ftp: 'FTP',
				sftp: 'SFTP',
				s3: 'S3',
				gdrv: 'Google Drive',
				dpbx: 'DropBox'
			}
		};
	},

	onRender: function() {
		let FormClass = this.getFormClass();

		// show child view
		//
		if (FormClass) {
			this.showChildView('form', new FormClass({

				// callbacks
				//
				onvalidate: (valid) => this.options.onvalidate(valid),
				onchange: () => this.options.onchange,
				onsubmit: () => this.options.onsubmit
			}));
		}
	},

	onChangeVolumeType: function() {
		this.onRender();
	}
});