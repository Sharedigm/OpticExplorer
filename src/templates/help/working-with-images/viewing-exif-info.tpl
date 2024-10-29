<h1><i class="fa fa-table"></i>Viewing EXIF Info</h1>

<ol class="breadcrumb">
	<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
	<li><a href="#help/working-with-images"><i class="fa fa-image"></i>Working with Images</a></li>
	<li><i class="fa fa-table"></i>Viewing EXIF Info</li>
</ol>

<div class="content">
	<p>Digital Photographs contain additional metadata alongside the image data to store information such as aperture, shutter speed, and focal length.  This metadata is stored in what is called EXIF (Exchangeable image file) format and can be viewed in a number of ways using <%= application.name %>. </p>

	<ol>
		<li>
			<h2><i class="fa fa-file"></i>Viewing Exif Info in File Browser</h2>
			<p>The easiest way to view basic image information is by using the View > Details menu of the <a href="#apps/file-browser">File Browser</a> app.  This can be used to preview basic EXIF info including Resolution, Make / Model, Focal Length, Exposure, Aperture, ISO, and Capture Date.  </p>

			<div class="figure">
				<img class="doubly nested dropdown menu" src="images/help/working-with-images/viewing-exif-info/view-photo-details-menu@2x.png" />
				<div class="caption">View Photo Details Menu</div>
			</div>

			<div class="figure">
				<a href="images/help/working-with-images/viewing-exif-info/file-browser-photos-exif.png" target="_blank" class="lightbox" title="File Browser Exif Details"><img class="dialog" src="images/help/working-with-images/viewing-exif-info/file-browser-photos-exif.png" /></a>
				<div class="caption">File Browser Exif Details</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-info-circle"></i>Viewing Exif in File Info Dialog</h2>
			<p>The next way to view an image's EXIF info is by using the file info dialog.  To view the dialog, select a file in the <a href="#apps/file-browser">File Browser</a> app and then select 'Show Info' from the File Menu, then click on the 'Photo' tab. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-images/viewing-exif-info/show-info-menu-item@2x.png" />
				<div class="caption">Show Info Menu Item</div>
			</div>

			<div class="figure">
				<a href="images/help/working-with-images/viewing-exif-info/show-photo-info-dialog.png" target="_blank" class="lightbox" title="Photo Tab on Show Info Dialog"><img class="dialog" src="images/help/working-with-images/viewing-exif-info/show-photo-info-dialog.png" /></a>
				<div class="caption">Photo Tab on Show Info Dialog</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-image"></i>Viewing Exif Info in <%= config.apps['image_viewer'].name %></h2>
			<p>In order to view the complete set of EXIF information associated with an image, open the image in the <a href="#apps/image-viewer"><%= config.apps['image_viewer'].name %></a> app, then select Sidebar > Image Info on the View menu. </p>

			<div class="figure">
				<img class="nested dropdown menu" src="images/help/working-with-images/viewing-exif-info/view-image-info-menu-item@2x.png" />
				<div class="caption">View Sidebar Image Info Menu Item</div>
			</div>

			<div class="figure">
				<a href="images/help/working-with-images/viewing-exif-info/image-info-sidebar.png" target="_blank" class="lightbox" title="Image Info Panel in Sidebar"><img class="dialog" src="images/help/working-with-images/viewing-exif-info/image-info-sidebar.png" /></a>
				<div class="caption">Image Info Panel in Sidebar</div>
			</div>
		</li>
	</ol>
</div>