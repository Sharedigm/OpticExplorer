/******************************************************************************\
|                                                                              |
|                            editable-files-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating files.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import FileMovable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-movable.js';
import CutAndPastable from '../../../../../views/apps/file-browser/mainbar/behaviors/cut-and-pastable.js';
import FileDisposable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';
import FileUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import DroppableUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/droppable-uploadable.js';

export default FilesView.extend(_.extend({}, FileMovable, CutAndPastable, FileDisposable, FileUploadable, DroppableUploadable, {

	//
	// attributes
	//

	template: template(`
		<div class="items"></div><input type="file" multiple style="display:none" />
	`)
}));