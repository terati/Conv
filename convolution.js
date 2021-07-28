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

var red_y = new Array(256).fill(0);
var green_y = new Array(256).fill(0);
var blue_y = new Array(256).fill(0);
var x = new Array(256);

function init() {
    console.log("Initialize");
    for (let i = 0; i < 256; i++){
        x[i] = i;
    }
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctxt.drawImage(img, 0, 0);
        plotting();
    }

}
init();


function plotting() {
    imgdata = ctxt.getImageData(0, 0, img.width, img.height);
    var data = imgdata.data;
    for (let i=0; i<data.length; i+=4){
        let idx = data[i];
        red_y[idx]++;
        idx = data[i+1];
        green_y[idx]++;
        idx = data[i+2];
        blue_y[idx]++;
    }
    // console.log(red_y);
    blue_y = blue_y.slice(1,256);
    green_y = green_y.slice(1,256);
    red_y = red_y.slice(1,256);
    console.log(red_y);
    var rtrace = {
        x:x,
        y:red_y,
        type: 'bar',
        width: 1,
        opacity: 0.6,
        marker: {
            color: 'rgba(255,0, 0, 0.9)'
        }
    };
    var gtrace = {
        x:x,
        y:green_y,
        type: 'bar',
        width: 1,
        opacity: 0.6,
        marker: {
            color: 'rgba(0, 255, 0, 0.9)'
        }
    };
    var btrace = {
        x:x,
        y:blue_y,
        type: 'bar',            
        width: 1,
        opacity: 0.6,
        marker: {
            color: 'rgba(0, 0, 255, 0.9)'
        }
    };
    var data = [rtrace, gtrace, btrace];
    var layout = {
        // title: "Color Histogram",
        staticPlot: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        bargap: 0.,
        font : {
            color: "white"
        },
        xaxis: {
            showgrid: false
        },
        yaxis: {
            showgrid: false,
            showline: true
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        height: 150,
    }
    var ex = {
        staticPlot: true,
    }
    Plotly.newPlot('myDiv', data, layout, ex);
}


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
        plotting();
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

function trigger() {
    kernel[0][0] = document.getElementById('k0').value;
    kernel[0][1] = document.getElementById('k1').value;
    kernel[0][2] = document.getElementById('k2').value;

    kernel[1][0] = document.getElementById('k3').value;
    kernel[1][1] = document.getElementById('k4').value;
    kernel[1][2] = document.getElementById('k5').value;

    kernel[2][0] = document.getElementById('k6').value;
    kernel[2][1] = document.getElementById('k7').value;
    kernel[2][2] = document.getElementById('k8').value;
}




function selectFunct() {
    let val = document.getElementById("mySelect").value;
    switch(val) {
        case "sharpen":
            document.getElementById('k0').setAttribute("value", "0");
            document.getElementById('k1').setAttribute("value", "-1");
            document.getElementById('k2').setAttribute("value", "0");

            document.getElementById('k3').setAttribute("value", "-1");
            document.getElementById('k4').setAttribute("value", "5");
            document.getElementById('k5').setAttribute("value", "-1");

            document.getElementById('k6').setAttribute("value", "0");
            document.getElementById('k7').setAttribute("value", "-1");
            document.getElementById('k8').setAttribute("value", "0");
            break;
        case "blur":
            document.getElementById('k0').setAttribute("value", "0.0625");
            document.getElementById('k1').setAttribute("value", "0.125");
            document.getElementById('k2').setAttribute("value", "0.0625");

            document.getElementById('k3').setAttribute("value", "0.125");
            document.getElementById('k4').setAttribute("value", "0.25");
            document.getElementById('k5').setAttribute("value", "0.125");

            document.getElementById('k6').setAttribute("value", "0.0625");
            document.getElementById('k7').setAttribute("value", "0.125");
            document.getElementById('k8').setAttribute("value", "0.0625");
            break;
        case "hsobel":
            document.getElementById('k0').setAttribute("value", "-1");
            document.getElementById('k1').setAttribute("value", "0");
            document.getElementById('k2').setAttribute("value", "1");

            document.getElementById('k3').setAttribute("value", "-2");
            document.getElementById('k4').setAttribute("value", "0");
            document.getElementById('k5').setAttribute("value", "2");

            document.getElementById('k6').setAttribute("value", "-1");
            document.getElementById('k7').setAttribute("value", "0");
            document.getElementById('k8').setAttribute("value", "1");
            break;
        case "vsobel":
            document.getElementById('k0').setAttribute("value", "-1");
            document.getElementById('k1').setAttribute("value", "-2");
            document.getElementById('k2').setAttribute("value", "-1");

            document.getElementById('k3').setAttribute("value", "0");
            document.getElementById('k4').setAttribute("value", "0");
            document.getElementById('k5').setAttribute("value", "0");

            document.getElementById('k6').setAttribute("value", "1");
            document.getElementById('k7').setAttribute("value", "2");
            document.getElementById('k8').setAttribute("value", "1");
            break;
        case "identity":
            document.getElementById('k0').setAttribute("value", "0");
            document.getElementById('k1').setAttribute("value", "0");
            document.getElementById('k2').setAttribute("value", "0");

            document.getElementById('k3').setAttribute("value", "0");
            document.getElementById('k4').setAttribute("value", "1");
            document.getElementById('k5').setAttribute("value", "0");

            document.getElementById('k6').setAttribute("value", "0");
            document.getElementById('k7').setAttribute("value", "0");
            document.getElementById('k8').setAttribute("value", "0");
            break;
    }
    trigger();
}










