/******************************************************************************\
|                                                                              |
|                           preferences-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for specifying user preferences.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesDialogView from '../../../../../views/apps/common/dialogs/preferences/preferences-dialog-view.js';
import PreferencesFormView from '../../../../../views/apps/timer/forms/preferences/preferences-form-view.js';

export default PreferencesDialogView.extend({

	//
	// rendering methods
	//

	form: function() {
		return new PreferencesFormView({
			model: this.model
		});
	}
});