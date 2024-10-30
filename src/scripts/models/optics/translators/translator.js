/******************************************************************************\
|                                                                              |
|                                translator.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for importing / exporting optics files.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Yaml from '../../../models/optics/translators/yaml.js';
import RayOptics from '../../../models/optics/translators/ray-optics.js';
import Zemax from '../../../models/optics/translators/zemax.js';
import FileUtils from '../../../utilities/files/file-utils.js';

export default {

	//
	// getting methods
	//

	getTranslator: function(extension) {
		switch (extension) {
			case 'optc':
				return Yaml;
			case 'roa':
				return RayOptics;
			case 'zmx':
				return Zemax;
		}
	},

	//
	// translation methods
	//

	import: function(file, text, options) {

		// get translator
		//
		let extension = FileUtils.getFileExtension(file.getName());
		let importer = this.getTranslator(extension);

		// import optics using translator
		//
		importer.importOptics(text, {
			name: file.getName(),

			// callbacks
			//
			success: options.success,
			error: options.error,
		});
	},

	export: function(optics, options) {
		let file = options.file;
		let path = file.get('path');
		let filename = FileUtils.getFileName(path);
		let extension = FileUtils.getFileExtension(filename);
		let exporter = this.getTranslator(extension);

		// export optics using exporter
		//
		return exporter.exportOptics(optics, {
			filename: filename
		});
	}
}