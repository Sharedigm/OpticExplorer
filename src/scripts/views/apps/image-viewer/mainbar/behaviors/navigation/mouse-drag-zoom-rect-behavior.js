/******************************************************************************\
|                                                                              |
|                        mouse-drag-zoom-rect-behavior.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseDragRectBehavior from '../../../../../../views/behaviors/mouse/mouse-drag-rect-behavior.js';

export default class MouseDragZoomRectBehavior extends MouseDragRectBehavior {

	constructor(viewer, options) {

		// call superclass constructor
		//
		super(viewer.$el.find('.image'), options);

		// set attributes
		//
		this.viewer = viewer;
		this.cursor = 'nwse-resize';
		this.blocking = false;
	}

	//
	// zooming methods
	//

	zoomTo(position, zoom) {

		// find image view attributes
		//
		let imageView = this.viewer.getImageView();
		let startPosition = imageView.getScrollPosition();
		let startZoom = imageView.getZoom();

		// animate zoom
		//
		this.animation = $({t: 0}).animate({t: 1}, {
			duration: this.viewer.preferences.get('zoom_duration'),

			// callbacks
			//
			step: (t) => {

				// interpolate zoom and scroll
				//
				this.viewer.setZoom(startZoom + (zoom - startZoom) * t);
				imageView.setScrollPosition({
					left: startPosition.left + (position.left - startPosition.left) * t,
					top: startPosition.top + (position.top - startPosition.top) * t
				});
			},

			complete: () => {
				this.animation = null;

				// perform callback
				//
				if (this.options.onfinish) {
					this.options.onfinish();
				}
			}
		});
	}

	//
	// mouse event handling methods
	//

	onMouseUp() {

		// find image view attributes
		//
		let imageView = this.viewer.getImageView();
		let offset = imageView.$el.offset();
		let width = imageView.getWidth();
		let height = imageView.getHeight();
		let center = {
			left: width / 2,
			top: height / 2
		};
		
		if (this.start != this.current) {

			// find drag
			//
			let drag = this.getOffset(this.start, this.current);
			let dragCenter = {
				left: (this.start.left + this.current.left) / 2,
				top: (this.start.top + this.current.top) / 2
			};

			// find position
			//
			let dragOffset = {
				left: dragCenter.left - offset.left - center.left,
				top: dragCenter.top - offset.top - center.top
			};
			let imageSize = {
				width: imageView.getImageWidth(),
				height: imageView.getImageHeight()
			};
			let scrollPosition = imageView.getScrollPosition();
			let position = {
				left: scrollPosition.left + (dragOffset.left / imageSize.width),
				top: scrollPosition.top + (dragOffset.top / imageSize.height)
			};

			// find zoom
			//
			let dragLength = Math.sqrt(drag.left ** 2 + drag.top ** 2);
			let imageDiagonal = imageView.getImageDiagonal();
			let zoom = imageView.getZoom() * imageDiagonal / dragLength;

			// change zoom and position
			//
			this.zoomTo(position, zoom);
		}

		// perform callback
		//
		if (this.options.onzoomstart) {
			this.options.onzoomstart();
		}
	}

	//
	// cleanup methods
	//

	onBeforeDestroy() {
		if (this.animation) {
			this.animation.stop();
		}
	}
}