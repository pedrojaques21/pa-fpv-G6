import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, TetrahedronGeometry, MeshStandardMaterial, Color, Mesh, Float32BufferAttribute, GridHelper, AmbientLight, PointLight, PointLightHelper, DirectionalLight, DirectionalLightHelper, SpotLight, SpotLightHelper, Clock, TextureLoader } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * Sets up the scene with a camera, renderer, and controls.
 * @returns {Object} An object containing the scene, camera, renderer, and controls.
 */
function setupScene() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer({ canvas: document.querySelector('#gl-canvas') });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(800, 600);

  camera.position.y = 0;
  camera.position.z = 5;

  const controls = new PointerLockControls(camera, renderer.domElement);

  
  const backgroundColor = 0xffffff;
  scene.background = new Color(backgroundColor);

  return { scene, camera, renderer, controls };
}

/**
 * Initializes the scene, camera, renderer, controls, clock, and event listeners.
 */
const { scene, camera, renderer, controls } = setupScene();
const clock = new Clock();

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
  controls.lock();
}, false);

const keyState = {};

/**
 * Handles the keydown event and updates the key state.
 * @param {KeyboardEvent} event - The keydown event.
 */
function handleKeyDown(event) {
  keyState[event.key] = true;
}

/**
 * Handles the keyup event and updates the key state.
 * @param {KeyboardEvent} event - The keyup event.
 */
function handleKeyUp(event) {
  keyState[event.key] = false;
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

/**
 * Processes the keyboard input based on the current key state.
 * @param {number} delta - The time delta since the last frame.
 */
function processKeyboard(delta) {
  const speed = 5;
  const actualSpeed = speed * delta;

  if (keyState['w']) {
    controls.moveForward(actualSpeed);
  }
  if (keyState['s']) {
    controls.moveForward(-actualSpeed);
  }
  if (keyState['a']) {
    controls.moveRight(-actualSpeed);
  }
  if (keyState['d']) {
    controls.moveRight(actualSpeed);
  }
  if (keyState['e']) {
    controls.getObject().position.y += actualSpeed;
  }
  if (keyState['q']) {
    controls.getObject().position.y -= actualSpeed;
  }
}

/**
 * Creates a cube mesh with random size and color.
 * @returns {Mesh} The created cube mesh.
 */
function createCube() {
  const cubeSize = Math.random() * 0.4 + 0.1;
  const geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize, 1, 1, 1);
  const material = new MeshStandardMaterial({ vertexColors: true });
  const colors = [];

  for (let i = 0; i < 6; i++) {
    const color = new Color();
    color.setRGB(Math.random(), Math.random(), Math.random());

    // Assign the same color to all vertices of the current face
    for (let j = 0; j < 4; j++) {
      colors.push(color.r, color.g, color.b);
    }
  }

  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  return new Mesh(geometry, material);
}

/**
 * Creates a pyramid mesh with random size and color.
 * @returns {Mesh} The created pyramid mesh.
 */
function createPyramid() {
  const pyramidSize = Math.random() * 0.4 + 0.1;
  const geometry = new TetrahedronGeometry(pyramidSize, 0);
  const material = new MeshStandardMaterial({ vertexColors: true });
  const colors = [];

  for (let i = 0; i < 6; i++) {
    const color = new Color();
    color.setRGB(Math.random(), Math.random(), Math.random());

    // Assign the same color to all vertices of the current face
    for (let j = 0; j < 4; j++) {
      colors.push(color.r, color.g, color.b);
    }
  }

  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  return new Mesh(geometry, material);
}

const objectsCount = Math.floor(Math.random() * 26) + 5;
console.log(objectsCount);

const meshes = [];

async function createObj() {
  const randomX = Math.random() * 20 - 10;
  const randomY = Math.random() * 2 - 1;
  const randomZ = Math.random() * 20 - 10;
  const loader = new OBJLoader();
  const modelPath = './models/Astronaut.obj';
  const modelTexturePath = './models/Astronaut.png';

  try {
    const object = await new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        resolve,
        undefined,
        reject
      );
    });

    var texture = new TextureLoader().load(modelTexturePath);
    object.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.map = texture;
        child.geometry.computeVertexNormals();
      }
    });

    object.position.set(randomX, randomY, randomZ);
    scene.add(object);
    meshes.push(object);
  } catch (error) {
    console.error(`Failed to load model at '${modelPath}':`, error);
  }
}


/**
 * Creates a specified number of random objects and adds them to the scene.
 */
async function createRandomObjects() {
  
  for (let i = 0; i < objectsCount; i++) {
    const randomX = Math.random() * 20 - 10;
    const randomY = Math.random() * 2 - 1;
    const randomZ = Math.random() * 20 - 10;
  
    let randomShape;
    if (Math.random() < 0.3) {
      createObj();
    } else {
      randomShape = Math.random() < 0.5 ? createCube() : createPyramid();
      randomShape.position.set(randomX, randomY, randomZ);
      scene.add(randomShape);
      meshes.push(randomShape);
    }
  
  }
  
}

createRandomObjects();

const gridHelper = new GridHelper(200, 50);
scene.add(gridHelper);

const lightTypeSelect = document.getElementById('lightTypeSelect');
const lightPosXInput = document.getElementById('lightPosXInput');
const lightPosYInput = document.getElementById('lightPosYInput');
const lightPosZInput = document.getElementById('lightPosZInput');
const colorRInput = document.getElementById('colorRInput');
const colorGInput = document.getElementById('colorGInput');
const colorBInput = document.getElementById('colorBInput');

let light;
let lightHelper;

lightTypeSelect.addEventListener('change', updateLightType);
lightPosXInput.addEventListener('input', updateLightPosition);
lightPosYInput.addEventListener('input', updateLightPosition);
lightPosZInput.addEventListener('input', updateLightPosition);
colorRInput.addEventListener('input', updateLightColor);
colorGInput.addEventListener('input', updateLightColor);
colorBInput.addEventListener('input', updateLightColor);

/**
 * Updates the light type based on the selected option and updates its position and color.
 */
function updateLightType() {
  const lightType = lightTypeSelect.value;

  // Remove the existing light if there is one
  if (light) {
    scene.remove(light, lightHelper);
  }

  // Create a new light based on the selected type
  if (lightType === 'ambient') {
    light = new AmbientLight(0xffffff);
  } else if (lightType === 'point') {
    light = new PointLight(0xffffff);
    lightHelper = new PointLightHelper(light);
  } else if (lightType === 'directional') {
    light = new DirectionalLight(0xffffff);
    lightHelper = new DirectionalLightHelper(light);
  } else if (lightType === 'spot') {
    light = new SpotLight(0xffffff);
    lightHelper = new SpotLightHelper(light);
  } else if (lightType === 'none') {
    scene.remove(light, lightHelper);
  }

  // Set the light position based on the current input field values
  light.position.set(
    parseFloat(lightPosXInput.value),
    parseFloat(lightPosYInput.value),
    parseFloat(lightPosZInput.value)
  );

  // Add the light to the scene
  scene.add(light, lightHelper);
}

/**
 * Updates the light position based on the input field values.
 */
function updateLightPosition() {
  if (light) {
    light.position.set(
      parseFloat(lightPosXInput.value),
      parseFloat(lightPosYInput.value),
      parseFloat(lightPosZInput.value)
    );
  }
}

/**
 * Updates the light color based on the input field values.
 */
function updateLightColor() {
  const r = parseFloat(colorRInput.value) / 255;
  const g = parseFloat(colorGInput.value) / 255;
  const b = parseFloat(colorBInput.value) / 255;

  const color = new Color(r, g, b);
  light.color = color;
}

/**
 * Animates the random rotation of the meshes.
 */
function animateRandomRotation() {
  for (const mesh of meshes) {
    const randomSpeedX = (Math.random() - 0.5) * 0.1;
    const randomSpeedY = (Math.random() - 0.5) * 0.1;
    const randomSpeedZ = (Math.random() - 0.5) * 0.1;

    /**
     * Updates the rotation of the mesh based on the random speeds.
     */
    function update() {
      mesh.rotation.x += randomSpeedX;
      mesh.rotation.y += randomSpeedY;
      mesh.rotation.z += randomSpeedZ;
    }

    animateFunctions.push(update);
  }
}

const animateFunctions = [];

/**
 * The animation loop.
 */
function animate() {
  requestAnimationFrame(animate);

  for (const animateFunction of animateFunctions) {
    animateFunction();
  }
  let delta = clock.getDelta();
  processKeyboard(delta);

  renderer.render(scene, camera);
}

animateRandomRotation();
animate();