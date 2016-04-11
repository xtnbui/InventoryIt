$(document).ready(function() {

  //click handler to show tab
  $("#brand a").click(function(event) {
    $(this).tab('show')
  });

  //click handler to show tab
  $("#category a").click(function(event) {
    $(this).tab('show')
  });

  $("#pencil-icon").click(function(event) {
    window.location.href = "./updateInventory.html";
  });


});
