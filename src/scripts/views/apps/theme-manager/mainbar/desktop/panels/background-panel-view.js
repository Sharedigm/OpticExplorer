/******************************************************************************\
|                                                                              |
|                           background-panel-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../../models/storage/directories/directory.js';
import ImageFile from '../../../../../../models/storage/media/image-file.js';
import FormPanelView from '../../../../../../views/forms/form-panel-view.js';
import RangeInputView from '../../../../../../views/forms/inputs/range-input-view.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="background-image form-group">
			<label class="control-label"><i class="fa fa-image"></i>Image</label>
			<div class="controls">
				<div class="flat desktop preview" style="<% if (background_url) { %><% if (background_size != 'tile') { %> background-size:<%= background_size != 'center' && background_size != 'tile'? background_size : (100 / background_repeat) + '%'%>;<% } %> background-position:center; background-repeat:<%= background_size != 'tile'?'no-repeat':'repeat' %>; background-image:url(<%= background_url %>);<% } %>"></div>
				
				<div class="buttons">
					<button type="button" class="select-image btn">
						<i class="fa fa-check"></i>Select
					</button>
					<button type="button" class="clear-image btn">
						<i class="fa fa-xmark"></i>Clear
					</button>
				</div>
			</div>
		</div>
		
		<div class="background-size form-group"<% if (!background_url) { %> style="display:none"<% } %>>
			<label class="control-label" style="width:25%"><i class="fa fa-arrows-alt"></i>Size</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="background-size" value="cover"<% if (background_size == 'cover') { %> checked="checked"<% } %>>Cover</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-size" value="contain"<% if (background_size == 'contain') { %> checked="checked"<% } %>>Contain</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-size" value="center"<% if (background_size == 'center') { %> checked="checked"<% } %>>Center</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-size" value="tile"<% if (background_size == 'tile') { %> checked="checked"<% } %>>Tile</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-size" value="repeat"<% if (background_size == 'repeat') { %> checked="checked"<% } %>>Repeat</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Background Size" data-content="This is the size of the desktop background image."></i>
			</div>
		</div>
		
		<div class="background-repeats form-group"<% if (!background_url || background_size != 'repeat') { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-redo"></i>Repeats</label>
			<div class="controls">
				<div class="range-input"></div>
			</div>
		</div>
		
		<div class="background-color form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Background Color</label>
			<div class="controls">
				<% if (colors) { %>
				<% for (let i = 0; i < colors.length; i++) { %>
				<% let color = colors[i]; %>
				<div class="radio-inline">
					<label><input type="radio" name="background-color" class="colored <%= color %>" value="<%= color %>"<% if (background_color == color) {%> checked<% } %>><%= color.toTitleCase() %></label>
				</div>
				<% } %>
				<% } %>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-color" class="colored black" value="black"<% if (background_color == 'black') {%> checked<% } %>>Black</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-color" value="auto"<% if (background_color == 'auto') {%> checked<% } %>>Auto</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-color" value="none"<% if (!background_color || background_color == 'none' || background_color == '') {%> checked<% } %>>None</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="background-color" value="custom"<% if (background_color && background_color.startsWith('#')) {%> checked<% } %>>Custom</label>
				</div>
		
				<div class="color-inline">
					<input type="color"<% if (background_color) { %> value="<%= background_color %>"<% } else { %> value="#999999"<% } %><% if (!background_color || !background_color.startsWith('#')) { %> style="display:none"<% } %> />
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Background Color" data-content="This determines the color used for the desktop background."></i>
			</div>
		</div>
	`),

	attributes: {
		action: '""'
	},

	regions: {
		repeats: '.background-repeats .range-input',
	},

	events: {
		'click .background-image .select-image': 'onClickSelectImage',
		'click .background-image .clear-image': 'onClickClearImage',
		'click .background-size input': 'onClickBackgroundSize',
		'change .background-color input[type="radio"]': 'onChangeBackgroundColor',
		'change .background-color input[type="color"]': 'onChangeBackgroundCustomColor'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// background
			//
			case 'background_size':
				return this.$el.find('.background-size input:checked').attr('value');
			case 'background_repeats':
				return this.getChildView('repeats').getValue();

			// background color
			//
			case 'background_color_kind':
				return this.$el.find('.background-color :checked').val();
			case 'custom_background_color':
				return this.$el.find('.background-color input[type="color"]').val();
			case 'use_custom_color':
				return this.getValue('background_color_kind') == 'custom';
			case 'background_color':
				return this.getValue('use_custom_color')? this.getValue('custom_background_color') : this.getValue('background_color_kind');
		}
	},

	//
	// setting methods
	//

	reset: function() {
		this.showBackgroundImage(null);
		this.showBackgroundColor();
		this.hideRepeatSelector();
		application.settings.desktop.set('background_image', null);
	},

	setPreviewColors: function(color) {
		let elements = $('.desktop.preview');
		application.desktop.setBackgroundColor(color, elements);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			background_url: application.settings.desktop.getBackgroundUrl(),
			background_size: application.settings.desktop.get('background_size') || 'cover',
			background_repeats: application.settings.desktop.get('background_repeats'),
			background_color: application.settings.desktop.get('background_color'),
			colors: config.defaults.colors
		};
	},

	onRender: function() {
		this.showPreviewColor(application.settings.desktop.get('background_color'));
	},

	showRegion: function(name) {
		switch (name) {
			case 'repeats':
				this.showRepeats();
				break;
		}
	},

	showRepeats: function() {
		this.showChildView('repeats', new RangeInputView({

			// options
			//
			value: application.settings.desktop.get('background_repeats'),
			min: 1,
			max: 25,
			step: 0.1,
			scale: 'logarithmic',

			// callbacks
			//
			onchange: (repeats) => {

				// update dialog
				//
				this.showPreviewRepeats(repeats);

				// update desktop
				//
				application.settings.desktop.set('background_repeats', repeats);
			}
		}));
	},

	showBackgroundImage: function(imageFile) {

		// update dialog
		//
		this.showPreviewUrl(imageFile? imageFile.getUrl() : null);
		this.showPreviewSize(imageFile? application.settings.desktop.get('background_size') : null, application.settings.desktop.get('background_repeats'));
		this.showPreviewColor(application.settings.desktop.get('background_color'));

		if (imageFile) {
			this.$el.find('.background-size').show();
		} else {
			this.$el.find('.background-size').hide();
		}
	},

	showBackgroundSize: function(backgroundSize) {
		this.showPreviewSize(backgroundSize, application.settings.desktop.get('background_repeats'));	
	},

	showRepeatSelector: function() {
		this.$el.find('.background-repeats').show();
	},

	hideRepeatSelector: function() {
		this.$el.find('.background-repeats').hide();
	},

	showBackgroundColor: function() {
		this.$el.find('.background-color input[type="color"]').show();
	},

	hideBackgroundColor: function() {
		this.$el.find('.background-color input[type="color"]').hide();
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function() {
		import(
			'../../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: new Directory({
					path: config.apps.theme_manager.backgrounds_directory
				}),

				// options
				//
				title: "Select Background Image",

				// callbacks
				//
				onopen: (items) => {
					let item = items[0];

					// check to make sure that we have 
					// selectd an image file.
					//
					if (!(item instanceof ImageFile)) {

						// show notification
						//
						application.notify({
							icon: '<i class="fa fa-image"></i>',
							title: 'Image File Required',
							message: "This is not an image file."
						});
						return;
					}

					// set desktop settings
					//
					application.settings.desktop.set('background_image', item? item.get('path') : null);
					if (!application.settings.desktop.has('background_size')) {
						application.settings.desktop.set('background_size', 'cover');
					}

					// update view
					//
					this.showBackgroundImage(item);
				}
			}));
		});
	},

	//
	// preview methods
	//

	showPreviewUrl: function(url) {
		if (url) {
			this.$el.find('.background-image .preview').css({
				'background-image': 'url(' + url + ')',
			});
		} else {
			this.$el.find('.background-image .preview').css({
				'background-image': ''
			});		
		}
	},

	showPreviewRepeats: function(backgroundRepeats) {
		this.$el.find('.background-image .preview').css({
			'background-size': (100 / backgroundRepeats) + '%'
		});
	},

	showPreviewSize: function(backgroundSize, backgroundRepeats) {

		// set preview size attributes
		//
		switch (backgroundSize) {
			case 'cover':
				this.$el.find('.background-image .preview').css({
					'background-size': 'cover',
					'background-position': 'center',
					'background-repeat': 'no-repeat',
					'image-rendering': 'auto'
				});
				break;
			case 'contain':
				this.$el.find('.background-image .preview').css({
					'background-size': 'contain',
					'background-position': 'center',
					'background-repeat': 'no-repeat',
					'image-rendering': 'auto'
				});
				break;
			case 'center':
				this.$el.find('.background-image .preview').css({
					'background-size': '50%',
					'background-position': 'center',
					'background-repeat': 'no-repeat',
					'image-rendering': 'pixelated'
				});
				break;
			case 'tile':
				this.$el.find('.background-image .preview').css({
					'background-size': '',
					'background-position': 'center',
					'background-repeat': 'repeat',
					'image-rendering': 'pixelated'
				});
				break;
			case 'repeat':
				this.$el.find('.background-image .preview').css({
					'background-size': (100 / backgroundRepeats) + '%',
					'background-position': 'center',
					'background-repeat': 'repeat',
					'image-rendering': 'auto'
				});
				break;
			default:
				this.$el.find('.background-image .preview').css({
					'background-size': '',
					'background-position': '',
					'background-repeat': '',
					'image-rendering': ''
				});
		}

		// show / hide background repeat selector
		//
		if (backgroundSize == 'repeat') {
			this.showRepeatSelector();
		} else {
			this.hideRepeatSelector();
		}

		// show / hide background color selector
		//
		if (backgroundSize && backgroundSize != 'cover') {
			this.showBackgroundColor();
		} else {
			this.hideBackgroundColor();
		}
	},

	showPreviewColor: function(color) {
		let element = this.$el.find('.desktop.preview');
		application.desktop.setBackgroundColor(color, element);
	},

	//
	// mouse event handling methods
	//

	onClickSelectImage: function() {
		this.showOpenDialog();
	},

	onClickClearImage: function() {
		this.reset();
	},

	onClickBackgroundSize: function() {
		let backgroundSize = this.getValue('background_size');
		this.showBackgroundSize(backgroundSize);
		application.settings.desktop.set('background_size', backgroundSize);

		// hide / show background color
		//
		if (backgroundSize == 'cover') {
			this.hideBackgroundColor();
			application.settings.desktop.set('background_color', null);
		} else {
			this.showBackgroundColor();
		}
	},

	onChangeBackgroundColor: function() {
		let backgroundColor = this.getValue('background_color');
		this.setPreviewColors(backgroundColor);
		application.settings.desktop.set('background_color', backgroundColor);

		// hide show custom color
		//
		if (backgroundColor && backgroundColor.startsWith('#')) {
			this.showBackgroundColor();
		} else {
			this.hideBackgroundColor();
		}
	},

	onChangeBackgroundCustomColor: function() {
		let backgroundColor = this.getValue('background_color');
		this.setPreviewColors(backgroundColor);
		application.settings.desktop.set('background_color', backgroundColor);
	}
});
