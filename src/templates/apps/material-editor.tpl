<h1><i class="<%= config.apps['material_editor'].icon %>"></i><%= config.apps['material_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file"></i><%= config.apps['material_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['material_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['material_editor'].image || config.apps['material_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['material_editor'].name %> app lets you view and define the optical properties of materials. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View the optical properties of materials.</li>
					<li>View a graphs and properties for:
						<ul>
							<li>Refraction</li>
							<li>Reflection</li>
							<li>Transmission</li>
						</ul>
					</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Explore and understand material optical properties.</li>
					<li>Create your own custom materials.</li>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/material-editor/material-editor.png" target="_blank" class="lightbox" title="Materials"><img class="dialog" src="images/info/apps/material-editor/material-editor.png" /></a>
		<div class="caption">Materials</div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/material-editor/mobile/mobile-material-editor.png" target="_blank" class="lightbox" title="Materials"><img src="images/info/apps/material-editor/mobile/mobile-material-editor.png" /></a>
		<div class="caption">Materials</div>
	</div>
</div>