#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

// ------FBM--------------------------------------------
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


//https://thebookofshaders.com/13/
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// based on Adam's slides
float fbm (in vec2 st) {
    // Initial values
    float total = 0.0;
    float persist = 0.5;
    int octaves = 6;
    
    // Loop for octaves
    for (int i = 0; i < octaves; i++) {
          float frequency = pow(3.5, float(i));
          float amp = pow(persist, float(i));
        total +=  abs(noise(vec2(st.x * frequency, st.y * frequency))) * amp;
       
    }
    return total;
}



vec3 skyPalette(float t);

//purples
const vec3 sky0 = vec3(0.1608, 0.3451, 0.851);
const vec3 sky1 = vec3(0.4588, 0.1529, 0.8118);
const vec3 sky2 = vec3(0.3725, 0.1647, 0.8588);
const vec3 sky3 = vec3(0.2353, 0.0745, 0.6196);
const vec3 sky4 = vec3(0.3294, 0.1059, 0.5882);

vec3 skyPalette(float t) {
    if(t < 0.2) {
        return mix(sky4, sky0, t / 0.2);
    }
    else if(t < 0.4) {
        return mix(sky4, sky3, (t - 0.2) / 0.2);
    }
    else if(t < 0.6) {
        return mix(sky3, sky2, (t - 0.4) / 0.2);
    }
    else if(t < 0.8) {
        return mix(sky2, sky1, (t - 0.6) / 0.2);
    }
    else if(t < 1.0) {
        return mix(sky1, sky4, (t - 0.8) / 0.2);
    }
}


void main() {

 //vec2 uv = gl_FragCoord.xy/u_Dimensions.xy;
 vec2 st = vec2(((gl_FragCoord.x + (u_Time*15.0)) / u_Dimensions.x), gl_FragCoord.y / u_Dimensions.y);
 vec3 color = vec3(0.0);
 color += fbm(vec2(fs_Pos.x +(u_Time*0.0009) , fs_Pos.y));
//color += fbm(st * 3.0 );
color *= vec3(0.5922, 0.5373, 0.4196); // add some color so its not pure black and white
color *= skyPalette(color.z); // prev color.x
vec3 sky = color;


  out_Col = vec4(0.5 * (fs_Pos + vec2(1.0)), 0.0, 1.0);
 // out_Col = vec4(color,1.0);
}
