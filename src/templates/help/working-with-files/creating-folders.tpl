<h1><i class="fa fa-folder"></i>Creating Folders</h1>

<ol class="breadcrumb">
	<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>
	<li><a href="#help/working-with-files"><i class="fa fa-file"></i>Working with Files</a></li>
	<li><i class="fa fa-folder"></i>Creating Folders</li>
</ol>

<div class="content">
	<p>Folders are the mechanism that we use to group related files together into groups.  Folders can contain files and other folders, which allows you to create a tree structured hierarchy to organize your files. </p>

	<ol>
		<li>
			<h2><i class="fa fa-file"></i>The File Menu</h2>
			<p>To create a new folder, simply click on "New Folder" on the File menu. </p>

			<div class="figure">
				<img class="dropdown menu" src="images/help/working-with-files/creating-folders/new-folder-menu-item@2x.png" />
				<div class="caption">"New Folder" on the File Menu</div>
			</div>

			<p>This will create a new folder named "untitled". You can then edit the name in order to rename this folder to a unique name of your choosing. </p>

			<div class="icon-grid figure">
				<div class="directory item selected">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/folder-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name" contenteditable="true">untitled</div>
					</div>
				</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-folder"></i>Folder Icons</h2>
			<p><%= application.name %> displays folders in way that helps you to know at a glance what is contained within a folder, without even opening it. You can tell whether the folder is empty or full (non-empty) and what type of files are contained within the folder. If all of the files within a folder are audio, images, or video files, then that will be indicated using a special icon as shown below. </p>

			<div class="icon-grid figure">
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/folder-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Empty Folder</div>
					</div>
				</div>
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/folder-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Full Folder</div>
					</div>
				</div>
			</div>
			<div class="icon-grid wide figure">
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/albums-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Audio Folder</div>
					</div>
				</div>
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/images-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Images Folder</div>
					</div>
				</div>
				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/videos-full.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Video Folder</div>
					</div>
				</div>
			</div>
		</li>

		<li>
			<h2><i class="fa fa-star"></i>Special Folders</h2>
			<p><%= application.name %> treats commonly named folders specially and displays them with appropriate graphical icons in order to make them easier to recognize. </p>

			<div class="icon-grid wide figure">

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/clipboard-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">.Clipboard</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/albums-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Albums</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/audio-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Audio</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/bills-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Bills</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/books-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Books</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/calculations-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Calculations</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/code-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Code</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/collections-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Collections</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/contacts-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Contacts</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/controllers-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Controllers</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/data-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Data</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/documents-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Documents</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/favorites-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Favorites</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/fonts-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Fonts</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/gallery-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Gallery</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/git-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Git</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/graphics-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Graphics</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/images-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Images</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/internet-shortcuts-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Internet Shortcuts</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/markup-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Markup</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/messages-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Messages</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/models-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Models</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/money-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Money</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/movies-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Movies</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/music-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Music</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/news-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">News</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/notes-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Notes</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/patents-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Patents</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/people-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">People</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/photos-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Photos</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/pictures-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Pictures</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/podcasts-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Podcasts</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/presentations-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Presentations</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/profile-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Profile</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/proposals-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Proposals</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/public-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Public</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/publications-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Publications</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/research-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Research</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/resumes-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Resumes</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/scripts-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Scripts</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/shared-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Shared</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/songs-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Songs</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/sounds-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Sounds</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/themes-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Themes</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/trash-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Trash</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/uploads-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Uploads</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/utilities-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Utilities</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/videos-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Videos</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/views-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Views</div>
					</div>
				</div>

				<div class="directory item">
					<div class="row">
						<div class="icon"><img src="images/icons/folders/websites-empty.svg" /></div>
					</div>
					<div class="row">
						<div class="name">Websites</div>
					</div>
				</div>

			</div>
		</li>
	</ol>
</div>