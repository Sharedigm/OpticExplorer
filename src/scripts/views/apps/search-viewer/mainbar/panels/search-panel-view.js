/******************************************************************************\
|                                                                              |
|                            search-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import DroppableUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/droppable-uploadable.js';

export default BaseView.extend(_.extend({}, DroppableUploadable, {

	//
	// attributes
	//

	className: 'search-panel',

	template: template(`
		<div class="panel">
			<div class="icon">
				<i class="fa fa-file"></i>
			</div>
			<h1>Search By File</h1>
			<h3>Drag and drop or select a file to search for the contents of this file.</h3>

			<button class="select-file btn btn-primary"><i class="fa fa-mouse-pointer"></i>Select File</button>
			<input type="file" id="file" class="form-control" style="display:none" />

			<div class="buttons" style="display:none">
				<button class="submit btn btn-primary"><i class="fa fa-search"></i>Search</button>
				<button class="clear btn" ><i class="fa fa-xmark"></i>Clear</button>
			</div>
		</div>
	`),

	events: _.extend({}, DroppableUploadable.events, {
		'click .select-file': 'onClickSelectFile',
		'change input[type="file"]': 'onChangeFile',
		'click .submit': 'onClickSubmitFile',
		'click .clear': 'onClickClearFile'
	}),

	//
	// getting methods
	//

	getFile: function() {
		return this.$el.find('#file')[0].files[0];
	},

	//
	// setting methods
	//

	setFiles: function(files) {
		const fileInput = this.$el.find('#file')[0];

		// set file input
		//
		if (fileInput) {
			fileInput.files = files;
		}

		// set input filename (required for Safari)
		//
		this.setFilename(files[0].name);

		// show files
		//
		this.onChangeFile();
	},

	setFilename: function(filename) {
		const fileInput = this.$el.find('#file')[0];

		// Help Safari out
		//
		if (fileInput.webkitEntries.length) {
			fileInput.dataset.file = filename;
		}
	},

	//
	// rendering methods
	//

	clear: function() {

		// update search view
		//
		this.update();
	},

	//
	// mouse event handling methods
	//

	onClickSubmitFile: function() {
		this.parent.search();
	},

	onClickClearFile: function() {
		this.clear();
	},

	//
	// file event handling methods
	//

	onClickSelectFile: function() {
		this.$el.find('input[type="file"]').trigger('click');
	},

	onChangeFile: function(event) {

		// update view
		//
		this.$el.find('input[type="file"]').show();
		this.$el.find('h3').text("Click the search button to search for the contents of this file.");
		this.$el.find('.select-file').hide();
		this.$el.find('.buttons').show();

		// set input filename (required for Safari)
		//
		if (event) {
			let filename = event.target.files[0].name;
			this.setFilename(filename);
		}
	},

	//
	// drag and drop event handling methods
	//

	onDrop: function(event) {

		// call mixin method
		//
		DroppableUploadable.onDrop.call(this, event);

		// change file input
		//
		// this.setFiles(event.originalEvent.dataTransfer.files);
	}
}));