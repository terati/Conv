
var ctx;
var x=250;
var y=250;
    
var height = 800;
var width = 800;

var fl1;

function init()
{
    canvas=document.getElementById("gameCanvas")
    ctx = canvas.getContext('2d');
    
    FW1 = new firework1(ctx, 300, 300, 80);

    setInterval(draw1, 1);
}

function draw1()
{
    ctx.clearRect(0,0,width,height);
    if (FW1.done != 1){
        FW1.FW_update();
    }

}

class firework1{
    constructor(ctx, pos_x, pos_y, num_flares=10){
        this.ctx = ctx;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.num = num_flares;
        this.FW1 = [];
        this.done = 0;
        for (let num=0; num < this.num; num++){
            this.FW1.push(new flare1(ctx, this.pos_x, this.pos_y));
        }
    }

    FW_update () {
        let cnt = 0;
        for (let numm=0; numm < this.num; numm++){
            if (this.FW1[numm].done != 1){
                this.FW1[numm].flareCurve1_update();
            } else {
                cnt += 1;
                if (cnt == this.num){
                    this.done = 1;
                }
            }
        }
    }

}

class flare1{
    constructor(ctx, blast_x, blast_y){
        this.ctx = ctx;
        this.blast_x = blast_x;
        this.blast_y = blast_y;
        this.trail = [];
        this.time = 0;
        this.Vx = 2*(Math.random()-0.5);
        this.Vy = (Math.random()-0.7)*2;
        this.acc = 1; //acceleration downwards
        this.done = 0;
        this.time_var = Math.random();
    }

    flareCurve1_update() {
        //Trail 
        this.ctx.beginPath();
        this.ctx.fillStyle="red";
                //(posX, posY, radius, 0, 2*Math.PI, true)
        this.ctx.arc(this.blast_x,this.blast_y,5,0,Math.PI*2,true); 
        this.ctx.closePath();
        this.ctx.fill();

        if (this.trail.length < 100) {
            this.trail.push(new trailcircle(this.ctx, this.blast_x, this.blast_y))
        }

        if (this.trail.length == 100){
            this.trail.shift();
            this.trail.push(new trailcircle(this.ctx, this.blast_x, this.blast_y))
        }

        // if (this.trail.length > 50){
        //     this.trail.shift();
        //     this.trail.push(new trailcircle(this.ctx, this.blast_x, this.blast_y))
        // }

        for (let cnt=0; cnt<this.trail.length; cnt++){
            if (this.trail[cnt].rad - 0.02 >= 0){
                this.trail[cnt].rad -= 0.02;
            }
            this.trail[cnt].trail_update();
        }

        //Head of Trail
        this.ctx.beginPath();
        this.ctx.fillStyle="red";
                //(posX, posY, radius, 0, 2*Math.PI, true)
        this.ctx.arc(this.blast_x,this.blast_y,2,0,Math.PI*2,true); 
        this.ctx.closePath();
        this.ctx.fill();

        
        if (this.time >= 2+ this.time_var){
            this.Vy = 0;
            // console.log(this.trail.length);
            console.log(this.trail[0].rad);
            if (this.trail[0].rad <= 1){
                this.done = 1;
                console.log(this.trail[this.trail.length-1].rad)
            }
        } else {
            this.blast_x += this.Vx*this.time;
            this.blast_y += this.Vy + 0.5*this.acc*this.time**2// 2 is the asecond order 
            this.time += 0.01;
        }

    }



}

class trailcircle{
    constructor(ctx, x, y){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.rad = 3;
    }
    trail_update() {
        var gradient = ctx.createRadialGradient(this.x,this.y, 0, this.x,this.y,this.rad);
        // gradient.addColorStop(0, "transparent");
        gradient.addColorStop(.80, "rgb( 114, 225, 107 )"); //"rgb( 114, 225, 107 )"
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.fillStyle="blue";
                //(posX, posY, radius, 0, 2*Math.PI, true)
        ctx.arc(this.x,this.y,this.rad,0,Math.PI*2,false); 
        ctx.closePath();
        // ctx.fillStyle = gradient;
        ctx.fill();



    }
}

init();