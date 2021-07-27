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

var kernel = [
    [-1,0,1],
    [-2,0,2],
    [-1,0,1]
]

function init() {
    console.log("Initialize");
    console.log(kernel[1][0]);
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
        // for (let i=0; i<data.length; i+=4){
        //     // data[i] = 255;
        //     // data[i+1] = 0;
        //     // data[i+2] = 0;
        // }
        ctxt.putImageData(imgdata,0,0);
	}
}


function convolve() {
    // console.log(data_copy);
    imgdata = ctxt.getImageData(0, 0, img.width, img.height);
    var data = imgdata.data;
    var w = img.width;
    var h = img.height;
    var arr = new Array(img.height+2).fill(0).map(()=>new Array(img.width+2).fill(0));

    function ConvolveChannel(a) {
        //populate the inner image
        var cnt = 0;
        for (let r = 1; r < img.height+1; r++){   
            for (let c = 1; c < img.width+1; c++){
                arr[r][c] = data[4*cnt+a]
                cnt++;
            }
        }


        // top edge case
        for (let c = 1; c < img.width+1; c++){
            arr[0][c] = arr[1][c];
            if (c == 1){
                arr[0][0] = arr[1][c];
            }
            if (c == img.width){
                arr[0][img.width+1] = arr[1][c];
            }
        }

        // bottom edge case
        for (let c = 1; c < img.width+1; c++){
            arr[img.height+1][c] = arr[img.height][c];
            if (c == 1){
                arr[img.height+1][0] = arr[img.height][c];
            }
            if (c == img.width){
                arr[img.height+1][img.width+1] = arr[img.height][c];
            }
        }

        // left and right edge cases
        for (let r = 1; r < img.height+1; r++){
            arr[r][0] = arr[r][1];
            arr[r][img.width+1] = arr[r][img.width];
        }

        // convolving kernel to arr
        cnt = 0;
        for (let r = 1; r < img.height+1; r++){   //populate the inner image
            for (let c = 1; c < img.width+1; c++){
                data[cnt*4+a] = kernel[0][0]*arr[r-1][c-1] + kernel[0][1]*arr[r-1][c] + kernel[0][2]*arr[r-1][c+1]
                            + kernel[1][0]*arr[r][c-1] + kernel[1][1]*arr[r][c] + kernel[1][2]*arr[r][c+1]
                            + kernel[2][0]*arr[r+1][c-1] + kernel[2][1]*arr[r+1][c] + kernel[2][2]*arr[r+1][c+1]
                cnt++
            }                   
        }
    }

    ConvolveChannel(0);
    ConvolveChannel(1);
    ConvolveChannel(2);

    // console.log(data);
    ctxt.putImageData(imgdata,0,0);
}


function revert() {
    ctxt.drawImage(img, 0, 0);
}

