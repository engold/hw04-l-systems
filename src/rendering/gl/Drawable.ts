import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufTranslate: WebGLBuffer;
  bufCol: WebGLBuffer;
  bufUV: WebGLBuffer;

  // Added for HW 4
  // Buffers for the cols of transform matrix
  bufTransformC1: WebGLBuffer;
  bufTransformC2: WebGLBuffer;
  bufTransformC3: WebGLBuffer;
  bufTransformC4: WebGLBuffer;

  idxGenerated: boolean = false;
  posGenerated: boolean = false;
  norGenerated: boolean = false;
  colGenerated: boolean = false;
  translateGenerated: boolean = false;  
  uvGenerated: boolean = false;

  // Added for HW4
  transformC1Generated: boolean = false;
  transformC2Generated: boolean = false;
  transformC3Generated: boolean = false;
  transformC4Generated: boolean = false;

  numInstances: number = 0; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufTranslate);    
    gl.deleteBuffer(this.bufUV);
    // Added for HW4
    gl.deleteBuffer(this.bufTransformC1);
    gl.deleteBuffer(this.bufTransformC2);
    gl.deleteBuffer(this.bufTransformC3);
    gl.deleteBuffer(this.bufTransformC4);
  }

  generateIdx() {
    this.idxGenerated = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posGenerated = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norGenerated = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colGenerated = true;
    this.bufCol = gl.createBuffer();
  }

  generateTranslate() {
    this.translateGenerated = true;
    this.bufTranslate = gl.createBuffer();
  }

  generateUV() {
    this.uvGenerated = true;
    this.bufUV = gl.createBuffer();
  }
  // Added for HW4
  generateTransformC1() {
    this.transformC1Generated = true;
    this.bufTransformC1 = gl.createBuffer();
  }
  // Added for HW4
  generateTransformC2() {
    this.transformC2Generated = true;
    this.bufTransformC2 = gl.createBuffer();
  }
  // Added for HW4
  generateTransformC3() {
    this.transformC3Generated = true;
    this.bufTransformC3 = gl.createBuffer();
  }
  // Added for HW4
  generateTransformC4() {
    this.transformC4Generated = true;
    this.bufTransformC4 = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxGenerated) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxGenerated;
  }

  bindPos(): boolean {
    if (this.posGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posGenerated;
  }

  bindNor(): boolean {
    if (this.norGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norGenerated;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindTranslate(): boolean {
    if (this.translateGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    }
    return this.translateGenerated;
  }

  bindUV(): boolean {
    if (this.uvGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    }
    return this.uvGenerated;
  }
  // Added for HW4
  bindTransformC1(): boolean {
    if (this.transformC1Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC1);
    }
    return this.transformC1Generated;
  }
  // Added for HW4
  bindTransformC2(): boolean {
    if (this.transformC2Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC2);
    }
    return this.transformC2Generated;
  }
  // Added for HW4
  bindTransformC3(): boolean {
    if (this.transformC3Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC3);
    }
    return this.transformC3Generated;
  }
  // Added for HW4
  bindTransformC4(): boolean {
    if (this.transformC4Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransformC4);
    }
    return this.transformC4Generated;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;