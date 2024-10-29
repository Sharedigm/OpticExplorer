<h1><i class="fa fa-database"></i>Setting Up the Database</h1>

<ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-installation"></i>Installation</li>
	<li><i class="fa fa-database"></i>Setting Up the Database</li>
</ol>

<div class="content">
	<p><%= application.name %> uses a standard SQL database.  You can use any of a number of SQL databases including MySQL, MariaDB, and others.  To set up your <%= application.name %> database, perform the following steps:</p>

	<ol>
		<li>
			<h2><i class="fa fa-database"></i>Create New Database</h2>
			<p>Using a database editor of your choice, create a new database named "<%= application.name.toLowerCase() %>".
		</li>

		<li>
			<h2><i class="fa fa-table"></i>Create Database Tables</h2>
			<p>To create the required database tables, locate the directory <span class="code">src/database</span>.  Inside of this directory, you will see a number of .sql files.  Run the file "_structure.sql" to create the database table structure. </p>

			<div class="icon-grid figure">
				<div class="file item">
					<div class="row">
						<div class="icon"><img src="images/icons/files/sql.svg" /></div>
					</div>
					<div class="row">
						<div class="name">_structure.sql</div>
					</div>
				</div>
			</div>
		</li>
		
		<li>
			<h2><i class="fa fa-list"></i>Initialize Database Tables</h2>
			<p>You will need to initialize the database with an administrator account and some additional information used by the application.  Inside of the <span class="code">src/database</span> directory, you will see a number of .sql files in addition to the <span class="code">_structure.sql</span> file that you ran in the previous step.  Run each of these other .sql files to complete the database initialization. 

			<div class="icon-grid figure">
				<div class="file item">
					<div class="row">
						<div class="icon"><img src="images/icons/files/sql.svg" /></div>
					</div>
					<div class="row">
						<div class="name">_initialize.sql</div>
					</div>
				</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-gear"></i>Configure the Application</h2>
			<p>To configure the application to use the database that you just created, open up the file <span class="code">src/services/.env</span> and set the database parameters: </p>

			<div class="code well">
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=<%= application.name.toLowerCase() %>
DB_USERNAME=webuser
DB_PASSWORD=password
			</div>
		</li>
	</ol>
</div>