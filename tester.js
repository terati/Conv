
var cxt;
var x=250;
var y=250;
    
var height = 800;
var width = 800;

var pulse_cnt = 0;

var num = Math.random()/100;
var lvl = 50;
var sn = 1;
var counter = 0;
var varRED = 50;

var fluids;
var Comets;
var color_shifter = Math.random()
var fluid_color = 'hsl(' + 360 * color_shifter + ', 50%, 50%)';


class comets{
    constructor(cxt, count=1){
        this.cxt = cxt;
        this.count = count;
        this.com_arr = []
        for (let ccnt=0; ccnt <= this.count; ccnt++){
            this.com_arr.push(new comet(this.cxt))
        }
    }
    comets_update() {
        this.com_arr.forEach(function (item, index) {
            item.comet_update();
        })
    }
}

class comet{
    constructor(cxt){
        this.cxt = cxt;
        // this.x = (Math.random()-0.5)*800 + x;
        // this.y = (Math.random()-0.5)*800 + y;
        this.amp = Math.random()*100;

        this.t = Math.random()*2*Math.PI;
        this.x = this.t*Math.cos(6*this.t);
        this.y = this.t*Math.sin(6*this.t);
    }
    comet_update() {
        // if ((this.y-y)**2  + (this.x-x)**2 <= 70**2){
        //     this.x = (Math.random()-0.5)*800 + x;
        //     this.y = (Math.random()-0.5)*800 + y;
            
        // }
        // if (this.x - x > 0){
        //     this.x -= Math.random();
        // }
        // if (this.x - x < 0){
        //     this.x += Math.random();
        // }
        // if (this.y - y > 0){
        //     this.y -= Math.random();
        // }
        // if (this.y - y < 0){
        //     this.y += Math.random();
        // }

        if ((this.y-y)**2  + (this.x-x)**2 <= 70**2){
            this.t = Math.random()*2*Math.PI;
            this.x = this.t*Math.cos(6*this.t);
            this.y = this.t*Math.sin(6*this.t);
        }
        if (this.t <= 0){
            this.t = 2*Math.PI - this.t;
        } else {
            this.t -= 0.0005;
        }
        // this.t = Math.random()*2*Math.PI;
        this.x = this.amp*this.t*Math.cos(5*this.t) + x;
        this.y = this.amp*this.t*Math.sin(5*this.t) + y;

        var gradient = cxt.createRadialGradient(this.x,this.y,0, this.x,this.y,1.3);
        // gradient.addColorStop(0, "transparent");
        gradient.addColorStop(.80, 'hsl(' + 360 * color_shifter + ', 50%, 50%)'); //"rgb( 114, 225, 107 )"
        gradient.addColorStop(1, 'transparent');
        cxt.beginPath();
        cxt.arc( this.x, this.y, 20, 0, 2*Math.PI, false);
        cxt.fillStyle = gradient;
        cxt.fill();
    }

}


class Fluid{
    constructor(cxt, count=10){
        this.cxt = cxt;
        this.count = count;
        this.arr = []
        for (let cnt=0; cnt < this.count; cnt++){
            this.arr.push(new flow(this.cxt))
        }
    }

    f_update () {
        if (color_shifter + .0001 >= 1 ){
            color_shifter = 0;
        } else {
            color_shifter += .0001;   
        }
        
        this.arr.forEach(function (item, index) {
            item.update_flow();
        })
    }
}

class flow{
    constructor(cxt, ){
        this.cxt = cxt;
        this.start = Math.random()*2*Math.PI;
        this.end = Math.random()*2*Math.PI;
        this.radadd = Math.random()*50+15;
        this.sign = Math.random()/20;
    }

    update_flow (){
        this.start += Math.random()/100
        this.end += Math.random()/1000
        if (this.start >= 2*Math.PI){
            this.start = 2*Math.PI-this.start;
        }
        if (this.end >= 2*Math.PI){
            this.end = 2*Math.PI-this.end;
        }
        if (this.radadd >= 150 ){
            this.sign = -Math.abs(this.sign);
        }
        if (this.radadd <= 0 ){
            this.sign = Math.abs(this.sign);
        }
        this.radadd += this.sign

        var gradient = cxt.createRadialGradient(x,y,lvl, x,y,70+this.radadd);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(.80, 'hsl(' + 360 * color_shifter + ', 50%, 50%)'); //"rgb( 114, 225, 107 )"
        gradient.addColorStop(1, 'transparent');
        cxt.beginPath();
        cxt.arc( x, y, 70+this.radadd, this.start, this.end, false);
        // cxt.lineTo(x, y);
        cxt.fillStyle = gradient;
        cxt.fill();
    }
}






function init()
{
    canvas=document.getElementById("gameCanvas")
    cxt = canvas.getContext('2d');

    fluids = new Fluid(cxt, 15);
    Comets = new comets(cxt, 200);
    setInterval(draw,1);

}

function draw()
{   
    num += Math.random()/1000;
    if (num > 1){
        num = 1
    }

    //clear the canvas
    cxt.clearRect(0,0, width,height);


    fluids.f_update();

    // The inner circle is at x=110, y=90, with radius=30
    // The outer circle is at x=100, y=100, with radius=70
    var gradient = cxt.createRadialGradient(x,y,varRED, x,y,70);
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(.95, "rgb( 170, 10, 60 )");
    gradient.addColorStop(1, 'transparent');
    cxt.beginPath();
	cxt.arc( x, y, 100, 0, 2*Math.PI );
	cxt.fillStyle = gradient;
    cxt.fill();
    
 
    //comets
    Comets.comets_update();
    

    //GREEN levels
    var gradient = cxt.createRadialGradient(x,y,lvl, x,y,70);
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(.95, "rgb( 114, 225, 107 )");
    gradient.addColorStop(1, 'transparent');
    cxt.beginPath();
    cxt.arc( x, y, 70, 0, 2*Math.PI*num, false);
    cxt.lineTo(x, y);
	cxt.fillStyle = gradient;
	cxt.fill();


    if (num != 1){
        counter = 0;
    }
    if (num == 1 && counter == 10){
        if (lvl <= 20 || lvl >= 60){
            sn = -sn;
        }
        lvl += sn;
        counter = 0;
        varRED = 60;
    } else {
        counter += 1;

    }

    cxt.font = "50px Brush Script MT";
    if ((num*100).toFixed(0) != 100){
        cxt.fillStyle = "rgb( 170, 10, 60 )";
    } else {
        cxt.fillStyle = "rgb( 114, 225, 107 )";
    }

    cxt.textAlign = "center";
    cxt.fillText((num*100).toFixed(0)+ "%", x+5, y+10);
}
init();