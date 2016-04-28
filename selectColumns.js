$(document).ready(function() {

	// Generate label text for checkboxes
	function generateCheckboxLabelText(type) {
		var text;
		if (type == "categories") {
			text = ["Erasers", "Notebooks", "Pencils", "Tapes"];
		} else if (type == "columns") {
			text = ["Name", "SKU", "Brand", "Vendor", "In Stock", "Unit Price", "Last Counted", "On Order", "Vendor Price", "Last Ordered"];
		}
		return text;
	}

	// Generate checkbox elements
	function makeCategorySelectionCheckboxes(type) {
		var labelText = generateCheckboxLabelText(type);
		labelText.push("Select All");
		
		var selectionDiv = $("<div>", {
			"class": "col-md-10",
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

			if (labelText[i] == "Select All") {
				newCheckbox.addClass("checkAll");
				newCheckbox.prop("id", type);
			} 

			newElt.prepend(newCheckbox);
			selectionDiv.append(newElt);
		}

		$("#"+type).append(selectionDiv);
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
});

// On form submission, collect submit 
function submitForm() {
	var columns;
	var categories;

	var column_values = document.getElementsByClassName("columns");
	var category_values = document.getElementsByClassName("categories");
	window.location.href = "viewInventory.html";
	return false;
}