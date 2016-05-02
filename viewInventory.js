$(document).ready(function() {
	var rightAlign = new Set(["SKU", "In Stock", "Unit Price", "Vendor Price"])
	$.extend({
	    getUrlVars : function() {
	        var vars = [], hash;
	        var hashes = window.location.href.slice(
	            window.location.href.indexOf('?') + 1).split('&');
	        for ( var i = 0; i < hashes.length; i++) {
	            hash = hashes[i].split('=');
	            vars.push(hash[0]);
	            vars[hash[0]] = hash[1];
	        }
	        return vars;
	    },
	    getUrlVar : function(name) {
	        return $.getUrlVars()[name];
	    }
	});

	function cleanParameters(param) {
		var objects = param.split(',');
		for (var i = 0; i < objects.length; i++) {
			objects[i] = objects[i].replace("%20", " "); }
		return objects;
	}

	var ref = new Firebase('https://blinding-inferno-865.firebaseio.com/Name');
	raw_col = $.getUrlVar('columns');
	raw_category = $.getUrlVar('category');
	columns = cleanParameters(raw_col);
	categories = new Set(cleanParameters(raw_category));

	// Generate label text for checkboxes
	function generateCheckboxLabelText(type) {
		var text;
		if (type == "categories") {
			text = ["Erasers", "Notebooks", "Pencils", "Tapes"];
		} else if (type == "columns") {
			text = ["Name", "SKU", "In Stock", "Unit Price", "Vendor Price", "Brand", "Vendor", ];
		}
		return text;
	}

	// Generate checkbox elements
	function makeCategorySelectionCheckboxes(type) {
		var labelText = generateCheckboxLabelText(type);
		var colSet = new Set(columns);

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

			if (labelText[i] == "Name") {
				$(newCheckbox).prop("checked", true);
				$(newCheckbox).prop("disabled", true);
			}

			if (categories.has(labelText[i]) || colSet.has(labelText[i]))
				$(newCheckbox).prop("checked", true);

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

	// Clear select all button if one of the options is unchecked
	$(".checkbox").click(function(e) {
		if (!($(this).prop("checked"))) {
			var selectAllClass = this.getAttribute("class") + " checkAll";
			var selectAllButton = document.getElementsByClassName(selectAllClass);
			$(selectAllButton).prop("checked", false);
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
			if (rightAlign.has(columns[i])) {
				header.setAttribute("class", "right-align");
			}
			head_tr.appendChild(header)
		}
	}

	function createTable(headers, itemsInCategories) {
		var table = document.getElementById("view-table");
		table.setAttribute("class", "table table-striped col-md-8 col-md-offset-2");
		createTableHeaders(headers);

		table_body = document.createElement('TBODY');
		ref.on("value", function(snapshot) {

		    snapshot.forEach(function(data) {
		    	obj_name = data.key();
		    	
		    	if (itemsInCategories.has(obj_name)) {
			    	tr_item = document.createElement('TR');
			    	tr_item.setAttribute("class", "item");
			    	table_body.appendChild(tr_item);
			    	obj_attr = data.val();
			    	for (var i = 0; i < headers.length; i++) {
			    		td = document.createElement('TD');
			    		if (rightAlign.has(headers[i])) {
			    			td.setAttribute("class", "right-align");
			    		}
			    		if (headers[i] == "Name") {
			    			td.innerHTML = obj_name }
			    		else {
			    			td.innerHTML = obj_attr[headers[i]] }
				    	tr_item.appendChild(td);
			    	}
			    	table.appendChild(table_body);
			    }
		    });
		});
	}

	function itemsFromCategories(columns, categories) {
		var rootRef = new Firebase('https://blinding-inferno-865.firebaseio.com/Category');
		var result = [];
		rootRef.on("value", function(snapshot) {
			snapshot.forEach(function(data) {
				name = data.key();
				if (categories.has(name)) {
					things = data.val();
					for (var i = 0; i<things.length; i++) {
						result.push(things[i]);
					}
				}
			});

			result = new Set(result);
			createTable(columns, result);
		});
	}

	

	itemsFromCategories(columns, categories);

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
	$(".submit").click(function(e) {
		var cols = [];
		var cats = [];

		var column_values = document.getElementsByClassName("columns");
		var category_values = document.getElementsByClassName("categories");

		for (var i=0; i<column_values.length; i++) {
			if (column_values[i].checked && column_values[i].name != "Select All")
				cols.push(column_values[i].name);
		}

		for (var i=0; i<category_values.length; i++) {
			if (category_values[i].checked && category_values[i].name != "Select All")
				cats.push(category_values[i].name);
		}

		// clear table
		// source: http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
		var table = document.getElementById("view-table");
		while (table.firstChild)
			table.removeChild(table.firstChild);
		
		var setOfCats = new Set(cats);
		itemsFromCategories(cols, setOfCats);
	});
});