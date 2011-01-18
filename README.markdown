WebDB
======
**AUTHOR**: Michael Philippone

**DATE**: 2011-01-17

**PURPOSE**:  Provide a unified, SQL-like, OOP interface to the Client-side SQLite DB that is exposed by modern browsers

**EXAMPLE**: initializing the database is simple, just provide an options object to the constructor, like so:
	<script type="text/javascript">
		var webdb = WebDB();
		// OR
		var webdb = $DB();
	</script>

**NOTE**: if no 'params' object is specified, the entire installation defaults to a schema for a To-Do list manager :)  
(unless otherwise noted to be [REQUIRED])

**REFERENCE**:
*	init( [params] ) OR WebDB( [params] ) OR $DB( [params] ) OR CREATE_DATABASE( [params] ) ==> initalizes an instance of the DB object and ties it to a SQLite DB instance
		params ==> object containing the following options:
			name				=>	name to assign to the Database instance
			description	=>	brief description of the database's purpose
			size				=>	size (in Mb) to allocate for the db
			version			=>	developer defined value of the DB version 
												(to assist in live vs offline versioning)
		(the following options are only available for the constructor and init() methods:)
			onSuccess		=>	[optional] hander/callback for default behaviour after successful queries
												(NOTE: there is a default handler suppplied, but you REALLY SHOULD
											specify your own to replace it)
			onError			=>	[optional] hander/callback for default behaviour after errors during operation
											(NOTE: there is a default handler suppplied, but you REALLY SHOULD
											specify your own to replace it)
---
*	CREATE_TABLE( [params] )  => create a table according to parameters
																	NOTE: since WebDB is all about simplicity, 
																		don't worry about specifying PRIMARY KEY or Last-modified
																		columns, WebDB takes care of them for you :-)
		params => object containing following options:
			table		=>	name of table to create
			columns	=> object containing mappings of column names and column data-types
									ie: { 'name':'text' , 'Birthday':'DATETIME' }
---
*	DROP_TABLE( params ) => DROP a specified table
		params => [REQUIRED] object containing following options:
			table 		=> 	table name to drop
			onSuccess	=>	[optional] optional override for global DB-success handler
			onError		=>	[optional] optional override for global DB-error handler
---
*	INSERT( params ) => inserts values into a table
		params => [REQUIRED] object containing data to insert according to:
			table	 		=> table into which we want to insert values
			columns 	=> array of names of columns
			values 		=> array of values to insert into columns (corresponds to 'columns' property)
			onSuccess	=> [optional] override for global DB-success handler
				onError		=> [optional] override for global DB-error handler
			last_mod	=> [optional] override for last_modified timestamp (BE CAREFUL!)
---
*	SELECT_ALL( params ) => return all rows for a given table:
---
*	DROP_DATABASE( params ) => return all rows for a given table:
---
*	SELECT( params ) => return rows as specified by the params:
			Still in the works
---
*	UPDATE( params ) => update rows specified by the params:
			Still in the works
---
*	DELETE( params ) => update rows specified by the params:
			Still in the works, though sort of functional
---
*	DELETE_ALL( params ) => delete ALL rows for table specified by the params:
			Still in the works
---

