<h1><i class="<%= config.apps['material_map_viewer'].icon %>"></i><%= config.apps['material_map_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file"></i><%= config.apps['material_map_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['material_map_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['material_map_viewer'].image || config.apps['material_map_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['material_map_viewer'].name %> app lets you create, simulate, analyse, and interact with models of optical systems. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View Abbe diagrams for material catalogs.</li>
					<li>Create your own custom Abbe diagrams.</li>
					<li>View material maps for optical systems.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Understand optical system glass selection.</li>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/material-map-viewer/material-map-viewer.png" target="_blank" class="lightbox" title="Material Maps"><img class="dialog" src="images/info/apps/material-map-viewer/material-map-viewer.png" /></a>
		<div class="caption">Material Maps</div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/material-map-viewer/mobile/mobile-material-map-viewer.png" target="_blank" class="lightbox" title="Material Maps"><img src="images/info/apps/material-map-viewer/mobile/mobile-material-map-viewer.png" /></a>
		<div class="caption">Material Maps</div>
	</div>
</div>