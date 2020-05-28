//color pallete, can be changed, I just wanted to add something so it looks spacey
var Colors = {
    darkBlue: 0x2b2662,
    lightBlue: 0x4c63d9,
    lightPurple: 0x543972,
    darkPurple: 0x44316c,
    black: 0x040404,
}

window.addEventListener('load', init, false);

function init() {
    //sets up the scene, camera, and renderer
    createScene();

    //add light
    createLights();

    //add objects
    createSpaceShip();
    createPlanet();
    createAtmosphere();

    //add listener for mosue
    document.addEventListener('mousemove', handleMouseMove, false);

    //start a loop to change the positions of the objects and render the scene every frame
    loop();
}

//create variables
var scene, camera, fieldOfView, aspectRatio, nearShip, farShip, HEIGHT, WIDTH, renderer, container;

//create scene function
function createScene() {
    //set bounds of our world 
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    //create the scne itself
    scene = new THREE.Scene();

    //add fog effecet
    scene.fog = new THREE.Fog(0x543972, 100, 950);

    //camera
    aspectRatio = WIDTH/HEIGHT;
    fieldOfView = 60;
    nearShip = 1;
    farShip = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearShip,
        farShip,
    );

    //camrea position
    camera.position.x = 0;
    camera.positionz = 200;
    camera.position.y = 100;

    //renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    //resize screen based on user input
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH/HEIGHT);
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
    //a hemisphere light has a gradient where the first color is the sky 
    //and the second is the ground. the third is the intensity
    hemisphereLight = new THREE.HemisphereLight(0xAAAAAA, 0x000000, 0.9);

    //a directional light
    //define the direction, visible area of the projected shadow, and resolution of the shadow
    shadowLight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

Planet = function() {
    //create the planet
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    //spin it
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    //planet material, maybe shouldnt be transparent but well see
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.darkPurple,
        transparent:true,
        opacity:.8,
        flatShading: true,
    });

    //create the object and give it some shade
    this.mesh = new THREE.Mesh(geometry, mat);
    this.mesh.receiveShadow = true;
}

var planet;

function createPlanet() {
    planet = new Planet();

    planet.mesh.position.y = -550;

    scene.add(planet.mesh);
}


function createAtmosphere() {

}

var Spaceship = function() {
    //this.mesh = new THREE.Object3D();
var rocketModel= new THREE.Object3D();


//const geometry = new THREE.CylinderBufferGeometry(
//  radiusTop, radiusBottom, height, radialSegments);
    
var rocketBody= new THREE.CylinderGeometry(11, 14, 20, 8);
var rocketBodymaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
var body = new THREE.Mesh(rocketBody, rocketBodymaterial);
//scene.add(body);

//this.mesh.add(body);
rocketModel.add(body);
var rocketBase = new THREE.CylinderGeometry(13, 12,4,8);
var rocketBasematerial = new THREE.MeshPhongMaterial({color:0x00ff00});
var baseRocket = new THREE.Mesh(rocketBase, rocketBasematerial);
baseRocket.position.y=-10;
//scene.add(baseRocket);
//this.mesh.add(baseRocket); 
rocketModel.add(baseRocket);
var rocketBottom= new THREE.CylinderGeometry(10, 8, 4, 8);
var rocketBottommaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
var bottom = new THREE.Mesh(rocketBottom, rocketBottommaterial);
bottom.position.y= -14;
//scene.add(bottom);
//this.mesh.add(bottom);
rocketModel.add(bottom);

var rocketTop= new THREE.CylinderGeometry(10, 11, 8, 8);
var rocketTopmaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
var topRocket = new THREE.Mesh(rocketTop, rocketTopmaterial);
topRocket.position.y= 10;
//scene.add(topRocket);
//this.mesh.add(topRocket);
rocketModel.add(topRocket);
var rocketNose = new THREE.CylinderGeometry(6,10,10,8);
var rocketNosematerial = new THREE.MeshPhongMaterial({color:0xff0000});
var nose = new THREE.Mesh(rocketNose, rocketNosematerial);
nose.position.y = 17;
//scene.add(nose);
//this.mesh.add(nose);
rocketModel.add(nose);

var rocketTip = new THREE.CylinderGeometry(1,6,5,8);
var rocketTipmaterial = new THREE.MeshPhongMaterial({color:0xff0000});
var tip = new THREE.Mesh(rocketTip, rocketTipmaterial);
tip.position.y=24;
//scene.add(tip);
//this.mesh.add(tip);
rocketModel.add(tip);
//const geometry = new THREE.BoxBufferGeometry(width, height, depth);
// depth = thickness of wing 
var wing1 = new THREE.BoxGeometry(20,10,3);
wing1.vertices[4].y -= 8; //should make height decrease 
wing1.vertices[5].y -= 8;     
wing1.vertices[6].y -= 5; 
wing1.vertices[7].y -= 5;
wing1.vertices[1].y += 5;
wing1.vertices[3].y +=5;

//right wing 
var wingMaterial = new THREE. MeshPhongMaterial({color:0x0ff000});
var one = new THREE.Mesh(wing1, wingMaterial);
one.position.x = 20;
one.position.y =-5;
//rotate around y-axis
one.rotation.y = (Math.PI/180)*150; //change from degress to radians
//scene.add(one);
//this.mesh.add(one);
rocketModel.add(one);


/*left wing*/
var wingMaterial2= new THREE. MeshPhongMaterial({color:0x0ff000});
var two = new THREE.Mesh(wing1, wingMaterial2);
two.position.x =-22;
two.position.y = -5;
//two.rotation.y = (Math.PI/180)*120;
//scene.add(two);
//this.mesh.add(two);

rocketModel.add(two);
return rocketModel;
}
var spaceship;
function createSpaceShip() {
    spaceship = new Spaceship();
    spaceship.scale.set(.25, .25, .25);
    spaceship.position.y = 100;
    spaceship.position.z = -100;
    spaceship.rotation.z = 1.5708;
    scene.add(spaceship);
}

var mousePos = {x:0, y:0};
function handleMouseMove(event) {
    //normalizing mouse movement
    var tx = -1 + (event.clientX/ WIDTH)*2;
    var ty = 1 - (event.clientY/ HEIGHT)*2;
    mousePos = {x: tx, y: ty};
}

function loop() {
    planet.mesh.rotation.z += .005;
    renderer.render(scene, camera);
    updateShip();

    requestAnimationFrame(loop);
}

function updateShip() {
    var targetY = normalize(mousePos.y,-.75,.75,25, 175);
	var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
	
	// Move the plane at each frame by adding a fraction of the remaining distance
    spaceship.position.y += (targetY-spaceship.position.y)*0.1;
    spaceship.position.x = targetX;

	// Rotate the plane proportionally to the remaining distance
	spaceship.rotation.z = (targetY-spaceship.position.y)*0.0128 - 1.5708;
	spaceship.rotation.x = (spaceship.position.y-targetY)*0.0064;
    
}

function normalize(v, vmin, vmax, tmin, tmax){
    var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}