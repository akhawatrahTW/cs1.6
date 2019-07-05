# cs1.6
An FPS game developed using Babylonjs.
The code is a bit (really) badly structred, but all the logic is there. So hopefuly it will be useful to someone looking for FPS howtos.
# Main Features:
* Ray casting
* Collision detection
* Animations
* HUD
* Basic AI and Path finding (A*) with some kind of obstacle avoidance
* A basic trick for a better performance for the path finding algorithms
* Attaching meshes to bones
* Pickups
* Headshots (yeah)
* Objects cashing
* Mobile support (joystick camera)
* Difficulty level simulation
* Babylon files of the models extracted from CS 1.6
* Some minor modification to babylonjs script to add nozzle flash and a custom loading screen
* Full screen
* Point lock
* Player Health
* Dynamic wall generation
* Jump and crouch
* Device Detection
* Respawn
* Continues enemy generation
* Sounds
* Shader material
* Asset manager
* In-game menu  

The project uses 3.x version of babylonjs. I tried porting to 4.0 but got some issues animating the player.  

All models were extracted from CS 1.6 and fixed using blender. I own nothing of them.  

A* is based on this (https://github.com/bgrins/javascript-astar)

# To try it
https://cs16.herokuapp.com/
# Run it locally
You will need a web server running on your dev machine. The easist way is to use python. Install python and run the following in the project root:  

python -m SimpleHTTPServer 8000  
Then open this in your browser (this is tested in Chrome): http://localhost:8000/home.html


