<h1><i class="<%= config.apps['pdf_viewer'].icon %>"></i><%= config.apps['pdf_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file-pdf"></i><%= config.apps['pdf_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['pdf_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['pdf_viewer'].image || config.apps['pdf_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['pdf_viewer'].name %> app lets you view .pdf (Portable Document Format) documents. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Use the navigation controls to navigate through the document pages.</li>
					<li>Use the zoom controls to zoom in, out, fit width, height, or size</li>
					<li>Preview and navigate pages using the sidebar thumbnail preview.</li>
					<li>Use the full screen mode to expand documents to encompass the screen.</li>
					<li>On mobile devices, pinch to zoom and swipe to pan.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Read PDF files from any network connected device. </li>
					<li>Lets you move your documentation or ebook libraries to the cloud. </p>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/pdf-viewer/pdf-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['pdf_viewer'].name %>"><img class="dialog" src="images/info/apps/pdf-viewer/pdf-viewer.png" /></a>
		<div class="caption"><%= config.apps['pdf_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/pdf-viewer/mobile/mobile-pdf-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['pdf_viewer'].name %>"><img src="images/info/apps/pdf-viewer/mobile/mobile-pdf-viewer.png" /></a>
		<div class="caption"><%= config.apps['pdf_viewer'].name %></div>
	</div>
</div>