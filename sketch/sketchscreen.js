window.onload = function (){
  (function($) {

  	// MAIN

  	var palette = ['#000000', '#efefef', '#99a5ad', '#7d6360', '#9a8c82'];

  	for (var code in palette) {
  		var color = $('<li>')
  		$(color).css('background-color', palette[code]);
  		$('#sketch ul').append(color)
  		$(color).append($('<a href="#sketch_surface" data-color="'+palette[code]+'">'))

  		// jQuery click event not working :/
  		$(color)[0].addEventListener('click', function() {
  			$("#sketch_palette li").removeClass('selected')
  			$(this).addClass('selected')
  		});
	}

	$($("#sketch_palette li")[0]).addClass("selected")

    $('#sketch_surface').sketch();




  })(jQuery);
}