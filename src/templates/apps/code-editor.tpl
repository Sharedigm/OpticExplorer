<h1><i class="<%= config.apps['code_editor'].icon %>"></i><%= config.apps['code_editor'].name %></h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#apps"><i class="fa fa-rocket"></i>Apps</a></li>
	<li><i class="fa fa-code"></i><%= config.apps['code_editor'].name %></li>
</ol>

<div class="content">
	<div class="attention icon colored <%= config.apps['code_editor'].color %>">
		<img src="images/icons/apps/<%= config.apps['code_editor'].image || config.apps['code_editor'].app + '.svg' %>" />
	</div>

	<div class="description section">
		<p>The <%= config.apps['code_editor'].name %> app lets you read and write computer programming source code. </p>
	</div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-check"></i>Features</h2>
				<ul>
					<li>Syntax highlighting for over 100 languages including (C, C++, C#, CSS, HTML, Java, Javascript, JSON, Pascal, Perl, PHP, Python, Ruby, Rust, Scala, SQL, SVG, Swift, Typescript, XML, YAML, and more).</li>
					<li>Indent and outdent blocks of code.</li>
					<li>Hierarchical block selection of code.</li>
					<li>Allows keyboard commands in vi/vim mode.</li>
					<li>Whitespace and hidden character display options.</li>
					<li>Cut, copy, paste to and from other documents.</li>
					<li>Tree view allows navigation of the files in your source tree.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-star"></i>Benefits</h2>
				<ul>
					<li>Create, edit, and manage your software source code from any network connected device. </li>
					<li>Makes sharing source code easy and fun. </p>
				</ul>
			</div>
		</div>
		<h2><i class="fa fa-file"></i>File Types</h2>
		<p>The <%= config.apps['code_editor'].name %> can be used to edit code files written in your programming language of choice: </p>
		<div class="icon-grid" style="white-space:nowrap; overflow-x:auto">
		<% let associations = application.settings.associations.attributes; %>
		<% let extensions = Object.keys(associations); %>
		<% for (var i = 0; i < extensions.length; i++) { %>
		<% let extension = extensions[i]; %>
		<% if (extension != '') { %>
		<% let application = associations[extension]; %>
		<% if (application == 'code_editor') { %>
			<div class="file item">
				<div class="row">
					<div class="icon"><img src="images/icons/files/<%= extension %>.svg" /></div>
				</div>
			</div>
		<% } %>
		<% } %>
		<% } %>
		</div>
	</div>

	<h2><i class="fa fa-desktop"></i>Screen Shots</h2>
	<div class="figure desktop-only">
		<a href="images/info/apps/code-editor/code-editor.png" target="_blank" class="lightbox" title="<%= config.apps['code_editor'].name %>"><img class="dialog" src="images/info/apps/code-editor/code-editor.png" /></a>
		<div class="caption"><%= config.apps['code_editor'].name %></div>
	</div>
	<div class="figure mobile-only">
		<a href="images/info/apps/code-editor/mobile/mobile-code-editor.png" target="_blank" class="lightbox" title="<%= config.apps['code_editor'].name %>"><img src="images/info/apps/code-editor/mobile/mobile-code-editor.png" /></a>
		<div class="caption"><%= config.apps['code_editor'].name %></div>
	</div>
</div>