/******************************************************************************\
|                                                                              |
|                              text-panel-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing theme settings.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormPanelView from '../../../../../../views/forms/form-panel-view.js';
import FontSelectorView from '../../../../../../views/forms/selectors/font-selector-view.js';

export default FormPanelView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="controls-preview form-group">
			<label class="control-label"><i class="fa fa-eye"></i>Preview</label>
			<div class="font-preview form-group">
				<div class="controls">
					<div class="well">
						The quick brown fox jumped over the lazy dogs.
						THE QUICK BROWN FOX JUMPED OVER THE LAZY DOGS.
					</div>
				</div>
			</div>
		</div>
		
		<div class="system-font form-group">
			<label class="control-label"><i class="fa fa-font"></i>Font</label>
			<div class="controls">
				<div class="font-selector"></div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Font" data-content="This is the font used for text."></i>
			</div>
		</div>
		
		<div class="title-font form-group">
			<label class="control-label"><i class="fa fa-font"></i>Titles</label>
			<div class="controls">
				<div class="font-selector"></div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Titles" data-content="This is the font used for title text."></i>
			</div>
		</div>

		<div class="label-font form-group">
			<label class="control-label"><i class="fa fa-font"></i>Labels</label>
			<div class="controls">
				<div class="font-selector"></div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Labels" data-content="This is the font used for label text."></i>
			</div>
		</div>

		<div class="heading-font form-group">
			<label class="control-label"><i class="fa fa-font"></i>Headings</label>
			<div class="controls">
				<div class="font-selector"></div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Headings" data-content="This is the font used for heading text."></i>
			</div>
		</div>
		
		<div class="font-size form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Size</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="font-size" value="smallest"<% if (font_size == 'smallest') {%> checked<% } %>>Smallest</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="font-size" value="smaller"<% if (font_size == 'smaller') {%> checked<% } %>>Smaller</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="font-size" value="normal"<% if (font_size == 'normal') {%> checked<% } %>>Normal</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="font-size" value="larger"<% if (font_size == 'larger') {%> checked<% } %>>Larger</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="font-size" value="largest"<% if (font_size == 'largest') {%> checked<% } %>>Largest</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Font Size" data-content="This determines the font size that is used."></i>
			</div>
		</div>
	`),

	regions: {
		system_font: {
			el: '.system-font .font-selector',
			replaceElement: true
		},
		title_font: {
			el: '.title-font .font-selector',
			replaceElement: true
		},
		label_font: {
			el: '.label-font .font-selector',
			replaceElement: true
		},
		heading_font: {
			el: '.heading-font .font-selector',
			replaceElement: true
		}
	},

	events: {
		'change .system-font select': 'onChangeSystemFont',
		'change .title-font select': 'onChangeTitleFont',
		'change .label-font select': 'onChangeLabelFont',
		'change .heading-font select': 'onChangeHeadingFont',
		'change .font-size input': 'onChangeFontSize'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'system_font':
				return this.$el.find('.system-font select').val();
			case 'title_font':
				return this.$el.find('.title-font select').val();
			case 'label_font':
				return this.$el.find('.label-font select').val();
			case 'heading_font':
				return this.$el.find('.heading-font select').val();
			case 'font_size':
				return this.$el.find('.font-size input:checked').val();
		}
	},

	getValues: function() {
		return {
			system_font: this.getValue('system_font'),
			title_font: this.getValue('title_font'),
			label_font: this.getValue('label_font'),
			heading_font: this.getValue('heading_font'),
			font_size: this.getValue('font_size')
		};
	},

	//
	// rendering methods
	//
	
	templateContext: function() {
		return {
			system_font: application.settings.theme.get('system_font'),
			title_font: application.settings.theme.get('title_font'),
			label_font: application.settings.theme.get('label_font'),
			heading_font: application.settings.theme.get('heading_font'),
			font_size: application.settings.theme.get('font_size')
		};
	},

	showRegion: function(name) {
		switch (name) {
			case 'system_font':
				this.showSystemFont();
				break;
			case 'title_font':
				this.showTitleFont();
				break;
			case 'label_font':
				this.showLabelFont();
				break;
			case 'heading_font':
				this.showHeadingFont();
				break;
		}
	},

	showSystemFont: function() {
		this.showChildView('system_font', new FontSelectorView({
			initialValue: application.settings.theme.get('system_font')
		}));
	},

	showTitleFont: function() {
		this.showChildView('title_font', new FontSelectorView({
			initialValue: application.settings.theme.get('title_font')
		}));
	},

	showLabelFont: function() {
		this.showChildView('label_font', new FontSelectorView({
			initialValue: application.settings.theme.get('label_font')
		}));
	},

	showHeadingFont: function() {
		this.showChildView('heading_font', new FontSelectorView({
			initialValue: application.settings.theme.get('heading_font')
		}));
	},

	//
	// event handling methods
	//

	onChangeSystemFont: function() {
		application.settings.theme.set('system_font', this.getValue('system_font'));
	},

	onChangeTitleFont: function() {
		application.settings.theme.set('title_font', this.getValue('title_font'));
	},

	onChangeLabelFont: function() {
		application.settings.theme.set('label_font', this.getValue('label_font'));
	},

	onChangeHeadingFont: function() {
		application.settings.theme.set('heading_font', this.getValue('heading_font'));
	},

	onChangeFontSize: function() {
		application.settings.theme.set('font_size', this.getValue('font_size'));
	}
});