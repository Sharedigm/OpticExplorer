/******************************************************************************\
|                                                                              |
|                           material-map-button-view.js                        |
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
	
	template: template(`
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="-3 -3 30 30">
			<path d="M23.961 8.429c -.831.982 -1.614 1.918 -1.961 3.775v6.683l -4 2.479v -9.161c -.347 -1.857 -1.13 -2.793 -1.961 -3.775 -.908 -1.075 -2.039 -2.411 -2.039 -4.629l.019 -.345 -2.019 -1.456 -5.545 4 -6.455 -4v18l6.455 4 5.545 -4 5.545 4 6.455 -4v -11.618l -.039.047zm -12.961 9.826l -4 2.885v -13.067l4 -2.886v13.068zm9 -18.255c -2.1 0 -4 1.702 -4 3.801 0 3.121 3.188 3.451 4 8.199.812 -4.748 4 -5.078 4 -8.199 0 -2.099 -1.9 -3.801 -4 -3.801zm0 5.5c -.828 0 -1.5 -.671 -1.5 -1.5s.672 -1.5 1.5 -1.5 1.5.671 1.5 1.5 -.672 1.5 -1.5 1.5z"/>
		</svg>
	`),

	//
	// mouse event handling methods
	//

	onClick: function() {

		// go to optics view
		//
		this.getParentView('app').showMaterialMap();
	}
});