/******************************************************************************\
|                                                                              |
|                            s3-volume-form-view.js                            |
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

import S3Storage from '../../../../../models/storage/volumes/s3-storage.js';
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
						<i class="active fa fa-question-circle" data-toggle="popover" title="Host" data-content="This is the hostname of your bucket (i.e. s3.company.com)."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="key form-group">
			<label class="required control-label"><i class="fa fa-key"></i>Key</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= key %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Key" data-content="This is the key that identifies your bucket."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="secret form-group">
			<label class="required control-label"><i class="fa fa-user-secret"></i>Secret</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= secret %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Secret" data-content="This is the secret that acts as a passkey to your bucket."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="bucket form-group">
			<label class="required control-label"><i class="fa fa-archive"></i>Bucket</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= bucket %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Bucket" data-content="This is name of your bucket."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="region form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Region</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= region %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Region" data-content="This is the region where your bucket is located."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// constructor
	//

	initialize: function() {
		if (!this.model) {
			this.model = new S3Storage();
		}
	},

	//
	// ajax methods
	//

	checkStorage: function(options) {
		new S3Storage(this.getValues()).check(options);
	},

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'host':
				return this.$el.find('.host input').val();
			case 'key':
				return this.$el.find('.key input').val();
			case 'secret':
				return this.$el.find('.secret input').val();
			case 'bucket':
				return this.$el.find('.bucket input').val();
			case 'region':
				return this.$el.find('.region input').val();
		}
	},

	getValues: function() {
		return {
			host: this.getValue('host'),
			key: this.getValue('key'),
			secret: this.getValue('secret'),
			bucket: this.getValue('bucket'),
			region: this.getValue('region')
		};
	}
});