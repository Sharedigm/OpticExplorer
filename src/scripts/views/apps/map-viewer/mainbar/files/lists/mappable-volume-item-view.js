/******************************************************************************\
|                                                                              |
|                         mappable-volume-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory within a directory list.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import VolumeItemView from '../../../../../../views/apps/file-browser/mainbar/files/lists/volume-item-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default VolumeItemView.extend(_.extend({}, Mappable));