$(document).ready(function() {
	var ref = new Firebase('https://blinding-inferno-865.firebaseio.com/Name');

	var myDataRef = new Firebase('https://blinding-inferno-865.firebaseio.com/');

	// Generate label text for checkboxes
	function generateCheckboxLabelText(type) {
		var text;
		if (type == "categories") {
			text = ["Erasers", "Notebooks", "Pencils", "Tapes"];
		} else if (type == "columns") {
			text = ["Name", "SKU", "Brand", "Vendor", "In Stock", "Unit Price", "Vendor Price"];
		}
		return text;
	}

	// Generate checkbox elements
	function makeCategorySelectionCheckboxes(type) {
		var labelText = generateCheckboxLabelText(type);

		var selectionDiv = $("<div>", {
			"class": "col-md-12",
			"id": type + "-selection",
		});

		for (var i=0; i<labelText.length; i++) {
			var newElt = $("<label>", {
				"class": "checkbox-inline col-md-3",
				"text": labelText[i],
				"for": labelText[i],
				"margin-top": "10px",
			});

			var newCheckbox = $("<input>", {
				"class": "checkbox " + type,
				"type": "checkbox",
				"id": labelText[i],
				"name": labelText[i],
			});

			newElt.prepend(newCheckbox);
			selectionDiv.append(newElt);
		}

		$("#"+type+"-div").append(selectionDiv);
	}

	makeCategorySelectionCheckboxes("categories");
	makeCategorySelectionCheckboxes("columns");

	// Select all button functionality
	$(".checkAll").click(function(e) {
		var checkType = $(this).prop("id");
		var elts = document.getElementsByClassName(checkType);
		for (var i=0; i<elts.length; i++) {
			$($(elts[i])).prop("checked", $(this).prop("checked"));
		}
	});

	function createTableHeaders(columns) {
		var table = document.getElementById("view-table");
		var tableHead = document.createElement('THEAD');
		table.appendChild(tableHead);
		var head_tr = document.createElement('TR');
		tableHead.appendChild(head_tr);
		for (var i = 0; i < columns.length; i++) {
  			var header = document.createElement('TH');
			header.innerHTML = columns[i]
			head_tr.appendChild(header)
		}
	}

	function createTable(headers, categories) {
		var table = document.getElementById("view-table");
		table.setAttribute("class", "table table-striped col-md-8 col-md-offset-2");
		createTableHeaders(headers);
		table_body = document.createElement('TBODY');
		ref.on("value", function(snapshot) {
		    snapshot.forEach(function(data) {
		    	tr_item = document.createElement('TR');
		    	tr_item.setAttribute("class", "item");
		    	table_body.appendChild(tr_item);
		    	obj_name = data.key();
		    	obj_attr = data.val();
		    	for (var i = 0; i < headers.length; i++) {
		    		td = document.createElement('TD');
		    		if (headers[i] == "Name") {
		    			td.innerHTML = obj_name }
		    		else {
		    			td.innerHTML = obj_attr[headers[i]] }
			    	tr_item.appendChild(td);
		    	}
		    	table.appendChild(table_body);
		    });
		});
	}

	createTable(['Name', 'In Stock', 'Vendor', 'Vendor Price'], ["Erasers", "Notebooks", "Pencils", "Tapes"]);

	// click handler to show/hide tabs of categories and columns
	// Source: http://stackoverflow.com/questions/14073019/show-hide-twitter-bootstrap-tabs
	$('#alltabs a').click(function(e) {
	    var tab = $(this);
	    if(tab.parent('li').hasClass('active')){
	        window.setTimeout(function(){
	            $(".tab-pane").removeClass('active');
	            tab.parent('li').removeClass('active');
	            tab.blur();
	        });
	    }
	});

	// click handler for submit button
	$("#submit-button").click(function(e) {
		var columns = [];
		var categories = [];

		var column_values = document.getElementsByClassName("columns");
		var category_values = document.getElementsByClassName("categories");
		
		for (var i=0; i<column_values.length; i++) {
			if (column_values[i].checked && column_values[i].name != "Select All")
				columns.push(column_values[i].name);
		}

		for (var i=0; i<category_values.length; i++) {
			if (category_values[i].checked && category_values[i].name != "Select All")
				categories.push(category_values[i].name);
		}

		// clear table
		// source: http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
		var table = document.getElementById("view-table");
		while (table.firstChild)
			table.removeChild(table.firstChild);
		
		createTable(columns, categories);
	});
});