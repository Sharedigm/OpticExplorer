/******************************************************************************\
|                                                                              |
|                       mappable-directory-tile-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory tile and name.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DirectoryTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/directory-tile-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default DirectoryTileView.extend(_.extend({}, Mappable));