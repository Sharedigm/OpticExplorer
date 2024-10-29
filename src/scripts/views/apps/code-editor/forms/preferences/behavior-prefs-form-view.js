/******************************************************************************\
|                                                                              |
|                         behavior-prefs-form-view.js                          |
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

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="key-binding form-group">
			<label class="control-label"><i class="fa fa-keyboard"></i>Key Binding</label>
			<div class="controls">
			
				<div class="radio-inline">
					<label><input type="radio" name="key-binding" value="default">Default</label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="key-binding" value="vim">Vim</label>
				</div>
				
				<div class="radio-inline">
					<label><input type="radio" name="key-binding" value="emacs">Emacs</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Key Binding" data-content="This what type of keyboard controls are used by the editor."></i>
			</div>
		</div>
		
		<div class="highlighting form-group">
			<label class="control-label"><i class="fa fa-long-arrow-alt-right"></i>Highlighting</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="highlight-active-line">Active Line</label>
				</div>
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="highlight-selected">Selected</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Highlighting" data-content="This is how to display the currently active / highlighted line."></i>
			</div>
		</div>
		
		<div class="selecting form-group">
			<label class="control-label"><i class="fa fa-mouse-pointer"></i>Selecting</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="select-full-line">Full Line</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Selecting" data-content="This is whether to allow full or partial lines of code to be selected."></i>
			</div>
		</div>
		
		<div class="scrolling form-group">
			<label class="control-label"><i class="fa fa-arrows-alt-v"></i>Scrolling</label>
			<div class="controls">
		
				<div class="checkbox-inline">
					<label><input type="checkbox" value="animated-scroll">Animated</label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Scrolling" data-content="This is whether or not to instantly jump or to use a brief animation effect when scrolling to a new location in the code."></i>
			</div>
		</div>
	`),

	events: {
		'change .key-binding input': 'onChangeKeyBinding',
		'click input[value="highlight-active-line"]': 'onClickHighlightActiveLine',
		'click input[value="highlight-selected"]': 'onClickHighlightSelected',
		'click input[value="select-full-line"]': 'onClickSelectFullLine',
		'click input[value="animated-scroll"]': 'onClickAnimatedScroll',
	},

	//
	// querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'key_binding':
				return this.$el.find('.key-binding input:checked').attr('value');
			case 'highlight_active_line':
				return this.$el.find('input[value="highlight-active-line"]').is(':checked');	
			case 'highlight_selected':
				return this.$el.find('input[value="highlight-selected"]').is(':checked');
			case 'select_full_line':
				return this.$el.find('input[value="select-full-line"]').is(':checked');
			case 'animated_scroll':
				return this.$el.find('input[value="animated-scroll"]').is(':checked');
		}
	},

	getValues: function() {
		return {
			key_binding: this.getValue('key_binding'),
			highlight_active_line: this.getValue('highlight_active_line'),
			highlight_selected: this.getValue('highlight_selected'),
			select_full_line: this.getValue('select_full_line'),
			animated_scroll: this.getValue('animated_scroll')
		};
	},
	
	//
	// settings methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'key_binding':
				this.$el.find('.key-binding input[value="' + value + '"]').prop('checked', true);
				break;
			case 'highlight_active_line':
				this.$el.find('input[value="highlight-active-line"]').is(':checked');
				break;
			case 'highlight_selected':
				this.$el.find('input[value="highlight-selected"]').is(':checked');
				break;
			case 'select_full_line':
				this.$el.find('input[value="select-full-line"]').is(':checked');
				break;
			case 'animated_scroll':
				this.$el.find('input[value="animated-scroll"]').is(':checked');
				break;
		}
	},

	//
	// event handling methods
	//

	onChangeKeyBinding: function() {
		this.onChangeValue('key_binding', this.getValue('key_binding'));
	},

	onClickHighlightActiveLine: function() {
		this.onChangeValue('highlight_active_line', this.getValue('highlight_active_line'));
	},

	onClickHighlightSelected: function() {
		this.onChangeValue('highlight_selected', this.getValue('highlight_selected'));
	},

	onClickSelectFullLine: function() {
		this.onChangeValue('select_full_line', this.getValue('select_full_line'));
	},

	onClickAnimatedScroll: function() {
		this.onChangeValue('animated_scroll', this.getValue('animated_scroll'));
	}
});
