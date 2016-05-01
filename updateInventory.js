$(document).ready(function() {
  // from http://stackoverflow.com/questions/1304378/jquery-web-page-height/1304384#1304384
  $("#items-container").css("height", 0.6*$(document).height()); //set the height of the items container to be 3/4 of the document's height

  // UNDO FUNCTIONALITY
  var itemtoLastQuantity = {};
  // var itemtoCurrentIndex = {};

  //initialize all the currentIndices
  var numItems = 6;
  // for (i=0; i<numItems; i++) {
  //   itemtoCurrentIndex[i.toString()] = -1; //currentIndex starts at -1
  // }


  $(".save-btn").click(function(event) {
    var itemNumber = $(this).attr("data-item-number");
    var quantity = parseInt($("#inputted_quantity-"+itemNumber).val());
    //if user inputs negative quantity, warn them about it
    if (quantity < 0) {
      
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

      //from http://stackoverflow.com/questions/275931/how-do-you-make-an-element-flash-in-jquery
      $("#inputted_quantity-"+itemNumber).css("background-color", "#DFF0D8");
      window.setTimeout(function() {
        $("#inputted_quantity-"+itemNumber).animate({backgroundColor: "#fff"});
      }, 1000);
      // var quantities = itemtoLastQuantity[itemNumber];
      // var currentIndex = itemtoCurrentIndex[itemNumber];
      // if (currentIndex > -1) {
      //   quantities.splice(currentIndex+1, quantities.length - currentIndex - 1);
      // }

      $("#undo-btn" + itemNumber).removeAttr("disabled"); //enable the undo button
      $("#save-btn" + itemNumber).attr("disabled", ""); //disable the save button
      // itemtoCurrentIndex[itemNumber] += 1;
      // console.log("dictionary val of currentIndex", itemtoCurrentIndex[itemNumber]);
    }
  });

  $(".undo-btn").click(function(event) {
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
    // }
  });

  //listen to the user typing in the quantity textbox
  $(".inputted_quantity").keydown(function(event) {
    var itemNumber = $(this).attr("data-item-number");
    //from https://css-tricks.com/snippets/javascript/javascript-keycodes/
    if ((event.keyCode < 37) || (event.keyCode > 40)) { //ignore arrow keys
      $(this).css("background-color", "rgba(241, 4, 35, 0.13)");
    }
    $("#save-btn" + itemNumber).removeAttr("disabled");
  });
});
