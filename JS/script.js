
/* +++ +++ +++ +++ +++ +++ +++ +++ +++ +++ */
var totalRows=0;
function renderTodo(row) {
	console.log( row );
	var elmt = 
					$('<tr/>')
						.addClass( 'bg'+(totalRows++%2) )
						.append( $('<td/>').html(row.sys_ROW_ID) )
						.append( $('<td/>').html(row.DueDate) )
						.append( $('<td/>').html(row.Task) )
						.append( $('<td/>').html(row.sys_LAST_MODIFIED) );
					
					elmt
						.append( $('<td/>') 
												.append( 
													$('<a/>')
														.attr('href','#')
														.html('[X]')
														.click(function(e){
															cdb.DELETE({	table: 'tbl_todos'
																						, column: 'sys_ROW_ID'
																						, value: row.sys_ROW_ID
																						, onSuccess: function(tx,result) {	
																								cdb.SELECT_ALL({	table: "tbl_todos"
																																	, onSuccess: loadTodoItems	});
																						}
																			});
														})
												)
						);
	return elmt;
}
/* +++ +++ +++ +++ +++ +++ +++ +++ +++ +++ */

function loadTodoItems(tx, rs) {	
	var len = rs.rows.length;
	
	$('#output').empty();
	
	if( len <= 0 ) {
		$('#output').html('No results available in database');
		return;
	}
	
	$('#output')
		.append(
			$('<table/>')
				.append( 
					$('<thead/>')
						.append( 
							$('<tr/>')
								.append( $('<th/>').html('ROW ID') )
								.append( $('<th/>').html('DUE DATE') )
								.append( $('<th/>').html('To Do Item') )	
								.append( $('<th/>').html('Date Modified') )
								.append( $('<th/>').html('&nbsp;') )
						) 
				)
				.append( $('<tbody/>') )
		);
	
	for (var i=0; i < len; i++)
		$('#output table tbody')
			.append( renderTodo( rs.rows.item(i) ) );
}
/* +++ +++ +++ +++ +++ +++ +++ +++ +++ +++ */

function newItemHandler(){
	var due = $('#newToDoDueDate').attr('value') ;
	var item = $('#newToDoText').attr('value');

	if( due.match(/^[\s]*$/) || item.match(/^[\s]*$/) ) { 
		alert('You left something blank :)'); 
		return; 
	}
	
	cdb.INSERT({	table:'tbl_todos' 
								, values: [ 
										$('#newToDoDueDate').attr('value') 
										, $('#newToDoText').attr('value') 
								] 
								,	columns:  [ "DueDate" , "Task" ]
								, onSuccess: function(tx,result) {
										$('#newToDoText').attr('value','');
										$('#newToDoDueDate').attr('value','');

										cdb.SELECT_ALL({	table: "tbl_todos"
																			, onSuccess: loadTodoItems	});
								}
						});
	$('#newToDoDueDate').focus();
}
/* +++ +++ +++ +++ +++ +++ +++ +++ +++ +++ */
/* +++ +++ +++ +++ +++ +++ +++ +++ +++ +++ */



$('body').ready(function(e_TOP){
/* == == == == == == == == == == == == == == == == == == == == == == == == == == ==  */	

	// set up the test instance:
	window.cdb = $DB();
	cdb.CREATE_TABLE();		
	
	cdb.SELECT_ALL({	table: "tbl_todos"
										, onSuccess: loadTodoItems	})


	// assign some UI control:
	$('#toDoBForm').submit(function(e){
		newItemHandler();
		return false;
	});
	
	$('#newToDoButton').click(function(e) {	newItemHandler(); });
	
	$('#DropDbBtn').click(function(e) {	
		if( confirm('Are you sure?') )
			cdb.DROP_DATABASE({	onSuccess: function(){ location.reload(); }
													, onError: function(tx,e){ console.error(e); }
											}); 
	});

	$('#newToDoDueDate').focus();

/* == == == == == == == == == == == == == == == == == == == == == == == == == == ==  */
});

