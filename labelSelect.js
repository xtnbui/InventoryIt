$(document).ready(function() {

  $(":button").click(function(){
  	var selector = this.id;
  	var identifiers = selector.split("_");
  	window.location.href = "./updateInventory.html?" + identifiers[0] + "=" + identifiers[1];
  });

  $(".card-title").click(function(){
  	var selector = this.id.substring(0, this.id.length -1);
  	var identifiers = selector.split("_");
  	window.location.href = "./updateInventory.html?" + identifiers[0] + "=" + identifiers[1];
  })

});
