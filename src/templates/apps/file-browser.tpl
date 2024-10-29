<h1><i class="<%= config.apps['file_browser'].icon %>"></i><%= config.apps['file_browser'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file"></i><%= config.apps['file_browser'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['file_browser'].color %>">
		<img src="images/icons/apps/<%= config.apps['file_browser'].image || config.apps['file_browser'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['file_browser'].name %> app lets you view, arrange, open, and manage your files. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Drag and drop to upload and download files and folders.</li>
					<li>Cut, copy, duplicate, and paste files and folders.</li>
					<li>View items by icons, lists, trees, tiles, or cards.</li>
					<li>View and sort photos by EXIF metadata (resolution, make / model, focal length, exposure, aperture, ISO, capture date).</li>
					<li>Show / hide file extensions, system files, and thumbnails.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Manage and share your digital files.</li>
					<li>Looks and works just like the file browser on your desktop operating system.</li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-info-circle"></i>For More Information</h2>
	<ul>
		<li><a href="#help/working-with-files">Working With Files</a></li>
	</ul>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/file-browser/file-browser.png" target="_blank" class="lightbox" title="<%= config.apps['file_browser'].name %>"><img class="dialog" src="images/info/apps/file-browser/file-browser.png" /></a>
		<div class="caption"><%= config.apps['file_browser'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/file-browser/mobile/mobile-file-browser.png" target="_blank" class="lightbox" title="<%= config.apps['file_browser'].name %>"><img src="images/info/apps/file-browser/mobile/mobile-file-browser.png" /></a>
		<div class="caption"><%= config.apps['file_browser'].name %></div>
	</div>
</div>