import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
camera.position.setZ(20);

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
    geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    material = new THREE.MeshStandardMaterial({
      color: getRandomColor(),
      
    });
    console.log('cube');
  } else if (randomShape === 'pyramid') {
    const pyramidSize = Math.random() * 0.4 + 0.1;
    geometry = new THREE.TetrahedronBufferGeometry(pyramidSize, 0); // radius and detail
    material = new THREE.MeshStandardMaterial({
      color: getRandomColor(),
    });
    console.log('pyramid');
  }

  const mesh = new THREE.Mesh(geometry, material);
  console.log('MESH: ' + mesh);
  mesh.position.set(randomX, randomY, randomZ);
  scene.add(mesh);
  meshes.push(mesh);
  console.log('MESH: ' + mesh);
}

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(8, 8, 8);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

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

  controls.update();

  renderer.render(scene, camera);
}

animateRandomRotation();
animate();
