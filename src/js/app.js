import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  TetrahedronGeometry,
  MeshStandardMaterial,
  Color,
  Mesh,
  Float32BufferAttribute,
  GridHelper,
  AmbientLight,
  PointLight,
  PointLightHelper,
  DirectionalLight,
  DirectionalLightHelper,
  SpotLight,
  SpotLightHelper,
  Clock,
  TextureLoader,
  DoubleSide,
  BackSide,
  AxesHelper,
} from "three";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/**
 * Initializes the scene, camera, renderer, controls, clock, and event listeners.
 */
const { scene, camera, renderer, controls } = setupScene();

// Grid helper
const gridHelper = new GridHelper(200, 50);
scene.add(gridHelper);

// Axes helper
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

// Start button
const startButton = document.getElementById("startButton");
startButton.addEventListener(
  "click",
  function () {
    controls.lock();
  },
  false
);

// Event listeners
const keyState = {};
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Object creation
const objectsCount = Math.floor(Math.random() * 26) + 5;
const meshes = [];
const meshObj = [];
createRandomObjects();

// Light setup
const lightTypeSelect = document.getElementById("lightTypeSelect");
const lightPosXInput = document.getElementById("lightPosXInput");
const lightPosYInput = document.getElementById("lightPosYInput");
const lightPosZInput = document.getElementById("lightPosZInput");
const colorRInput = document.getElementById("colorRInput");
const colorGInput = document.getElementById("colorGInput");
const colorBInput = document.getElementById("colorBInput");

// Light variables
let light;
let lightHelper;

// Event listeners for light controls
lightTypeSelect.addEventListener("change", updateLightType);
lightPosXInput.addEventListener("input", updateLightPosition);
lightPosYInput.addEventListener("input", updateLightPosition);
lightPosZInput.addEventListener("input", updateLightPosition);
colorRInput.addEventListener("input", updateLightColor);
colorGInput.addEventListener("input", updateLightColor);
colorBInput.addEventListener("input", updateLightColor);

// Animation
const clock = new Clock();

const animateFunctions = [];

animateRandomRotation();

animate();

//***********************************************************
//*                      FUNCTIONS                          *
//***********************************************************

/**
 * Sets up the scene with a camera, renderer, and controls.
 * @returns {Object} An object containing the scene, camera, renderer, and controls.
 */
function setupScene() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  const renderer = new WebGLRenderer({
    canvas: document.querySelector("#gl-canvas"),
    antialias: true,
  }); // realism by smoothing jagged edges on curved lines and diagonals
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(800, 600);

  camera.position.y = 10;
  camera.position.x = 10;
  camera.position.z = 10;

  const controls = new PointerLockControls(camera, renderer.domElement);

  const backgroundColor = 0x101018;
  scene.background = new Color(backgroundColor);

  return { scene, camera, renderer, controls };
}

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

/**
 * Processes the keyboard input based on the current key state.
 * @param {number} delta - The time delta since the last frame.
 */
function processKeyboard(delta) {
  const speed = 5;
  const actualSpeed = speed * delta;

  if (keyState["w"]) {
    controls.moveForward(actualSpeed);
  }
  if (keyState["s"]) {
    controls.moveForward(-actualSpeed);
  }
  if (keyState["a"]) {
    controls.moveRight(-actualSpeed);
  }
  if (keyState["d"]) {
    controls.moveRight(actualSpeed);
  }
  if (keyState["e"]) {
    controls.getObject().position.y += actualSpeed;
  }
  if (keyState["q"]) {
    controls.getObject().position.y -= actualSpeed;
  }
}

/**
 * Creates a cube mesh with random size and color.
 * @returns {Mesh} The created cube mesh.
 */
function createCube() {
  const bricks = "./textures/brick_roughness.jpg";
  const negy = "./textures/negy.jpg";
  const disturb = "./textures/disturb.jpg";
  const floor = "./textures/FloorsCheckerboard_S_Diffuse.jpg";

  const cubeSize = Math.random() * 0.4 + 0.1;
  const geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize).toNonIndexed();

  const cubeHasTexture = Math.random() < 0.5 ? true : false; // 50% chance of a texture

  if (!cubeHasTexture) {
    // Colored cube
    const cubeMaterial = new MeshStandardMaterial({ vertexColors: true });
    const colors = [];

    const positionAttribute = geometry.getAttribute("position");
    for (let i = 0; i < positionAttribute.count; i += 3) {
      const color = new Color(Math.random() * 0xffffff);

      // Assign the same color to all vertices of the current face
      colors.push(
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b
      );
    }
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    const coloredCube = new Mesh(geometry, cubeMaterial);
    return coloredCube;
  } else {
    // Textured cube
    const textureLoader = new TextureLoader();
    const cubeMaterial = [
      new MeshStandardMaterial({
        map: textureLoader.load(bricks),
        side: DoubleSide,
      }), //right
      new MeshStandardMaterial({
        map: textureLoader.load(bricks),
        side: DoubleSide,
      }), //left
      new MeshStandardMaterial({
        map: textureLoader.load(bricks),
        side: DoubleSide,
      }), //top
      new MeshStandardMaterial({
        map: textureLoader.load(floor),
        side: DoubleSide,
      }), //bottom
      new MeshStandardMaterial({
        map: textureLoader.load(negy),
        side: BackSide,
      }), //front
      new MeshStandardMaterial({
        map: textureLoader.load(disturb),
        side: DoubleSide,
      }), //back
    ];
    const texturedCube = new Mesh(geometry, cubeMaterial);
    return texturedCube;
  }
}

/**
 * Creates a pyramid mesh with random size and color.
 * @returns {Mesh} The created pyramid mesh.
 */
function createPyramid() {
  const lava = "./textures/lavatile.jpg";

  const pyramidSize = Math.random() * 0.4 + 0.1;
  const geometry = new TetrahedronGeometry(pyramidSize, 0).toNonIndexed();

  const pyramidHasTexture = Math.random() < 0.5 ? true : false; // 50% chance of a texture

  if (!pyramidHasTexture) {
    // Colored pyramid
    const pyramidMaterial = new MeshStandardMaterial({ vertexColors: true });
    const colors = [];

    const positionAttribute = geometry.getAttribute("position");
    for (let i = 0; i < positionAttribute.count; i += 3) {
      const color = new Color(Math.random() * 0xffffff);

      colors.push(
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b,
        color.r,
        color.g,
        color.b
      );
    }
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    const coloredPyramid = new Mesh(geometry, pyramidMaterial);
    return coloredPyramid;
  } else {
    // Textured pyramid
    const pyramidMaterial = new MeshStandardMaterial({
      map: new TextureLoader().load(lava),
    });
    const texturedPyramid = new Mesh(geometry, pyramidMaterial);
    return texturedPyramid;
  }
}

/**
 * Generates random model and texture paths for a 3D object.
 * @returns {Array<string>} An array containing the model path and the texture path.
 */
function randomObj() {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  let modelPath;
  let modelTexturePath;

  switch (randomNumber) {
    case 1:
      modelPath = "./models/Astronaut.obj";
      modelTexturePath = "./models/Astronaut.png";
      break;
    case 2:
      modelPath = "./models/bird.obj";
      modelTexturePath = "./models/bird.jpg";
      break;
    case 3:
      modelPath = "./models/cat.obj";
      modelTexturePath = "./models/cat_texture.png";
      break;
    case 4:
      modelPath = "./models/pig.obj";
      modelTexturePath = "./models/pig.png";
      break;
    case 5:
      modelPath = "./models/tiger.obj";
      modelTexturePath = "./models/tiger_texture.jpg";
      break;
    default:
      // Handle any unexpected random number here
      modelPath = "./models/default.obj";
      modelTexturePath = "./models/default.jpg";
      break;
  }

  return [modelPath, modelTexturePath];
}


/**
 * Asynchronously creates a 3D object from an OBJ file and applies a texture to it.
 * @returns {Promise<THREE.Object3D>} A promise that resolves with the loaded object if successful.
 * @throws {Error} If the model fails to load.
 */
async function createObj() {
  const loader = new OBJLoader();
  const [modelPath, modelTexturePath] = randomObj();
  const parts = modelPath.split("/");
  const filename = parts[parts.length - 1];
  const name = filename.split(".")[0];

  try {
    const object = await new Promise((resolve, reject) => {
      /**
       * Loads the OBJ model.
       * @param {string} modelPath - The path to the OBJ model file.
       * @param {Function} resolve - The function to call when the model is successfully loaded.
       * @param {Function} reject - The function to call if there's an error loading the model.
       */
      loader.load(modelPath, resolve, undefined, reject);
    });

    var texture = new TextureLoader().load(modelTexturePath);
    object.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.map = texture;
        child.geometry.computeVertexNormals();
      }
    });

    if (name === "Astronaut") {
      const size = 0.3;
      object.scale.set(size, size, size);
    } else if (name === "tiger") {
      const size = 0.0004;
      object.scale.set(size, size, size);
    } else if (name === "cat" || name === "bird" || name === "pig") {
      const size = 0.004;
      object.scale.set(size, size, size);
    }
    
    return object;
  } catch (error) {
    console.error(`Failed to load model at '${modelPath}':`, error);
    throw error;
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
    let randomObj;
    if (Math.random() < 0.3) {
      randomObj = createObj();
      randomObj.then((myObj) => {
        myObj.position.set(randomX, randomY, randomZ);
        scene.add(myObj);
        meshObj.push(myObj);
        animateRandomRotationObj();
      });
    } else {
      randomShape = Math.random() < 0.5 ? createCube() : createPyramid();
      randomShape.position.set(randomX, randomY, randomZ);
      scene.add(randomShape);
      meshes.push(randomShape);
    }
  }
}

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
  if (lightType === "ambient") {
    light = new AmbientLight(0xffffff);
  } else if (lightType === "point") {
    light = new PointLight(0xffffff);
    lightHelper = new PointLightHelper(light);
  } else if (lightType === "directional") {
    light = new DirectionalLight(0xffffff);
    lightHelper = new DirectionalLightHelper(light);
  } else if (lightType === "spot") {
    light = new SpotLight(0xffffff);
    lightHelper = new SpotLightHelper(light);
  } else if (lightType === "none") {
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

/**
 * Animates the random rotation of the 3d Objects.
 */
function animateRandomRotationObj() {
  for (const mesh of meshObj) {
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
