var socket = io(), //load socket.io
	addFormOpen = false,
	editFormOpen = false,
	editedNote,
	editing = false;
function addNote(title, content, color, id){
	// Add new note to the end of the list
	var newNote = $('<li id="'+id+'" class="'+color+'"><a><h2>'+title+'</h2><p>'+content+'</p><div class="actions-container"><i class="icon-remove"></i></div></a></li>');
	$("ul").prepend(newNote);
}
function toggleAddForm(){
	//$(".centered-form-container").toggle();
	if(addFormOpen){
		$('.centered-form-container').hide();
		addFormOpen = false;
	}
	else{
		$('.centered-form-container').show();
		addFormOpen = true;
	}
};
function toggleEditForm(title, content){
	if(editFormOpen){
		$('.centered-form-container-two').hide();
		editFormOpen = false;
	}
	else{
		$('.centered-form-container-two').show();
		editFormOpen = true;
		$('.centered-form-container-two').children('form').find('input[name=edit-title]').val(title);
		$('.centered-form-container-two').children('form').find('textarea[name=edit-content]').val(content);
		console.log(title);
		console.log(content);
	}
};
function clearForm(){
	$(".centered-form-container").find("input, textarea").val("");
	$(".centered-form-container-two").find("input, textarea").val("");
}
$(document).ready(function(){
	/*$('#form').hide();*/
	$('.new-note').click(function(){
		toggleAddForm();
		console.log("The button was clicked");
	});
	$('.centered-form-container').click(function(event){
		if(event.target.nodeName === "DIV"){
			toggleAddForm();
			clearForm();
		}
	});
	$('.centered-form-container-two').click(function(event){
		if(event.target.nodeName === "DIV"){
			toggleEditForm();
			clearForm();
		}
	});
	$("#main-wrapper ul").on("click", "a", function(event){
		event.preventDefault();
		editedNote = $(this);
		var title = editedNote.children("h2").text();
		var content = editedNote.children("p").text();
		toggleEditForm(title, content);
	});
	$('#addForm').submit(function(event){
		var noteTitle = $('input[name=title]').val();
		var noteContent = $('textarea[name=content]').val();
		var noteClass = Math.random();
		// Generate random class for new note
		if(noteClass<=0.25){
			noteClass="yellow";
		}
		else if(noteClass<=0.5){
			noteClass="green";
		}
		else if(noteClass<=0.75){
			noteClass="blue";
		}
		else {
			noteClass="red";
		}
		event.preventDefault();
		// tell the server a note was added, pass its title, content, and color
		socket.emit("add note", noteTitle, noteContent, noteClass);
		// clear the form and hide it
		toggleAddForm();
		clearForm();
	});
	$('#editForm').submit(function(event){
		var noteTitle = $('#editForm').find('input[name=edit-title]').val();
		var noteContent = $('#editForm').find('textarea[name=edit-content]').val();
		console.log(noteContent);
		event.preventDefault();
		editedNote.children("h2").text(noteTitle);
		editedNote.children("p").text(noteContent);
		toggleEditForm();
		clearForm();
	});
	
	/*$("li a").click(function(){
		$(this).remove();
	});*/
	$("#main-wrapper ul").on("click", ".actions-container", function(event){
		event.stopPropagation();
		var removedNote = $(this).closest("li");
		var title = removedNote.children("a").children("h2").text();
		var content = removedNote.children("a").children("p").text();
		socket.emit("remove note", title, content, removedNote.attr("class"), removedNote.attr("id"));
		removedNote.remove();
	});

	//
	socket.on("add note", addNote);
	// socket.on("clear screen", function(){
	// 	$("ul").empty();
	// });
});