<h1><i class="<%= config.apps['text_editor'].icon %>"></i><%= config.apps['text_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-file-alt"></i><%= config.apps['text_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['text_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['text_editor'].image || config.apps['text_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['text_editor'].name %> app lets you read and write simple text files. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Select text by word, line, or paragraph.</li>
					<li>Cut, copy, and paste text to and from other documents.</li>
					<li>Use find and replace to search and replace text.</li> 
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Lets you keep notes in the cloud that you can read and write from any network connected device. </li>
				</ul>
			</div>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/text-editor/text-editor.png" target="_blank" class="lightbox" title="<%= config.apps['text_editor'].name %>"><img class="dialog" src="images/info/apps/text-editor/text-editor.png" /></a>
		<div class="caption"><%= config.apps['text_editor'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/text-editor/mobile/mobile-text-editor.png" target="_blank" class="lightbox" title="<%= config.apps['text_editor'].name %>"><img src="images/info/apps/text-editor/mobile/mobile-text-editor.png" /></a>
		<div class="caption"><%= config.apps['text_editor'].name %></div>
	</div>
</div>