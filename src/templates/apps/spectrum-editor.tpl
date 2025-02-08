<h1><i class="<%= config.apps['spectrum_editor'].icon %>"></i><%= config.apps['spectrum_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file"></i><%= config.apps['spectrum_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['spectrum_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['spectrum_editor'].image || config.apps['spectrum_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['spectrum_editor'].name %> app lets you view and define spectra of lights. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View the spectra of lights.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Explore and understand lights.</li>
					<li>Create your own custom lights.</li>
				</ul>
			</div>
		</div>
	</div>
	
	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/spectrum-editor/spectrum-editor.png" target="_blank" class="lightbox" title="Spectra"><img class="dialog" src="images/info/apps/spectrum-editor/spectrum-editor.png" /></a>
		<div class="caption">Spectra</div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/spectrum-editor/mobile/mobile-spectrum-editor.png" target="_blank" class="lightbox" title="Spectra"><img src="images/info/apps/spectrum-editor/mobile/mobile-spectrum-editor.png" /></a>
		<div class="caption">Spectra</div>
	</div>
</div>