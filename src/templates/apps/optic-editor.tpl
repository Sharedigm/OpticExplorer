<h1><i class="<%= config.apps['optic_editor'].icon %>"></i><%= config.apps['optic_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file"></i><%= config.apps['optic_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['optic_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['optic_editor'].image || config.apps['optic_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['optic_editor'].name %> app lets you create, simulate, analyse, and interact with models of optical systems. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Create optical systems including:
						<ul>
							<li>lenses</li>
							<li>aperture stops</li>
							<li>sensors</li>
						</ul>
					</li>
					<li>Add light sources and view their interaction with optics.
						<ul>
							<li>point lights</li>
							<li>distant lights</li>
						</ul>
					</li>
					<li>Add objects and view projected images.</li>
					<li>Import and export .zmx or .optc (yaml) files.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Manage and share your optical system models.</li>
					<li>Explore optical systems and their interactions with light.</li>
					<li>Share optical system models with friends and colleagues.</li>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/optic-editor/optic-editor.png" target="_blank" class="lightbox" title="Optics"><img class="dialog" src="images/info/apps/optic-editor/optic-editor.png" /></a>
		<div class="caption">Optics</div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/optic-editor/mobile/mobile-optic-editor.png" target="_blank" class="lightbox" title="Optics"><img src="images/info/apps/optic-editor/mobile/mobile-optic-editor.png" /></a>
		<div class="caption">Optics</div>
	</div>
</div>