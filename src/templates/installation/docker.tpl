<h1><i class="fab fa-docker"></i>Docker Installation</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fab-docker"></i>Docker Installation</li>
</ol>

<div class="content">
	<p>The Docker installation allows you to get <%= application.name %> installed and running within just a few minutes.  The Docker installation specifies the details for you so you don't need to make any decisions about the particular implementation.  This is the right approach for most users.</p>

	<div class="attention"><div class="emphasis">Get Started in Minutes!</div></div>

	<div class="details section">
		<div class="row">
			<div class="col-sm-6">
				<h2><i class="fa fa-thumbs-up"></i>Advantages</h2>
				<ul>
					<li><b>Quick</b> - get started in minutes.</li>
					<li><b>Easy</b> - no need to specify technical details.</li>
					<li><b>Consistent</b> - process ensures consistency.</li>
				</ul>
			</div>
			<div class="col-sm-6">
				<h2><i class="fa fa-thumbs-down"></i>Disadvantages</h2>
				<ul>
					<li><b>Requires Docker</b> to be installed and running. </li>
					<li><b>Less control</b> over the implementation.</li>
					<li><b>Can consume</b> a lot of memory and storage.</li>
				</ul>
			</div>
		</div>
	</div>

	<ol>
		<li>
			<h2><i class="fab fa-docker"></i>Install Docker</h2>
			<p>If you want to run <%= application.name %> from your local / desktop computer, then we recommend that you install <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker Desktop</a>.  If you intend to run <%= application.name %> on a remote server, then we recommend that you install docker using the "get-docker.sh" installation script: 
			<div class="code well">
curl https://get.docker.com > get-docker.sh
sh get-docker.sh
			</div>
		</li>
		<li>
			<h2><i class="fa fa-download"></i>Download the Code</h2>
			<p>Next, <a href="#downloads">download</a> the <%= application.name %> code. </p>
		</li>
		<li>
			<h3><i class="fa fa-rocket"></i>Run Your Container</h3>
			<p>To run the container, open up a terminal and 'cd' into the directory that you downloaded. Then enter: </p>
			<div class="code well">
sh start.sh
			</div>

			<p>or enter:</p>
			<div class="code well">
docker compose up --build
			</div>
			<p>The docker process will run for a while.  The first time you run this command, it will need to download the docker images for the web server and database, which may take a few minutes.  You will see a stream of status messages scroll by.  When this stops, the application will be up and running.
		</li>
		<li>
			<h3><i class="fa fa-eye"></i>View the Application</h3>
			<p>To view the application, if you are running on your local / desktop computer, then open up your web browser and, in the address bar, type "localhost".   If you are running on a remote server, then open up your web browser and type in the hostname or IP address of your server. </p>
		</li>
	</ol>
</div>