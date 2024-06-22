type rgbObj = {
    r: number;
    g: number;
    b: number;
}

function componentToHex(c:number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r:number, g:number, b:number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

function getAverageColor(colors:any[], black: boolean=false){
    let r=0;
    let g=0;
    let b=0;
    colors.forEach(c=>{
      if(!black){
        r+=c.r;
        g+=c.g;
        b+=c.b;
      }
      else{
        r+=c.r+30;
        g+=c.g+30;
        b+=c.b+30;
      }  
    })
    return rgbToHex(Math.round(r/colors.length),Math.round(g/colors.length),Math.round(b/colors.length));
}


const findBiggestColorRange = (rgbValues:any) => {
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;
  
    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;
  
    rgbValues.forEach((pixel:rgbObj) => {
      rMin = Math.min(rMin, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      bMin = Math.min(bMin, pixel.b);
  
      rMax = Math.max(rMax, pixel.r);
      gMax = Math.max(gMax, pixel.g);
      bMax = Math.max(bMax, pixel.b);
    });
  
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
  
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return "r";
    } else if (biggestRange === gRange) {
      return "g";
    } else {
      return "b";
    }
  };

  const quantization = (rgbValues:any, depth:number):any => {

    const MAX_DEPTH = 5;
     if (depth === MAX_DEPTH || rgbValues.length === 0) {
       const color = rgbValues.reduce(
         (prev:any, curr:any) => {
           prev.r += curr.r;
           prev.g += curr.g;
           prev.b += curr.b;
   
           return prev;
         },
         {
           r: 0,
           g: 0,
           b: 0,
         }
       );
   
       color.r = Math.round(color.r / rgbValues.length);
       color.g = Math.round(color.g / rgbValues.length);
       color.b = Math.round(color.b / rgbValues.length);
       return [color];
     }
     const before = [...rgbValues];
     const componentToSortBy = findBiggestColorRange(rgbValues);
     rgbValues.sort((p1:any, p2:any) => {
       return p1[componentToSortBy] - p2[componentToSortBy];
     });
     const mid = rgbValues.length / 2;
     return [
       ...quantization(rgbValues.slice(0, mid), depth + 1),
       ...quantization(rgbValues.slice(mid + 1), depth + 1),
     ];
   }

const buildRgb = (imageData:Uint8ClampedArray) => {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = {
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      };
      rgbValues.push(rgb);
    }
    return rgbValues;
  };

function getDominantColors(colors:any[]){
    let black = 0;
    let blue = 0;
    let lime = 0;
    let cyan = 0;
    let red = 0;
    let magenta = 0;
    let yellow = 0;
    let white = 0;
    let hex = '#000000';

    let allColors = [0,0,0,0,0,0,0,0];

    let blackArray: any[] = [];
    let blueArray: any[]  = [];
    let limeArray : any[] = [];
    let cyanArray: any[]  = [];
    let redArray: any[]  = [];
    let magentaArray: any[]  = [];
    let yellowArray: any[]  = [];
    let whiteArray: any[]  = [];

    colors.forEach((c:any, i:number)=>{
        if(c.r<128){
            if(c.g < 128){
                if(c.b<128){
                    black++;
                    allColors[0]=black;
                    blackArray.push(c);
                }
                else{
                    blue++;
                    allColors[1]=blue;
                    blueArray.push(c);
                }
            }
            else{
                if(c.b<128){
                    lime++;
                    allColors[2]=lime;
                    limeArray.push(c);
                }
                else{
                    cyan++;
                    allColors[3]=cyan;
                    cyanArray.push(c);
                }
            }
        }
        else{
            if(c.g < 128){
                if(c.b<128){
                    red++;
                    allColors[4]=red;
                    redArray.push(c);
                }
                else{
                    magenta++;
                    allColors[5]=magenta;
                    magentaArray.push(c);
                }
            }
            else{
                if(c.b<128){
                    yellow++;
                    allColors[6]=yellow;
                    yellowArray.push(c);
                }
                else{
                    white++;
                    allColors[7]=white;
                    whiteArray.push(c);
                }
            }
        }
    });
    if(allColors.indexOf(Math.max(...allColors))===0){
        hex = getAverageColor(blackArray, true);
    }
    if(allColors.indexOf(Math.max(...allColors))===1){
        hex = getAverageColor(blueArray);
    }
    if(allColors.indexOf(Math.max(...allColors))===2){
        hex =  getAverageColor(limeArray);
    }
    if(allColors.indexOf(Math.max(...allColors))===3){
        hex = getAverageColor(cyanArray);
    }
    if(allColors.indexOf(Math.max(...allColors))===4){
        hex = getAverageColor(redArray);
    }
    if(allColors.indexOf(Math.max(...allColors))===5){
        hex = getAverageColor(magentaArray);
    }
    if(allColors.indexOf(Math.max(...allColors))===6){
        hex = getAverageColor(yellowArray);
    }
    if(allColors.indexOf(Math.max(...allColors))===7){
        hex = getAverageColor(whiteArray);
    }
    return hex;
}

export async function getImageColors(imageUrl: string ) {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = 'Anonymous';
    const maxWidth = 150;
    return new Promise((resolve, reject)  => {
        image.onload = () =>{
        const canvas = document.createElement('canvas');
        const aspectRatio = image.width / image.height;
        let newWidth = image.width;
        let newHeight = image.height;

        if (image.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        }
        canvas.width = newHeight;
        canvas.height = newWidth;
        const ctx = canvas.getContext('2d');
        if(ctx){
            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const rgbValues = buildRgb(imageData.data);
            const componentToSortBy = findBiggestColorRange(rgbValues);
            rgbValues.sort((p1:any, p2:any) => {
              return p1[componentToSortBy] - p2[componentToSortBy];
            });
            const colors = quantization(rgbValues, 0);
            resolve(getDominantColors(colors));
        }
    }
    })
}

export function invertHexColor(hexColor: string): string {

  hexColor = hexColor.replace(/^#/, '');
  const bigint = parseInt(hexColor, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const invertedR = 255 - r;
  const invertedG = 255 - g;
  const invertedB = 255 - b;

  const invertedHex =
    '#' +
    (1 << 24 | invertedR << 16 | invertedG << 8 | invertedB).toString(16).slice(1);
  return invertedHex;
}

export function hexToRgba(hex:string, alpha:number) {

  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const result = `rgba(${r}, ${g}, ${b}, ${alpha})`;

  return result;
}
