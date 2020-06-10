# 163_FinalProj

# Tennessee Phillips Ward:
# I set up the initial prototype which included the rotating planet, 
# and a box that the player could move around with their mouse.
# I then added some rotation based on the current direction of the box 
# to give the illusion of movement rather than tracking. 
# Once the scene was a bit more space-like, I added the enemies and made 
# them rotate around the planet. Once this was done, I added simple
# collision so that the enemies would disappear when they made contact  
# with the spaceship. Then I added some text to the top of the screen
# in the form of a THREE.js object with text parameters. Once the text
# was implemented, it took me a while to figure out how to update the 
# text itself. It seems as if there is no way to update an existing text
# so I needed to delete the old text and add a new text with the updated 
# information. This text contains the player's health and when it reaches 
# zero I needed a way to stop the game. I make the game's status "Game Over",
# then I put a conditional statement in the looping function that would
# only update certain aspects of the game if the game was not over. 
# Once the game is over, I also add some text saying so, just so the player
# knows for sure what happened. 


# Charita Mangina:
## I made the rocket using only the primitive shapes available to us
## by three.js. The process was a little complex but overall fun. The two
## main primitives the rocket is composed of are the Cylinder Geometry and 
## the Box Geometry. By manipulating the vertices for the Box Geometry, it 
## allowed me to create the wings for the rocket and the position was adjusted
## by shifting positions. The rocket itself was built from multiple Cylinder
## Geometry objects (ie. rocket body, base, tip , and nose). All the individual 
## objects were encapsulated under a 3d object so we can move rocket as a whole.
## I also helped create the enemy object using another Three.js primitive and this was 
## to resembles asteroids the ship must avoid.

# Gavril Tango:
# I did more or less the same thing Charita did. I utilized the primitive shapes
# offered to us by three.js to implement the different objects we see in the game.
# I first created the Asteroids that are seen spinning around the world using the
# Dodecahedron Geometry and a basic phong material mesh. This basically the same
# way I created the star background as well. Other than that, I basically did a 
# little house keeping. I changed all the colors around for the planet, and the 
# entire background as well as the space ship. I helped a little with making the
# spaceship by making the wings face the correct way and look like wings, also
# adding the tail wing to look more like a NASA space ship. I also began started
# spaceships trail that we see spinning, but I only created the particles. Tennessee
# implemented the spinning part. I wanted to make it so that the
# particles would actual spawn and then over time fade out, but I couldn't figure it
# out with the time crunch I had.
