//Variables

var scene,
  camera, camera2, fieldOfView, aspectRatio, nearPlane, farPlane,
  shadowL, renderer, container, clock;
var vista = true;
var delta = 0;
var floorRadius = 1000;
var speed = 3;
var distance = 0;
var level = 1;
var segments = 8;
var levelInterval;
var levelUpdateFreq = 5000;
var initSpeed = 6;
var maxSpeed = 40;
var floorR = 0;
var gameStatus = "play";;
var malusClearColor = 0xb44b39;
var malusClearAlpha = 0;

var elementsNumber = 30;
var elements = [elementsNumber];
var old = [elementsNumber];
var touched = [elementsNumber];
var updown = [elementsNumber];
var birdsNumber = 8;
var birds = [birdsNumber];
var lives = 0;

var monkey;
var up = true;
var fly = 0;

var ctCount=5;

var HEIGHT, WIDTH, windowHalfX, windowHalfY,mousePos = {x: 0, y: 0};

// Materials

var blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    shading:THREE.FlatShading,
});

var whiteMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shading:THREE.FlatShading,
});

var greenMat = new THREE.MeshPhongMaterial({
  color: 0x347C2C,
  shading:THREE.FlatShading
});

var brownMat = new THREE.MeshPhongMaterial({
  color: 0x5d4037,
  shading:THREE.FlatShading
});

var pinkMat = new THREE.MeshPhongMaterial({
  color: 0xffccbc,
  shading:THREE.FlatShading
});

var yellowMat = new THREE.MeshPhongMaterial({
  color: 0xffb74d,
  shading:THREE.FlatShading
});

var redMat = new THREE.MeshPhongMaterial({
  color: 0xe51700,
  shininess:0,
  shading:THREE.FlatShading,
});

var darkGreenMat = new THREE.MeshPhongMaterial({
    color: 0x254117,
    shininess:0,
    shading:THREE.FlatShading,
});

var lightGreenMat = new THREE.MeshPhongMaterial({
  color: 0x388e3c,
  shininess:0,
  shading:THREE.FlatShading,
});

var orangeMat = new THREE.MeshPhongMaterial({
  color: 0xff9800,
  shininess:0,
  shading:THREE.FlatShading,
});

var blueMat = new THREE.MeshPhongMaterial({
  color: 0x3f51b5,
  shininess:0,
  shading:THREE.FlatShading,
});


//Init ThreeJS, lights, screen and mouse events

var fieldDist = document.getElementById("dist");
var fieldDistance = document.getElementById("distValue");
var fieldLife = document.getElementById("life");
var fieldLives = document.getElementById("lifeValue");
var fieldGameOver = document.getElementById("gameoverInstructions");
var fieldRecord = document.getElementById("record");
var fieldRecordValue = document.getElementById("recordValue");
var fieldInstruction = document.getElementById("instructions");
var fieldWelcomeMessage = document.getElementById("WelcomeMessage");
var fieldButtonStart = document.getElementById("Start");
var fieldPicture = document.getElementById("picture");
var fieldRestart = document.getElementById("Restart");
var fieldCountdown = document.getElementById("countdown");

function initScreenAnd3D() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 5000;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.z = 260;
  camera.position.y = 30;
  camera.lookAt(new THREE.Vector3(0, 30, 0));

  camera2 = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera2.position.x = -160;
  camera2.position.z = 0;
  camera2.position.y = 80;
  camera2.lookAt(new THREE.Vector3(-50, 30, 0));

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor( malusClearColor, malusClearAlpha);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleResize, false);
  document.body.onkeyup = function(e){
    if (e.keyCode == 32){
      handleKeyPress();
    }
    else if (e.keyCode == 67){
      vista=!vista;
    }
  }
  clock = new THREE.Clock();
}

var doneOnce=false;
var donwTwice=false;
function handleKeyPress(event){
  if (gameStatus == "play"){    
    if(monkey.status=="jumping" && !doneOnce){
      jumpHeight=70;      
      if(!up) up=!up;
      doneOnce=true;      
    } 
    else{
      monkey.status="jumping";
    }     
  } 
}

function handleResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  globalLight = new THREE.AmbientLight(0xffffff, .9);
  shadowL = new THREE.DirectionalLight(0xffffff, 1);
  shadowL.position.set(-30, 40, 20);
  shadowL.castShadow = true;
  shadowL.shadow.camera.left = -400;
  shadowL.shadow.camera.right = 400;
  shadowL.shadow.camera.top = 400;
  shadowL.shadow.camera.bottom = -400;
  shadowL.shadow.camera.near = 1;
  shadowL.shadow.camera.far = 2000;
  shadowL.shadow.mapSize.width = shadowL.shadow.mapSize.height = 2048;
  scene.add(globalLight);
  scene.add(shadowL);
}

function createFloor() {
  floorS = new THREE.Mesh(new THREE.SphereGeometry(floorRadius, 100, 100), new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    specular:0x000000,
    shininess:1,
    transparent:true,
    opacity:.5
  }));
  floorS.rotation.x = -Math.PI / 2;
  floorS.receiveShadow = true;
  floor = new THREE.Group();
  floor.position.y = -floorRadius;
  floor.rotation.x = -Math.PI / 2;
  floorG = new THREE.Mesh(new THREE.SphereGeometry(floorRadius-0.5, 100, 100), new THREE.MeshBasicMaterial({color: 0x4caf50}));
  floorG.receiveShadow = false;
  floor.add(floorS);
  floor.add(floorG);
  scene.add(floor);
}

Monkey = function() {
  this.status = "running";
  this.runningCycle = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();

  var torsoGeom = new THREE.CubeGeometry(15,35,15);
  this.torso = new THREE.Mesh(torsoGeom, brownMat);
  this.torso.rotation.x = 0.66;

  var headGeom = new THREE.CubeGeometry(20,20,20, 1);
  headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,10));
  this.head = new THREE.Mesh(headGeom, brownMat);
  this.head.position.z = -10;
  this.head.position.y = 15;
  this.head.rotation.x = - 0.66;

  var mouthGeom = new THREE.CubeGeometry(10,10,10, 1);
  mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,20));
  this.mouth = new THREE.Mesh(mouthGeom, pinkMat);
  this.mouth.position.y = -13;
  this.mouth.position.z = 0;
  this.head.add(this.mouth);

  var eyeGeom = new THREE.CubeGeometry(2,3,3);
  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 10;
  this.eyeL.position.z = 15;
  this.eyeL.position.y = 5;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);

  var irisGeom = new THREE.CubeGeometry(.6,1,1);
  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = 1.2;
  this.iris.position.y = -1;
  this.iris.position.z = 1;
  this.eyeL.add(this.iris);

  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;
  this.eyeR.position.x = -this.eyeL.position.x;
  this.head.add(this.eyeR);

  var earGeom = new THREE.CubeGeometry(2,5,3);
  this.earL = new THREE.Mesh(earGeom, pinkMat);
  this.earL.position.x = 10;
  this.earL.position.z = 5;
  this.earL.position.y = 2;
  this.earL.castShadow = true;
  this.head.add(this.earL);
  this.earR = this.earL.clone();
  this.earR.position.x = -this.earL.position.x;
  this.head.add(this.earR);

  var tailGeom = new THREE.CubeGeometry(3,20,3);
  tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-3,9,-5));
  tailGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  tailGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));

  var tailGeomUP = new THREE.CubeGeometry(3,20,3);
  tailGeomUP.applyMatrix(new THREE.Matrix4().makeTranslation(0,-20,0));
  tailGeomUP.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
  tailGeomUP.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));

  this.tail = new THREE.Mesh(tailGeom, brownMat);
  this.tailUP = new THREE.Mesh(tailGeomUP, brownMat);
  this.tail.position.z = -6;
  this.tail.position.y = -8;
  this.tail.rotation.x = 0.33;
  this.tailUP.position.z = -7;
  this.tailUP.position.y = -4;
  this.torso.add(this.tail);
  this.tail.add(this.tailUP)

  var pawGeom = new THREE.CubeGeometry(5,30,5);
  pawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-15,0));
  this.pawFL = new THREE.Mesh(pawGeom, brownMat);
  this.pawFL.position.y = 15;
  this.pawFL.position.z = 3;
  this.pawFL.position.x = -5.5;
  this.pawFL.rotation.x = -1;
  this.torso.add(this.pawFL);
  this.pawFR = this.pawFL.clone();
  this.pawFR.position.x = - this.pawFL.position.x;
  this.torso.add(this.pawFR);


  var pawGeom2 = new THREE.CubeGeometry(5,5,5);
  pawGeom2.applyMatrix(new THREE.Matrix4().makeTranslation(0,-15,0));
  this.pawFLL = new THREE.Mesh(pawGeom2, pinkMat);
  this.pawFLL.position.y = -18;
  this.pawFLL.position.z = 2;
  this.pawFLL.position.x = 0;
  this.pawFL.add(this.pawFLL);
  this.pawFRL = this.pawFLL.clone();
  this.pawFRL.position.x = - this.pawFLL.position.x;
  this.pawFR.add(this.pawFRL);


  var UpperPawGeom = new THREE.CylinderGeometry(6,2,8);
  UpperPawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-5,-10));
  this.pawBUR = new THREE.Mesh(UpperPawGeom, brownMat);
  this.pawBUR.position.y = -6;
  this.pawBUR.position.z = 5;
  this.pawBUR.position.x = 5.5;
  this.pawBUR.rotation.x = -1.65;
  this.torso.add(this.pawBUR);

  this.pawBUL = this.pawBUR.clone();
  this.pawBUL.position.x =  - this.pawBUR.position.x;
  this.torso.add(this.pawBUL);

  var LowerPawGeom = new THREE.CylinderGeometry(2,0,6);
  LowerPawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-5,0));
  this.pawBLR = new THREE.Mesh(LowerPawGeom, brownMat);
  this.pawBLR.position.y = -7.5;
  this.pawBLR.position.z = -10;
  this.pawBLR.position.x = 0.5;
  this.pawBLR.rotation.x = 1;
  this.pawBUR.add(this.pawBLR);
  this.pawBLL = this.pawBLR.clone();
  this.pawBUL.add(this.pawBLL);

  var Foot = new THREE.BoxGeometry(5,7,3);
  this.footR = new THREE.Mesh(Foot, brownMat);
  this.footR.position.y = -8;
  this.footR.position.z = 3;
  this.footR.position.x = 0;
  this.footR.rotation.x = 190;
  this.pawBLR.add(this.footR);
  this.footL = this.footR.clone();
  this.pawBLL.add(this.footL);

  this.mesh.add(this.body);
  this.torso.add(this.head);
  this.body.add(this.torso);
  this.torso.castShadow = true;
  this.head.castShadow = true;
  this.pawFL.castShadow = true;
  this.pawFR.castShadow = true;
  this.pawBUL.castShadow = true;
  this.pawBUR.castShadow = true;
  this.body.position.y = 30;

  this.body.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Monkey.prototype.run = function(){
  this.status = "running";
  var s = Math.min(speed,maxSpeed);
  this.runningCycle += delta * s * .7;
  this.runningCycle = this.runningCycle % (Math.PI*2);
  var t = this.runningCycle;
  var amp = 2;

  this.body.rotation.x =  Math.sin(t - Math.PI/2)*amp*.1;
  this.pawBUL.rotation.x = - 1 + Math.sin(t+2)*Math.PI/10;
  this.pawBLL.rotation.x = 0.7 + Math.sin(t+2)*Math.PI/4;
  this.pawBUR.rotation.x = - 1 + Math.sin(t+6)*Math.PI/10;
  this.pawBLR.rotation.x = 0.7 + Math.sin(t+6)*Math.PI/4;
  this.pawFR.rotation.x = - 1 + Math.sin(t+5)*Math.PI/10;
  this.pawFL.rotation.x = - 1 + Math.sin(t+3)*Math.PI/10;
  this.footR.rotation.z = Math.sin(t + Math.PI/2)*amp*.1;
  this.footL.rotation.z = Math.sin(t + Math.PI/2)*amp*.1;
  this.head.rotation.x = -.66 + Math.sin(t + 2)*Math.PI/10;
  this.tail.rotation.x = Math.sin(t+10)*Math.PI/10;
}

var jumpHeight = 35;
Monkey.prototype.jump = function(){
  
  var totalSpeed = speed/2;
 
  if(up && this.mesh.position.y < jumpHeight){
    if(this.pawFR.rotation.x > -3){
      this.pawFR.rotation.x -=  Math.PI/10;
      this.pawFL.rotation.x -=  Math.PI/10;
    }
    this.mesh.position.y += totalSpeed;
    return;
  }

  else if (fly <= 10){
    fly += speed/8;
    return;
  }

  else if (this.mesh.position.y >= jumpHeight&&up){
    up = false;
    return;
  }

  else if (this.mesh.position.y > -3){
    this.mesh.position.y -= totalSpeed;
    if (this.mesh.position.y <= -3){
      this.mesh.position.y =- 3;
      jumpHeight = 35;
      doneOnce=false;
      console.log("reset");
    }    
    return;
  }

  up = true;
  fly = 0;
  this.status = "running";
}

function createMonkey() {
  monkey = new Monkey();
  monkey.mesh.scale.set(0.5,0.5,0.5);
  monkey.mesh.rotation.y = Math.PI/2 + 0.3;
  monkey.mesh.position.x = -70;
  monkey.mesh.position.y = -3;
  scene.add(monkey.mesh);
}

Palm = function() {
  this.mesh = new THREE.Group();
  var bodyGeom = new THREE.CubeGeometry(3, 36, 3, 3, 12 ,3);
  bodyGeom.faces.forEach( (face, idx) => {
    if ( (idx + (Math.floor(idx/(segments*2)) % 2 * 2)) % 4 < 2 ) {
      face.color.setRGB(0.7,0.7,0.7);
    }
  })
  var material = new THREE.MeshBasicMaterial( {color: 0x826842, vertexColors: THREE.FaceColors} );
  this.body = new THREE.Mesh(bodyGeom, material);
  var leafGeom = new THREE.CylinderGeometry(0,2,15);
  leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,1,0));
  for (var i=0; i<9; i++){
    if(i%3 == 2){
      var row = (i%3);
      var col = Math.floor(i/3);
      var sb = new THREE.Mesh(leafGeom, darkGreenMat);
      sb.rotation.x =-Math.PI/2 -.5;
      sb.position.z = -3;
      sb.position.y = -2 + row*10;
      sb.position.x = -2 + col*2;
      this.body.add(sb);

      var sf = new THREE.Mesh(leafGeom, darkGreenMat);
      sf.rotation.x = + Math.PI/2 +.5;
      sf.position.z = 3;
      sf.position.y = -2 + row*10;
      sf.position.x = -2 + col*2;
      this.body.add(sf);

      var sr = new THREE.Mesh(leafGeom, darkGreenMat);
      sr.position.x = 3;
      sr.position.y = -2 + row*10;
      sr.position.z = -2 + col*2;
      sr.rotation.z = -Math.PI/2 -.5;
      this.body.add(sr);

      var sl = new THREE.Mesh(leafGeom, darkGreenMat);
      sl.position.x = -3;
      sl.position.y = -2 + row*10;
      sl.position.z = -2 + col*2;
      sl.rotation.z = + Math.PI/2 +.5;
      this.body.add(sl);
    }
  }
  this.mesh.add(this.body);
  this.mesh.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Banana = function() {
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();

  var middleGeom = new THREE.CylinderGeometry(1,2,7.5);
  this.middle = new THREE.Mesh(middleGeom, yellowMat);
  this.middle.rotation.x = -1.2;

  var upGeom = new THREE.CubeGeometry(1.5, 1.5, 4);
  this.up = new THREE.Mesh(upGeom, brownMat);
  this.up.position.z = 0.5;
  this.up.rotation.x = -1.3;
  this.up.position.y = 5.5;
  this.middle.add(this.up);
 
  var downGeom = new THREE.CylinderGeometry(2,0.5,7.5);
  this.down = new THREE.Mesh(downGeom, yellowMat);
  this.down.position.y = -5.8;
  this.down.position.z = 1.7;
  this.down.rotation.x = -0.66;
  this.middle.add(this.down);

  this.body.add(this.middle);
  this.body.applyMatrix(new THREE.Matrix4().makeTranslation(0,25+Math.random()*15,0));
  this.body.rotation.y = 1.5;
  this.mesh.add(this.body);

  this.mesh.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Banana.prototype.fly = function(i){
  var delta = 0.4;
  if(this.body.position.y>75){
    updown[i]=!updown[i];
    this.body.position.y -= delta;
  }
  if(this.body.position.y<30){
    updown[i]=!updown[i];
    this.body.position.y += delta;
  }
  if(updown[i]){
    this.body.position.y += delta;
  }
  else{
    this.body.position.y -= delta;
  }  
}

Apple = function() {
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();

  var appleGeom = new THREE.SphereGeometry(5,5,5);
  this.apple = new THREE.Mesh(appleGeom, redMat);
 
  var stalkGeom = new THREE.CubeGeometry(1.5,3,1.5);
  this.stalk = new THREE.Mesh(stalkGeom, brownMat);
  this.stalk.position.y = 6;
  this.apple.add(this.stalk);

  var leafGeom = new THREE.CubeGeometry(1.5,4,1.5);
  this.leaf = new THREE.Mesh(leafGeom, greenMat);
  this.leaf.position.y = 6;
  this.leaf.position.x = 3;
  this.leaf.rotation.z = -0.66;
  this.apple.add(this.leaf);

  this.body.add(this.apple);
  this.body.applyMatrix(new THREE.Matrix4().makeTranslation(0,70,0));

  this.mesh.add(this.body);
  this.mesh.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Bird = function() {

  this.runningCycle = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();

  var torsoGeom = new THREE.CubeGeometry(6, 6, 12, 1);
  this.torso = new THREE.Mesh(torsoGeom, lightGreenMat);
  this.torso.rotation.x = 0.15;

  var neckGeom = new THREE.CylinderGeometry(1.5, 1.5, 3);
  this.neck = new THREE.Mesh(neckGeom, lightGreenMat);
  this.neck.position.z = -7.5;
  this.neck.rotation.x = -1.3;
  this.neck.position.y = 3;
  this.torso.add(this.neck);

  var headGeom = new THREE.CubeGeometry(8, 2, 9, 1);
  this.head = new THREE.Mesh(headGeom, redMat);
  this.head.rotation.x = -0.5;
  this.head.position.z = 0.5;
  this.head.position.y = 2.5;
  this.neck.add(this.head);

  var eyeGeom = new THREE.CubeGeometry(1,2,2);
  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 4.5;
  this.eyeL.position.z = 2;
  this.eyeL.position.y = 0.5;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);

  var irisGeom = new THREE.CubeGeometry(.6,1,1);

  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = 0.8;
  this.iris.position.y = 0.5;
  this.iris.position.z = -0.5;
  this.eyeL.add(this.iris);

  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;
  this.eyeR.position.x = -this.eyeL.position.x;
  this.head.add(this.eyeR);

  var growthGeom = new THREE.ConeGeometry(1.6, 5);
  this.growth = new THREE.Mesh(growthGeom, redMat);
  this.growth.rotation.x = 2;
  this.growth.position.y = -1.5;
  this.growth.position.z = 6.5;
  this.head.add(this.growth);

  var mouthGeom = new THREE.ConeGeometry(5, 9);
  this.mouth = new THREE.Mesh(mouthGeom, orangeMat);
  this.mouth.position.y = 5.5;
  this.head.add(this.mouth);

  var pawGeom = new THREE.CylinderGeometry(1.5,0,7.5);
  this.pawFL = new THREE.Mesh(pawGeom, darkGreenMat);
  this.pawFL.position.y = -3;
  this.pawFL.position.z = 9.5;
  this.pawFL.position.x = 4.5;
  this.pawFL.rotation.x = -1.2;
  this.torso.add(this.pawFL);

  this.pawFR = this.pawFL.clone();
  this.pawFR.position.x = - this.pawFL.position.x;
  this.torso.add(this.pawFR);

  var wingGeomR = new THREE.CylinderGeometry(4.5,0,18);
  wingGeomR.applyMatrix(new THREE.Matrix4().makeTranslation(4.5,0,0));
  wingGeomR.applyMatrix(new THREE.Matrix4().makeRotationZ(90));
  this.wingR = new THREE.Mesh(wingGeomR, darkGreenMat);
  this.wingR.position.y = 3;
  this.wingR.position.z = 0;
  this.wingR.position.x = 11;
  this.torso.add(this.wingR);

  var wingGeomL = new THREE.CylinderGeometry(4.5,0,18);
  wingGeomL.applyMatrix(new THREE.Matrix4().makeTranslation(-4.5,0,0));
  wingGeomL.applyMatrix(new THREE.Matrix4().makeRotationZ(-90));
  this.wingL = new THREE.Mesh(wingGeomL, darkGreenMat);
  this.wingL.position.y = 3;
  this.wingL.position.z = 0;
  this.wingL.position.x = -11;
  this.torso.add(this.wingL);

  var tailGeom = new THREE.CylinderGeometry(0, 2, 15);
 
  this.tail = new THREE.Mesh(tailGeom, blueMat);
  this.tail.position.z = +12;
  this.tail.position.y = 4;
  this.tail.rotation.x = 1.3;
  this.torso.add(this.tail);

  this.body.add(this.torso);
  this.body.rotation.y = 1.5;
  this.body.position.y = 30;
  this.mesh.add(this.body);
  this.mesh.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

Bird.prototype.fly = function(){

  var s = Math.min(speed,maxSpeed);
  this.runningCycle += delta * s * .7;
  this.runningCycle = this.runningCycle % (Math.PI*2);

  var t = this.runningCycle;
  var amp = 2;

  this.head.rotation.x = -.5 + Math.sin(t+2)*Math.PI/10;
  this.wingL.rotation.x = 2 + Math.sin(t - Math.PI/2)*Math.PI/6*amp;
  this.wingR.rotation.x = 2 + Math.sin(t - Math.PI/2)*Math.PI/6*amp;
}

function BirdFly(){
  for(var i=0; i<birdsNumber; i++){
    birds[i].obj.fly();
  }
}

BirdObj = function(){
  this.angle=0;
  this.position = 0;
  this.trigger = false;
  this.obj = new Bird;
}

function createbirds(){
  for(var i=0; i<birdsNumber; i++){
    birds[i] = new BirdObj();
    birds[i].obj.mesh.scale.set(0.8,0.8,0.8);
    birds[i].angle = i * Math.PI/4 + Math.random() * Math.PI/45;
    scene.add(birds[i].obj.mesh);
  }
}

Element = function(){
  this.angle = 0;
  this.position = 0;
  this.type = randomN();
  this.trigger = false;
  this.obj = randomElement(this.type)
}

function randomElement(num){
  if (num == 3){
    return new Apple;
  }
  else if (num == 2){
    return new Banana; 
  }
  else {
    return new Palm;
  }
}

function randomN(){
  var rnd = parseInt(Math.random()*10000);
  if ((rnd % 7) == 0){
    return 3;
  }
  else if ((rnd % 3) == 0){
    return 2;
  }
  else{
    return 1;
  }
}

function createElements(){
  for(var i=0; i<elementsNumber; i++){
    elements[i] = new Element();
    elements[i].angle = i * Math.PI/15 + Math.random() * Math.PI/90;
    touched[i] = false;
    updown[i] = false;
    scene.add(elements[i].obj.mesh);
  }
}

function fruitsFly(){
  for(var i=0; i<elementsNumber; i++){
    if(elements[i].type == 2){
      elements[i].obj.fly(i);
    }
  }
}

function loop(){
  delta = clock.getDelta();
  updateRotation();
  if (gameStatus == "play"){
    if (monkey.status == "running"){
      monkey.run();
    }
    if (monkey.status == "jumping"){
      monkey.jump();
    }
    BirdFly();
    fruitsFly();
    updateDistance();
    updateElementsPosition();
    updatebirdsPosition();
    checkCollision();
  }  
  render();
  requestAnimationFrame(loop);
}

function updateRotation(){
  floorR += delta*.02 * speed;
  floorR = floorR%(Math.PI*2);
  floorR = floorR;
  floor.rotation.z = floorR;
}

function updateDistance(){
  if (ctCount<0)
    distance += delta*speed;
  var d;
  d = distance/2;
  fieldDistance.innerHTML = Math.floor(d);
  fieldLives.innerHTML = lives;
}

function updateElementsPosition(){
  for(var i=0; i<elementsNumber; i++){
    old[i] = elements[i].position;
    elements[i].position = (floorR + elements[i].angle)%(Math.PI*2);
    if(elements[i].position > Math.PI/4 && elements[i].position < Math.PI/2){
      elements[i].trigger = false;
    }
    if(elements[i].position < old[i] && elements[i].trigger == false){
      scene.remove(elements[i].obj.mesh);
      elements[i].type = randomN();
      elements[i].obj = randomElement(elements[i].type);
      elements[i].angle = i * Math.PI/15 + Math.random() * Math.PI/90;
      touched[i]=false;
      elements[i].trigger = true;
      elements[i].obj.mesh.rotation.z = elements[i].position - Math.PI/2;
      elements[i].obj.mesh.position.y = -floorRadius + Math.sin(elements[i].position) * (floorRadius + 15);
      elements[i].obj.mesh.position.x = Math.cos(elements[i].position) * (floorRadius + 15);
      scene.add(elements[i].obj.mesh);
    }
    else{
      elements[i].obj.mesh.rotation.z = elements[i].position - Math.PI/2;
      elements[i].obj.mesh.position.y = -floorRadius + Math.sin(elements[i].position) * (floorRadius + 15);
      elements[i].obj.mesh.position.x = Math.cos(elements[i].position) * (floorRadius + 15);
    }
  }
}

function updatebirdsPosition(){
  for(var i=0; i<birdsNumber; i++){
    old[i] = birds[i].position;
    birds[i].position = (floorR + birds[i].angle)%(Math.PI*2);
    if(birds[i].position > Math.PI/4 && birds[i].position < Math.PI/2){
      birds[i].trigger = false;
    }
    if(birds[i].position < old[i] && birds[i].trigger == false){
      birds[i].angle = i * Math.PI/4 + Math.random() * Math.PI/45;
      birds[i].trigger = true;
      birds[i].obj.mesh.rotation.z = birds[i].position - Math.PI/2;
      birds[i].obj.mesh.position.y = -floorRadius + Math.sin(birds[i].position) * (floorRadius + 90);
      birds[i].obj.mesh.position.x = Math.cos(birds[i].position) * (floorRadius + 15);
    }
    else{
      birds[i].obj.mesh.rotation.z = birds[i].position - Math.PI/2;
      birds[i].obj.mesh.position.y = -floorRadius + Math.sin(birds[i].position) * (floorRadius + 90);
      birds[i].obj.mesh.position.x = Math.cos(birds[i].position) * (floorRadius + 15);
    }
  }
}

function checkCollision(){
  if(ctCount < 0){
    var dm;
    var correctionX=10;
    var correctionY=20;
    for(var i=0; i<elementsNumber; i++){
      dm = monkey.mesh.position.clone().sub(elements[i].obj.mesh.position.clone());
      if(elements[i].type==3 && !touched[i]){
        dm.y-=2*correctionY;
        dm.x+=2*correctionX;
        if(dm.length() < 15){
          console.log("apple");
          scene.remove(elements[i].obj.mesh);
          touched[i]=true;
          lives+=1;
        }
      }
      else if(elements[i].type==2 && !touched[i]){
        dm.y-=correctionY;
        dm.x+=correctionX;      
        if(dm.length() < 15){
          console.log("banana");
          scene.remove(elements[i].obj.mesh);
          touched[i]=true;
          distance+=100;
          speed-=.1;
        }
      }
      else if(elements[i].type==1 && !touched[i]){
        dm.y+=5;
        if(dm.length() < 15){
          touched[i]=true;
          if (lives>0){
            lives-=1;
          }
          else{
            gameOver();
          }          
        }
      }
    }
  }
}

function gameOver(){
  fieldGameOver.className = "show";
  fieldRecord.className = "show";
  fieldRecordValue.innerHTML = Math.floor(distance/2);
  fieldRecordValue.className = "show";
  fieldRestart.className = "show";
  gameStatus = "gameOver";
  document.addEventListener('mousedown', resetGame);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startTimer () {
  setTimeout(updateCountdown,1000);
}

function updateCountdown(){  
  if (ctCount<=-1) return;
  else if(ctCount==0){
    fieldCountdown.className = "Notshow";
    ctCount-=1;
  }
  else{    
    ctCount-=1;
    if(ctCount==0) fieldCountdown.innerHTML = "GO!";
    else fieldCountdown.innerHTML = ctCount;
    startTimer();
  }
}

function render(){
  if(vista){
    monkey.body.rotation.y = 0;
    renderer.render(scene, camera);
  }
  else{
    monkey.body.rotation.y = -0.3;
    renderer.render(scene, camera2);
  }
}

window.addEventListener('load', init, false);

function init(event){
  fieldButtonStart.onclick = function(){
    fieldDist.className = "show";
    fieldLife.className = "show";
    fieldInstruction.className = "Notshow";
    fieldWelcomeMessage.className = "Notshow";
    fieldButtonStart.className = "Notshow";
    fieldPicture.className = "Notshow";
    fieldButtonStart.disabled = true;
    StartGame();
  };
}

function StartGame(){
  initScreenAnd3D();
  createLights();
  createFloor()
  createMonkey();
  createElements();
  createbirds();
  resetGame();
  loop();
}

function resetGame(){
  fieldGameOver.className = "Notshow";
  fieldRecord.className = "Notshow";
  fieldRecordValue.className = "Notshow";
  fieldRestart.className = "Notshow";
  ctCount=5;
  fieldCountdown.innerHTML = ctCount;
  fieldCountdown.className = "show";
  scene.add(monkey.mesh);
  monkey.mesh.rotation.y = Math.PI/2 + 0.3;
  monkey.mesh.position.x = -70;
  monkey.mesh.position.y = -3;
  speed = initSpeed;
  level = 0;
  distance = 0;
  lives=0;
  gameStatus = "play";
  monkey.status = "running";
  updateLevel();
  levelInterval = setInterval(updateLevel, levelUpdateFreq);
  console.log("resetGame");
  document.removeEventListener('mousedown', resetGame);  
  startTimer();
}

function updateLevel(){
  if (speed >= maxSpeed) return;
  level++;
  speed += 0.5;
}