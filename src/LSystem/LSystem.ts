import {vec3, vec4, mat4, glMatrix, quat} from 'gl-matrix';
import ExpansionRules from '../LSystem/ExpansionRules';
import Turtle from '../LSystem/Turtle';

class LSystem {
  // Turtle to move through the LSystem and draw
  myTurtle: Turtle;
  // stack of the turtle states
  turtleHistory: Turtle[];
  // the expansion rules for the axiom
  expansionRules: ExpansionRules;
  // maps the chars to their functions for drawing
  drawingRules: Map<string, any>;  

  constructor(expansRule: ExpansionRules, angle: number) {
    // turtle takes in position, orientation, quaternion, depth, angle
    this.myTurtle = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0), quat.fromValues(0.0, 0.0, 0.0, 1.0), 0.0, angle);
    this.expansionRules = expansRule;

    // Set up drawing rules for the characters that will be used
    this.drawingRules = new Map();
    this.drawingRules.set("F", this.myTurtle.moveForward.bind(this.myTurtle)); // move forward    
    this.drawingRules.set("-", this.myTurtle.rotateLeft.bind(this.myTurtle)); // rotate left
    this.drawingRules.set("+", this.myTurtle.rotateRight.bind(this.myTurtle)); // rotate right
    this.drawingRules.set("*", this.myTurtle.leaf.bind(this.myTurtle));
    this.drawingRules.set("L", this.myTurtle.otherLeaf.bind(this.myTurtle));
    this.drawingRules.set("B", this.myTurtle.otherLeaf2.bind(this.myTurtle));
    // set up the stack of turtle states
    this.turtleHistory = [];
  }

  axiomExpansion(iters: number): string {
    // the string that will hold the axiom  
    let expandedString: string = this.expansionRules.axiom;

    for (let i: number = 0.0; i < iters; i++) {
      let newString: string = "";
      for (let j: number = 0.0; j < expandedString.length; j++) {
          var c = expandedString.charAt(j);
        let currChar: string = expandedString[j];
        let expFunc: any = this.expansionRules.getExpansion(currChar); // get the expansion rule for the character

        // if a rule for the char exists
        if (expFunc) {
          // add the expansion into the string  
          newString = newString + expFunc();
        }
        // if there is not a function for the char, nothing to expand for the char
        else {
          newString = newString + currChar;
        }        
      }
      expandedString = newString;
    }
    return expandedString; // final expanded string
  }
 
  // Returns an array of transformation matrices to be applied in drawing
  drawLSystemFunc(iters: number) {
    let LSystemInfo: any = [];    
    let expandedString: string = this.axiomExpansion(iters);
   // console.log("braches: " + expandedString); // for testing

    // for each character in the final string, get the associated drawing function
    for (let i: number = 0.0; i < expandedString.length; i++) {
      let currChar: string = expandedString[i]; // current character
      let drawingFunc: any = this.drawingRules.get(currChar); // associated drawing rule
      let info: any = {};

      // if a drawing rule exists for the char
      if (drawingFunc) {              
        let returnFunc: any = drawingFunc(); // mat4 from a movement call, void from a rotate call
      // if a matrix was returned from the drawing function, add it to the transforms to be drawn
        if (returnFunc) {
          info.transform = returnFunc;
          info.char = currChar;
          LSystemInfo.push(info);          
        }        
      }
      // check if turtle state should be added to the turtle history
      if (currChar == "[") {
        // save the state
        this.turtleHistory.push(this.myTurtle.copyTurtle());
      }
      // check if the turtle state should be restored off the stack history
      if (currChar == "]") {        
        let poppedTurtle: Turtle = this.turtleHistory.pop();        
        // if a turtle exists off the stack
        if (poppedTurtle) {   
            // restore that turtle state                 
          this.myTurtle.updateTurtleFromStack(poppedTurtle);
        }
      }          
    } // end for loop
    return LSystemInfo;
  }

};

export default LSystem;