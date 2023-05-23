import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#gl-canvas'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(800, 600);

camera.position.y = 0;
camera.position.z = 5;

const startButton = document.getElementById('startButton');
startButton.addEventListener(
  'click',
  function () {
    controls.lock()
  },
  false
)

const controls = new PointerLockControls(camera, renderer.domElement)
const clock = new THREE.Clock();

const keyBoard = [];
addEventListener('keydown', (e) => {
  keyBoard[e.key] = true;
  console.log(keyBoard);
});

addEventListener('keyup', (e) => {
  keyBoard[e.key] = false;
});

function processKeyBoard(delta) {
  let speed = 5;
  let actualSpeed = speed * delta;
  if (keyBoard['w']) {
    controls.moveForward(actualSpeed);
  }
  if (keyBoard['s']) {
    controls.moveForward(-actualSpeed);
  }
  if (keyBoard['a']) {
    controls.moveRight(-actualSpeed);
  }
  if (keyBoard['d']) {
    controls.moveRight(actualSpeed);
  }
  if (keyBoard['e']) {
    controls.getObject().position.y += actualSpeed;
  }
  if (keyBoard['q']) {
    controls.getObject().position.y -= actualSpeed;
  }
}



var model_src = "modelos/tiger.obj";
var model_texture = "modelos/tiger_texture.jpg";
var model_data;


const loader = new OBJLoader();

loader.load(
  'modelos/bird.obj',
  (object) => {
    object.position.set(0, 0, -53);
    scene.add(object);
    renderer.render(scene, camera);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {

    console.log('An error happened: ' + error);

  }
);

const backgroundColor = 0xabcdef;

scene.background = new THREE.Color(backgroundColor);





const objectsCount = Math.floor(Math.random() * 26) + 5;
console.log(objectsCount);

const meshes = [];

for (let i = 0; i < objectsCount; i++) {
  console.log('Loop iteration:', i);
  const randomX = Math.random() * 20 - 10;
  const randomY = Math.random() * 2 - 1;
  const randomZ = Math.random() * 20 - 10;

  let geometry, material;
  const randomShape = Math.random() < 0.5 ? 'cube' : 'pyramid';

  if (randomShape === 'cube') {
    const cubeSize = Math.random() * 0.4 + 0.1;
    geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 1, 1, 1);
    const positionAttribute = geometry.getAttribute('position');

    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < positionAttribute.count; i += 4) {
      color.set(getRandomColor());

      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);

    }
    material = new THREE.MeshStandardMaterial({ vertexColors: true });
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  } else if (randomShape === 'pyramid') {
    const pyramidSize = Math.random() * 0.4 + 0.1;
    geometry = new THREE.TetrahedronBufferGeometry(pyramidSize, 0); // radius and detail
    const positionAttribute = geometry.getAttribute('position'); //->12 vertices / 4 faces = 3
    const colors = [];
    const color = new THREE.Color();
    console.log('vertices: ' + positionAttribute.count);
    for (let i = 0; i < positionAttribute.count; i += 3) {

      color.set(getRandomColor());

      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);

    }
    material = new THREE.MeshStandardMaterial({ vertexColors: true });
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(randomX, randomY, randomZ);
  scene.add(mesh);
  meshes.push(mesh);
}



const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(8, 8, 8);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);


function getRandomColor() {
  return Math.random() * 0xffffff;
}

function animateRandomRotation() {
  for (const mesh of meshes) {
    const randomSpeedX = (Math.random() - 0.5) * 0.1;
    const randomSpeedY = (Math.random() - 0.5) * 0.1;
    const randomSpeedZ = (Math.random() - 0.5) * 0.1;

    function update() {
      mesh.rotation.x += randomSpeedX;
      mesh.rotation.y += randomSpeedY;
      mesh.rotation.z += randomSpeedZ;
    }

    animateFunctions.push(update);
  }
}

const animateFunctions = [];

function animate() {
  requestAnimationFrame(animate);

  for (const animateFunction of animateFunctions) {
    animateFunction();
  }
  let delta = clock.getDelta();
  processKeyBoard(delta);

  renderer.render(scene, camera);
}

animateRandomRotation();
animate();
