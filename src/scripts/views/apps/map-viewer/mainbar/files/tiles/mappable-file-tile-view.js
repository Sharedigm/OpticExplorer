/******************************************************************************\
|                                                                              |
|                          mappable-file-tile-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file tile and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/file-tile-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default FileTileView.extend(_.extend({}, Mappable));