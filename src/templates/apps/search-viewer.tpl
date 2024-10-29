<h1><i class="<%= config.apps['search_viewer'].icon %>"></i><%= config.apps['search_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-user"></i><%= config.apps['search_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['search_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['search_viewer'].image || config.apps['search_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['search_viewer'].name %> app is used to search the content of files and posts. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Search files by content.</li>
					<li>Search discussion topic posts by content.</li>
					<li>Search by text.</li>
					<li>Search by the contents of a web page.</li>
					<li>Search by the contents of a file.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Make your files and posts searchable by others. </li>
					<li>Mine your company or organization's information for meaning.</li>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/search-viewer/search-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['search_viewer'].name %>"><img class="dialog" src="images/info/apps/search-viewer/search-viewer.png" /></a>
		<div class="caption"><%= config.apps['search_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/search-viewer/mobile/mobile-search-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['search_viewer'].name %>"><img src="images/info/apps/search-viewer/mobile/mobile-search-viewer.png" /></a>
		<div class="caption"><%= config.apps['search_viewer'].name %></div>
	</div>
</div>