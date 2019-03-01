import {vec3, vec4, mat4, quat} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import MySquare from './geometry/MySquare';
import MyIcosphere from './geometry/MyIcosphere';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import ExpansionRules from './LSystem/ExpansionRules'; // for LSystem
import LSystem from './LSystem/LSystem'; // for LSystem
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh'; // for obj loading

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
let colorVec: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
let guiIters: number = 1.0; // to keep track of slider value
let guiAngle: number = 10.0; // to keep track of slider value

const controls = {
  // Added
  iterations: 4.0,
  angle: 33.0,
  Leaf_R: 0.2627, // for coloring the leaves 
  Leaf_G: 0.5255, // 
  Leaf_B: 0.0902, //
  'UpdateColor' : createLSystem, 
};

let mySquare: MySquare;
let screenQuad: ScreenQuad;

// Icosphere
let icosphere: MyIcosphere;
let leaf: MyIcosphere;

// Mesh
let wahoo: Mesh; // plant pot
let time: number = 0.0;
let dirt: Mesh; // dirt for pot

// the branches
function createLSystem(): void{
  let myLSystem: LSystem = new LSystem(new ExpansionRules(), controls.angle);

  // arrays for VBP data
  let data = myLSystem.drawLSystemFunc(controls.iterations); // iterations from slider
  let colorsBranchArray = []; // array to hold colors for each instance
  let c1BranchArray = []; // column 1
  let c2BranchArray = []; // column 2
  let c3BranchArray = []; // column 3
  let c4BranchArray = []; // column 4

  for (let i = 0.0; i < data.length; i++) {
    let currData = data[i];
    let currTransform = currData.transform;

    // add column (mat4 is 4x4)
    // First column
    c1BranchArray.push(currTransform[0]);
    c1BranchArray.push(currTransform[1]);
    c1BranchArray.push(currTransform[2]);
    c1BranchArray.push(currTransform[3]);
    // second column
    c2BranchArray.push(currTransform[4]);
    c2BranchArray.push(currTransform[5]);
    c2BranchArray.push(currTransform[6]);
    c2BranchArray.push(currTransform[7]);
    // third column
    c3BranchArray.push(currTransform[8]);
    c3BranchArray.push(currTransform[9]);
    c3BranchArray.push(currTransform[10]);
    c3BranchArray.push(currTransform[11]);
    // fourth column
    c4BranchArray.push(currTransform[12]);
    c4BranchArray.push(currTransform[13]);
    c4BranchArray.push(currTransform[14]);
    c4BranchArray.push(currTransform[15]);
    // add colors for leaves
    if(currData.char == "*"){
      colorsBranchArray.push(controls.Leaf_R);
      colorsBranchArray.push(controls.Leaf_G);
      colorsBranchArray.push(controls.Leaf_B);
      colorsBranchArray.push(1.0);
    }
    // for unripe berries
    else if(currData.char == "L"){
      //vec3(0.4588, 0.8314, 0.5412) lightish green color
      colorsBranchArray.push(0.4588);
      colorsBranchArray.push(0.8314);
      colorsBranchArray.push(0.5412);
      colorsBranchArray.push(1.0);
    }
    // for blue berries
    else if(currData.char == "B"){
      //vec3(0.149, 0.4157, 0.7216) blue color
      colorsBranchArray.push(0.149);
      colorsBranchArray.push(0.4157);
      colorsBranchArray.push(0.75);
      colorsBranchArray.push(1.0);
    }
    else{
      // brown color vec3(0.2549, 0.1765, 0.1176)
    colorsBranchArray.push(0.2549); 
    colorsBranchArray.push(0.1765);
    colorsBranchArray.push(0.1176);
    colorsBranchArray.push(1.0);
    }
  }

  let c1BranchFinal: Float32Array = new Float32Array(c1BranchArray);
  let c2BranchFinal: Float32Array = new Float32Array(c2BranchArray);
  let c3BranchFinal: Float32Array = new Float32Array(c3BranchArray);
  let c4BranchFinal: Float32Array = new Float32Array(c4BranchArray);
  let branchColors: Float32Array = new Float32Array(colorsBranchArray);

  // set the instance VBOs
  icosphere.setInstanceVBOs(c1BranchFinal, c2BranchFinal, c3BranchFinal, c4BranchFinal, branchColors);
  icosphere.setNumInstances(data.length);

}

function loadScene() {
  mySquare = new MySquare();
  mySquare.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  // Icosphere branch shape
  icosphere = new MyIcosphere(vec3.fromValues(0.0, 0.0, 0.0), 1.0, 5);
  icosphere.create();
  // Icosphere leaf shape
  leaf = new MyIcosphere(vec3.fromValues(0.0, 0.0, 0.0), 1.0, 5);
  leaf.create();

  // mesh for the pot
  let obj0: string = readTextFile('./src/geometry/plantpot.obj');
  wahoo = new Mesh(obj0, vec3.fromValues(0.0, 0.0, 0.0));
  wahoo.create();
  // set up mesh VBOs for 1 instance
  let wahooColorsArray: number[] = [0.4784, 0.3176, 0.1294, 1.0]; //brownish
  let col1Array: number[] = [1, 0, 0, 0]; // scale x
  let col2Array: number[] = [0, 1, 0, 0]; // scale y
  let col3Array: number[] = [0, 0, 1, 0]; // scale z
  let col4Array: number[] = [0, -5.85, 0, 1]; // translation/displacement
  let col1: Float32Array = new Float32Array(col1Array);
  let col2: Float32Array = new Float32Array(col2Array);
  let col3: Float32Array = new Float32Array(col3Array);
  let col4: Float32Array = new Float32Array(col4Array);
  let colors: Float32Array = new Float32Array(wahooColorsArray);
  wahoo.setInstanceVBOs(col1, col2, col3, col4, colors);
  wahoo.setNumInstances(1);

   // mesh for the dirt
   let obj1: string = readTextFile('./src/geometry/dirt.obj');
   dirt= new Mesh(obj1, vec3.fromValues(0.0, 0.0, 0.0));
   dirt.create();
   // set up mesh VBOs for 1 instance
   let dirtColorsArray: number[] = [0.1608, 0.0902,0.0353, 1.0]; // dark brownish
   let dirt_col1Array: number[] = [7.85, 0, 0, 0]; // scale x
   let dirt_col2Array: number[] = [0, 3, 0, 0]; // scale y
   let dirt_col3Array: number[] = [0, 0, 7.85, 0]; // scale z
   let dirt_col4Array: number[] = [0, 0.35, 0, 1]; // translation/displacement
   let dirt_col1: Float32Array = new Float32Array(dirt_col1Array);
   let dirt_col2: Float32Array = new Float32Array(dirt_col2Array);
   let dirt_col3: Float32Array = new Float32Array(dirt_col3Array);
   let dirt_col4: Float32Array = new Float32Array(dirt_col4Array);
   let dirt_colors: Float32Array = new Float32Array(dirtColorsArray);
   dirt.setInstanceVBOs(dirt_col1, dirt_col2, dirt_col3, dirt_col4, dirt_colors);
   dirt.setNumInstances(1);
  
  // create LSystem
  createLSystem(); // call initial LSystem
 
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'iterations', 1.0, 5.0).step(1.0);
  gui.add(controls, 'angle', 0.0, 45.0).step(5.0);
  gui.add(controls, 'Leaf_R', 0.0, 1).step(.05); //  slider for color values
  gui.add(controls, 'Leaf_G', 0.0, 1).step(.05); // 
  gui.add(controls, 'Leaf_B', 0.0, 1).step(.05); //
  gui.add(controls, 'UpdateColor');
 
  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  if(controls.iterations - guiIters != 0){
    guiIters = controls.iterations;
    // redo LSystem
    createLSystem();
  }
  if(controls.angle - guiAngle != 0){
    guiAngle = controls.angle;
    // redro LSystem
    createLSystem();
  }

    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      //mySquare,    
      icosphere, // stem
      leaf,
      wahoo, // my plant
      dirt, // dirt for the top of the pot
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();