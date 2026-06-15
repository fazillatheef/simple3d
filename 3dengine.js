const BACKGROUND = "#101010";
const  FOREGROUND = "#50FF50"
console.log(game);
game.width = 200;
game.height = 200;

const ctx = game.getContext("2d");
console.log(ctx);
// x axis is from centre to the right
// y axis is from centre to top
// z axis is from centre into the screen

function clear(){
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0,0,game.width, game.height);
}

// This point was used to create a reference. Later not used
function point({x,y}){
    const s = 20;
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(x-s/2,y-s/2,s,s);    
}

// Using similar triangles, we just calculate where the point 
// would be on a virtual screen. i.e. projection
function project({x,y,z}){
    return {
        x: x/z
        ,y: y/z
    }
}

// Map the virtual screen to a real screen 
function screen(p){
    // for x, -1 .. +1 => 0..w
    // for y, +1 .. -1 => 0..h 
    return {
                x:(p.x + 1)/2 * game.width
                ,y:(1 - p.y)/2 * game.height
            };
}
// 3d data for vertices
const vs = [
    {x:-0.25,y:+0.25,z:+0.25},
    {x:+0.25,y:+0.25,z:+0.25},
    {x:+0.25,y:-0.25,z:+0.25},
    {x:-0.25,y:-0.25,z:+0.25},
    {x:-0.25,y:+0.25,z:-0.25},
    {x:+0.25,y:+0.25,z:-0.25},
    {x:+0.25,y:-0.25,z:-0.25},
    {x:-0.25,y:-0.25,z:-0.25}    
];

// Connection between the vertices. i.e. Edges
// Here the data structure is like a face
const fs =[
    [0,1,2,3],[4,5,6,7],[0,4],[1,5],[2,6],[3,7]
];

// Move object in Z axis
function translate_z({x,y,z},dz){
    return {x,y,z:z+dz};
}

// Rotate using trigonometry in y axis
// Formula used is derived using sin(A+B) and cos(A+B) identities
function rotate_xz({x,y,z},angle){
    cos = Math.cos(angle);
    sin = Math.sin(angle)
    return {
        x: x * cos - z * sin
        ,y: y
        ,z: x * sin + z * cos
    }
}

// Rotate using trigonometry in z axis
// Formula used is derived using sin(A+B) and cos(A+B) identities
function rotate_xy({x,y,z},angle){
    cos = Math.cos(angle);
    sin = Math.sin(angle)
    return {
        x: x * cos - y * sin
        ,y: x * sin + y * cos
        ,z: z
    }
}

//Draw a line between two points
function line(p1,p2){
    ctx.lineWidth = 1;
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

const FPS = 60;
//let dz = 0;
let angle = 0;
let dt = 1 / FPS; // time between frames in seconds
let dt_ms = 1000 / FPS; // milliseconds between frames
function frame(){
    //dz += 1 * dt;
    angle += Math.PI * dt;
    clear();

    /*for (const v of vs){
        point(screen(project(translate_z(rotate_xz(v,angle),1))));
    }*/

    for (const f of fs){
        for (let i = 0; i < f.length ;++i){
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(screen(project(translate_z(rotate_xz(rotate_xy(a, angle),angle),1))) 
            , screen(project(translate_z(rotate_xz(rotate_xy(b, angle),angle),1))));
        }
    }

    setTimeout(frame, dt_ms); // this function calls frame after time needed for each
                              // frame. It is recursive loop. Never ends
}
frame(); // Calls the function for first time
