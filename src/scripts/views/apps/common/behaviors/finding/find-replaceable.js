/******************************************************************************\
|                                                                              |
|                              find-replaceable.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for views that deal with sharable items       |
|        (files and directories).                                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Findable from '../../../../../views/apps/common/behaviors/finding/findable.js';

export default _.extend({}, Findable, {

	//
	// attributes
	//

	finding: {
		needle: undefined,
		replacement: undefined,
		options: {}
	},

	//
	// abstract (overridable) methods
	//

	replace: function() {

		// replace selected text with replacement text
		//
	},

	findReplace: function() {

		// replace selected text with replacement and find next
		//
	},

	replaceAll: function() {

		// replace all occurances of selected text with replacement
		//
	},

	//
	// dialog methods
	//

	showFindReplaceDialog: function() {
		import(
			'../../../../../views/apps/common/dialogs/find-replace/find-replace-dialog-view.js'
		).then((FindReplaceDialogView) => {

			// show find replace dialog
			//
			application.show(new FindReplaceDialogView.default({

				// options
				//
				replacement: this.find.replacement,
				needle: this.find.needle || this.getSelected(),

				// callbacks
				//
				find: (needle, options) => {

					// save finding state
					//
					this.finding.needle = needle;
					this.finding.options = options;

					// perform find
					//
					let selected = this.find(needle, options);
					if (selected) {
						this.finding.options.start = selected.end;
					}

					return selected;
				},

				found: (needle, replacement) => {
					this.onFound();
					if (replacement) {
						this.onReplaced();
					}
				},
				
				replace: (replacement, options) => {

					// save finding state
					//
					this.finding.needle = options.needle;
					this.finding.replacement = replacement;
					this.finding.options = options;

					// perform replace
					//
					let selected = this.findReplace(replacement, options);
					if (selected) {
						this.finding.options.start = selected.end;
					}

					return selected;
				},

				replaceAll: (replacement, options) => {

					// save finding state
					//
					this.finding.needle = options.needle;
					this.finding.replacement = replacement;
					this.finding.options = options;

					// perfom replace all
					//
					return this.replaceAll(replacement, options);
				},

				replaced: () => {
					this.onFound();
					this.onReplaced();
				}
			}));
		});
	},

	//
	// iterating methods
	//

	replaceNext: function() {

		// replace selected
		//
		this.replace(this.finding.replacement);

		// find next
		//
		let selected = this.find(this.finding.needle, _.extend(this.finding.options, {
			backwards: false
		}));
		if (selected) {
			this.finding.options.start = selected.end;
		}
	},

	replacePrev: function() {

		// replace selected
		//
		this.replace(this.finding.replacement);

		// find prev
		//
		let selected = this.find(this.finding.needle, _.extend(this.finding.options, {
			backwards: true
		}));
		if (selected) {
			this.finding.options.start = selected.end;
		}
	}
});