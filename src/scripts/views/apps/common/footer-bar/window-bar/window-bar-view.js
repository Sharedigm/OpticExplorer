/******************************************************************************\
|                                                                              |
|                              window-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view or adding window size controls to apps.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'window-size toolbar visible-desktop-only',

	template: template(`
		<button class="shrink-window button btn-sm" data-toggle="tooltip" title="Shrink">
			<i class="fa fa-minus"></i>
		</button>
		<button class="grow-window button btn-sm" data-toggle="tooltip" title="Grow">
			<i class="fa fa-plus"></i>
		</button>
		<button class="expand-window button btn-sm" data-toggle="tooltip" title="Expand">
			<i class="fa fa-expand"></i>
		</button>
	`)
});