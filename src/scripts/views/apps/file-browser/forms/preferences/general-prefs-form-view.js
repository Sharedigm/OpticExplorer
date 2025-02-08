/******************************************************************************\
|                                                                              |
|                          general-prefs-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="view-kind form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Appearance</label>
			<div class="controls">
				<select>
					<option data-subtext="<i class='fa fa-th'></i>" value="icons"<% if (view_kind == 'icons') { %> selected<% } %>>Icons</option>
					<option data-subtext="<i class='fa fa-ellipsis-h'></i>" value="names"<% if (view_kind == 'names') { %> selected<% } %> class="desktop-only">Names</option>
					<option data-subtext="<i class='fa fa-list'></i>" value="lists"<% if (view_kind == 'lists') { %> selected<% } %>>Lists</option>
					<option data-subtext="<i class='fa fa-tree'></i>" value="trees"<% if (view_kind == 'trees') { %> selected<% } %>>Trees</option>
					<option data-subtext="<i class='fa fa-th-large'>" value="tiles"<% if (view_kind == 'tiles') { %> selected<% } %>>Tiles</option>
					<option data-subtext="<i class='fa fa-id-card'>" value="cards"<% if (view_kind == 'cards') { %> selected<% } %>>Cards</option>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Appearance" data-content="This is how files and folders are to be visually displayed."></i>
			</div>
		</div>
		
		<div class="detail-kind form-group">
			<label class="control-label"><i class="fa fa-search"></i>Details</label>
			<div class="controls">
				<select>
					<option value=""<% if (!detail_kind || detail_kind == '') { %> selected<% } %>>None</option>
					<option data-subtext="<i class='fa fa-download'></i>" value="size"<% if (detail_kind == 'size') { %> selected<% } %>>Size</option>
					<option data-subtext="<i class='fa fa-magic'></i>" value="create_date"<% if (detail_kind == 'create_date') { %> selected<% } %>>Create Date</option>
					<option data-subtext="<i class='fa fa-check'></i>" value="modify_date"<% if (detail_kind == 'modify_date') { %> selected<% } %>>Modify Date</option>
					<option data-subtext="<i class='fa fa-eye'></i>" value="access_date"<% if (detail_kind == 'access_date') { %> selected<% } %>>Access Date</option>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Details" data-content="This is what details to include about files and folders."></i>
			</div>
		</div>
		
		<div class="tile-size form-group">
			<label class="control-label"><i class="fa fa-th-large"></i>Tile Size</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="tile-size" value="small"<% if (tile_size == 'small') { %> checked<% } %>>Small</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tile-size" value="medium"<% if (tile_size == 'medium') { %> checked<% } %>>Med</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="tile-size" value="large"<% if (tile_size == 'large') { %> checked<% } %>>Large</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Tile Size" data-content="This is what size tiles to display when the appearance is set to tiles."></i>
			</div>
		</div>
		
		<div class="open-folders-in-new-window form-group">
			<label class="control-label"><i class="fa fa-folder-open"></i>Open Folders</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="open-folders" value="same-window"<% if (!open_folders_in_new_window) { %> checked<% } %>>Same Window</label>
				</div>
				
				<div class="radio-inline">
					<label><input type="radio" name="open-folders" value="new-window"<% if (open_folders_in_new_window) { %> checked<% } %>>New Window</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Open Folders" data-content="This determines how folders are to be displayed when they are opened."></i>
			</div>
		</div>
	`),

	events: {
		'change .view-kind select': 'onChangeViewKind',
		'change .detail-kind select': 'onChangeDetailKind',
		'change .tile-size input': 'onChangeTileSize',
		'change .open-folders-in-new-window input': 'onChangeOpenFoldersInNewWindow',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'view_kind':
				return this.$el.find('.view-kind select').val();
			case 'detail_kind':
				return this.$el.find('.detail-kind select').val();
			case 'tile_size':
				return this.$el.find('.tile-size input:checked').val();
			case 'open_folders_in_new_window':
				return this.$el.find('.open-folders-in-new-window input:checked').val() == 'new-window';
		}
	},

	getValues: function() {
		return {
			view_kind: this.getValue('view_kind'),
			detail_kind: this.getValue('detail_kind'),
			tile_size: this.getValue('tile_size'),
			open_folders_in_new_window: this.getValue('open_folders_in_new_window'),
		};
	},

	//
	// event handling methods
	//

	onChangeViewKind: function() {
		this.onChangeValue('view_kind', this.getValue('view_kind'));
	},

	onChangeDetailKind: function() {
		this.onChangeValue('detail_kind', this.getValue('detail_kind'));
	},

	onChangeTileSize: function() {
		this.onChangeValue('tile_size', this.getValue('tile_size'));
	},

	onChangeOpenFoldersInNewWindow: function() {
		this.onChangeValue('open_folders_in_new_window', this.getValue('open_folders_in_new_window'));
	}
});