"use client"

import { customizeBoundingBox, initializeFabric } from '@/fabric/fabric-utils';
import { shapeDefinitions } from '@/fabric/shapes/shape-definition';
import { useEditorStore } from '@/store';
import React, { useEffect, useRef } from 'react'

function Canvas() {


  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef =useRef(null);
  const initAttemptedRef = useRef(false);
  const {setCanvas, markAsModified} =useEditorStore();


  useEffect(()=>{
     const cleanUpCanvas = ()=>{
      if(fabricCanvasRef.current){
        try{
          const handleCanvasChange =()=>{
            //to implement the auto save when the canvaa changes ||path change

             //to implement the auto save when the canvaa changes ||path change
  markAsModified();
  console.log("Saved called when auto save working");
            
           }
          fabricCanvasRef.current.off('object:added', handleCanvasChange);
             fabricCanvasRef.current.off('object:modified', handleCanvasChange);
             fabricCanvasRef.current.off('object:removed',handleCanvasChange);
             fabricCanvasRef.current.off('path:created', shapeDefinitions);
          
    }catch(e){
       console.error("Error removing Event Listeners", e);
                 
    }
        try{
              fabricCanvasRef.current.dispose()    
        }catch(e){
           console.error("Error disposing canva", e);
                     
        }
        fabricCanvasRef.current = null;
        setCanvas(null);
      }
     }

     cleanUpCanvas();

     //reset the init flag

     initAttemptedRef.current =false;

     //init our canvas

     const  initCanvas = async()=>{
      if(typeof window === undefined || !canvasRef.current || initAttemptedRef.current){
        return
      }
      initAttemptedRef.current =true;
      try{
             const fabricCanvas = await initializeFabric(canvasRef.current, canvasContainerRef.current);
              //getting canva object storing in store with the Canva Clean
              console.log(fabricCanvas);
              
             if(!fabricCanvas){
              
              console.error("Failed to intialize Fabric.js canvas");

              return 
              
             }




             fabricCanvasRef.current = fabricCanvas

             //set the canvas store 
             setCanvas(fabricCanvas);

             console.log('Canvas init is done and set in store');

             const handleCanvasChange =()=>{
              //to implement the auto save when the canvaa changes ||path change

               //to implement the auto save when the canvaa changes ||path change
    markAsModified();
    console.log("Saved called when auto save working");
              
             }
             //apply custom style to controls
             //todo
             customizeBoundingBox(fabricCanvas)

             fabricCanvas.on('object:added', handleCanvasChange);
             fabricCanvas.on('object:modified', handleCanvasChange);
             fabricCanvas.on('object:removed',handleCanvasChange);

             fabricCanvas.on('path:created', handleCanvasChange);


             //set up event Listeners
             
      }catch(e){
        console.error("Failed to intialize Fabric.js canvas",e);
      }
     }

     const timer = setTimeout(()=>{
      initCanvas();
     },50)


     return ()=>{
      clearTimeout(timer);
      cleanUpCanvas()
     }
  },[])
  return (
    <div className='w-full h-[600px] overflow-auto relative' ref={canvasContainerRef}>
      
      <canvas ref={canvasRef}/>
    </div>
  )
}

export default Canvas