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
    this.mesh = new THREE.Object3D();
    
    var placeHolderGeo = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    var placeHolderMat = new THREE.MeshPhongMaterial({
        color:Colors.lightBlue, flatShading: true
    });
    var placeholder = new THREE.Mesh(placeHolderGeo, placeHolderMat);
    placeholder.castShadow = true;
    placeholder.receiveShadow = true;
    this.mesh.add(placeholder);
}
var spaceship;
function createSpaceShip() {
    spaceship = new Spaceship();
    spaceship.mesh.scale.set(.25, .25, .25);
    spaceship.mesh.position.y = 100;
    spaceship.mesh.position.z = -100;
    scene.add(spaceship.mesh);
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
    //move the spacechip based on the mouse input
    var targetX = normalize(mousePos.x, -1, 1, -100, 100);
    var targetY = normalize(mousePos.y, -1, 1, 25, 175);
    //update location
    spaceship.mesh.position.y = targetY;
    spaceship.mesh.position.x = targetX;
    
}

function normalize(v, vmin, vmax, tmin, tmax){
    var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}