/******************************************************************************\
|                                                                              |
|                            favorites-tree-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a recursive directory tree.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DirectoryTreeView from '../../../../../../views/apps/file-browser/mainbar/files/trees/directory-tree-view.js';

export default DirectoryTreeView.extend({

	//
	// rendering methods
	//

	getIcon: function() {
		return '<i class="fa fa-star"></i>';
	}
});