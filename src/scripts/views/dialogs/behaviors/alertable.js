/******************************************************************************\
|                                                                              |
|                                 alertable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing types of alert dialogs.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AlertDialogView from '../../../views/dialogs/alerts/alert-dialog-view.js';
import NotifyDialogView from '../../../views/dialogs/alerts/notify-dialog-view.js';
import ConfirmDialogView from '../../../views/dialogs/alerts/confirm-dialog-view.js';
import PromptDialogView from '../../../views/dialogs/alerts/prompt-dialog-view.js';
import ErrorDialogView from '../../../views/dialogs/alerts/error-dialog-view.js';

export default {

	alert: function(options) {
		let dialogView;

		// show alert message dialog
		//
		if (AlertDialogView.current) {

			// update existing alert dialog
			//
			dialogView = AlertDialogView.current;
			dialogView.update(options);
		} else {

			// show new alert dialog
			//
			dialogView = new AlertDialogView(options);
			this.show(dialogView);
		}

		return dialogView;
	},

	notify: function(options) {
		let dialogView;

		// show notify dialog
		//
		if (NotifyDialogView.current) {

			// update existing notify dialog
			//
			dialogView = NotifyDialogView.current;
			dialogView.update(options);
		} else {

			// show new notify dialog
			//
			dialogView = new NotifyDialogView(options);
			this.show(dialogView);
		}

		return dialogView;
	},

	confirm: function(options) {
		let dialogView;

		// show new confirm dialog
		//
		dialogView = new ConfirmDialogView(options);
		this.show(dialogView);

		return dialogView;
	},

	prompt: function(options) {
		let dialogView;

		// show new prompt dialog
		//
		dialogView = new PromptDialogView(options);
		this.show(dialogView);

		return dialogView;
	},

	error: function(options) {
		let dialogView;

		// do not show error for aborted requests
		//
		if (options && options.response && 
			options.response.statusText == 'abort') {
			return;
		}

		// show error message
		//
		if (ErrorDialogView.current) {

			// update existing error dialog
			//
			dialogView = ErrorDialogView.current;
			dialogView.update(options);
		} else {

			// show new error dialog
			//
			dialogView = new ErrorDialogView(options);
			this.show(dialogView);
		}

		return dialogView;
	}
};