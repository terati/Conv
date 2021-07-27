// var counter = 0;
// function init()
// {
//     canvas=document.getElementById("gameCanvas")
//     ctx = canvas.getContext('2d');

//     setInterval(draw,1000);

// }
// init();


// function draw()
// {
//     ctx.clearRect(0,0, canvas.width, canvas.height);
//     ctx.beginPath();
//     ctx.arc(100, 100, 50, 0, counter); //2 * Math.PI);
//     ctx.stroke();
//     if (counter > 2* Math.PI){
//         counter = 0;
//     } else {
//         counter += 0.5;
//     }
// }


var canvas=document.getElementById("gameCanvas");
var ctxt = canvas.getContext('2d');
var data_copy;

var img = new Image;
var imgdata;
img.src = "./doggo.jpg";

function init() {
    console.log("Initialize");
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctxt.drawImage(img, 0, 0);
    }
}
init();




function readURL(input) {
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result);
            manip(e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}



function manip(pic) {
	img.src = pic;
	img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
		ctxt.drawImage(img, 0, 0);
		imgdata = ctxt.getImageData(0, 0, img.width, img.height);
        var data = imgdata.data;
        data_copy = new Uint8ClampedArray(imgdata.data);
        for (let i=0; i<data.length; i+=4){
            // data[i] = 255;
            // data[i+1] = 0;
            // data[i+2] = 0;
        }
        ctxt.putImageData(imgdata,0,0);
        // console.log(data);
        // console.log(data.length);
	}
}


function convolve() {
    // console.log(data_copy);
    imgdata = ctxt.getImageData(0, 0, img.width, img.height);
    var data = imgdata.data;
    for (let i=0; i<data.length; i+=4){
        data[i] = 255;
        // data[i+1] = 0;
        // data[i+2] = 0;
    }
    ctxt.putImageData(imgdata,0,0);
}


function revert() {
    ctxt.drawImage(img, 0, 0);
}

