WebDB
======
**AUTHOR**: Michael Philippone

**DATE**: 2011-01-17
##### updated 2011-02-21

**PURPOSE**:  Provide a unified, SQL-like, OOP interface to the Client-side SQLite DB that is exposed by modern browsers

**EXAMPLE**: initializing the database is simple, just provide an options object to the constructor, like so:
	<script type="text/javascript">
		var webdb = WebDB();
		// OR
		var webdb = $DB();
	</script>

**NOTE**: if no 'params' object is specified, the entire installation defaults to a schema for a To-Do list manager :)  
(unless the params are otherwise noted to be <span style="color:red">[REQUIRED]</span> in the reference section below)


REFERENCE:  
-----------------
*	init( [params] )  
OR  
WebDB( [params] )  
OR  
$DB( [params] )  
OR  
CREATE_DATABASE( [params] ) ==> initalizes an instance of the DB object and ties it to a SQLite DB instance
	* **params object may contain**:
		*	name				=>	<span style="color:red">[REQUIRED]</span> name to assign to the Database instance
		*	description	=>	<span style="color:red">[REQUIRED]</span> brief description of the database's purpose
		*	size				=>	<span style="color:red">[REQUIRED]</span> size (in Mb) to allocate for the db
		*	version			=>	<span style="color:red">[REQUIRED]</span> developer defined value of the DB version (to assist in live vs offline versioning)
		*	onSuccess		=>	<span style="color:blue">[optional]</span> hander/callback for default behaviour after successful queries  
			(**NOTE**: there is a default handler suppplied, but you REALLY SHOULD specify your own to replace it)  
			*only available when calling a constructor or* **init()**
		*	onError			=>	<span style="color:blue">[optional]</span> hander/callback for default behaviour after errors during operation  
			(**NOTE**: there is a default handler suppplied, but you REALLY SHOULD specify your own to replace it)  
			*only available when calling a constructor or* **init()**

*	CREATE_TABLE( [params] )  => create a table according to parameters  
*NOTE*: since WebDB is all about simplicity, don't worry about specifying PRIMARY KEY or Last-modified columns, WebDB takes care of them for you :-)
	* **Parameters object may contain**:
		* table		=>	<span style="color:red">[REQUIRED]</span> name of table to create
		* columns	=>  <span style="color:red">[REQUIRED]</span> object containing mappings of column names and column data-types  
			ie: { 'name':'text' , 'Birthday':'DATETIME' }

*	DROP_TABLE( params ) => DROP a specified table
	* **params object may contain**:
		* table 		=> 	<span style="color:red">[REQUIRED]</span> table name to drop
		* onSuccess	=>	<span style="color:blue">[optional]</span> optional override for global DB-success handler
		* onError		=>	<span style="color:blue">[optional]</span> optional override for global DB-error handler

*	INSERT( params ) => inserts values into a table
	* **params object may contain**:
		* table	 		=>  <span style="color:red">[REQUIRED]</span> table into which we want to insert values
		* columns 	=>  <span style="color:red">[REQUIRED]</span> array of names of columns
		* values 		=>  <span style="color:red">[REQUIRED]</span> array of values to insert into columns (corresponds to 'columns' property)
		* onSuccess	=>	<span style="color:blue">[optional]</span> optional override for global DB-success handler
		* onError		=>	<span style="color:blue">[optional]</span> optional override for global DB-error handler

*	SELECT_ALL( params ) => return all rows in a given table:
	* **params object may contain**:
		* table     =>  <span style="color:red">[REQUIRED]</span> table we are querying for values
		* onSuccess	=>	<span style="color:blue">[optional]</span> optional override for global DB-success handler
		* onError		=>	<span style="color:blue">[optional]</span> optional override for global DB-error handler

*	DROP_DATABASE( params ) => drops all tables for the WebDB instance:
	* **params object may contain**:
		* onSuccess	=>	<span style="color:blue">[optional]</span> optional override for global DB-success handler
		* onError		=>	<span style="color:blue">[optional]</span> optional override for global DB-error handler
	
-------------------------------------
## UNDER CONSTRUCTION

*	SELECT( params ) => return rows as specified by the params:
	* **params object may contain**:
		* STILL IN DEVELOPMENT

*	UPDATE( params ) => update rows specified by the params:
	* **params object may contain**:
		* STILL IN DEVELOPMENT

*	DELETE( params ) => update rows specified by the params:
	* **params object may contain**:
		* STILL IN DEVELOPMENT

*	DELETE_ALL( params ) => delete ALL rows for table specified by the params:
	* **params object may contain**:
		* STILL IN DEVELOPMENT


