
var cxt;
var CM;
var x=100;
var y=100;
var dx=1;
var dy=1;
    
var height = 800;
var width = 1000;



class circle_manager{
    constructor(cxt, number) {
        this.number = number;
        this.arr = [];
        this.cxt = this.cxt;
        for (let cnt=0; cnt < this.number; cnt++){
            this.arr.push(new circle_creator(this.cxt, x,y,20))
        }
    }
    updateCM (){
        this.arr.forEach(function (item, index) {
            item.redraw();
        })
    }
    
}

class circle_creator{
    constructor(cxt, x, y, rad=20){
        this.x = Math.random()*900;
        this.y = Math.random()*700;
        this.rad = Math.random()*100
        this.cxt = cxt;
        this.dx = dx;
        this.dy = dy;
        this.color = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
        // redraw();
    }

    redraw () {
        var rad = 20;
        cxt.beginPath();
        cxt.fillStyle=this.color;
        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
        cxt.arc(this.x,this.y,this.rad,0,Math.PI*2,true); 
        cxt.closePath();
        cxt.fill();
        if(this.x+this.rad >= width || this.x-this.rad <= 0){
            this.dx = -this.dx;
        }

        if(this.y+this.rad >= height || this.y-this.rad <= 0){
            this.dy = -this.dy;
        }
        this.x+=this.dx;
        this.y+=this.dy;
    }


}
    


init()
function init()
{
    canvas=document.getElementById("gameCanvas")
    cxt = canvas.getContext('2d');

    CM = new circle_manager(cxt, 25);
    
    setInterval(draw,1);

}

function draw()
{   
    // cxt.clearRect(0,0, width,height);

    CM.updateCM();
    
}
