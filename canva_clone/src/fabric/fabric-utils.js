import { fontFamilies } from '@/config';
import { shapeDefinitions, shapeTypes } from './shapes/shape-definition';
import { createShape } from './shapes/shape-factory';

export const initializeFabric =async(canvasEl, containerEl) => {

    try{
        const {Canvas, PencilBrush} =await import('fabric');

        const canvas = new Canvas(canvasEl, {
            preserveObjectStacking:true,
            isDrawingMode : false,
            renderOnAddRemove:true
        })


        //drawing init
        const brush = new PencilBrush(canvas);
        brush.color ="#00000"
        brush.width =5
        canvas.freeDrawingBrush = brush
        return canvas;
    }catch(e){
        console.error("Failed to load fabric",e);
        return null;
        
    }
     
}


export const centerCanvas = (canvas)=>{
    if(!canvas || !canvas.wrapperEl) return;


    const canvasWrapper = canvas.wrapperEl;
    canvasWrapper.style.width =`${canvas.width}px`
    canvasWrapper.style.height =`${canvas.height}px`
    canvasWrapper.style.position = 'absolute';
    canvasWrapper.style.top ="50%"
    canvasWrapper.style.left ="50%"
    canvasWrapper.style.transform ="translate(-50%, -50%)"
}



export const addShapeToCanvas = async(canvas, shapeType,customProps={})=>{
    if(!canvas) return null;
    
    try{
        const fabricModule =await import('fabric');

        const shape =createShape(fabricModule,shapeType,shapeDefinitions,{
            left:100,
            top:100,
            ...customProps
        });

        if(shape){
            shape.id = `${shapeType}-${Date.now()}`
            canvas.add(shape);
            canvas.setActiveObject(shape)
            canvas.renderAll() 
            return shape;       
        }
    }catch(e){
    console.error("Failed to add shapes",e);
    }
}




export const addTextToCanvas = async(canvas, text, options={},withBackground =false)=>{
    if(!canvas) return null;

    try{
      const {IText}=await import('fabric');
    
      const defaultProps ={
        left:100,
        top:100,
        fontSize:24,
        fontFamily:'Arial',
        fill:"#000000",
        padding:withBackground ? 10: 0,
        textAlign: 'left',
        id:`text-${Date.now()}`

      }
      const textObj = new IText(text, {
        ...defaultProps,
        ...options
      })
      console.log({
        ...defaultProps,
        ...options
      });
      
      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
      return textObj
    }catch(e){
    console.error("Failed to add shapes",e);
    
    }
}



export const addImageToCanvas = async(canvas, imageUrl)=>{
  if(!canvas) return null;

  try{
     const {Image:FabricImage} = await import("fabric");

     let imgObj=new Image();
     imgObj.crossOrigin = 'Anonymous'
     imgObj.src=imageUrl

 return new Promise((resolve, reject)=>{
  imgObj.onload =() =>{
    let image = new FabricImage(imgObj);
    image.set({
      id:`image-${Date.now()}`,
      top:100,
      left:100,
      padding:10,
      cornorSize :10
    })
    const maxDimension = 400;
    if(image.width> maxDimension || image.height >maxDimension){
      if(image.width >image.height){
        const scale = maxDimension /image.width
        image.scale(scale);
        
      }else{
        const scale = maxDimension /image.height
        image.scale(scale);
      }
    }
    canvas.add(image);
    canvas.setActiveObject(image);
    canvas.renderAll();
    resolve(image)
   }

   imgObj,onerror =()=>{
    reject(new Error('Failed to load image', imageUrl))
   }
 })

  }catch(e){

    console.error("Error adding image");
    
  return null
  }
}




export const toggleDrawingMode =(
    canvas,
    isDrawingMode,
    drawingColor ="#000000",
    brushWidth =5
)=>{
  try{
    if(!canvas) return null;

    canvas.isDrawingMode =isDrawingMode;
    if(isDrawingMode){
      canvas.freeDrawingBrush.color = drawingColor
      canvas.freeDrawingBrush.width=brushWidth
    }
  
    return true;
  }catch(e){
   return false;
  }
};





export const toggleEraseMode =(canvas, isErasing, previousColor="#000000",earserWidth=20)=>{
   if(!canvas || !canvas.freeDrawingBrush) return false;
   
   
   try{
       if(isErasing){
        canvas.freeDrawingBrush.color = "#ffffff"
        canvas.freeDrawingBrush.width=earserWidth
       }else{
        canvas.freeDrawingBrush.color = previousColor
        canvas.freeDrawingBrush.width=5
       }

       return true
   }catch(e){
    return false
   }
   
}

export const updateDrawingBrush =(canvas, properties={})=>{
  if(!canvas || !canvas.freeDrawingBrush) return false;


  try{
      const {color, width, opacity} = properties;
      if(color !== undefined){
         canvas.freeDrawingBrush.color = color;
      }


      if(width !== undefined){
        canvas.freeDrawingBrush.width = width;
     }

     if(opacity !== undefined){
      canvas.freeDrawingBrush.opacity = opacity;
   }

   return true;
  }catch(e){
    return false;
  }
}


export const cloneSelectObject = async(canvas)=>{
  if(!canvas) return;

  const activeObject =canvas.getActiveObject();

  if(!activeObject) return

  try{
    const clonedObj = await activeObject.clone();
    clonedObj.set({
      left:activeObject.left + 1,
      top :activeObject.top +10,
      id:`${activeObject.type  || 'object'}-${Date.now()}`
    });
    canvas.add(clonedObj);
    canvas.renderAll()
    return clonedObj
  }catch(e){
   console.error('Error while cloning',e);

   return null;
  }
  
}

export const deleteSelectedCanvasObject = async(canvas)=>{
  if(!canvas) return;

  const activeObject =canvas.getActiveObject();

  if(!activeObject) return
     canvas.remove(activeObject);
     canvas.discardActiveObject();
     canvas.renderAll();

     return true
}


export const customizeBoundingBox=(canvas)=>{
  if(!canvas) return

  try{

    canvas.on('object:added',(e)=>{
      if(e.target){
        e.target.set({
          borderColor:'#2196f3',
          cornerColor:'#ffffff',
          cornerStrokeColor:'#2196f3',
          cornerSize:10,
          transparentCorners:false
        })
      }
    })

    canvas.getObjects().forEach(obj => {
      obj.set({
        borderColor:'#2196f3',
        cornerColor:'#ffffff',
        cornerStrokeColor:'#2196f3',
        cornerSize:10,
        transparentCorners:false
      })
    });
  }catch(e){
console.error('Failed to customize BoundingBox');

  }
}

export const borderStyles = ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset", "none"];