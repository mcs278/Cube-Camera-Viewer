
Notes about operation:
	----->> (0) use internet explorer

	----->> (1)once you open the .html file just left click with the mouse on the screen to let the keyboard operations start

	----->> (2)the + key that is used is SHIFT and the = key, I donot have the + key by itself on my keyborad thus that it what I used so that I can check that is working 
	


That is what I did in that Lab:
	1) (DONE) Implement the assignment in a clean and understandable manner. Your code must be readily understandable for grading including extensive comments. A 	README.md that explains what you did (i.e. extra credit) and anything the grader needs to know to run your assignment
	2)(DONE) Set up a WebGL capable HTML canvas able to display without error. Its size should be at least 960x540 and should have the z-buffer enabled and cleared 	to a black background. Implement necessary shader codes without error  ** Note: I did it 960x960

	3)(DONE) Display eight (8) unit cubes using a symmetric perspective projection. Each of the eight cubes should be centered at (+/- 10, +/- 10, +/- 10) from the 	origin. Each of the eight cubes should be drawn with a different color. You can use any colors except black or white. All eight cubes should be visible from an 	initial camera position along the Z axis
	5)(DONE) The ‘c’ key should cycle the colors between the cubes 

	6)(DONE) The cubes should display in a square aspect ratio (they should not be stretched or squeezed when displayed) 
	7)(DONE) Implement a simple camera navigation system using the keyboard. Up and down arrow keys should control the position of the camera along the Y axis (+Y 		is up and -Y is down by default in WebGL). Each key press should adjust position by 0.25 units. 

	8)(DONE) The left and right arrow keys control the heading (azimuth, like twisting your neck to say 'no') of the camera. Each key press should rotate the 		heading by four (4) degrees 
	9)(DONE) The letters i, j, k and m control forward, left, right and backward, respectively, relative to the camera's current heading. Each key press should 		adjust position by 0.25 units. The ‘r’ key should reset the view to the start position (recall, the start position is defined only in that all cubes are 		visible and the eye be positioned along the Z axis) – 

	10)(DONE) The ‘n’ and ‘w’ keys should adjust the horizontal field of view (FOV) narrower or wider. One (1) degree per key press. Keep the display of your scene 	square as the FOV changes

	11)(DONE)The ‘+’ key should toggle the display of an orthographic projection of a cross hair centered over your scene. The cross hairs themselves can be a 		simple set of lines rendered in white 
 
Extra:

	1)(DONE) Instance each of the eight cubes from the same geometry data .

	2)(DONE) Implement the cube geometry as a single triangle strip primitive 
	3)(DONE) Implement your navigation system rotations using quaternions 

	
