import {vec3, quat} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals'; //From Piazza for obj reader

import Turtle from './Turtle'; 
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';
import Mesh from './geometry/Mesh';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;
// my stuff
let obj0: string;
let myGeom: Mesh;

// LSystem setup for hw4
let myExpansionRules: ExpansionRule = new ExpansionRule();
let myDrawingRules: DrawingRule = new DrawingRule();
let grammar: string[] = [];
// some test strings
grammar.push("AB");
let myTurtle: Turtle = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), quat.create(), 1.0, 0.0);
let iterations: number = 1;
let turtleStack: Turtle[] = [];
// arrays for the branches to be used for instance rendering
let turtleOffsetsArray: number[] = [];
let turtleColorsArray:number[] = [];
let branchCounter: number = 0;

//set which symbols become which other symbols
// symbol1, probability, maps to symbol2
myExpansionRules.addExpansionRule('[', 1.0, '[');
myExpansionRules.addExpansionRule(']', 1.0, ']');
myExpansionRules.addExpansionRule('+', 1.0, '+');
myExpansionRules.addExpansionRule('-', 1.0, '-');
myExpansionRules.addExpansionRule('A', 1.0, 'AB');
myExpansionRules.addExpansionRule('B', 1.0, '[+A][-A]');

// map chars to drawing rules to move/rot the turtle: [,],A,B,+,-,*
// symbol1, probability, corresponding rule
myDrawingRules.addDrawingRule('A', 1.0, function(){ myTurtle.turtleMoveForward(vec3.fromValues(1.0, 1.0, 0.0))} );
myDrawingRules.addDrawingRule('B', 1.0, function(){ myTurtle.turtleMoveForward(vec3.fromValues(1.0, 1.0, 0.0))} );
myDrawingRules.addDrawingRule('+', 1.0, function(){ myTurtle.turtleRotateZ(10.0)});
myDrawingRules.addDrawingRule('-', 1.0, function(){ myTurtle.turtleRotateZ(-10.0)} );
// push a copy of the turtle to preserve current state
myDrawingRules.addDrawingRule('[', 1.0, function(){ turtleStack.push(myTurtle.copy());  console.log("save turtle state on stack");});
myDrawingRules.addDrawingRule(']', 1.0, function(){ myTurtle = turtleStack.pop();  console.log("update Turtle state to popped turtle");});

// expand the string based on the predefined rules
function expandString(): void{
  var expandedStringArray: string[] = [];
  
  for(let i = 0; i < grammar.length; i ++){
      var stringToExpand = grammar[i];
      for(let j = 0; j < stringToExpand.length; j++){
          var c = stringToExpand.charAt(j);
          let otherString = myExpansionRules.getExpansion(c);
          expandedStringArray.push(otherString);
      } 
  }

  grammar = expandedStringArray;
}

// iterate through string for however iterations to expand grammar
for(let i = 0; i < iterations; i++){
    expandString();
    console.log("iterations " + i + " = " + grammar);
}

// actually moves the turtle, according to the grammar string, to draw the Lsytem
function createLSystem(): void{
  // loop through the string to get each char to find what movement should be done
  for(let i = 0; i < grammar.length; i ++){
    var stringToExpand = grammar[i];
    for(let j = 0; j < stringToExpand.length; j++){
      var c = stringToExpand.charAt(j);
      let drawFunc = myDrawingRules.getDrawingRule(c);

    // execute whatever function is called to move the turtle
    drawFunc();
    /*
     let x:number = drawFunc();
      // TODO:  after moveForward (which should draw a new Turtle) is called the turtle will have a new state (ie, pos/orientation)
      if(x == 2){ // the moveForward function was called
        console.log("PUSH TURTLE INFO TO VBO ARRAY")
         // turtleOffsetsArray.push(myTurtle.pos[0]); // x value
         // turtleOffsetsArray.push(myTurtle.pos[1]); // y value
         // turtleOffsetsArray.push(myTurtle.pos[2]); // z value
         // branchCounter++; // keep track of how many branches to draw
         // also update color vec somewhere, rbga
          // turtleColorsArray.push(); //x4
      }
      */
    
    }
  }
}


function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  //call func to iterate through final expanded string to move turtle to draw the Lsystem
 createLSystem(); // after this call the instance vbo array will be ready to be passed

  // create my shape
 //obj0 = readTextFile('./src/testSquare.obj');
 obj0 = readTextFile('./src/wahoo.obj');
 myGeom = new Mesh(obj0, vec3.fromValues(0.0, 0.0, 5.0)); // call mesh create to set up vbo data
 myGeom.create();
 //console.log(myGeom); // for test printing
// send instance info to Shader
  // let offsetsT: Float32Array = new Float32Array(turtleOffsetsArray);
  // let colorsT: Float32Array = new Float32Array(turtleColorsArray);
  // myGeom.setInstanceVBOs(offsetsT, colorsT); // copied this method in mesh.ts from square.ts
  // myGeom.setNumInstances(branchCounter); //this method already exists in drawable,  how many branches need to be drawn

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  let offsetsArray = [];
  let colorsArray = [];
  // let n: number = 100.0;
  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     offsetsArray.push(i);
  //     offsetsArray.push(j);
  //     offsetsArray.push(0);

  //     colorsArray.push(i / n);
  //     colorsArray.push(j / n);
  //     colorsArray.push(1.0);
  //     colorsArray.push(1.0); // Alpha channel
  //   }
  // }
  // for testing
  let n: number = 5.0;
  for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
      offsetsArray.push(i);
      offsetsArray.push(j);
      offsetsArray.push(0);

      colorsArray.push(1.0); // r
      colorsArray.push(1.0); // g
      colorsArray.push(1.0); // b
      colorsArray.push(1.0); // Alpha channel

    }
  }

  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  square.setInstanceVBOs(offsets, colors);
  square.setNumInstances(n * n); // grid of "particles"

  console.log(square);
  console.log(myGeom);


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

  // testing for hw4
  //const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));
  const camera = new Camera(vec3.fromValues(10, 10, -10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND); // for testing
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
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      square,// myGeom, // myGeom commented out for testing square instancing
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
