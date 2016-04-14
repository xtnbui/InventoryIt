$(document).ready(function() {

  //click handler to show tab
  $("#brand a").click(function(event) {
    $(this).tab('show');
  });

  //click handler to show tab
  $("#category a").click(function(event) {
    $(this).tab('show');
  });

  //clicking on pencils icon or title link redirects you to update inv page
  $("#pencil-icon").click(function(event) {
    window.location.href = "./updateInventory.html";
  });

  $("#pencils").click(function(event) {
    window.location.href = "./updateInventory.html";
  });


});
