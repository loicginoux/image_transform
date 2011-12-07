/**
 * 
	simple library  for image transformation
	
	exemple of use:
	
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	canvas.id = id;
  var elem_canvas = document.body.appendChild(canvas);
	
	image_transform.make( 'grayscale', 'img_elem_id', elem_canvas)
	
 */

(function () {
	window.image_transform = {
		
		// imageId: the id of the image on the page
		// canvasId: the id of the canvas on the page where to render transformation
		// transform_fn, the transformation function
		make: function(transform_fn, imageId, canvasId){
			var canvas = document.getElementById(canvasId);
			var image = document.getElementById(imageId);
			if (!canvas || !canvas.getContext) {
		    alert('canvas not specified')
				return;
		  }
			if (!image) {
		    alert('image not specified')
				return;
		  }
		
			//get context
			var context = canvas.getContext('2d');
			if (!context || !context.getImageData || !context.putImageData || !context.drawImage) {
		    return;
		  }
		
			// Draw the image on canvas.
	    context.drawImage(image, 0, 0);

	    // Get the pixels.
	    var imgd= context.getImageData(0, 0, image.width, image.height);
	
			//apply transformation
			imgd.data = this[transform_fn](imgd);
			
			//replace data
			context.putImageData(imgd, 0, 0);
			
		},

		
		grayscale: function(imgd){		
			var pix = imgd.data;

			// Loop over each pixel and invert the color.
	    for (var i = 0, n = pix.length; i < n; i += 4) {
				var avg = (pix[i] + pix[i+1] + pix[i+2])/3;
	      pix[i  ] = avg; // red
	      pix[i+1] = avg; // green
	      pix[i+2] = avg; // blue
	      // i+3 is alpha (the fourth element)
	    }
			return pix;
		},
		
		invert_colors: function(imgd){
			var pix = imgd.data;

			// Loop over each pixel and invert the color.
	    for (var i = 0, n = pix.length; i < n; i += 4) {
	      pix[i  ] = 255 - pix[i  ]; // red
	      pix[i+1] = 255 - pix[i+1]; // green
	      pix[i+2] = 255 - pix[i+2]; // blue
	      // i+3 is alpha (the fourth element)
	    }
			return pix;
		},
		
		//color is 0 1 or 2 corresponding to R, G, B
		remove_color: function(imgd, color){
			var pix = imgd.data;
			// Loop over each pixel and invert the color.
	    for (var i = 0, n = pix.length; i < n; i += 4) {
	      pix[i + color ] = 0; // red
	      // i+3 is alpha (the fourth element)
	    }

			return imgd.data
		},

		remove_red:function(imgd){
			return this.remove_color(imgd, 0)
		},


		remove_green: function(imgd){
			return this.remove_color(imgd, 1)
		},


		remove_blue: function(imgd){
			return this.remove_color(imgd, 2)
		},

		max: function(imgd){
			var pix = imgd.data;
	    for (var i = 0, n = pix.length; i < n; i += 4) {
				var r = pix[i];
				var g = pix[i+1];
				var b = pix[i+2];
				if (r > g && r > b){
					pix[i+1] = pix[i+2] = 0;
				}else if (g> r && g > b) {
					pix[i] = pix[i+2] = 0;
				}else if (b > g && b >r){
					pix[i] = pix[i+1] = 0;
				}

	    }

			return imgd.data
		},

		// addition of two matrix
		_matrix_addition: function(m, n){
			var ret = [[],[],[]];
			for (var j=0, len = m.length; j < len; j++) {
					var line = m[j];
					for (var i=0, len = line.length; i < len; i++) {
							ret[i][j] = m[i][j] * n[i][j];
					}
			}
			return ret;
		},
		
		//add all components of a matrix
		_matrix_add_components: function(m){
			var ret = 0
			for (var j=0, len = m.length; j < len; j++) {
					var line = m[j];
					for (var i=0, len = line.length; i < len; i++) {
							ret += m[i][j]
					}
			}		
			return ret;
		},
		
		_getGrayscaleMatrix: function(imgd){
				var pix = this.grayscale(imgd);
				var ret = [];
				j = 0;
		    for (var i = 0, n = pix.length; i < n; i += 4) {
					ret[j] = pix[i];
					j++;
				}
				return ret
		},
		
		_fillMatrixWithGrayscale: function(gray_mat, imgData){
		    for (var i = 0, n = gray_mat.length; i < n; i++) {
					imgData[i*4] = imgData[i*4+1] = imgData[i*4+2] = gray_mat[i];
					j++;
				}
				return imgData;
		},
		
		_apply_kernel_3: function(kernel){
				
		},
		
		detect_border: function(imgd){
			var pix = this._getGrayscaleMatrix(imgd);
			kernx = [
				[-1,0,1],
				[-2,0,2],
				[-1,0,1]
			]
			
			kerny = [
				[1,2,1],
				[0,0,0],
				[-1,-2,-1]
			]
			
			
			prunning2 = [
				[1,1,1],
				[1,1,1],
				[1,1,1]
			]
			
			prunning = [
				[0,1,0],
				[1,1,1],
				[0,1,0]
			]
			
			var w = imgd.width;
			var h = imgd.height;
	    for (var i = 0, n = pix.length; i < n; i ++) {
				var i1 = i;
				var i2 = (pix[i + 1])      ? i + 1 : i;
				var i3 = (pix[i + 2])      ? i + 2 : i;
				var i4 = (pix[i + w])     ? i + w : i;
				var i5 = (pix[i + w + 1])     ? i + w + 1 : i;
				var i6 = (pix[i + w + 2])     ? i + w + 2 : i;
				var i7 = (pix[i + 2*w])     ? i + 2*w : i;
				var i8 = (pix[i + 2*w + 1])     ? i + 2*w + 1 : i;
				var i9 = (pix[i + 2*w + 2])     ? i + 2*w + 2 : i;
			
				var matx = [
					[pix[i1],pix[i2],pix[i3]],
					[pix[i4],pix[i5],pix[i6]],
					[pix[i7],pix[i8],pix[i9]]
				];
				var outx = this._matrix_addition(matx, kernx);
				outx = this._matrix_addition(outx, prunning2);
				outx = this._matrix_addition(outx, prunning);
				var outy = this._matrix_addition(matx, kerny);
				outy = this._matrix_addition(outy, prunning2);
				outy = this._matrix_addition(outy, prunning);
				var new_x = this._matrix_add_components(outx)
				var new_y = this._matrix_add_components(outy)
				var new_value = Math.abs(new_x) + Math.abs(new_y);
				
				pix[i] =  (new_value < 1000)? new_value : 0;
	    }

			imgd.data = this._fillMatrixWithGrayscale(pix, imgd.data);
			
			return this.invert_colors(imgd)
		}
	}
})();

