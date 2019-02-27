import {vec3, vec4, mat3, mat4, glMatrix, quat} from 'gl-matrix';


const PI = 3.14159265359;

class Turtle{
  // variables
  pos: vec3;
  orientation: quat;
  scale: number;
  depth: number;

  constructor(startPos: vec3, startOrientation: quat, startScale: number, startDepth: number){
        this.pos = startPos;
        this.orientation = startOrientation;
        this.scale = startScale;
        this.depth = startDepth;
  }
  copy(): Turtle {
    let copyTurtle: Turtle = new Turtle(this.pos, this.orientation, this.scale, this.depth);
     return copyTurtle;
  }

  // return a function identifier
  turtleRotateX(angle: number): number{
    this.orientation = quat.rotateX(this.orientation, this.orientation, glMatrix.toRadian(angle));
    console.log("rotate turtle X");
    return 1;
  }
    // return a function identifier
  turtleRotateY(angle: number): number{
    this.orientation = quat.rotateY(this.orientation, this.orientation, glMatrix.toRadian(angle));
    console.log("rotate turtle Y");
    return 1;
  }
    // return a function identifier
  turtleRotateZ(angle: number): number{
    this.orientation = quat.rotateZ(this.orientation, this.orientation, glMatrix.toRadian(angle));
    console.log("rotate turtle Z");
    return 1;
  }

    // return a function identifier
  turtleMoveForward(moveVec : vec3): number{
    this.pos = vec3.add(this.pos, this.pos, moveVec);
    console.log("Move turtle forward");
    return 2;
  }
    // return a function identifier
  turtleScale(s: number): number{
    this.scale *= s;
    console.log("scale turtle");
    return 3;
  }
  turtleGetTransMat(): mat4{
      var transMat: mat4 = mat4.fromRotationTranslationScale(mat4.create(), 
        this.orientation, this.pos, vec3.fromValues(this.scale, this.scale, this.scale));

        return transMat;
  }


};

export default Turtle;