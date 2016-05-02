$(document).ready(function() {

  $(":button").click(function(){
  	selector = this.id;
  	window.location.href = "./updateInventory.html?selector=" + selector;
  });

  $(".card-title").click(function(){
  	selector = this.id.substring(0, this.id.length -1);
  	window.location.href = "./updateInventory.html?selector=" + selector;
  })

});
