<h1><i class="<%= config.apps['tune_editor'].icon %>"></i><%= config.apps['tune_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-music"></i><%= config.apps['tune_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['tune_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['tune_editor'].image || config.apps['tune_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['tune_editor'].name %> lets you view, create, and edit music notation documents. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>View and play music notation / sheet music.</li>
					<li>Open and create music notation files in .abc format</li>
					<li>Select notes and symbols in either the notation or the markup view.</li>
					<li>Play music notation as MIDI audio.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Read and write music from any network connected device. </li>
					<li>The ABC music notation format is simple to use and extremely efficient so you can store a huge number of songs in a very small amount of space. </p>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/tune-editor/tune-editor.png" target="_blank" class="lightbox" title="<%= config.apps['tune_editor'].name %>"><img class="dialog" src="images/info/apps/tune-editor/tune-editor.png" /></a>
		<div class="caption"><%= config.apps['tune_editor'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/tune-editor/mobile/mobile-tune-editor.png" target="_blank" class="lightbox" title="<%= config.apps['tune_editor'].name %>"><img src="images/info/apps/tune-editor/mobile/mobile-tune-editor.png" /></a>
		<div class="caption"><%= config.apps['tune_editor'].name %></div>
	</div>
</div>