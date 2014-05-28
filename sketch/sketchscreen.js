window.onload = function (){
  (function($) {

  	// LIB
  	
  	var change_color = function(elem) {
  		
  	}



  	// MAIN

  	var palette = ['#000000', '#efefef', '#99a5ad', '#7d6360', '#9a8c82'];

  	for (var code in palette) {
  		var color = $('<li>')
  		$(color).css('background-color', palette[code]);
  		$('#sketch ul').append(color)
  		$(color).click(change_color)
  	}

    $('#simple_sketch').sketch();




  })(jQuery);
}