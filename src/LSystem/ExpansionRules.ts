class ExpansionRules {
    // start string
    axiom: string;
    // the map of rules that dictate which characters map to other characters
    grammarMap : Map<string, Map<number, any>> = new Map<string, Map<number, any>>();
  
    constructor() {
     
      this.axiom = "X"; // Start with example from class
     
      this.addExpansionRule("X", 1.0, this.XmapsTo);
      this.addExpansionRule("F", 0.5, this.FmapsTo);
      this.addExpansionRule("F", 0.5, this.FmapsTo2);  
      this.addExpansionRule("*", 0.65, this.leafMapsToLeaf);  
      this.addExpansionRule("*", 0.25, this.leafMapsToOtherLeaf);  
      this.addExpansionRule("*", 0.10, this.leafMapsToBerry); 
     
    }
  
    addExpansionRule(startChar: string, prob: number, func: any){
      if(this.grammarMap.has(startChar)){
          var probMap: Map<number, any> = this.grammarMap.get(startChar);
          probMap.set(prob, func);
      }
      else{
          var probMap: Map<number, any> = new Map<number, any>();
          probMap.set(prob, func);
          this.grammarMap.set(startChar, probMap);
      }
     }
  
     getExpansion(startChar: string): any{
      if(this.grammarMap.has(startChar)){
          var probMap: Map<number, any> = this.grammarMap.get(startChar);
          var randValue: number = Math.random();
          var func: any;
          var totalProb: number = 0.0;
  
              for(const prob of probMap.keys()){
                  if(randValue > totalProb && randValue <= (totalProb + prob)){
                          func = probMap.get(prob);
                  }
                  totalProb += prob;
              }
              return func;
         }
         else{
              return;
         }
     }
  
    // Expansion mapping functions for expanding char to more chars/ another char
    FmapsTo(): String {
       return "FF";    
    }

    FmapsTo2(): String {
       return "F";    
    }
   
    XmapsTo(): String {  
      return "F-[[X*]+X]+F[+FX*]-X";  
    }
  
    leafMapsToLeaf(): String{
      return "*";
    }
  
    leafMapsToOtherLeaf(): String{
      return "L";
  }

  leafMapsToBerry() : String{
    return"B"
  }
  
  };
  
  export default ExpansionRules;