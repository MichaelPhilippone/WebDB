/** ******************* WebDB ******************* 
 * ===========================================================================================
 * AUTHOR	: Michael Philippone
 * ===========================================================================================
 * DATE 	: 2011-01-17
 * ===========================================================================================
 * PURPOSE: 
 *	provide a unified, SQL-like, OOP interface to the 
 * 	Client-side SQLite DB that is exposed by modern browsers
 * ===========================================================================================
 * DOCUMENTATION:
 * 	initializing the database is simple, just provide an options object to the 
 *		constructor, like so:
 *
 * 			var webdb = WebDB();
 *			// OR
 *			var webdb = $DB();
 *
 * ===========================================================================================
 *	METHODS:
 * -------------------------------------------------------------------------------------------------
 *	+)	init( [params] ) OR WebDB( [params] ) OR $DB( [params] ) OR CREATE_DATABASE( [params] ) ==> 
 *						initalizes an instance of the DB object and ties it to a SQLite DB instance
 *
 *			params ==> object containing the following options:
 *				name				=>	name to assign to the Database instance
 *				description	=>	brief description of the database's purpose
 *				size				=>	size (in Mb) to allocate for the db
 *				version			=>	developer defined value of the DB version 
 *													(to assist in live vs offline versioning)
 *
 * 		(the following options are only available for the constructor and init() methods:)
 *
 *				onSuccess		=>	[optional] hander/callback for default behaviour after successful queries
 * 												(NOTE: there is a default handler suppplied, but you REALLY SHOULD
 *												specify your own to replace it)
 *				onError			=>	[optional] hander/callback for default behaviour after errors during operation
 *												(NOTE: there is a default handler suppplied, but you REALLY SHOULD
 *												specify your own to replace it)
 * -------------------------------------------------------------------------------------------------
 * 	+)	CREATE_TABLE( [params] )  => create a table according to parameters
 *																		NOTE: since WebDB is all about simplicity, 
 *																			don't worry about specifying PRIMARY KEY or Last-modified
 *																			columns, WebDB takes care of them for you :-)
 *			params => object containing following options:
 *				table		=>	name of table to create
 *				columns	=> object containing mappings of column names and column data-types
 *										ie: { 'name':'text' , 'Birthday':'DATETIME' }
 *-------------------------------------------------------------------------------------------------
 *	+)	DROP_TABLE( params ) => DROP a specified table
 *			params => [REQUIRED] object containing following options:
 *				table 		=> 	table name to drop
 *				onSuccess	=>	[optional] optional override for global DB-success handler
 *				onError		=>	[optional] optional override for global DB-error handler
 * -------------------------------------------------------------------------------------------------
 *	+)	INSERT( params ) => inserts values into a table
 *			params => [REQUIRED] object containing data to insert according to:
 *				table	 		=> table into which we want to insert values
 *				columns 	=> array of names of columns
 *				values 		=> array of values to insert into columns (corresponds to 'columns' property)
 *				onSuccess	=> [optional] override for global DB-success handler
 * 				onError		=> [optional] override for global DB-error handler
 *				last_mod	=> [optional] override for last_modified timestamp (BE CAREFUL!)
 * -------------------------------------------------------------------------------------------------
 *	+)	SELECT_ALL( params ) => return all rows for a given table:
 *
 *
 *
 *
 *
 *
 * -------------------------------------------------------------------------------------------------
 *	+)	DROP_DATABASE( params ) => return all rows for a given table:
 *
 *
 *
 *
 *
 *
 * -------------------------------------------------------------------------------------------------
 *	+)	SELECT( params ) => return rows as specified by the params:
 *
 *
 *
 *
 * -------------------------------------------------------------------------------------------------
 *	+)	UPDATE( params ) => update rows specified by the params:
 *
 *
 *
 *
 *
 * -------------------------------------------------------------------------------------------------
 *	+)	DELETE( params ) => update rows specified by the params:
 *
 *
 *
 *
 *
 * -------------------------------------------------------------------------------------------------
 *	+)	DELETE_ALL( params ) => delete ALL rows for table specified by the params:
 *
 *
 *
 *
 *
 * -------------------------------------------------------------------------------------------------
 * ===========================================================================================
 *	NOTE: if no 'params' object is specified, 
 * 		the entire installation defaults to a schema for a To-Do list manager :)
 *		(unless otherwise noted to be [REQUIRED])
 * ===========================================================================================
 */

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!! CORE FUNCTIONALITY SPECIFIED BELOW !!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!! EDIT AT YOUR OWN RISK! !!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* Sandbox it! */
(function( window, undefined ) {	
	
	window.WebDB_VERSION = "0.1";
	window.WebDB_HideErrors = false;
	
	// provide some defaults for initializing a sample instance of a WebDB
	var defaults = {
		DBNAME:						"Todo"
		, DBSIZE:					parseFloat(5*Mb)
		, DBDESCRIPTION:	"Todo List Manager (SAMPLE)"
		, DBVERSION:			"0.1"
		, tables:{
				"default": {
						name: 		'tbl_todos'
					, columns:	{ "DueDate":"DATETIME" , "Task":"TEXT" }
			}
		}
	};
	var Mb = (1024*1024);
	var document = window.document;
	
	/* now, make a 'local' copy to avoid pollution */
	var WebDB = (function() {
	
		var WDB = function(params) { return new WDB.fn.init(params); };
	
		// now, fill in the prototype for the DB object
		WDB.fn = WDB.prototype = {
		
			/** list of (protected) class variables */
				get	name()					{ return (!!_dbName)?(_dbName):(""); }
			, set	name(x)					{ _dbName = x; }
			,	get	db()						{ return _db; }
			, set	db(x)						{ _db = x; }
			,	get	version()				{ return _versn; }
			, set version(x)			{ _versn = x; }
			,	get	description()		{ return _desc; }
			, set	description(x)	{ _desc = x; }
			,	get	size()					{ return _size; }
			, set	size(x)					{ _size = x; }
			,	get	tables()				{ return _tbls; }
			, set	tables(x)				{ _tbls = x; }
			
			/** map the constructor call */
			, constructor : WDB
			
			/** helper function to get current timestamp in milliseconds since the EPOCH :) */
			, now: function() { return (new Date()).getTime(); }
			
			/** helper function to provide ()?():() functionality */
			, ifThenElse: function (_if,_then,_else){
				if( _if ) {
					return _then;
				} else {
					return _else;
				}
			}
			
			/** helper function for logging SQL calls */
			, log_sql: function( sql , caller ) { 
					//var caller = '' ;arguments.callee.caller.toString(); 
					console.log("EXECUTING SQL in '" + caller + "': " + sql ); }
			
			/** default error handler for DB operations */
			, onError : function(tx, e) { 
				if( !window.WebDB_HideErrors ) {
					console.error('SQL ERROR: ' + e.message ); 
					console.log("    TX -- ");
					console.log(tx);
					console.log( "    ERROR -- " );
					console.log(e);
				}
			}
			
			/** default success handler for DB operations */
			, onSuccess : function(tx, r) {
					var self = this;
					console.log( "SUCCESSFUL QUERY");
					console.log( "    TX -- " );
					console.log( tx );
					console.log( "    ROW -- " );
					console.log( r );
			}
			
			/** [constructor] wrapper for CREATE_DATABASE */
			, init: function(params)	{
					var self = this;
					
					self.onSuccess		= !!params && params.onSuccess 		|| self.onSuccess;
					self.onError			= !!params && params.onError 			|| self.onError;
					
					self.tables = [];
					
					return self.CREATE_DATABASE( params );
			}
			
			/** initialize a SQLite DB with any specified options */
			, CREATE_DATABASE : function(params) {
					var self = this;	
					if( !!!params ) console.log('NOTE: No options given to CREATE_DATABASE, using DEFAULT options');
					
					// assign defaults:
					self.name 				= !!params && !!params.name && params.name 								|| defaults.DBNAME;
					self.description 	= !!params && !!params.description && params.description 	|| defaults.DBDESCRIPTION;
					self.version 			= !!params && !!params.version && params.version 					|| defaults.DBVERSION;
					self.size 				= !!params && !!params.size && params.size 								|| defaults.DBSIZE;
					
					self.db = openDatabase( self.name , self.version , self.description , self.size )

					return self;
			}	
				
			/** since W3C API does not provide this, we'll pproximate it here: */
			, DROP_DATABASE: function(params){
				var self = this;
					
				var success = !!params && params.onSuccess 	|| self.onSuccess;
				var error = !!params && params.onError 			|| self.onError;
					
				// build up the query string from the given parameters:
				
				self.log_sql(sql,'DROP_DATABASE');
				for( var i=0,table = self.tables[i]; i < self.tables.length; i++ )
					self.DROP_TABLE({	table: table , onSuccess: success , onError: error });

				self.tables=[];
			}
			
			/** creates a table in the SQLite DB according to specified parameters: */
			, CREATE_TABLE : function(params) {
					var self = this;
					if( !!!params ) console.log('NOTE: No options given to CREATE_TABLE, using DEFAULT options');
					
					var table = !!params && params.table 				|| defaults.tables['default'].name;
					var columns = !!params && params.columns 		|| defaults.tables['default'].columns;
					var success = !!params && params.onSuccess 	|| self.onSuccess;
					var error = !!params && params.onError 			|| self.onError;
					
					// add this to our listing of tables for this DB
					self.tables.push( table );
					
					// build up the query string from the given parameters:
					var sql = 'CREATE TABLE IF NOT EXISTS ' + table +'(';
					sql += 'sys_ROW_ID INTEGER PRIMARY KEY ';		// ALWAYS add a system-maintained primary key
					sql += ', sys_LAST_MODIFIED DATETIME';			// ALWAYS add a system-maintained last_modified column
					for( var col in columns )
						sql += ', ' + col + ' ' + columns[col] ;
					sql += ')';

					self.log_sql(sql,'CREATE_TABLE');
					
					self.db.transaction(function(tx) { 
						tx.executeSql(	sql 
														, [] 
														, function(tx,r){
																success(tx,r);
																console.log(r);
														} 
														, error ); });
			}
			
			/** drops a table in the SQLite DB according to specified parameters: */
			, DROP_TABLE : function(params) {
					var self = this;

					if( !!!params && !!params.table ) {
						console.error('ERROR: No options given to DROP_TABLE');
						return -1;
					}
					
					var table = !!params && params.table;
					var success = !!params && params.onSuccess 	|| self.onSuccess;
					var error = !!params && params.onError 			|| self.onError;
					
					sql = 'DROP TABLE IF EXISTS ' + table ;
					self.log_sql(sql,'DROP_TABLE');
					self.db.transaction(function(tx) { tx.executeSql( sql , [] , success , error ); });
			}
			
			/** INSERT a record into a table according to specified parameters */
			, INSERT : function(params) {
					var self = this;

					if( !!!params ) {
						console.error('ERROR: No options given to INSERT');
						return -1;
					}
					
					var values = !!params && params.values;
					var table = !!params && params.table;
					var columns = !!params && params.columns;

					success = !!params && params.onSuccess 			|| self.onSuccess;
					error = !!params && params.onError 					|| self.onError;
					last_mod = !!params && params.last_modified || self.now();

					if( values.length != columns.length ) {
						console.error('ERROR: [INSERT] Uneven values / columns arrays given');
						return -1;
					}	

					sql = 'INSERT INTO '+ table +'( sys_LAST_MODIFIED';
					for( var i=0; i<columns.length; i++ )
						sql += ' , ' + columns[i] ;
					sql += ' ) VALUES ( ?'; // '?' is for for the last_mod
					for( var i=0; i<values.length; i++ )
						sql += ' , ?';
					sql += ' )'; 
					
					// stick the last_mod date at the front of the insertions array
					values = [last_mod].concat( values ); 
					console.log( values );
					
					self.log_sql(sql,'INSERT');
					
					self.db.transaction(function(tx) { tx.executeSql( sql , values , success , error ); });
			}

			/** SELECT ALL RECORDS from a table according to specified parameters: */
			, SELECT_ALL : function(params) {
					var self = this;
					
					if( !!!params || !!params && !!!params.table) {
						console.error('ERROR [SELECT_ALL]: Bad options');
						return -1;
					}
					var onSuccess	= !!params && params.onSuccess	|| self.onSucces;
					var onError 	= !!params && params.onError 		|| self.onError;
					var table			= !!params && params.table
					
					sql = 'SELECT * FROM ' + table;
					
					self.log_sql(sql,'SELECT_ALL');
					
					self.db.transaction(function(tx) { tx.executeSql( sql , [] , onSuccess , onError ); });
			}
			
			/** select rows based on criteria in params */
			, SELECT : function(params){
				alert('STILL TO BE DEVELOPED');
			}
			
			/** update rows based on criteria in params */
			, UPDATE : function(params){
				alert('STILL TO BE DEVELOPED');
			}
			
			/** delete all rows in table criteria from params */
			, DELETE_ALL : function(params){
				alert('STILL TO BE DEVELOPED');
			}

			/** DELETE a row from a table according to specified parameters: */
			, DELETE : function(params) {
					var self = this;

					if( !!!params ) {
						console.error('ERROR: [DELETE] No options given');
						return -1;
					}

					var column = !!params && params.column ;
					var table	= !!params && params.table;
					var value = !!params && params.value;
					var success	= !!params && params.onSuccess	|| self.onSucces;
					var error 	= !!params && params.onError 		|| self.onError;
					
					
					self.log_sql(sql,'DELETE');
					
					self.db.transaction(function(tx) { 
						tx.executeSql(
							'DELETE FROM '+table+' WHERE '+column+'=?'
							, [value]
							, success
							, error);
						});
			}
			
		}; // end prototype definition
		
		// Map over WebDB in case of overwrite
		_WebDB = window.WebDB;
		// Map over the $DB in case of overwrite
		_$DB = window.$DB;
		// Give the init function the WebDB prototype for later instantiation
		WDB.fn.init.prototype = WDB.fn;
			
		// expose WebDB object to global namespace
		return (window.WebDB =  window.$DB = WDB);	
		
	})(); // end WebDB anon scope

})(window); // end outermost anon scope
