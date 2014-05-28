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

	$('#sketch_trash')[0].addEventListener('click', function() {
		clearSketch()
	});

	$('#sketch_submit')[0].addEventListener('click', function() {
		sendSketch([$('#sketch_surface')[0].toDataURL()])
		clearSketch()
	});

	$('#sketch_toggle a')[0].addEventListener('click', function() {
		$('#sketch').toggle()
		if ($("#sketch").is(":visible")) {
			$('#sketch_toggle a i').removeClass("icon-tint").addClass("icon-arrow-down")
		} else {
			$('#sketch_toggle a i').removeClass("icon-arrow-down").addClass("icon-tint")
		}
	});

    $('#sketch_surface').sketch();
    showSketchOn($('#bg-overlay'))

    function clearSketch() {
		$('#sketch_surface').data('sketch').actions = []
		var canvas = $('#sketch_surface')[0];
		var ctx = canvas.getContext("2d");
		ctx.beginPath()
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save()
    }

	function sendSketch(images) {
		$.post('https://noveria.nl/sketchscreen/index.php', {images: images}, function(data) {
			//this is the success function
			console.log(data);
		});

	}

	function showSketchOn(selector) {
		$.get('https://noveria.nl/sketchscreen/index.php', {action: 'getimage'}, function(images) {
			delay = 0;
			images = images.reverse();
			while(img = images.pop()) {
				
				//set img src of selector to img, possibly fade
				setTimeout(function(img, selector) { 
					selector.fadeTo(1200, 0.3, function() {
						$(this).css('background-image', "url(" + img + ")");
					}).fadeTo(1200, 1);
	//				selector.css('background-image', "url(" + img + ")");
				}, delay, img, selector);
				delay += 4000;
			}
		}, "json");
		setTimeout(showSketchOn, 30000, selector)
	}

  })(jQuery);
}
