import {vec3, vec4} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';

class ExpansionRule {
    //probablity: number;
    //expanded: string;

    MapOfRules: Map<string, Map<number, string>> = new Map<string, Map<number, string>>();

    constructor(){

    }

    addExpansionRule(startChar: string, prob: number, otherString: string){
            if(this.MapOfRules.has(startChar)){
                var probMap: Map<number, string> = this.MapOfRules.get(startChar);
                probMap.set(prob, otherString);
            }
            else{
                var probMap: Map<number, string> = new Map<number,string>();
                probMap.set(prob, otherString);
                this.MapOfRules.set(startChar, probMap);
            }
    }

    getExpansion(startChar: string): string{
            if(this.MapOfRules.has(startChar)){
                var probMap: Map<number, string> = this.MapOfRules.get(startChar);
                var randValue: number = Math.random();
                var otherString: string;
                var totalProb: number = 0.0;

                    for(const prob of probMap.keys()){
                        if(randValue > totalProb && randValue <= (totalProb + prob)){
                                otherString = probMap.get(prob);
                        }
                        totalProb += prob;
                    }
                    return otherString;
            }
            else{
                return '';
            }
    }

// constructor(prob : nubmer,s : string ){
//     this.probablity = prob; // the probablity of using the given rule
//     this.expanded = s; // the string that will replace the existing char
// }

};
export default ExpansionRule;