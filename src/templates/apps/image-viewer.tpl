<h1><i class="<%= config.apps['image_viewer'].icon %>"></i><%= config.apps['image_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-image"></i><%= config.apps['image_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['image_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['image_viewer'].image || config.apps['image_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['image_viewer'].name %> app lets you view your images and photo collections. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>	
					<li>View image files in the following formats:
						<ul>
							<li>Jpeg (.jpg, .jpeg)</li>
							<li>Png (.png)</li>
							<li>Gif (.gif)</li>
							<li>Photoshop (.psd)</li>
							<li>Scalable Vector Graphics (.svg)</li>
							<li>Targa (.tga)</li>
							<li>Tiff (.tif, .tiff)</li>
							<li>Windows Bitmap (.bmp)</li>
						</ul>
					</li>
					<li>Use the zoom controls to inspect image details.</li>
					<li>Use the sidebar thumbnail view to preview and navigate images.</li>
					<li>Use the navigation controls to step through a collection of images.</li>
					<li>Use the full screen mode to expand images to encompass the screen.</li>
					<li>On mobile devices, pinch to zoom and swipe to pan images.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Allows you to view and closely inspect your photos from any network connected device. </li>
					<li>Lets you move your photo collections to the cloud. </p>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/working-with-images">Working With Images</a></li>
	</ul>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/image-viewer/image-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['image_viewer'].name %>"><img class="dialog" src="images/info/apps/image-viewer/image-viewer.png" /></a>
		<div class="caption"><%= config.apps['image_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/image-viewer/mobile/mobile-image-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['image_viewer'].name %>"><img src="images/info/apps/image-viewer/mobile/mobile-image-viewer.png" /></a>
		<div class="caption"><%= config.apps['image_viewer'].name %></div>
	</div>
</div>