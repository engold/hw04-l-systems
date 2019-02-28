class ExpansionRules {
    // beginning string
    axiom: string;
    // the rules by which each character maps to a new character(s)
    //grammar : Map<string, any> = new Map();
    grammarMap : Map<string, Map<number, any>> = new Map<string, Map<number, any>>();
  
    constructor() {
     
      this.axiom = "X"; // Start with example from class
      //this.grammarMap.set("F", this.FmapsTo); // F char and the expansion string F maps to
      //this.grammarMap.set("X", this.XmapsTo); // X char and the expansion string X maps to
     
      this.addExpansionRule("X", 1.0, this.XmapsTo);
      this.addExpansionRule("F", 0.5, this.FmapsTo);
      this.addExpansionRule("F", 0.5, this.FmapsTo2);  
      //this.addExpansionRule("*", 0.5, this.leafMapsToLeaf);  
      //this.addExpansionRule("*", 0.5, this.leafMapsToNone);  
     
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
  
    // Expansion mapping functions
    // 50% chance of being chosen
    FmapsTo(): String {
      // return string to add to grammar
       return "FF";    
    }
    // 50% chance
    FmapsTo2(): String {
      // return string to add to grammar
       return "F";    
    }
   
    XmapsTo(): String {  
      return "F-[[X*]+X]+F[+FX*]-X";  
    }
  
    leafMapsToLeaf(): String{
      return "*";
    }
  
    leafMapsToNone(): String{
      return "";
  }
  
  };
  
  export default ExpansionRules;