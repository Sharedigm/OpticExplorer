/******************************************************************************\
|                                                                              |
|                              dialog-settings.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's dialog settings.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../models/settings/user-settings.js';
import ModalView from '../../views/dialogs/modal-view.js';
import Browser from '../../utilities/web/browser.js';

export default UserSettings.extend({

	//
	// attributes
	//

	category: 'dialogs',
	defaults: UserSettings.toKeyValuePairs(config.theme.dialogs, Browser.device),

	//
	// constructor
	//

	initialize: function() {

		// listen for changes
		//
		this.on('change', this.onChange);
	},

	//
	// setting methods
	//

	apply: function() {

		// apply dialog styles
		//
		// this.applyDialogColors(this.get('dialog_colors'));
		this.applyDialogMaterial(this.get('dialog_material'));
		this.applyDialogButtonColors(this.get('dialog_button_colors'));
		this.applyDialogItemMaterial(this.get('dialog_button_material'), 'dialog-buttons');
		this.applyDialogButtonLabelColors(this.get('dialog_button_label_colors'));

		this.applyDialogCorners(this.get('dialog_corners'));
		this.applyDialogButtonCorners(this.get('dialog_button_corners'));
		this.applyDialogPadding(this.get('dialog_padding'));
		this.applyDialogAlertSize(this.get('dialog_alert_size'));

		this.applyDialogHeaderWidth(this.get('dialog_header_width'));
		this.applyDialogTitleStyle(this.get('dialog_title_style'));
		this.applyItemIcons(this.get('dialog_header_icons'), 'header');
		this.applyShowDialogHandles(this.get('dialog_handles'));
		this.applyShowDialogButtons(this.get('dialog_buttons'));
		this.applyItemIcons(this.get('dialog_footer_icons'), 'footer');

		this.applyDialogButtonAlignment(this.get('dialog_button_alignment'));
		this.applyDialogButtonSize(this.get('dialog_button_size'));
		this.applyDialogButtonWidth(this.get('dialog_button_width'));
		this.applyShowDialogButtonLabels(this.get('dialog_button_labels'));
		this.applyShowDialogButtonOutlines(this.get('dialog_button_outlines'));

		this.applyDialogEffect('open', this.get('dialog_open_effect'));
		this.applyDialogEffect('close', this.get('dialog_close_effect'));
		this.applyDialogEffect('minimize', this.get('dialog_minimize_effect'));
		this.applyDialogEffect('unminimize', this.get('dialog_unminimize_effect'));
	},

	reset: function() {
		this.set(this.defaults);
	},

	clear: function() {
		let keys = Object.keys(this.attributes);
		for (let i = 0; i < keys.length; i++) {
			this.set(keys[i], undefined);
		}
	},

	//
	// dialog color setting methods
	//

	applyDialogColors: function(dialogColors) {
		switch (dialogColors || 'mono') {
			case 'none':
			case 'monochrome':
				$('.modals').removeClass('colored');
				$('.modals').removeClass('colorful');
				$('#desktop').removeClass('colorful');
				break;
			case 'colored':
				$('.modals').addClass('colored');
				$('.modals').removeClass('colorful');
				$('#desktop').removeClass('colorful');
				break;
			case 'colorful':
				$('.modals').removeClass('colored');
				$('.modals').addClass('colorful');
				$('#desktop').addClass('colorful');
				break;
		}
	},

	applyDialogMaterial: function(material) {
		switch (material || 'auto') {
			case 'none':
			case 'flat':
				$('.modals').addClass('flat');
				$('.modals').removeClass('chalk');
				$('.modals').removeClass('plastic');
				$('.modals').removeClass('glass');
				$('.modals').removeClass('metal');
				$('.modals').removeClass('auto-material');
				break;
			case 'chalk':
				$('.modals').removeClass('flat');
				$('.modals').addClass('chalk');
				$('.modals').removeClass('plastic');
				$('.modals').removeClass('glass');
				$('.modals').removeClass('metal');
				$('.modals').removeClass('auto-material');
				break;
			case 'plastic':
				$('.modals').removeClass('flat');
				$('.modals').removeClass('chalk');
				$('.modals').addClass('plastic');
				$('.modals').removeClass('glass');
				$('.modals').removeClass('metal');
				$('.modals').removeClass('auto-material');	
				break;
			case 'glass':
				$('.modals').removeClass('flat');
				$('.modals').removeClass('chalk');
				$('.modals').removeClass('plastic');
				$('.modals').addClass('glass');
				$('.modals').removeClass('metal');
				$('.modals').removeClass('auto-material');
				break;
			case 'metal':
				$('.modals').removeClass('flat');
				$('.modals').removeClass('chalk');
				$('.modals').removeClass('plastic');
				$('.modals').removeClass('glass');
				$('.modals').addClass('metal');
				$('.modals').removeClass('auto-material');
				break;
			case 'auto':
				$('.modals').removeClass('flat');
				$('.modals').removeClass('chalk');
				$('.modals').removeClass('plastic');
				$('.modals').removeClass('glass');
				$('.modals').removeClass('metal');
				$('.modals').addClass('auto-material');
		}
	},

	applyDialogItemMaterial: function(material, items) {
		switch (material || 'none') {
			case 'none':
			case 'flat':
				$('.modals').addClass('flat-' + items);
				$('.modals').removeClass('chalk-' + items);
				$('.modals').removeClass('plastic-' + items);
				$('.modals').removeClass('glass-' + items);
				$('.modals').removeClass('metal-' + items);
				$('.modals').removeClass('auto-' + items);
				break;
			case 'chalk':
				$('.modals').removeClass('flat-' + items);
				$('.modals').addClass('chalk-' + items);
				$('.modals').removeClass('plastic-' + items);
				$('.modals').removeClass('glass-' + items);
				$('.modals').removeClass('metal-' + items);
				$('.modals').removeClass('auto-' + items);
				break;
			case 'plastic':
				$('.modals').removeClass('flat-' + items);
				$('.modals').removeClass('chalk-' + items);
				$('.modals').addClass('plastic-' + items);
				$('.modals').removeClass('glass-' + items);
				$('.modals').removeClass('metal-' + items);
				$('.modals').removeClass('auto-' + items);
				break;
			case 'glass':
				$('.modals').removeClass('flat-' + items);
				$('.modals').removeClass('chalk-' + items);
				$('.modals').removeClass('plastic-' + items);
				$('.modals').addClass('glass-' + items);
				$('.modals').removeClass('metal-' + items);
				$('.modals').removeClass('auto-' + items);
				break;
			case 'metal':
				$('.modals').removeClass('flat-' + items);
				$('.modals').removeClass('chalk-' + items);
				$('.modals').removeClass('plastic-' + items);
				$('.modals').removeClass('glass-' + items);
				$('.modals').addClass('metal-' + items);
				$('.modals').removeClass('auto-' + items);
				break;
			case 'auto':
				$('.modals').removeClass('flat-' + items);
				$('.modals').removeClass('chalk-' + items);
				$('.modals').removeClass('plastic-' + items);
				$('.modals').removeClass('glass-' + items);
				$('.modals').removeClass('metal-' + items);
				$('.modals').addClass('auto-' + items);
		}
	},

	applyDialogButtonColors: function(dialogButtonColors) {
		switch (dialogButtonColors) {
			case 'colored':
				$('.modals').addClass('colored-buttons');
				$('.modals').removeClass('colorful-buttons');
				break;
			case 'colorful':
				$('.modals').removeClass('colored-buttons');
				$('.modals').addClass('colorful-buttons');
				break;
			default:
				$('.modals').removeClass('colored-buttons');
				$('.modals').removeClass('colorful-buttons');
				break;
		}
	},

	applyDialogButtonLabelColors: function(dialogButtonLabelColors) {
		switch (dialogButtonLabelColors || 'light') {
			case 'light':
				$('.modals').removeClass('dialog-button-dark-labels');
				break;
			case 'dark':
				$('.modals').addClass('dialog-button-dark-labels');
				break;
		}
	},

	//
	// dialog shape setting methods
	//

	applyDialogCorners: function(dialogCorners) {
		switch (dialogCorners || 'auto') {
			case 'round':
				$('body').addClass('round-dialogs');
				$('body').removeClass('rounded-dialogs');
				$('body').removeClass('square-dialogs');
				$('body').removeClass('auto-dialog-corners');
				break;	
			case 'rounded':
				$('body').removeClass('round-dialogs');
				$('body').addClass('rounded-dialogs');
				$('body').removeClass('square-dialogs');
				$('body').removeClass('auto-dialog-corners');
				break;				
			case 'square':
				$('body').removeClass('round-dialogs');
				$('body').removeClass('rounded-dialogs');
				$('body').addClass('square-dialogs');	
				$('body').removeClass('auto-dialog-corners');
				break;
			case 'auto':
				$('body').removeClass('round-dialogs');
				$('body').removeClass('rounded-dialogs');
				$('body').removeClass('square-dialogs');	
				$('body').addClass('auto-dialog-corners');
				break;
		}
	},

	applyDialogButtonCorners: function(dialogButtonCorners) {
		switch (dialogButtonCorners || 'auto') {
			case 'round':
				$('.modals').addClass('round-dialog-button-corners');
				$('.modals').removeClass('rounded-dialog-button-corners');
				$('.modals').removeClass('square-dialog-button-corners');
				$('.modals').removeClass('auto-dialog-button-corners');
				break;	
			case 'rounded':
				$('.modals').removeClass('round-dialog-button-corners');
				$('.modals').addClass('rounded-dialog-button-corners');
				$('.modals').removeClass('square-dialog-button-corners');
				$('.modals').removeClass('auto-dialog-button-corners');
				break;				
			case 'square':
				$('.modals').removeClass('round-dialog-button-corners');
				$('.modals').removeClass('rounded-dialog-button-corners');
				$('.modals').addClass('square-dialog-button-corners');
				$('.modals').removeClass('auto-dialog-button-corners');
				break;
			case 'auto':
				$('.modals').removeClass('round-dialog-button-corners');
				$('.modals').removeClass('rounded-dialog-button-corners');
				$('.modals').removeClass('square-dialog-button-corners');
				$('.modals').addClass('auto-dialog-button-corners');
				break;
		}
	},

	applyDialogPadding: function(dialogPadding) {
		if (dialogPadding) {
			$('.modals').addClass('padded');
		} else {
			$('.modals').removeClass('padded');
		}
	},

	applyDialogAlertSize: function(dialogAlertSize) {
		switch (dialogAlertSize || 'medium') {
			case 'small':
				$('.modals').addClass('small-alerts');
				break;
			case 'medium':
				$('.modals').removeClass('small-alerts');
				break;
		}
	},

	//
	// dialog header setting methods
	//

	applyDialogHeaderWidth: function(dialogHeaderWidth) {
		switch (dialogHeaderWidth || 'medium') {
			case 'thin':
				$('.modals').addClass('thin-headers');
				$('.modals').removeClass('thick-headers');
				break;	
			case 'medium':
				$('.modals').removeClass('thin-headers');
				$('.modals').removeClass('thick-headers');
				break;
			case 'thick':
				$('.modals').removeClass('thin-headers');
				$('.modals').addClass('thick-headers');
				break;
		}
	},

	applyDialogTitleStyle: function(dialogTitleSyle) {
		switch (dialogTitleSyle || 'left') {
			case 'left':
				$('.modals').addClass('left-titles');
				$('.modals').removeClass('center-titles');
				$('.modals').removeClass('right-titles');
				break;	
			case 'center':
				$('.modals').removeClass('left-titles');
				$('.modals').addClass('center-titles');
				$('.modals').removeClass('right-titles');
				break;
			case 'right':
				$('.modals').removeClass('left-titles');
				$('.modals').removeClass('center-titles');
				$('.modals').addClass('right-titles');
				break;
		}
	},

	applyShowDialogHandles: function(showDialogHandles) {
		if (showDialogHandles) {
			$('.modals').addClass('show-handles');
		} else {
			$('.modals').removeClass('show-handles');
		}
	},

	applyShowDialogButtons: function(showDialogButtons) {
		if (showDialogButtons) {
			$('.modals').addClass('show-buttons');
		} else {
			$('.modals').removeClass('show-buttons');
		}
	},

	applyItemIcons: function(value, items) {
		if (value) {
			$('body').removeClass('hide-' + items + '-icons');
		} else {
			$('body').addClass('hide-' + items + '-icons');	
		}
	},

	//
	// dialog button setting methods
	//

	applyDialogButtonAlignment: function(dialogButtonAlignment) {
		switch (dialogButtonAlignment || 'right') {
			case 'left':
				$('.modals').addClass('left-buttons');
				$('.modals').removeClass('split-buttons');
				$('.modals').removeClass('right-buttons');
				break;
			case 'split':
				$('.modals').removeClass('left-buttons');
				$('.modals').addClass('split-buttons');
				$('.modals').removeClass('right-buttons');
				break;
			case 'right':
				$('.modals').removeClass('left-buttons');
				$('.modals').removeClass('split-buttons');
				$('.modals').addClass('right-buttons');
				break;
		}
	},

	applyDialogButtonSize: function(dialogButtonSize) {
		switch (dialogButtonSize) {
			case 'small':
				$('.modals').addClass('small-buttons');
				$('.modals').removeClass('medium-buttons');
				break;
			case 'medium':
				$('.modals').removeClass('small-buttons');
				$('.modals').addClass('medium-buttons');
				break;
			default:
				$('.modals').removeClass('small-buttons');
				$('.modals').removeClass('medium-buttons');
				break;
		}
	},

	applyDialogButtonWidth: function(dialogButtonWidth) {
		switch (dialogButtonWidth || 'square') {
			case 'square':
				$('.modals').removeClass('rect-buttons');
				$('.modals').removeClass('wide-buttons');
				break;
			case 'rect':
				$('.modals').addClass('rect-buttons');
				$('.modals').removeClass('wide-buttons');
				break;
			case 'wide':
				$('.modals').removeClass('rect-buttons');
				$('.modals').addClass('wide-buttons');
				break;
		}
	},

	applyShowDialogButtonLabels: function(showDialogButtonLabels) {
		if (showDialogButtonLabels) {
			$('.modals').addClass('show-button-labels');
		} else {
			$('.modals').removeClass('show-button-labels');
		}
	},

	applyShowDialogButtonOutlines: function(showDialogButtonOutlines) {
		if (showDialogButtonOutlines) {
			$('.modals').addClass('show-button-outlines');
		} else {
			$('.modals').removeClass('show-button-outlines');
		}
	},

	applyDialogEffect: function(effect, value) {
		switch (effect) {
			case 'open':
				ModalView.effects.open = value;
				break;
			case 'close':
				ModalView.effects.close = value;
				break;
			case 'minimize':
				ModalView.effects.minimize = value;
				break;
			case 'unminimize':
				ModalView.effects.unminimize = value;
				break;
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.apply();
	}
});