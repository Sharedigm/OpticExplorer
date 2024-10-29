<h1><i class="<%= config.apps['map_viewer'].icon %>"></i><%= config.apps['map_viewer'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-map"></i><%= config.apps['map_viewer'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['map_viewer'].color %>">
		<img src="images/icons/apps/<%= config.apps['map_viewer'].image || config.apps['map_viewer'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['map_viewer'].name %> app lets you view and explore an interactive map. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>	
					<li>View maps in the following modes:
						<ul>
							<li>map</li>
							<li>aerial</li>
							<li>hybrid</li>
						</ul>
					</li>
					<li>Search maps by:
						<ul>
							<li>coordinates</li>
							<li>address</li>
						</ul>
					</li>
					<li>Measure distances between locations. Choose between:
						<ul>
							<li>Metric units (km)</li>
							<li>Imperial units (miles)</li>
						</ul>
					</li>
					<li>Easy to use pan and zoom controls.</li>
					<li>Add and manage place markers.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Allows you to view and explore the world. </li>
					<li>View your images, videos, and connections by geolocation. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/map-viewer/map-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['map_viewer'].name %>"><img class="dialog" src="images/info/apps/map-viewer/map-viewer.png" /></a>
		<div class="caption"><%= config.apps['map_viewer'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/map-viewer/mobile/mobile-map-viewer.png" target="_blank" class="lightbox" title="<%= config.apps['map_viewer'].name %>"><img src="images/info/apps/map-viewer/mobile/mobile-map-viewer.png" /></a>
		<div class="caption"><%= config.apps['map_viewer'].name %></div>
	</div>
</div>