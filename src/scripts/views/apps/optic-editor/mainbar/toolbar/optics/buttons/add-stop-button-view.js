/******************************************************************************\
|                                                                              |
|                              add-stop-button-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonView from '../../../../../../../views/apps/common/toolbars/buttons/button-view.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 1000 1000">
			<path d="M608 443.5l-225 -382q47 -8 81 -8 177 0 304 120zm-33 168l233 -395q103 125 103 283 0 53 -16 112l-320 0zm-96 -280l-427 0q37 -91 109 -158t167 -97zm-24 335l423 0q-37 90 -108.5 156.5t-164.5 98.5zm-99 -278l-234 396q-104 -126 -104 -285 0 -52 16 -111l322 0zm-33 165l227 384q-48 9 -86 9 -172 0 -302 -120z" />
		</svg>
	`,

	//
	// mouse event handling methods
	//

	onClick: function() {

		// show add stop dialog
		//
		this.getParentView('app').showAddStopDialog();
	}
});