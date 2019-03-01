import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as Loader from 'webgl-obj-loader';

class Mesh extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  uvs: Float32Array;
  center: vec4;
  offsets: Float32Array; // Data for bufTranslate, added for InstanceVBO stuff

  transC1: Float32Array;
  transC2: Float32Array;
  transC3: Float32Array;
  transC4: Float32Array;

  objString: string;

  constructor(objString: string, center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);

    this.objString = objString;
  }

  create() {  
    let posTemp: Array<number> = [];
    let norTemp: Array<number> = [];
    let uvsTemp: Array<number> = [];
    let idxTemp: Array<number> = [];

    //objString is the content of the obj file (not the file path)
    var loadedMesh = new Loader.Mesh(this.objString);

    //posTemp = loadedMesh.vertices;
    for (var i = 0; i < loadedMesh.vertices.length; i++) {
      posTemp.push(loadedMesh.vertices[i]);
      if (i % 3 == 2) posTemp.push(1.0);
    }

    for (var i = 0; i < loadedMesh.vertexNormals.length; i++) {
      norTemp.push(loadedMesh.vertexNormals[i]);
      if (i % 3 == 2) norTemp.push(0.0);
    }

    uvsTemp = loadedMesh.textures;
    idxTemp = loadedMesh.indices;

    // white vert color for now
    this.colors = new Float32Array(posTemp.length);
    for (var i = 0; i < posTemp.length; ++i){
      this.colors[i] = 1.0;
    }

    this.indices = new Uint32Array(idxTemp);
    this.normals = new Float32Array(norTemp);
    this.positions = new Float32Array(posTemp);
    this.uvs = new Float32Array(uvsTemp);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateUV();
    this.generateCol();

    this.generateTransformC1();
    this.generateTransformC2();
    this.generateTransformC3();
    this.generateTransformC4();

    this.count = this.indices.length;
    this.numInstances = 1;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

    console.log(`Created Mesh from OBJ`);
    this.objString = ""; // hacky clear
  }

// modified method to include columns
setInstanceVBOs(inC1: Float32Array, inC2: Float32Array, inC3: Float32Array, inC4: Float32Array, inColors: Float32Array) {

  this.transC1 = inC1;
  this.transC2 = inC2;
  this.transC3 = inC3;
  this.transC4 = inC4;
  this.colors = inColors;
  //this.offsets = inOffsets;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
  gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
  
  // Added
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC1);
  gl.bufferData(gl.ARRAY_BUFFER, this.transC1, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC2);
  gl.bufferData(gl.ARRAY_BUFFER, this.transC2, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC3);
  gl.bufferData(gl.ARRAY_BUFFER, this.transC3, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC4);
  gl.bufferData(gl.ARRAY_BUFFER, this.transC4, gl.STATIC_DRAW);
}

};

export default Mesh;
