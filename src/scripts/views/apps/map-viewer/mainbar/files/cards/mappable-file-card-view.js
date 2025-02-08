/******************************************************************************\
|                                                                              |
|                          mappable-file-card-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file card and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileCardView from '../../../../../../views/apps/file-browser/mainbar/files/cards/file-card-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default FileCardView.extend(_.extend({}, Mappable));