<h1><i class="fa fa-download"></i>Downloads</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-download"></i>Downloads</li>
</ol>

<div class="content">
	<p>You've come to the right place to download and install your own instance of <%= application.name %>.  If you have access to a web server and some basic web application deployment and systen administration skills, then you can set up your own version of <%= application.name %> on your own server! </p>

	<div class="attention"><div class="emphasis">Run Your Own <%= application.name %>!</div></div>

	<% if (config.defaults.downloads && (config.defaults.downloads.production || config.defaults.downloads.development)) { %>

	<% if (config.defaults.downloads.production) { %>
	<h2><i class="fa fa-file-zipper"></i>Releases</h2>
	<p>To download a pre-compiled, ready-to-run version of <%= application.name %>, click a link below. This software is ready to deploy - to run it, just download it and then install it on your web server using the instructions below. </p>
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Link</th>
			</tr>
		</thead>
		<tbody>
		<% let keys = Object.keys(config.defaults.downloads.production); %>
		<% for (let i = 0; i < keys.length; i++) { %>
		<% let key = keys[i]; %>
		<% let href = config.defaults.downloads.production[key]; %>
			<tr>
				<td style="width:33%"><%= key %></td>
				<td><a href="<%= href %>" target="_blank"><%= href %></a></td>
			</tr>
		<% } %>
		</tbody>
	</table>
	<% } %>

	<% if (config.defaults.downloads.development) { %>
	<br />
	<h2><i class="fa fa-code"></i>For Developers</h2>
	<p>To view or download the <%= application.name %> source code, visit a link below. This software is provided in its original, uncompiled form, which can be installed as-is, or can be compiled for better performance. As always, make sure to read the licensing terms included in the repository. </p>

	<% if (config.defaults.downloads.development) { %>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Link</th>
			</tr>
		</thead>
		<tbody>
		<% let keys = Object.keys(config.defaults.downloads.development); %>
		<% for (let i = 0; i < keys.length; i++) { %>
		<% let key = keys[i]; %>
		<% let href = config.defaults.downloads.development[key]; %>
			<tr>
				<td style="width:33%"><%= key %></td>
				<td><a href="<%= href %>" target="_blank"><%= href %></a></td>
			</tr>
		<% } %>
		</tbody>
	</table>
	<% } %>
	<% } %>
	<% } else { %>
	<p>No downloads are currently available.  Please <a href="#contact">contact us</a> for more information.
	<% } %>

	<br />

	<h2><i class="fa fa-computer"></i>Install the Software</h2>
	<p>Once you have downloaded <%= application.name %> from the link above, then you will need to install it on your system by following <a href="#installation">these instructions</a>. </p>
</div>