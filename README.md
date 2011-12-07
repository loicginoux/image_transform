simple library  for image transformation
========================================

transformations available:
------------------------
they are all listed in the example but here they are:

- 'grayscale' 
- 'detect_border': this is using the sobel operator http://homepages.inf.ed.ac.uk/rbf/HIPR2/sobel.htm
- 'max'
- 'remove_red'
- 'remove_blue' 
- 'remove_green'
- 'invert_colors'	
	
add a transformation:
---------------------
you can easily add a transformation this way:

	//make the image brighter adding 20 for each component
	//imgd is a ImageData object
	window.image_transform.my_custom_transformation = function(imgd){
		var pix = imgd.data;
    		for (var i = 0, n = pix.length; i < n; i += 4) {
      			pix[i  ] += 20
      			pix[i+1] += 20
      			pix[i+2] += 20
    		}
		return pix;
	},


exemple of use:
---------------

	//create a canvas on your page
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	canvas.id = id;
	var elem_canvas = document.body.appendChild(canvas);	
	
	//call the transformation passing a transformation, athe id of the image to transform and the canvas element
	image_transform.make( 'grayscale', 'img_elem_id', elem_canvas)
	
issues:
-------

if you have a DOM error exception 18, either put  your need ot access your files throu a local server "http://localhost..." or start chrome with ‘–allow-file-access-from-files’ 

improvements:
-------------
- pass the image manipulation to a web worker and display a loading image
- add the library sylvester.js for matrix manipulation
- add transformations
- being able to play with parameters

aknowledgements:
---------------
thanks to [Hakim](https://github.com/hakimel) for the example page template
