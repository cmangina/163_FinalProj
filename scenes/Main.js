//color pallete, can be changed, I just wanted to add something so it looks spacey
var Colors = {
    darkBlue: 0x2b2662,
    lightBlue: 0x4c63d9,
    lightPurple: 0x543972,
    darkPurple: 0x44316c,
    black: 0x040404,
}

////
var game;
var deltaTime = 0;
var enemiesStack = [];



    game = {
        distance: 0,
        spaceshipInitialHeight: 100,
        spaceshipAmpHeight: 50,
        planeColSpeedX: 0,
        planeColSpeedY: 0,

        enemyDistanceTolerance: 10,

        level: 1,
        planetRadius: 500,

        status: " in play",

    };



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
    createSpace();
    createEnemy();

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
    aspectRatio = WIDTH / HEIGHT;
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
    //camera.position.z = 200;
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
    renderer.setSize(WIDTH / HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
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

Planet = function () {
    //create the planet
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    //spin it
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    //planet material, maybe shouldnt be transparent but well see
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.darkPurple,
        transparent: true,
        opacity: .8,
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

//Create indivdual background asteroids
Asteroid = function () {
    this.mesh = new THREE.Object3D();
    var geo = new THREE.DodecahedronGeometry(100, 0);
    var mat = new THREE.MeshPhongMaterial({ color: 0x707070 });
    var m = new THREE.Mesh(geo, mat);

    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;
    m.scale.set(0.9, 0.9, 0.9);

    this.mesh.add(m);
}

//Create the background mesh filled with multiple asteroids
spaceBackground = function () {
    this.mesh = new THREE.Object3D();
    this.asteroidAmount = 30;
    this.asteroidArray = [];
    var stepAngle = Math.PI * 2 / this.asteroidAmount;
    console.log("in space background");
    for (var i = 0; i < this.asteroidAmount; i++) {
        var roid = new Asteroid();
        this.asteroidArray.push(roid);
        var angle = stepAngle * i;
        var height = 750 + Math.random() * 200;
        roid.mesh.position.y = Math.sin(angle) * height;
        roid.mesh.position.x = Math.cos(angle) * height;
        roid.mesh.rotation.z = angle + Math.PI / 2
        roid.mesh.position.z = -400 - Math.random() * 400;
        var size = Math.floor((Math.random() * 1.5) + 0.1);
        roid.mesh.scale.set(size, size, size);
        this.mesh.add(roid.mesh);
    }
}

//Create the background
var space;
function createSpace() {
    space = new spaceBackground();
    space.mesh.position.y = -700;
    scene.add(space.mesh);
}

//Individual particle
spaceshipParticle = function () {
    // Create an empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();
    this.particle = [];

    // create a cube geometry;
    // this shape will be duplicated to create the cloud
    var geom = new THREE.BoxGeometry(10, 10, 10);

    // create a material; a simple white material will do the trick
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
    });

    // create the mesh by cloning the geometry
    var m = new THREE.Mesh(geom, mat);
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    // set the size of the cube randomly
    var s = 0.1 + Math.random() * 0.2;
    m.scale.set(s, s, s);

    // add the cube to the container we first created
    this.mesh.add(m);
}

//Combine spaceship particles to form spaceship smoke trail
spaceshipTrail = function () {
    this.mesh = new THREE.Object3D();
    this.smokeTrail = [];
    for (var i = 0; i < 40; i++) {
        var smoke = new spaceshipParticle();
        smoke.mesh.position.y = -(Math.floor((Math.random() * 40) + 23));

        if (i < 21) {
            smoke.mesh.position.x = Math.floor((Math.random() * 7) + 1);
        } else {
            smoke.mesh.position.x = -Math.floor((Math.random() * 10) + 1);
        }

        this.smokeTrail.push(smoke);
        this.mesh.add(smoke.mesh);
    }
}

function createAtmosphere() {

}

var Spaceship = function () {
    //this.mesh = new THREE.Object3D();
    var rocketModel = new THREE.Object3D();


    //const geometry = new THREE.CylinderBufferGeometry(
    //  radiusTop, radiusBottom, height, radialSegments);

    var rocketBody = new THREE.CylinderGeometry(11, 14, 20, 8);
    var rocketBodymaterial = new THREE.MeshPhongMaterial({ color: 0xe6e6e6 });
    var body = new THREE.Mesh(rocketBody, rocketBodymaterial);
    //scene.add(body);

    //this.mesh.add(body);
    rocketModel.add(body);
    var rocketBase = new THREE.CylinderGeometry(13, 12, 4, 8);
    var rocketBasematerial = new THREE.MeshPhongMaterial({ color: 0xe6e6e6 });
    var baseRocket = new THREE.Mesh(rocketBase, rocketBasematerial);
    baseRocket.position.y = -10;
    //scene.add(baseRocket);
    //this.mesh.add(baseRocket); 
    rocketModel.add(baseRocket);
    var rocketBottom = new THREE.CylinderGeometry(10, 8, 4, 8);
    var rocketBottommaterial = new THREE.MeshPhongMaterial({ color: 0x323232 });
    var bottom = new THREE.Mesh(rocketBottom, rocketBottommaterial);
    bottom.position.y = -14;
    //scene.add(bottom);
    //this.mesh.add(bottom);
    rocketModel.add(bottom);

    var rocketTop = new THREE.CylinderGeometry(10, 11, 8, 8);
    var rocketTopmaterial = new THREE.MeshPhongMaterial({ color: 0x323232 });
    var topRocket = new THREE.Mesh(rocketTop, rocketTopmaterial);
    topRocket.position.y = 10;
    //scene.add(topRocket);
    //this.mesh.add(topRocket);
    rocketModel.add(topRocket);
    var rocketNose = new THREE.CylinderGeometry(6, 10, 10, 8);
    var rocketNosematerial = new THREE.MeshPhongMaterial({ color: 0x323232 });
    var nose = new THREE.Mesh(rocketNose, rocketNosematerial);
    nose.position.y = 17;
    //scene.add(nose);
    //this.mesh.add(nose);
    rocketModel.add(nose);

    var rocketTip = new THREE.CylinderGeometry(1, 6, 5, 8);
    var rocketTipmaterial = new THREE.MeshPhongMaterial({ color: 0x323232 });
    var tip = new THREE.Mesh(rocketTip, rocketTipmaterial);
    tip.position.y = 24;
    //scene.add(tip);
    //this.mesh.add(tip);
    rocketModel.add(tip);
    //const geometry = new THREE.BoxBufferGeometry(width, height, depth);
    // depth = thickness of wing 
    var wing1 = new THREE.BoxGeometry(20, 10, 3);
    wing1.vertices[0].z += 3;
    wing1.vertices[1].z -= 3;
    wing1.vertices[2].z += 3;
    wing1.vertices[3].z -= 3;
    wing1.vertices[4].z -= 2;
    wing1.vertices[6].z -= 2;

    var tailWing = new THREE.BoxGeometry(20, 10, 3);
    tailWing.vertices[0].y += 2;
    tailWing.vertices[1].y += 2;
    tailWing.vertices[2].y += 2;
    tailWing.vertices[3].y += 2;
    tailWing.vertices[4].y -= 4;
    tailWing.vertices[5].y -= 4;
    tailWing.vertices[6].y -= 4;
    tailWing.vertices[7].y -= 4;

    //right wing 
    var wingMaterial = new THREE.MeshPhongMaterial({ color: 0x323232 });
    var one = new THREE.Mesh(wing1, wingMaterial);
    one.position.x = 5;
    one.position.y = 1;
    one.position.z = 15;
    one.rotation.y = (Math.PI / 180) * 90; //change from degress to radians
    rocketModel.add(one);

    /*left wing*/
    var wingMaterial2 = new THREE.MeshPhongMaterial({ color: 0x323232 });
    var two = new THREE.Mesh(wing1, wingMaterial2);
    two.position.x = 5;
    two.position.y = -1;
    two.position.z = -15;
    two.rotation.y = (Math.PI / 180) * 270; //change from degress to radians
    two.rotation.x = (Math.PI / 180) * 180; //change from degress to radians
    two.rotation.z = (Math.PI / 180) * 180; //change from degress to radians
    rocketModel.add(two);

    /*Tail Wing*/
    var wingMaterial = new THREE.MeshPhongMaterial({ color: 0xe6e6e6 });
    var tail = new THREE.Mesh(tailWing, wingMaterial);
    tail.position.x = -10;
    tail.position.y = -10;
    rocketModel.add(tail);

    var c = new spaceshipTrail;
    rocketModel.add(c.mesh);

    // var asteroid = new Asteroid;
    // asteroid.mesh.position.x = 70;
    // rocketModel.add(asteroid.mesh);

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
///adding some stuff
//testing making enemies 
Enemy = function () {
    this.mesh = new THREE.Object3D();

    var geometryEnemy = new THREE.TetrahedronGeometry(8, 2);
    var matEnemy = new THREE.MeshPhongMaterial({ color: 0xf25346, shininess: 0, flatShading: true });

    var enemyMesh = new THREE.Mesh(geometryEnemy, matEnemy);

    this.mesh.add(enemyMesh);

}
var test;
function createEnemy() {

    test = new Enemy();
    //enemy.scale.set(.25, .25, .25);
    test.mesh.position.y = 100;
    test.mesh.position.z = -100;
    test.mesh.position.x = 50;
    test.mesh.rotation.z = 1.5708;
    console.log(test.mesh)
    scene.add(test.mesh);
}
    //var enemyObj = new THREE.Object3D();
    //enemyObj.enemiesOut = [];
     var enemiesStack =[];

EnemyStack = function(){
this.mesh = new THREE.Object3D();
this.enemiesInPlay= [];

}


spawnEnemies = function () {
    var totEnemy = 5;
    console.log("in spawnenemies");
    for (var n = 0; n < totEnemy; n++) {
        var enemy;
        if (enemiesStack.length) {
            enemy = enemiesStack.pop();

        }
        else {
            enemy = new Enemy();
        }
        enemy.angle = -(n * 0.1);
        enemy.distance = game.planetRadius + game.spaceshipInitialHeight + (-1 + Math.random() * 2) * (game.spaceshipAmpHeight - 20);
        console.log(window.innerWidth + " " + window.innerHeight);
        enemy.mesh.position.y = 50//-game.planetRadius + Math.sin(enemy.angle) * enemy.distance;
        enemy.mesh.position.x = 50//Math.cos(enemy.angle) * enemy.distance;
        enemy.mesh.position.z = -100;
        console.log(enemy.mesh.position);
        //nemyObj.add(enemy.mesh);
        //enemyObj.enemiesOut.push(enemy);
        this.mesh.add(enemy.mesh);
	this.enemiesInPlay.push(enemy);
    }
}

//spawnEnemies();


rotateEnemy = function () {

    for (var i = 0; i < enemyObj.enemiesOut.length; i++) {

        var enemy = enememyObj.enemiesOut[i];
        enemy.angle += game.speed * deltaTime * game.enemySpeed;
        if (enemy.angle > Math.Pi * 2)
            enemy.angle -= Math.PI * 2;

        enemy.mesh.position.x = Math.cos(enemy.angle) * eneemy.distance;
        enemy.mesh.position.y = -game.planetRadius + Math.sin(enemy.angle) * enemy.distance;
        enemy.mesh.rotation.z += Math.random() * .5;
        enemy.mesh.rotation.y = Math.random() * .5;


        var changePos = Spaceship.mesh.position.clone().sub(enemy.mesh.position.clone());
        var len = changePos.length();
        if (len < game.enemyDistanceTolerance) {
            //rticleCount.spawnparticles(enemy.position.clone(), 10, 0xff0000,3);
            enemiesStack.unshift(enemyObj.enemiesOut.splice(i, 1)[0]);

            this.mesh.remove(enemy.mesh);
            game.spaceshipColSpeedX = 100 * changePos.x / len;
            game.spaceshipColSpeedY = 100 * changePos.y / len;
            ambientLight.intensity = 3;
            i--;

        } else if (enemy.angle > Math.PI) {

            enemiesStack.unshift(enemyObj.enemiesOut.splice(i, 1)[0]);
            this.mesh.remove(enemy.mesh);
            i--;

        }
    }
}

/////// adding more code 
EnemyStack = function(){
this.mesh = new THREE.Object3D();
this.enemiesInPlay= [];

}

//anothe create enemy funct to test 
var enemyInArray;
function createObstacle(){
for ( var j =0; j<5;j++){
var enemy = new Enemy();
enemiesStack.push(enemy);




}
 enemyInArray = new EnemyStack();
  spawnEnemies();
scene.add(enemyInArray.mesh);

}





// function createEnemy() {
//     for (var i = 0; i < 20; i++) {
//         var enemy = new Enemy();
//         enemiesStack.push(enemy);

//     }
//     enemyCount = new EnemyCount();
//     scene.add(enemyCount.mesh);
// }

// createEnemy();

var mousePos = { x: 0, y: 0 };
function handleMouseMove(event) {
    //normalizing mouse movement
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
}
//////////////////////////
function loop() {
    planet.mesh.rotation.z += .005;
    space.mesh.rotation.z += 0.01;
    test.mesh.rotation.z +=0.01;
    //test.rotation.z +=0.01;
    //enemyMesh.rotation.z += 0.05;
    //enemyInArray.spawnEnemies();
   
    renderer.render(scene, camera);
    updateShip();
    requestAnimationFrame(loop);
}

function updateShip() {
    var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
    var targetX = normalize(mousePos.x, -.75, .75, -100, 100);

    // Move the plane at each frame by adding a fraction of the remaining distance
    spaceship.position.y += (targetY - spaceship.position.y) * 0.05;
    spaceship.position.x = targetX;
    //console.log(spaceship.position);

    // Rotate the plane proportionally to the remaining distance
    spaceship.rotation.z = (targetY - spaceship.position.y) * 0.0128 - 1.5708;
    spaceship.rotation.x = (spaceship.position.y - targetY) * 0.0064;

}

function normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}
