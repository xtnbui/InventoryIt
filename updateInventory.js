$(document).ready(function() {
  var ref = new Firebase('https://blinding-inferno-865.firebaseio.com/Name');

  // from http://stackoverflow.com/questions/1304378/jquery-web-page-height/1304384#1304384
  // $("#items-container").css("height", 0.6*$(document).height()); //set the height of the items container to be 3/4 of the document's height

  // UNDO FUNCTIONALITY
  var itemtoLastQuantity = {};
  // var itemtoCurrentIndex = {};

  var table = document.getElementById("update_table");

  //to keep track of which item number it is - for undo and save purposes
  var itemCount = 0;
  ref.on("value", function(snapshot) {
    var table = document.getElementById("update_table");
    snapshot.forEach(function(data) {

      itemCount += 1;

      obj_name = data.key();
      obj_attr = data.val();

      var tr = document.createElement('TR');
      var td = document.createElement('TD');
        td.width='10%';
        img = document.createElement('IMG');
        img.setAttribute("class", "thumbnail-image img-responsive");
        img.setAttribute("src", obj_attr["Image"]);
        td.appendChild(img);
      tr.appendChild(td);

      var td_2 = document.createElement('TD');
        td_2.width='70%';
        var p = document.createElement("p");
        p.setAttribute("class", "pencil-name top no-padding");
        p.setAttribute("data-item-number", itemCount);
        p.appendChild(document.createTextNode(obj_name));
        td_2.appendChild(p);

          var bar_div = document.createElement('DIV');
          bar_div.setAttribute("class", "progress bottom progress-size");
            var bar_div2 = document.createElement('DIV');
            bar_div2.setAttribute("class", "progress-bar progress-color");
            bar_div2.setAttribute("role", "progressbar");
            bar_div2.setAttribute("style", "width:10%");
            bar_div2.setAttribute("aria-valuenow", obj_attr["In Stock"]);
            bar_div2.setAttribute("aria-valuemax", obj_attr["Max Quantity"]);
            bar_div2.setAttribute("aria-valuemin", "0");
              // span = document.createElement('SPAN');
              // span.setAttribute("class", "sr-only");
              // span.innerHTML = amt + "% Complete";
              // bar_div2.appendChild(span);
            bar_div.appendChild(bar_div2);
          td_2.appendChild(bar_div);
      tr.appendChild(td_2)

        var td_3 = document.createElement('TD');
          td_3.width='10%';
          textarea = document.createElement('TEXTAREA')
          textarea.appendChild(document.createTextNode(obj_attr["In Stock"]));
          textarea.setAttribute("wrap", "off");
          textarea.setAttribute("class", "form-control inputted_quantity");
          textarea.setAttribute("id", "inputted_quantity-"+itemCount);
          textarea.setAttribute("data-item-number", itemCount);
          td_3.appendChild(textarea);
      tr.appendChild(td_3);

      var td_4 = document.createElement('TD');
        td_4.width='10%'
          button = document.createElement('BUTTON')
          button.innerHTML = 'Save'
          button.setAttribute("id", "save-btn"+itemCount);
          button.setAttribute("type", "button");
          button.setAttribute("class", "btn btn-primary btn-sm btn-text center-block save-btn");
          button.setAttribute("data-item-number", itemCount);
        td_4.appendChild(button);
      tr.appendChild(td_4);

      var td_5 = document.createElement('TD');
        td_5.width='10%'
          button2 = document.createElement('BUTTON')
          button2.innerHTML = 'Reset to Previous'
          button2.setAttribute("id", "undo-btn"+itemCount);
          button2.setAttribute("type", "button");
          button2.setAttribute("class", "btn btn-primary btn-sm btn-text center-block undo-btn");
          button2.setAttribute("data-item-number", itemCount);
        td_5.appendChild(button2);
      tr.appendChild(td_5);



      table.appendChild(tr);

      //disable the "Reset to Previous" buttons
      $("#undo-btn"+itemCount).attr("disabled", "");
      $("#save-btn"+itemCount).attr("disabled", "");

    });
  });

  //initialize all the currentIndices
  var numItems = 6;
  // for (i=0; i<numItems; i++) {
  //   itemtoCurrentIndex[i.toString()] = -1; //currentIndex starts at -1
  // }

  //save_button =
  // $(".save-btn").click(function(event) {
  //from http://stackoverflow.com/questions/15090942/jquery-event-handler-not-working-on-dynamic-content
  $(document).on("click", ".save-btn", function(event) {
    var itemNumber = $(this).attr("data-item-number");
    var quantity = parseInt($("#inputted_quantity-"+itemNumber).val());
    //if user inputs negative quantity, warn them about it
    //TODO: check if alphabet or symbol (non-number)
    if ((quantity < 0)) {
      //TODO: error modal
      $("#inputted_quantity-"+itemNumber).val("");
    } else {
      if (!(itemtoLastQuantity[itemNumber])) {
        //initialize an array to keep track of the most recent two quantities of that item, including currently saved one
        //at first, it would be [54]
        itemtoLastQuantity[itemNumber] = [quantity];
      } else if (itemtoLastQuantity[itemNumber].length == 1) {
        //so now the list should have two quantities, e.g. [54, 123]
        itemtoLastQuantity[itemNumber].push(quantity);
      } else if (itemtoLastQuantity[itemNumber].length == 2) {
        //remove the least recent quantity
        itemtoLastQuantity[itemNumber].splice(0, 1);
        itemtoLastQuantity[itemNumber].push(quantity);
        console.log("saved quantities are", itemtoLastQuantity);
      }

      //update the backend
      //gets the appropriate data using itemNumber - check for safety?? TODO
      //from: http://stackoverflow.com/questions/4191386/jquery-how-to-find-an-element-based-on-a-data-attribute-value ,
      //http://stackoverflow.com/questions/21756777/jquery-find-element-by-data-attribute-value
      var itemTitle = $("#items-table").find("p[data-item-number=" + itemNumber + "]").text();
      updateBackendAndGiveVisualCues(itemTitle, itemNumber, quantity);
  }
});

  $(document).on("click", ".undo-btn", function(event) {
    var itemNumber = $(this).attr("data-item-number");
    console.log("item number is", itemNumber);
    //get the least recent quantity, which is one quantity back (the quantity before the one that was last saved)
    var quantity = itemtoLastQuantity[itemNumber][0];
    console.log("last quantity is", quantity);
    // itemtoCurrentIndex[itemNumber] -= 1;
    // var currentIndex = itemtoCurrentIndex[itemNumber];
    // if (currentIndex > -1) {
    $("#inputted_quantity-"+itemNumber).val(quantity);
    //remove the most recent saved quantity (so if you go from 124 to 32, remove 124 from saved quantities)
    itemtoLastQuantity[itemNumber].splice(1, 1);
    console.log("curently saved quantities after the undo", itemtoLastQuantity[itemNumber]);
    //diabled doesn't need "" but added there so that attr function knows to add that attribute, not get its value
    $("#undo-btn" + itemNumber).attr("disabled", "");
    $("#save-btn" + itemNumber).removeAttr("disabled");
    // }
  });

  $(document).on("click", "#save-all", function(event) {
    var listOfInputQuantityDIVs = $(".inputted_quantity");
    for (var i = 0; i < listOfInputQuantityDIVs.length; i++) {
      console.log(listOfInputQuantityDIVs[i]);
      var currentElementID = listOfInputQuantityDIVs[i].id;
      var inputtedQuantity = parseInt($("#" + currentElementID).val());
      var itemNumber = $("#" + currentElementID).attr("data-item-number");
      var itemTitle = $("#items-table").find("p[data-item-number=" + itemNumber + "]").text();

      //check if different than saved quantity and if so, save it to backend
      ref.child(itemTitle).on("value", function(snapshot) {
        var itemProperties = snapshot.val();
        var savedQuantity = itemProperties["In Stock"];
        console.log("saved quantity", savedQuantity);
        //from https://css-tricks.com/snippets/javascript/javascript-keycodes/
        // if (((event.keyCode >= 48) && (event.keyCode <= 57)) || ((event.keyCode >= 65) && (event.keyCode <= 90)) || (event.keyCode >= 96) && (event.keyCode <= 111) || (event.keyCode >= 186) && (event.keyCode <= 222)) { //only
        console.log("inputted qty", inputtedQuantity);
        console.log("inputtedQuantity != savedQuantity", inputtedQuantity != savedQuantity);
        if (inputtedQuantity != savedQuantity) {
          //save the changed quantities and give user visual cues
          updateBackendAndGiveVisualCues(itemTitle, itemNumber, inputtedQuantity);
        }
      });
    }
  });

  //listen to the user typing in the quantity textbox
  $(document).on("keyup", ".inputted_quantity", function(event) {
    var itemNumber = $(this).attr("data-item-number");
    var itemTitle = $("#items-table").find("p[data-item-number=" + itemNumber + "]").text();
    console.log("keydown!");
    ref.child(itemTitle).on("value", function(snapshot) {
      var itemProperties = snapshot.val();
      var savedQuantity = itemProperties["In Stock"];
      console.log("saved quantity", savedQuantity);
      //from https://css-tricks.com/snippets/javascript/javascript-keycodes/
      // if (((event.keyCode >= 48) && (event.keyCode <= 57)) || ((event.keyCode >= 65) && (event.keyCode <= 90)) || (event.keyCode >= 96) && (event.keyCode <= 111) || (event.keyCode >= 186) && (event.keyCode <= 222)) { //only
      var inputtedQuantity = parseInt($("#inputted_quantity-" + itemNumber).val());
      console.log("inputted qty", inputtedQuantity);
      console.log("inputtedQuantity != savedQuantity", inputtedQuantity != savedQuantity);
      if (inputtedQuantity != savedQuantity) {

        $("#inputted_quantity-" + itemNumber).css("background-color", "rgba(241, 4, 35, 0.13)");
        $("#save-btn" + itemNumber).removeAttr("disabled");
        console.log("changed background and disabled")
      } else {
        $("#inputted_quantity-" + itemNumber).css("background-color", "#fff");
        $("#save-btn" + itemNumber).attr("disabled", "");
      }
    });
  });

  var updateBackendAndGiveVisualCues = function(itemTitle, itemNumber, quantity) {
    //save the changed quantities and give user visual cues
    ref.child(itemTitle).update({
      "In Stock": quantity
      }, function(error) { //when save is complete, show user feedback
            if (error != null) {
              //TODO: change to feedback to user
              console.log("DIDN'T SAVE!!");
            } else {
              //from http://stackoverflow.com/questions/275931/how-do-you-make-an-element-flash-in-jquery
              $("#inputted_quantity-"+itemNumber).css("background-color", "#DFF0D8");
              window.setTimeout(function() {
                $("#inputted_quantity-"+itemNumber).animate({backgroundColor: "#fff"});
              }, 1000);

              $("#undo-btn" + itemNumber).removeAttr("disabled"); //enable the undo button
              $("#save-btn" + itemNumber).attr("disabled", ""); //disable the save button
            }
          });
  }
});
