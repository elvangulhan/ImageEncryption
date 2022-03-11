
let messages = {
    "error_0" : "something went wrong, please try again",
    "error_1" : "extension not supported, please try again"
}

let canvas              = document.getElementById("board");
let canvasCtx           = canvas.getContext("2d");
let imgFile             = null;
let imgExt              = null;
let cryptX              = 4;
let cryptY              = 1;
let allowedExtensions   = ["jpeg","png"];

function ENDECrypt(imgData){
    imgFile = imgData.files[0];
    if(imgFile){
        imgExt = (imgFile.type).split("/")[1]; // uploaded img extension
        if(allowedExtensions.includes(imgExt)){
            let reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = function(){
                let tempImage = new Image();
                tempImage.src = reader.result;
                tempImage.onload = function(){
                    let iW = canvas.width   = this.width;
                    let iH = canvas.height  = this.height;
                    canvasCtx.drawImage(tempImage, 0, 0, iW, iH);
                    let pxlArray = Array();
                    let subScore = 0;
                    let pxlData  = canvasCtx.getImageData(0,0,cryptX,cryptY).data;
                    for(let l = 0; l < pxlData.length; l+=4)
                            pxlArray.push({
                                0: pxlData[l],
                                1: pxlData[l+1],
                                2: pxlData[l+2]
                            });
                    for(let j = 0; j < pxlArray.length; j++){
                        if(j+1 <= pxlArray.length){
                            let k1 = pxlArray[j][0]+1 == pxlArray[j][1];
                            let k2 = (pxlArray[j][0]+1) + (pxlArray[j][1]);
                            if(k1 && (k2 == pxlArray[j][2]))
                                subScore++;
                        }
                    }
                    if(subScore==cryptX*cryptY){ // encrypted
                        let tokenIndex  =  pxlArray[0][1];
                        let n1          = tokenIndex-1,
                            n2          = tokenIndex,
                            n3          = tokenIndex*2;
                        let nImgData    = canvasCtx.getImageData(0, 0, iW, iH);
                        let nImgPixels  = nImgData.data;
                        for(let k = 0; k < nImgPixels.length; k+=4){
                            let m1      = nImgPixels[k],
                                m2      = nImgPixels[k+1],
                                m3      = nImgPixels[k+2];
                            for(let q = 0; q < 256; q++) // for red 
                                if((n1*q)%255==m1){
                                    nImgPixels[k]   = q;
                                    break;
                                }
                            for(let q = 0; q < 256; q++) // for green
                                if((n2*q)%255==m2){
                                    nImgPixels[k+1] = q;
                                    break;
                                }
                            for(let q = 0; q < 256; q++) // for blue
                                if((n3*q)%255==m3){
                                    nImgPixels[k+2] = q;
                                    break;
                                }
                        }
                        canvasCtx.putImageData(nImgData,0 ,0);
                    }else{ // not encrypted
                        let tokenIndex  = Math.floor(Math.random() * 128);  
                        tokenIndex      = (tokenIndex > 127) ? 127 : tokenIndex;
                        let t1          = tokenIndex-1,
                            t2          = tokenIndex,
                            t3          = tokenIndex*2;
                        let tImgData    = canvasCtx.getImageData(0, 0, iW, iH);
                        let tImgPixels  = tImgData.data;
                        for(let k = 0; k < tImgPixels.length; k+=4){
                            if(k < cryptX*cryptY*4){
                                tImgPixels[k]   = t1;
                                tImgPixels[k+1] = t2;
                                tImgPixels[k+2] = t3;
                            }else{
                                let p1  = tImgPixels[k],
                                    p2  = tImgPixels[k+1],
                                    p3  = tImgPixels[k+2];
                                tImgPixels[k]    = (p1 * t1) % 255;
                                tImgPixels[k+1]  = (p2 * t2) % 255;
                                tImgPixels[k+2]  = (p3 * t3) % 255;
                            }
                        }
                        canvasCtx.putImageData(tImgData,0 ,0);
                    }
                }
            }
        }else{
            alert(messages["error_1"]);
        }
    }else{
        alert(messages["error_0"]);
    }
}