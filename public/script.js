var socket = io(), //load socket.io
	formOneOpen = false,
	formTwoOpen = false,
	editedNote,
	editing = false;
function addNote(title, content, color){
	// Add new note to the end of the list
	var newNote = $('<li class="'+color+'"><a><h2>'+title+'</h2><p>'+content+'<div class="actions-container"><i class="icon-remove"></i></div></p></a></li>');
	$("ul").prepend(newNote);
}
function toggleFormOne(){
	//$(".centered-form-container").toggle();
	if(formOneOpen){
		$('.centered-form-container').hide();
		formOneOpen = false;
	}
	else{
		$('.centered-form-container').show();
		formOneOpen = true;
	}
};
function toggleFormTwo(title, content){
	if(formTwoOpen){
		$('.centered-form-container-two').hide();
		formTwoOpen = false;
	}
	else{
		$('.centered-form-container-two').show();
		formTwoOpen = true;
		$('.centered-form-container-two').children('form').find('input[name=title]').val(title);
		$('.centered-form-container-two').children('form').find('textarea[name=content]').val(content);
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
		toggleFormOne();
		console.log("The button was clicked");
	});
	$('.centered-form-container').click(function(event){
		if(event.target.nodeName === "DIV"){
			toggleFormOne();
			clearForm();
		}
	});
	$('.centered-form-container-two').click(function(event){
		if(event.target.nodeName === "DIV"){
			toggleFormTwo();
			clearForm();
		}
	});
	$("#main-wrapper ul").on("click", "a", function(event){
		event.preventDefault();
		editedNote = $(this);
		var title = editedNote.children("h2").text();
		var content = editedNote.children("p").text();
		toggleFormTwo(title, content);
	});
	$('#formOne').submit(function(event){
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
		// call function to add note
		addNote(noteTitle, noteContent, noteClass);
		// clear the form and hide it
		toggleFormOne();
		clearForm();
	})
	$('#formTwo').submit(function(event){
		var noteTitle = $('#formTwo').find('input[name=title]').val();
		var noteContent = $('#formTwo').find('textarea[name=content]').val();
		event.preventDefault();
		editedNote.children("h2").text(noteTitle);
		editedNote.children("p").text(noteContent);
		toggleFormTwo();
		clearForm();
	})
	
	/*$("li a").click(function(){
		$(this).remove();
	});*/
	$("#main-wrapper ul").on("click", ".actions-container", function(event){
		event.stopPropagation();
		$(this).closest("a").remove();
	});

	//
	socket.on("add note", function(title, content, color){
		addNote(title, content, color);
	});
});