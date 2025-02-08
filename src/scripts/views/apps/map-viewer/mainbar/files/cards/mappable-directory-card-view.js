/******************************************************************************\
|                                                                              |
|                       mappable-directory-card-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory card and name.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DirectoryCardView from '../../../../../../views/apps/file-browser/mainbar/files/cards/directory-card-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default DirectoryCardView.extend(_.extend({}, Mappable));