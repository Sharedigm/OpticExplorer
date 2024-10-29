/******************************************************************************\
|                                                                              |
|                                  findable.js                                 |
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

export default {

	//
	// attributes
	//

	finding: {
		needle: undefined,
		options: {}
	},

	//
	// abstract (overridable) methods
	//

	find: function() {

		// find needle in text
		//
	},

	//
	// dialog methods
	//

	showFindDialog: function() {
		import(
			'../../../../../views/apps/common/dialogs/find-replace/find-dialog-view.js'
		).then((FindDialogView) => {

			// show find dialog
			//
			application.show(new FindDialogView.default(_.extend(this.find.options || {}, {
				needle: this.getSelected() || this.find.needle,

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
				
				found: () => {
					if (this.onFound) {
						this.onFound();
					}
				}
			})));
		});
	},

	//
	// iterating methods
	//

	findNext: function() {
		let selected = this.find(this.finding.needle, _.extend(this.finding.options, {
			backwards: false
		}));
		if (selected) {
			this.finding.options.start = selected.end;
		}
	},

	findPrev: function() {
		let selected = this.find(this.finding.needle, _.extend(this.finding.options, {
			backwards: true
		}));
		if (selected) {
			this.finding.options.start = selected.start;
		}
	}
};