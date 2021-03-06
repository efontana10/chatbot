$(function() {
        // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
  var ID = '_' + Math.random().toString(36).substr(2, 9);
  var first_open = true;
  var INDEX = 0; 
  $("#chat-submit").click(function(e) {
    e.preventDefault();
    var msg = $("#chat-input").val(); 
    if(msg.trim() == ''){
      return false;
    }
    generate_message(msg, 'self');
    
    setTimeout(function() {
      sayToBot(msg);
    }, 500)
    
  })

  function sayToBot(message) {
    console.log("User Message:", message)
    $.ajax({
      // url: 'https://rasabot.betacomservices.com/webhooks/rest/webhook',
      url: 'http://localhost:5005/webhooks/rest/webhook',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        "message": message,
        "sender": ID
      }),
      success: function (data, textStatus) {
        if(data != null && data.length !=0){
            console.log("Success : "+data);
            generate_message(data,'user');
        }
      },
      error: function (errorMessage) {
        msg="Si è verificato un errore";
        generate_message(msg, "user");
        console.log('Error : ' + errorMessage);
  
      }
    });
  }
  
  function generate_message(val, type) {
    INDEX++;
    var str="";
    var msg="";
    if (val.length < 1){
      msg="Non riesco a connettermi al server :( Prova di nuovo.";
    }
    else if(type=="self")
    {
      msg=val;
    }
    else if(typeof(val)=="string" && type=="user")
    {
      msg=val;
    }
    else
    {
		val.sort(function(a, b) {
		x = (a.buttons !== null && a.buttons !== undefined) ? a.buttons.length : 0;
		y = (b.buttons !== null && b.buttons !== undefined) ? b.buttons.length : 0;
		return x - y;
		});
      for (i = 0; i < val.length; i++) {
        //check if there is text message
        if (val[i].hasOwnProperty("text")) {
          msg+=val[i].text+"<br>";
        }
        
        //check if there are buttons
        if (val[i].hasOwnProperty("buttons")) {
          //generate buttons
          for (j = 0; j < val[i].buttons.length; j++) {
            msg+="<\/div><\/div>"
            msg+=generate_choice_btn(val[i].buttons[j].title, val[i].buttons[j].payload.substring(1))
          }
        }

        //check if there is image
        if (val[i].hasOwnProperty("image")) {
          msg+="<img src='"+val[i].image+"' class='chat_img'>";
        }
      }
    }
    str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
    str += "          <span class=\"msg-avatar\">";
    str += "            <img class='img_"+type+"'>";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-"+INDEX).hide().fadeIn(300);
    if(type == 'self'){
     $("#chat-input").val(''); 
    }    
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
  }  
  
  function generate_choice_btn(txt, payload) {
  var str="";
  //id of btn = "index of the generating msg"_"num of choice" 
  str += "<div class=\"cm-msg-button\">";
    //str += "          <div class=\"cm-msg-button\">";
    str += "          	<div id="+payload+" class=\"cm-msg-btn-text\" \">";
  str += txt;
    str += "          	<\/div>";
    //str += "          <\/div>";
  str += "        <\/div>";
  return str
  
  }
  
  $(document).delegate(".cm-msg-btn-text", "click", function() {
    document.querySelectorAll('div.cm-msg-btn-text').forEach(elem => {
	  elem.disabled = true;
	});
	var value = this.id;
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
  // check if we need to restart the conversation
  if(value != "restart"){
    sayToBot("/"+value);
  } else {
    sayToBot("/"+value);
    generate_message("Ok, a presto!", "user");	
  }
    //generate_message(name, 'self');
  })
  
  $("#chat-circle").click(function() {
  if(first_open){ 
    sayToBot('buongiorno');
    first_open = false;
    }
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })
  
  $(".chat-box-toggle").click(function() {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })
  
})
