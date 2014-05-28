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

function sendSketch(images) {
	$.post('https://noveria.nl/sketchscreen/index.php', {images: images}, function(data) {
		//this is the success function
		console.log(data);
	});

}

function showSketchOn(imgObject) {
	$.get('https://noveria.nl/sketchscreen/index.php', {action: 'getimage'}, function(images) {
		while(img = images.pop()) {
			
			//set img src of selector to img, possibly fade
			setTimeout(function() { 
				$('#icongrid').css('background-image', img);
			}, 300);
		}
	}, "json");
}
