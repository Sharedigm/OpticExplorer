<div class="pager">
	<div class="btn-group">
		<button type="button" class="first btn btn-sm" data-toggle="tooltip" title="<%= tooltips.first %>" data-placement="top"<% if (pageNumber == 1) { %> disabled<% } %>>
			<i class="fa fa-fast-backward"></i>
		</button>

		<button type="button" class="prev btn btn-sm" data-toggle="tooltip" title="<%= tooltips.prev %>" data-placement="top"<% if (pageNumber == 1) { %> disabled<% } %>>
			<i class="fa fa-backward"></i>
		</button>

		<span class="page-info">
			<input class="page-number" value="<%= pageNumber %>" data-toggle="tooltip" title="Page #" data-placement="top">
		</span>

		<button type="button" class="next btn btn-sm" data-toggle="tooltip" title="<%= tooltips.next %>" data-placement="top"<% if (pageNumber == numPages) { %> disabled<% } %>>
			<i class="fa fa-forward"></i>
		</button>

		<button type="button" class="last btn btn-sm" data-toggle="tooltip" title="<%= tooltips.last %>" data-placement="top"<% if (pageNumber == numPages) { %> disabled<% } %>>
			<i class="fa fa-fast-forward"></i>
		</button>
	</div>
</div>