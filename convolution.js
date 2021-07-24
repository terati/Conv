var counter = 0;
function init()
{
    canvas=document.getElementById("gameCanvas")
    ctx = canvas.getContext('2d');

    setInterval(draw,1000);

}
init();


function draw()
{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, counter); //2 * Math.PI);
    ctx.stroke();
    if (counter > 2* Math.PI){
        counter = 0;
    } else {
        counter += 0.5;
    }
}