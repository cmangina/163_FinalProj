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


function createLights() {

}
function createPlanet() {

}
function createAtmosphere() {

}
function createSpaceShip() {

}

function loop() {

}
