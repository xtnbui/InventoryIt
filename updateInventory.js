$(document).ready(function() {
  var ref = new Firebase('https://blinding-inferno-865.firebaseio.com/Name');

  // from http://stackoverflow.com/questions/1304378/jquery-web-page-height/1304384#1304384
  $("#items-container").css("height", 0.6*$(document).height()); //set the height of the items container to be 3/4 of the document's height

  // UNDO FUNCTIONALITY
  var itemtoQuantityRecord = {};
  var itemtoCurrentIndex = {};

  var table = document.getElementById("update_table");

  ref.on("value", function(snapshot) {
    var table = document.getElementById("update_table");
    snapshot.forEach(function(data) {

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
          textarea.setAttribute("id", "inputted_quantity-3");
          td_3.appendChild(textarea);
      tr.appendChild(td_3);

      var td_4 = document.createElement('TD');
        td_4.width='10%'
          button = document.createElement('BUTTON')
          button.innerHTML = 'Save'
          button.setAttribute("id", "save-btn3");
          button.setAttribute("type", "button");
          button.setAttribute("class", "btn btn-primary btn-sm btn-text center-block save-btn");
        td_4.appendChild(button);
      tr.appendChild(td_4);

      var td_5 = document.createElement('TD');
        td_5.width='10%'
          button2 = document.createElement('BUTTON')
          button2.innerHTML = 'Undo'
          button2.setAttribute("id", "save-btn3");
          button2.setAttribute("type", "button");
          button2.setAttribute("class", "btn btn-primary btn-sm btn-text center-block save-btn");
        td_5.appendChild(button2);
      tr.appendChild(td_5);        


      table.appendChild(tr);

    });
  });

  //initialize all the currentIndices
  var numItems = 6;
  for (i=0; i<numItems; i++) {
    itemtoCurrentIndex[i.toString()] = -1; //currentIndex starts at -1
  }


  save_button = $(".save-btn").click(function(event) {
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
