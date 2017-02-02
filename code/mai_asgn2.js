// variables
var gl;
var program;
var canvas;
var pcube;	
var vcube;
var buffer;
var color;
var cColors;
var col_Buffer;
var x = 0; 
var y = 0; 
var z = -40;
var degrees_camera = 0;
var crosshair = false;
var Degrees = [0, 0, 0, 0, 0, 0, 0, 0]; //rotation degrees for the speed
var w_h_ratio = 1; 
var xprime = 0;
var zprime = 0;
var fov = 90; 
//matrices
var ortho_Matrix;
var proj_matrix;
var tranformation_matrix;

//this is the main function like int main in c++
window.onload = function init() {
	
	// setting up the webgl canvas , its size is set in HTML file and its id is gl-canvas
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);	
	// show error meessage if webgl isn't supported
	if(!gl) {
		alert("WebGL is not available!");
	}
	
	//use keycodes to setup the event listener of the keyboard 
	document.onkeydown = function(e) {
		
		e = e || window.event;
		// if left key is pressed rotate the camera heading  (azimuth, like twisting your neck to say 'no') to the left by 4 degrees each press 
		if(e.keyCode===37) 
			degrees_camera-=4;
		// if right key is pressed rotate the camera heading  (azimuth, like twisting your neck to say 'no')  to the right by 4 degrees each press 
		else if(e.keyCode===39) 
			degrees_camera+=4;
		// if up key is pressed rotate the camera upwards by 0.25 units each press 
		else if(e.keyCode===38)
			y-=0.25;
		// if down key is pressed rotate the camera downwards by 0.25 units each press 
		else if(e.keyCode===40) 
			y+=0.25;
		// if r is pressed reset camera view to the start position (recall, the start position is defined only in that all cubes are visible and the eye be positioned along the Z axis)
		else if(e.keyCode===82)
		{ 
			x = 0;
			y = 0;
			z = -40;
			w_h_ratio = 1;//ratio between width and height of canvas
			degrees_camera = 0;
			fov=90;
		}
		// if "+" key pressed either by shift = , should toggle the display of an orthographic projection of a cross hair centered over your scene. The cross hairs themselves can be a simple set of lines rendered in white
		else if (e.shiftKey && e.keyCode == 187)
			crosshair = !crosshair; // setting it on/off when pressed on it
		//The ‘c’ key should cycle the colors between the cubes
		else if(e.keyCode===67) 
			cycling(cColors); // the following function is used to cycle the colors among the cubes given the array of colors
		//The ‘n' key should adjust the horizontal field of view (FOV) narrower. One (1) degree per key press (w_h_ratio is width/height thus keeping aspect of my scene squared)
		else if(e.keyCode==78)
			fov+=1;
		//The‘w’ keys should adjust the horizontal field of view (FOV) wider. One (1) degree per key press (w_h_ratio is width/height thus keeping aspect of my scene squared)
		else if(e.keyCode==87) 
			fov-=1;
		//The letter i control forward relative to the camera's current heading. Each key press should adjust position by 0.25 units.
		else if(e.keyCode===73)
		{ 
			camera_ijkm(degrees_camera, 0, 0.25);
			x-=xprime;
			z-=zprime;
			// or can simply use z+=0.25; instead of the previous 3 lines 
		}
		//The letter j control left relative to the camera's current heading. Each key press should adjust position by 0.25 units.
		else if(e.keyCode===74)
		{ 
			camera_ijkm(degrees_camera, 2, 0.25);
			x-=xprime;
			z-=zprime;
			// or can simply use x+=0.25; instead of the previous 3 lines 
		}
		//The letter k control right, relative to the camera's current heading. Each key press should adjust position by 0.25 units.
		else if(e.keyCode===75) 
		{ 
			camera_ijkm(degrees_camera, 3, 0.25);
			x-=xprime;
			z-=zprime;
			// or can simply use x-=0.25; instead of the previous 3 lines 
		}
		//The letter m control backward relative to the camera's current heading. Each key press should adjust position by 0.25 units.
		else if(e.keyCode===77) 
		{ 
			camera_ijkm(degrees_camera, 1, 0.25);
			x-=xprime;
			z-=zprime;
			// or can simply use z-=0.25; instead of the previous 3 lines 
		}
	};
	//setting the viewport and giving it the width and height of the canvas
	gl.viewport(0, 0, canvas.width, canvas.height); 
	//setting the background of canvas to black
	gl.clearColor(0.0, 0.0, 0.0, 1.0); // set canvas background to black when cleared
	//enable the z-buffer to ensure that the depth factor is enables and how thing are viewed correctly if they appear closer on the z axis
	gl.enable(gl.DEPTH_TEST); 
	//gl.depthFunc(gl.LEQUAL);
	
	//setting the vertices of one unit cube that will be later moved to different positions
	var length = 0.5; //the sides of the unit cube are 1 thus the lenght should be 0.5 thus the total length is 1 
	vcube = // array of vectors that take 3 arguments and these vectors arranged clockwise
	[
		vec3(-length, -length, length), //-x,-y
		vec3(-length, length, length),  //-x,y
		vec3(length, length, length),  // x,y
		vec3(length, -length, length), //x,-y 
		vec3(-length, -length, -length),
		vec3(-length, length, -length),
		vec3(length, length, -length),
		vec3(length, -length, -length)
	];
	
	cColors = //creating randon different colors for all the 8 cubes
	[
		vec4(0.2, 0.2, 0.2, 1.0), // RGBA 
		vec4(0.5, 0.5, 0.5, 1.0),  
		vec4(1.0, 0.2, 0.0, 1.0),  
		vec4(0.2, 1.0, 0.0, 1.0),  
		vec4(0.2, 0.0, 1.0, 1.0),  
		vec4(1.0, 0.5, 1.0, 1.0),  
		vec4(1.0, 1.0, 0.5, 1.0),  
		vec4(0.5, 1.0, 1.0, 1.0)   
	];

	pcube = [];
	cube(vcube, pcube); //using it as a function to hold the vertices and points of the faces of each cube
	
	// implementing and initializing the vertex and fragment shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader"); 
    
	gl.useProgram(program);
	
	//creating new buffer, and put data in it so that data becomes in the gpu 
	buffer = gl.createBuffer(); 
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // binding the buffer/ telling gl to use it
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pcube), gl.STATIC_DRAW); // putting data into the gl buffer, must use flatten to change the matrix to array, static_draw is because we are not changing the diagram

	// set the attribute ( creates a pointer to variables in the shader and tell it which buffer that it should pull its information/pieces from
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
		
	//render is to clear canvas and draw the shapes in it
	render();
};

function render() {

	//gl.enable(gl.DEPTH_TEST); 
	// set proj_matrix to be prespective by default
	proj_matrix = perspective(fov, w_h_ratio, -1, 1); 
	//set orthoProjectionMatrix in case choosing to have orthogonal view instead of prespective
	ortho_Matrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
	// seting uniform tranformation_matrix matrix
	tranformation_matrix = gl.getUniformLocation(program, "tranformation_matrix");	
	//setting uniform color
	color = gl.getUniformLocation(program, "color");
	//clearing the color and the depth of the canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// setting a new 4x4 matrix that will be used to transform the cubes/the world through multiplying it with other matrices and scales
	var my_array = mat4();
	//setting the rotation degrees for the 8 cubes
	var deg = [8, 8, 8, 8, 8, 8, 8, 8];

	var cScales = // setting scale factors for each individual cube and this scale should be less than or equal 20% of orginal size
	[
		vec3(3.01, 3.01, 3.01),
		vec3(3.00, 3.00, 3.00),
		vec3(3.02, 3.02, 3.02),
		vec3(2.99, 2.99, 2.99),
		vec3(3.03, 3.03, 3.03),
		vec3(2.98, 2.98, 2.98),
		vec3(3.04, 3.04, 3.04),
		vec3(2.97, 2.97, 2.97)
	];
	
	// creating translation cube_location for each cube such that Each of the eight cubes should be centered at (+/- 10, +/- 10, +/- 10) from the origin. 
	var cube_location = 
	[
		vec3(-10, -10, -10),
		vec3(-10, -10, 10),
		vec3(-10, 10, -10),
		vec3(-10, 10, 10),
		vec3(10, -10, -10),
		vec3(10, -10, 10),
		vec3(10, 10, -10),
		vec3(10, 10, 10)
	]
	
	//drawing the 8 cubes one at a time through providing the following information for each cube to the function
	for(var i=0; i<8; i++) {
		drawONEcube(i, my_array, cube_location[i], cScales[i], [0, 1, 0], deg[i], cColors[i]);
	//     translation matrix, cube's position, its scale factor, the degree of rotation ,color
	}
	
	if(crosshair) // if true preview crosshair as orthographic projection
	{
		var crosshair_vals =  // creating cross hair in the middle
		[
			vec2(-0.5, 0),
			vec2(0.5, 0),
			vec2(0, -0.5),
			vec2(0, 0.5)
		];
	
		// creating new crosshair buffer
		var crosshair_buffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, crosshair_buffer);// binding it		
		
		gl.bufferData(gl.ARRAY_BUFFER, flatten(crosshair_vals), gl.STATIC_DRAW);// loading data to buffer
		
		gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 2, gl.FLOAT, false, 0, 0);

		my_array = mat4();

		my_array = mult(my_array, ortho_Matrix); //multiplying it with ortho_Matrix to switch it to orthographic preview 

		my_array = mult(my_array, scale(vec3(0.1, 0.1, 0.1)));// scale it

		gl.uniform4fv(color, flatten(vec4(1.0, 1.0, 1.0, 1.0))); //making the color white

		gl.uniformMatrix4fv(tranformation_matrix, false, flatten(my_array));

		gl.drawArrays(gl.LINES, 0, 4);// draw the lines
		
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);// telling webgl to use the cube buffer 
		
		gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
	}
	
	window.requestAnimFrame(render);//calls itself again to keep rendering
}
// control the i,j,k and m keys motion and how it affects the cubes/ the world after azimuth of the camera
function camera_ijkm(rdegree, dir, increment) {// angle with the z axis when x and y are zeros

	// degree can be modulo-ed to less than 360 without loss of rotational data
	mod_deg = rdegree % 360;
	// determine if mod_deg is negative
	var bool_neg = false;
	if(mod_deg<0)
		bool_neg = true;
	
	// make degree positive regardless of sign
	mod_deg = Math.abs(mod_deg);
	
	if(mod_deg>180)
	{           				 // check if angle > 180
		mod_deg = 360-mod_deg;   // find difference value from 360 (by subtracting)
		bool_neg = !bool_neg; // switch the negative
	}
	if(mod_deg<-180)
	{            				// check if angle < -180
		mod_deg = 360+mod_deg;     // find difference value from 360 (by adding)
		bool_neg = !bool_neg;    // switch the negative
	}
	var radian = mod_deg*Math.PI/180; //change to radians 
	if(bool_neg)
		radian = -radian;
	var opposite = Math.tan(radian)*Math.sqrt(increment/(1+Math.pow(Math.tan(radian),2))); // calculating the opposite using trig functions
	var adjacent = Math.sqrt(increment/(1+Math.pow(Math.tan(radian),2))); // calculating the adjacent using trig functions
	//covering the cases of 90, 80 and all others & flipping signs in negative degree and > 90 cases
	//0 is for i key
	//1 is for m key
	//2 is for j key
	//4 is for k key	
	
	if(mod_deg===180)
	{
		if(dir===0)
		{ 
			xprime = 0;
			zprime = increment;
		}
		else if(dir===1)
		{ 
			xprime = 0;
			zprime = -increment;
		}
		else if(dir===2) 
		{ 
			xprime = increment;
			zprime = 0;
		}
		else if(dir===3) 
		{ 
			xprime = -increment;
			zprime = 0;
		}
	}
	else if(mod_deg===90) 
	{		
		if(dir===0) 
		{ 
			xprime = increment;
			zprime = 0;
		}
		else if(dir===1) 
		{ 
			xprime = -increment;
			zprime = 0;
		}
		else if(dir===2) 
		{ 
			xprime = 0;
			zprime = -increment;
		}
		else if(dir===3) 
		{ 
			xprime = 0;
			zprime = increment;
		}
		if(bool_neg) 
		{
			xprime = -xprime;
			zprime = -zprime;
		}
	}
	else {
		if(dir===0) 
		{
			xprime = opposite;
			zprime = -adjacent;
		}
		else if(dir===1) 
		{ 
			xprime = -opposite;
			zprime = adjacent;
		}
		else if(dir===2) 
		{ 
			xprime = -adjacent;
			zprime = -opposite;
		}
		else if(dir===3) 
		{ 
			xprime = adjacent;
			zprime = opposite;
		}
	}
	if(mod_deg>90) 
	{
		xprime = -xprime;
		zprime = -zprime;
	}
}
// use the a-h to draw a cube using a single triangle strip
function quad(vcube, pcube, a, b, c, d, e, f, g, h) {
	var indexarr = 
	[
		a, b, c, 
		d, b, f,
		d, h, f,
		e, h, g, 
		e, a, g,
		c, e, f, 
		a, b, c,
		d, g, h
	];
	for(var i=0; i<indexarr.length; i++) {
		pcube.push(vcube[indexarr[i]]);// returns the points array with all the points of the cube
	}	
}
// quad returns the array points with all the points of the cube to draw it with the triangle strip through using the right hand rule
function cube(vcube, pcube) {
	quad(vcube, pcube, 0, 3, 1, 2, 4, 7, 5, 6); // give numbers for the vertices to be easier to use
}
//use single triangle strip primitive to create the cube 
function drawONEcube(findex, my_array, ftranslation, fscale, faxis, fspeed, fcolor) {
		//   index, translation matrix, cube's position, its scale factor, the degree of rotation ,color

	Degrees[findex] += fspeed;
	
	my_array = mat4();
    my_array = mult(my_array, proj_matrix);
	my_array = mult(my_array, rotate(degrees_camera, faxis)); //rotation
	my_array = mult(my_array, translate(vec3(x, y, z))); //translation
	my_array = mult(my_array, translate(ftranslation));
    my_array = mult(my_array, scale(fscale)); //scaling the cubes while program running ===> scale is the last thing to do
	my_array = mult(my_array, rotate(Degrees[findex], faxis)); // smooth, continuously, and individually rotate cubes while running by constant speeds
	//use flatten to switch from matrix to array
	gl.uniform4fv(color, flatten(fcolor));
    gl.uniformMatrix4fv(tranformation_matrix, false, flatten(my_array));	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 24); 
}
//function to cycle the colors of the cubes
// function changes the value of the exicting array with the following one thus the last one takes the value of the next which is the first
function cycling(array) {
	var one = array[0]; 
	for(var i=0; i<array.length-1; i++)
		array[i] = array[i+1];
	array[array.length-1] = one;
}
