/*
HFS FILE CHAT - XHR-queries.

This is only JavaScript/JQuery code
without PHP, MySQL, node.js, and another server side.
This is open source.
You can download this here: <a href="./code/HFS_FILE_CHAT_XHR.zip">FREE DOWLNOAD</a>.

To host this chat:
1. Just download free HFS-server, here: http://www.rejetto.com/hfs/
2. Then, make the folder "Upload_messages" uploadable for anyone. (See Upload_messages/README.txt)
3. And enjoy this anonymous chat.

Now you no need to register anywhere,
no need to create any channels and rooms,
no need to connect the internet (this chat can working in local network),
and no need to pay someone for free communications.




"Everyone has the right to freedom of opinion and expression;
this right includes freedom to hold opinions without interference and to seek,
receive and impart information and ideas
through any media and regardless of frontiers."

	(Universal Declaration of Human Rights, Article 19., United Nations, U.N.).
*/


var message_number = 0;		//1-st message number

//transfer the number from a function
function number_in_script(new_message_number){
	message_number = new_message_number;
	if(document.getElementById("last_message")===null){}
	else{
		document.getElementById("last_message").innerHTML = new_message_number;
	}
}


//modify text links -> to html links.
	function linkify(inputText) {
		var replacedText, replacePattern1, replacePattern2, replacePattern3;

		//URLs starting with http://, https://, or ftp://
		replacePattern1 = /(\b(http?|https?|ftp?|ftps):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

		//Change email addresses to mailto:: links.
		replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

		return replacedText;
	}
	
//get n-th message, where n is a number.
function get_file(number){
	if(number===0){
		var url = './Upload_messages/message.txt'; //first message
	}
	else{
		var url = './Upload_messages/message ('+number+').txt'; // n-th message
	}
	
	xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.setRequestHeader('Cache-Control', 'no-cache'); //download messages as files from server, without cache this.
	xhr.send(); //send XHR query to download file.
	xhr.onerror = function(number){console.log("error" + xhr.status);}
	xhr.onload = function(){ //file loaded
		if(//check status and content
			this.status === 404 									//if status is 404 (not found code)
		||	this.responseText.indexOf('<h1>Not found</h1>')!==-1	//or if there is "<h1>Not found</h1>" inside the code.
		){}//do not do nothing
		else{
			//message received.
			var nickname = this.responseText.split(': ')[0];	//insert nickname
			var message = this.responseText.split(': ')[1];		//insert message
			
			//replace link
			var message = linkify(message);						//change links
			
			//display in chat window
			var code = '<p>'+'<span>'+nickname+'</span>'+message+'</p>';	//add tags to message
			document.getElementById('chat-area').innerHTML += code;			//display this
			
			//add sound and play this.
			$('body').append($('<audio id="chatAudio"><source src="notify.ogg" type="audio/ogg"><source src="notify.mp3" type="audio/mpeg"><source src="notify.wav" type="audio/wav"></audio>'));
			$('#chatAudio')[0].play();
				
			//increment the number
			number_in_script(number+1);
			//try to download next message.
			get_file(number+1);
		}
	}
	xhr.upload.onerror = function(number){console.log("error" + xhr.status); }
}


    function save_username() {	//window to enter username.
		// ask user for name with popup prompt
		var name = prompt("Please enter your name", "Guest");
			
		// default name is 'Guest'
		if (!name || name === ' ') {
			name = "Guest";	
		}
			
		// strip tags
		name = name.replace(/(<([^>]+)>)/ig,"");
		
		if (name != null) {
			// display name when user typing a message
			document.getElementById("username").innerHTML =
			name+ ': ';

			// display name on the page, mear the textarea...
		$("#name-area").html("Your nickname: <span>" + name + "</span>");
		}
	}

	//send message as file by uploading this to the hidden folder on HFS server.
	function save_message_as_file(){
		var nickname = document.getElementById('username').innerHTML;
		var message = document.getElementById('sendie').value;
		console.log('message', message);

		var formData = new FormData();
		var blob = new Blob([nickname+message], { type: 'plain/text' });
		formData.append('file', blob,'message.txt');

		var request = new XMLHttpRequest();
		request.open('POST', './Upload_messages');
		request.send(formData);	
	}

		//textarea functions...
		$(function() {
    		 // watch textarea for key presses
             $("#sendie").keydown(function(event) {  
                 var key = event.which;  
                 //all keys including return.  
                 if (key >= 33) {
                     var maxLength = $(this).attr("maxlength");  
                     var length = this.value.length;  
                     // don't allow new content if length is maxed out
                     if (length >= maxLength) {  
                         event.preventDefault();  
                     }  
                  }
			 });
			
    		 // watch textarea for release of key press
    		 $('#sendie').keyup(function(e) {	
    			  if (e.keyCode == 13) { 
                    var text = $(this).val();
    				var maxLength = $(this).attr("maxlength");  
                    var length = text.length; 
                    // send 
                    if (length <= maxLength + 1) { 
    			        save_message_as_file(); //save message as file and upload this to HFS
						$(this).val("");
                    } else {
    					$(this).val(text.substring(0, maxLength));
    				}	
    			  }
             });
    	});
