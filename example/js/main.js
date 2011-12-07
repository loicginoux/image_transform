(function(){
	
	function buildCanvas(id, w, h, title){
		// Get the canvas element.
		var canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		canvas.id = id;
		var div = document.createElement("div");
		div.className = "image";
		var p = document.createElement("p")
		p.innerHTML = title;
		div.appendChild(canvas);
		div.appendChild(p);
		
		document.body.appendChild(div);
	  
		return canvas.id;
	}
	window.addEventListener('load', function () {

		var img_id = 'original';
	  var img = document.getElementById(img_id);
		
	
	  //img.addEventListener('load', function () {
			var w = img.width,
			h = img.height;
			image_transform.make( 'grayscale', img_id, buildCanvas('canvas_1', w, h, "grayscale") )
			image_transform.make('detect_border', img_id, buildCanvas('canvas_2', w, h, "border detection (Sobel)" ))
			image_transform.make('max',img_id, buildCanvas('canas_3', w, h, "maximum component" ))
			image_transform.make('remove_red', img_id, buildCanvas('canvas_4', w ,h, "no red component" ))
			image_transform.make("remove_blue", img_id, buildCanvas('canvas_5', w ,h, "no blue component" ))
			image_transform.make('remove_green', img_id, buildCanvas('canvas_6', w ,h, "no green component" ))
			image_transform.make('invert_colors', img_id, buildCanvas('canvas_7', w ,h, "color inversion" ))			
			
	 // }, false);

	}, false);
})()