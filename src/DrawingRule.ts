import {vec3, vec4} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';

class DrawingRule {
  
drawingRulesMap: Map<string, Map<number, any>> = new Map<string, Map<number, any>>();

constructor(){
  
}

addDrawingRule(char: string, prob: number, drawFunc: any){
    if(this.drawingRulesMap.has(char)){
        var probMap: Map<number, any> = this.drawingRulesMap.get(char);
        probMap.set(prob, drawFunc);
    }
    else{
        var probMap: Map<number, any> = new Map<number, any>();
        probMap.set(prob, drawFunc);
        this.drawingRulesMap.set(char, probMap);
    }
}

getDrawingRule(char: string): any{
    if(this.drawingRulesMap.has(char)){
        var probMap: Map<number, any> = this.drawingRulesMap.get(char);
        var randomVal: number = Math.random();
        var drawingRule: any;
        var totalProb: number = 0.0;

        for(const prob of probMap.keys()){
            if(randomVal > totalProb && randomVal <= (totalProb + prob)){
                drawingRule = probMap.get(prob);
            }
            totalProb += prob;
        }
        return drawingRule;
    }
    else{// if theres not a Mapping set up
        return function(): void{}; // return an empty function
    }
}

};
export default DrawingRule;