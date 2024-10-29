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
					<option data-subtext="<i class='fa fa-th-large'>" value="tiles"<% if (view_kind == 'tiles') { %> selected<% } %>>Tiles</option>
					<option data-subtext="<i class='fa fa-id-card'>" value="cards"<% if (view_kind == 'cards') { %> selected<% } %>>Cards</option>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Appearance" data-content="This is how topics are to be visually displayed."></i>
			</div>
		</div>
		
		<div class="detail-kind form-group">
			<label class="control-label"><i class="fa fa-search"></i>Details</label>
			<div class="controls">
				<select>
					<% for (let i = 0; i < detail_kinds.length; i++) { %>
					<option value="<%= detail_kinds[i] %>"<% if (detail_kind == detail_kinds[i]) { %> selected<% } %>><%= detail_kinds[i]? detail_kinds[i].toTitleCase() : 'None' %></option>
					<% } %>
				</select>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Details" data-content="This is what details to include about topics."></i>
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
	`),

	events: {
		'change .view-kind select': 'onChangeViewKind',
		'change .detail-kind select': 'onChangeDetailKind',
		'change .tile-size input': 'onChangeTileSize'
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
		}
	},

	getValues: function() {
		return {
			view_kind: this.getValue('view_kind'),
			detail_kind: this.getValue('detail_kind'),
			tile_size: this.getValue('tile_size')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			detail_kinds: [
				null,
				'members',
				'create_date',
				'update_date'
			],
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
	}
});
