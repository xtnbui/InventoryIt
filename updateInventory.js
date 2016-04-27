$(document).ready(function() {
  // from http://stackoverflow.com/questions/1304378/jquery-web-page-height/1304384#1304384
  $("#items-container").css("height", 0.6*$(document).height()); //set the height of the items container to be 3/4 of the document's height

  // UNDO FUNCTIONALITY
  var itemtoQuantityRecord = {};
  var itemtoCurrentIndex = {};

  //initialize all the currentIndices
  var numItems = 6;
  for (i=0; i<numItems; i++) {
    itemtoCurrentIndex[i.toString()] = -1; //currentIndex starts at -1
  }


  $(".save-btn").click(function(event) {
    var itemNumber = $(this).attr("data-item-number");
    if (!(itemtoQuantityRecord[itemNumber])) {
      itemtoQuantityRecord[itemNumber] = []; //initialize an array to keep track of the quantities of that item
    }

    var quantities = itemtoQuantityRecord[itemNumber];
    var currentIndex = itemtoCurrentIndex[itemNumber];
    if (currentIndex > -1) {
      quantities.splice(currentIndex+1, quantities.length - currentIndex - 1);
    }

    var quantity = $("#inputted_quantity-"+itemNumber).val();
    quantities.push(quantity);
    console.log("quantities is:", quantities);
    itemtoCurrentIndex[itemNumber] += 1;
    console.log("dictionary val of currentIndex", itemtoCurrentIndex[itemNumber]);
  });

  $(".undo-btn").click(function(event) {
    var itemNumber = $(this).attr("data-item-number");
    console.log("item number is", itemNumber);
    var quantities = itemtoQuantityRecord[itemNumber];
    console.log("quantities is", quantities);
    itemtoCurrentIndex[itemNumber] -= 1;
    var currentIndex = itemtoCurrentIndex[itemNumber];
    console.log("current index", currentIndex);
    if (currentIndex > -1) {
      console.log($("#inputted_quantity-"+itemNumber));
      console.log("quantity at current index", quantities[currentIndex]);
      $("#inputted_quantity-"+itemNumber).val(quantities[currentIndex]);
    }
  });
});
