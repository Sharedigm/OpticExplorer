/******************************************************************************\
|                                                                              |
|                                   yaml.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for importing / exporting .yaml files.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Optics from '../../../models/optics/optics.js';
import Elements from '../../../collections/optics/elements/elements.js';
import Lights from '../../../collections/optics/lights/lights.js'
import Objects from '../../../collections/optics/objects/objects.js';
import Yaml from '../../../../library/js-yaml/js-yaml.js';

export default {

	//
	// attributes
	//

	yamlHeader: template(`
		################################################################################
		#                                                                              #
		#                               <%= filename %>                                #
		#                                                                              #
		################################################################################
		#                                                                              #
		#        This is a description of an OpticExplorer optical system.             #
		#                                                                              #
		#        Author(s): <%= author %>                                              #
		#                                                                              #
		################################################################################
		#        Made with OpticExplorer, opticexplorer.com, Optics for Everyone       #
		################################################################################
	`),

	//
	// importing methods
	//

	importOptics: function(text, options) {
		Yaml.loadAll(text, (objects) => {

			// perform callback
			//
			let optics = new Optics({
				name: name,
				elements: Elements.parse(objects.ELEMENTS),
				lights: Lights.parse(objects.LIGHTS),
				objects: Objects.parse(objects.OBJECTS)
			});

			// load dependencies
			//
			optics.load(options);
		});
	},

	//
	// exporting methods
	//

	exportYamlHeader: function(options) {
		let header = this.yamlHeader({
			filename: options.filename,
			author: options.author
		});
		let lines = header.split('\n');

		// adjust line lengths
		//
		lines[2] = '#' + this.toSpaces(Math.trunc(39 - options.filename.length / 2)) + options.filename +
			this.toSpaces(Math.ceil(39 - options.filename.length / 2)) + '#';
		lines[8] = '#        Author(s): ' + options.author + this.toSpaces(80 - options.author.length - 21) + '#';

		return lines.join('\n');
	},

	toSpaces: function(numSpaces) {
		let string = '';
		for (let i = 0; i < numSpaces; i++) {
			string = string + ' ';
		}
		return string;
	},

	exportYamlBody: function(object) {
		return Yaml.dump({
			ELEMENTS: object.elements,
			LIGHTS: object.lights,
			OBJECTS: object.objects
		}, {
			indent: 2
		});
	},

	exportOptics: function(optics, options) {
		let yaml = this.exportYamlHeader({
			filename: options? options.filename : undefined,
			author: application.session.user.getName()
		});

		// add body yaml
		//
		yaml += '\n';
		yaml += this.exportYamlBody({
			elements: optics.elements.toObject(),
			lights: optics.lights.toObject(),
			objects: optics.objects.toObject()
		}).replaceAll("'", '');

		// add spaces between elements
		//
		yaml = yaml.replaceAll("ELEMENTS:", "\nELEMENTS:");
		yaml = yaml.replaceAll("LIGHTS:", "\nLIGHTS:");
		yaml = yaml.replaceAll("OBJECTS:", "\nOBJECTS:");
		yaml = yaml.replaceAll("\n  - type: ", "\n\n  - type: ");

		return yaml;
	}
}