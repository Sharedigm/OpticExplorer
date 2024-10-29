<h1><i class="fa fa-download"></i>Downloads</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-download"></i>Downloads</li>
</ol>

<div class="content">
	<p>You've come to the right place to download and install your own instance of <%= application.name %>.  If you have access to a web server and some basic web application deployment and systen administration skills, then you can set up your own version of <%= application.name %> on your own server! </p>

	<div class="attention"><div class="emphasis">Run Your Own <%= application.name %>!</div></div>

	<h2><i class="fa fa-file-zipper"></i>Releases</h2>
	<p>To install your own version of <%= application.name %>, you will first need to download the files from a link below: </p>

	<% if (config.defaults.releases) { %>
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Link</th>
			</tr>
		</thead>
		<tbody>
		<% let dates = Object.keys(config.defaults.releases); %>
		<% for (let i = 0; i < dates.length; i++) { %>
		<% let date = dates[i]; %>
		<% let release = config.defaults.releases[date]; %>
			<tr>
				<td><%= date %></td>
				<td><a href="<%= release %>" target="_blank"><%= release %></a></td>
			</tr>
		<% } %>
		</tbody>
	</table>
	<% } %>

	<br />

	<h2><i class="fa fa-computer"></i>Install the Software</h2>
	<p>Once you have downloaded <%= application.name %> from the link above, then you will need to install it on your system by following <a href="#installation">these instructions</a>. </p>
</div>