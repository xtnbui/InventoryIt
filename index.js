$(document).ready(function() {

	$("#view-inventory-button").click(function(event) {
    window.location.href = "selectColumns.html";
  });

  $("#update-inventory-button").click(function(event) {
    window.location.href = "labelSelect.html";
  });

  $("#options-button").click(function(event) {
    window.location.href = "settings.html";
  });
});