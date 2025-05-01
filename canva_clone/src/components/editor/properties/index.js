'use client' 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { fontFamilies } from '@/config';
import { borderStyles, cloneSelectObject, deleteSelectedCanvasObject } from '@/fabric/fabric-utils';
import { useEditorStore } from '@/store'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Copy, FlipHorizontal, FlipVertical, Italic, MoveDown, MoveUp, Trash, Underline } from 'lucide-react';
import React, { useEffect, useReducer, useState } from 'react'

function Properties() {
  const { canvas } = useEditorStore();

  const [selectedObject, setSelectedObject] = useState(null);

  // Common
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);


  const [objectType, setObjectType] = useState("");
//text

const initialTextState = {
  text: '',
  fontSize: 24,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fontStyle: 'normal',
  underline: false,
  textColor: '#000000',
  textBackGroundColor: '',
  letterSpacing: 0,
};


//for 


const initialShapeState = {
  fillColor: "#ffffff",
  borderColor: "#000000",
  borderWidth: 0,
  borderStyle: "solid",
  filter: "none",
  blur: 0
};



function textReducer(state, action) {
  switch (action.type) {
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload };
    case 'SET_FONT_WEIGHT':
      return { ...state, fontWeight: action.payload };
    case 'SET_FONT_STYLE':
      return { ...state, fontStyle: action.payload };
    case 'SET_UNDERLINE':
      return { ...state, underline: action.payload };
    case 'SET_TEXT_COLOR':
      return { ...state, textColor: action.payload };
    case 'SET_BACKGROUND_COLOR':
      return { ...state, textBackGroundColor: action.payload };
    case 'SET_LETTER_SPACING':
      return { ...state, letterSpacing: action.payload };
    default:
      return state;
  }
}
function shapeReducer(state, action) {
  switch (action.type) {
    case "SET_FILL_COLOR":
      return { ...state, fillColor: action.payload };
    case "SET_BORDER_COLOR":
      return { ...state, borderColor: action.payload };
    case "SET_BORDER_WIDTH":
      return { ...state, borderWidth: action.payload };
    case "SET_BORDER_STYLE":
      return { ...state, borderStyle: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_BLUR":
      return { ...state, blur: action.payload };
    case "SET_ALL":
      return { ...state, ...action.payload }; // optional: for bulk updates
    default:
      return state;
  }
}

const [textState, dispatch] = useReducer(textReducer, initialTextState);
const {
  text,
  fontSize,
  fontFamily,
  fontWeight,
  fontStyle,
  underline,
  textColor,
  textBackGroundColor,
  letterSpacing
}  =  textState;

//image//shapes
const [shapeState, dispatchShape] = useReducer(shapeReducer, initialShapeState);

const { fillColor,
  borderColor,
  borderWidth,
  borderStyle,
  filter,
  blur}= shapeState


  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreatedOrUpdated = () => {
      const activeObject = canvas.getActiveObject();

      console.log(activeObject.type,"typoe deko");
      
      if (activeObject) {
        //common properties
        setSelectedObject(activeObject);
        setOpacity(Math.round((activeObject.opacity ?? 1) * 100));
        setWidth(Math.round(activeObject.width * activeObject.scaleX));
        setHeight(Math.round(activeObject.height * activeObject.scaleY));
        if(activeObject.stroke){
          dispatchShape({type:"SET_BORDER_COLOR", payload:activeObject.stroke})
        }else{
          dispatchShape({type:"SET_BORDER_COLOR", payload:"#000000"})
        }
        if(activeObject.strokeWidth){
          dispatchShape({type:"SET_BORDER_WIDTH", payload:activeObject.strokeWidth})
        }else{
          dispatchShape({type:"SET_BORDER_WIDTH", payload:0})
        }
      }


      //border style
      if (activeObject.strokeDashArray) {
        const dashArray = activeObject.strokeDashArray;
      console.log(dashArray);
      
        if (dashArray[0] === 5 && dashArray[1] === 5) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "dashed" });
        } else if (dashArray[0] === 2 && dashArray[1] === 2) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "dotted" });
        } else if (
          dashArray[0] === 10 && dashArray[1] === 5
        ) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "double" });
        } else if (
          dashArray[0] === 8 && dashArray[1] === 3 && dashArray[2] === 2 && dashArray[3] === 3
        ) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "groove" });
        } else if (
          dashArray[0] === 6 && dashArray[1] === 3 && dashArray[2] === 4 && dashArray[3] === 2
        ) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "ridge" });
        } else if (
          dashArray[0] === 12 && dashArray[1] === 4 && dashArray[2] === 3 && dashArray[3] === 3
        ) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "inset" });
        } else if (
          dashArray[0] === 7 && dashArray[1] === 2 && dashArray[2] === 4 && dashArray[3] === 2
        ) {
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "outset" });
        } else {
          // If no matching strokeDashArray is found, set the border style to solid
          dispatchShape({ type: "SET_BORDER_STYLE", payload: "solid" });
        }
      }





      //check the selection type
      if(activeObject.type=== 'i-text'){
        setObjectType('text')
        console.log("im in r");
        
        dispatch({type:"SET_TEXT", payload:activeObject.text|| ""});
        dispatch({type:"SET_FONT_WEIGHT",payload:activeObject.fontWeight || 'normal'});
        dispatch({type:"SET_FONT_FAMILY",payload:activeObject.fontFamily || 'Arial'});
        dispatch({type:"SET_FONT_SIZE",payload:activeObject.fontSize || 24});
        dispatch({type:"SET_FONT_STYLE",payload:activeObject.fontStyle || 'normal'});
        dispatch({type:"SET_TEXT_COLOR",payload:activeObject.fill || "#000000"});
        dispatch({type:"SET_UNDERLINE",payload:activeObject.underline || false});
        dispatch({type:"SET_BACKGROUND_COLOR",payload:activeObject.backgroundColor || ""});
        dispatch({type:"SET_LETTER_SPACING",payload:activeObject.charSpacing || 0});


        //border
      }else if(activeObject.type === 'image'){
        setObjectType('image')
         
      if(activeObject.filters && activeObject.filters.length>0){
         const filterObj = activeObject.filters[0];
         console.log(filterObj);
         
         if (filterObj.type === "GrayScale") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "grayscale"
          });
        } else if (filterObj.type === "Sepia") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "sepia"
          });
        } else if (filterObj.type === "Invert") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "invert"
          });
        } else if (filterObj.type === "Blur") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "blur"
          });
          dispatchShape({
            type: "SET_BLUR",
            payload: filterObj.blur * 100 || 0
          });
        } else if (filterObj.type === "Brightness") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "brightness"
          });
        } else if (filterObj.type === "Contrast") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "contrast"
          });
        } else if (filterObj.type === "Saturate") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "saturate"
          });
        } else if (filterObj.type === "HueRotate") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "hue-rotate"
          });
        } else if (filterObj.type === "Opacity") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "opacity"
          });
        } else if (filterObj.type === "None") {
          dispatchShape({
            type: "SET_FILTER",
            payload: "none"
          });
        }
        
      }
     
      }else if(activeObject.type === 'path'){
        setObjectType('path')
      }else{
        console.log(activeObject);
        
        setObjectType('shape')
        if(activeObject.fill &&  typeof activeObject.fill == 'string'){
          dispatchShape({type:"SET_FILL_COLOR", payload:activeObject.fill})
        }
       


        if (activeObject.strokeDashArray) {
          const dashArray = activeObject.strokeDashArray;
        console.log(dashArray);
        
          if (dashArray[0] === 5 && dashArray[1] === 5) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "dashed" });
          } else if (dashArray[0] === 2 && dashArray[1] === 2) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "dotted" });
          } else if (
            dashArray[0] === 10 && dashArray[1] === 5
          ) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "double" });
          } else if (
            dashArray[0] === 8 && dashArray[1] === 3 && dashArray[2] === 2 && dashArray[3] === 3
          ) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "groove" });
          } else if (
            dashArray[0] === 6 && dashArray[1] === 3 && dashArray[2] === 4 && dashArray[3] === 2
          ) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "ridge" });
          } else if (
            dashArray[0] === 12 && dashArray[1] === 4 && dashArray[2] === 3 && dashArray[3] === 3
          ) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "inset" });
          } else if (
            dashArray[0] === 7 && dashArray[1] === 2 && dashArray[2] === 4 && dashArray[3] === 2
          ) {
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "outset" });
          } else {
            // If no matching strokeDashArray is found, set the border style to solid
            dispatchShape({ type: "SET_BORDER_STYLE", payload: "solid" });
          }
        }
        
      }
    };

    const handleSelectionCleared = () => {
      // setSelectedObject(null);
    };

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      handleSelectionCreatedOrUpdated();
    }

    canvas.on('selection:created', handleSelectionCreatedOrUpdated);
    canvas.on('selection:updated', handleSelectionCreatedOrUpdated);
    canvas.on('object:modified', handleSelectionCreatedOrUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('selection:created', handleSelectionCreatedOrUpdated);
      canvas.off('selection:updated', handleSelectionCreatedOrUpdated);
      canvas.off('object:modified', handleSelectionCreatedOrUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas]);



const handleTextChange =(e)=>{
 const newText =e.target.value;
 dispatch({type:"SET_TEXT", payload:newText})
 console.log("im in r");
 
  updateObjectProperty('text', newText);
}

const handleFontSizeChange =(e)=>{
  const newSize =Number(e.target.value);
  dispatch({type:"SET_FONT_SIZE", payload:newSize})
  updateObjectProperty('fontSize', newSize);
}
const handleFontFamilyChange =(value)=>{
  
  
  const newFamily =value
  dispatch({type:"SET_FONT_FAMILY", payload:newFamily})
  updateObjectProperty('fontFamily', newFamily);
}
const handleToggleBold =(e)=>{
  const newWeight = fontWeight === "bold" ? "normal" : "bold"
  dispatch({type:"SET_FONT_WEIGHT", payload:newWeight})
  updateObjectProperty('fontWeight', newWeight);
  
}
const handleToggleItalic =(e)=>{
  const newStyle = fontStyle === "italic" ? "normal" : "italic"
  dispatch({type:"SET_FONT_STYLE", payload:newStyle})
  updateObjectProperty('fontStyle', newStyle);
}

const handleToggleUnderLine=(e)=>{
 const newUnderLine=!underline;
  dispatch({type:"SET_UNDERLINE", payload:newUnderLine})
  updateObjectProperty('underline', newUnderLine);
}

const handleToggleTextColorChange =(e)=>{
  
  const newTextColor =e.target.value;
  dispatch({type:"SET_TEXT_COLOR", payload:newTextColor})
  updateObjectProperty('fill', newTextColor); 
}


const handleToggleTextBackgroundColorChange =(e)=>{
  const newTextBackGroundColor =e.target.value;
  dispatch({type:"SET_BACKGROUND_COLOR", payload:newTextBackGroundColor})
  updateObjectProperty('backgroundColor', newTextBackGroundColor); 
}

const handleLetterSpacingChange =(value)=>{
  const newSpacing =value[0];
  dispatch({type:"SET_LETTER_SPACING", payload:newSpacing});
  updateObjectProperty('charSpacing',newSpacing)
}




//FillColorChange
const handleFillColorChange =(event)=>{
  const newFilterColor =event.target.value;
  dispatchShape({type:"SET_FILL_COLOR", payload :newFilterColor});
  updateObjectProperty('fill',newFilterColor);
}

const handleBorderWidthChange =(value)=>{
  console.log(value[0]);
  
  const newBorderWidth =value[0];
  dispatchShape({type:"SET_BORDER_WIDTH", payload :newBorderWidth});
  updateObjectProperty('strokeWidth',newBorderWidth);
}

const handleBorderColorChange=(event)=>{
  const newBorderColor =event.target.value;
  dispatchShape({type:"SET_BORDER_COLOR", payload :newBorderColor});
  updateObjectProperty('stroke',newBorderColor);
}



const handleBorderStyle = (value) => {
  const newBorderStyle = value;
  dispatchShape({ type: "SET_BORDER_STYLE", payload: newBorderStyle });
  let strokeDashArray = null;

  switch (newBorderStyle) {
    case "dashed":
      strokeDashArray = [5, 5];  // For dashed border
      break;
    case "dotted":
      strokeDashArray = [2, 2];  // For dotted border
      break;
    case "double":
      strokeDashArray = [10, 5];  // For double border
      break;
    case "groove":
      strokeDashArray = [8, 3, 2, 3];  // For groove border
      break;
    case "ridge":
      strokeDashArray = [6, 3, 4, 2];  // For ridge border
      break;
    case "inset":
      strokeDashArray = [12, 4, 3, 3];  // For inset border
      break;
    case "outset":
      strokeDashArray = [7, 2, 4, 2];  // For outset border
      break;
    default:
      strokeDashArray = null; // For solid or no border
  }


  updateObjectProperty("strokeDashArray", strokeDashArray);


};









  const updateObjectProperty = (property, value) => {
    if (!canvas || !selectedObject) return;

    if (property === 'width') {
      selectedObject.set({
        scaleX: 1,
        width: value
      });
    } else if (property === 'height') {
      selectedObject.set({
        scaleY: 1,
        height: value
      });
    } else {
      selectedObject.set(property, value);
    }

    canvas.renderAll();
    markAsModified()
  };

  const handleOpacityChange = (value) => {
    const newValue = Number(value[0]);
    setOpacity(newValue);
    updateObjectProperty('opacity', newValue / 100);
  };

  const handleWidthChange = (e) => {
    const newValue = Number(e.target.value);
    setWidth(newValue);
    updateObjectProperty('width', newValue);
  };

  const handleHeightChange = (e) => {
    const newValue = Number(e.target.value);
    setHeight(newValue);
    updateObjectProperty('height', newValue);
  };

//sentToback
const handleSendToFront=()=>{
  if(!canvas || !selectedObject) return;
  canvas.bringObjectToFront(selectedObject)
  canvas.renderAll()
  markAsModified()
  
}
//senttoFront
const handleSentToBack=()=>{
  if(!canvas || !selectedObject) return;
  canvas.sendObjectToBack(selectedObject);
  canvas.renderAll()
  markAsModified()
}
  //duplicate
const handleDuplicate =async()=>{
   if(!canvas || !selectedObject) return;

   await cloneSelectObject(canvas);
   markAsModified();
}

//delete
const handleDelete =()=>{
  if(!canvas || !selectedObject) return;

   deleteSelectedCanvasObject(canvas);
   markAsModified();
}

//Flip H and Flip V
const handleFlipHorizontal =()=>{
  if(!canvas || !selectedObject) return;

  const flipX = !selectedObject.flipX;
  
  updateObjectProperty('flipX', flipX)

}

const handleFlipVertical =()=>{
  if(!canvas || !selectedObject) return;

  const flipY = !selectedObject.flipY;
  
  updateObjectProperty('flipY', flipY)

}


//image related
const handleImageFilterChange =async(value)=>{
  console.log(value,'filter');
  
   dispatchShape({
    type:"SET_FILTER",
    payload:value
   });
   console.log(filter,'filter11')
   if(!canvas || !selectedObject || selectedObject.type !== 'image') return;

   try{
     canvas.discardActiveObject()

     const {filters}=await import('fabric');

     selectedObject.filters=[];
     switch (value) {
      case 'grayscale':
        selectedObject.filters.push(new filters.Grayscale());
        break;
    
      case 'sepia':
        selectedObject.filters.push(new filters.Sepia());
        break;
    
      case 'invert':
        selectedObject.filters.push(new filters.Invert());
        break;
    
      case 'blur':
        selectedObject.filters.push(new filters.Blur({ blur: blur/100 })); 
        break;
    
      case 'brightness':
        selectedObject.filters.push(new filters.Brightness({ brightness: 0.05 })); // adjust value as needed
        break;
    
      case 'contrast':
        selectedObject.filters.push(new filters.Contrast({ contrast: 0.1 })); // adjust value as needed
        break;
    
      case 'saturate':
        selectedObject.filters.push(new filters.Saturation({ saturation: 0.3 })); // only in newer versions of Fabric.js
        break;
    
      case 'hue-rotate':
        selectedObject.filters.push(new filters.HueRotation({ rotation: 1 })); // value in radians
        break;
    
      case 'opacity':
        selectedObject.filters.push(new filters.BlendColor({ color: '#ffffff', alpha: 0.5, mode: 'tint' }));
        break;
    
      case 'none':
        selectedObject.filters = []; // Clear filters
        break;
    
      default:
        selectedObject.filters = []; // Clear filters
        break;
    }
   
    selectedObject.applyFilters()
    canvas.setActiveObject(selectedObject)
    canvas.renderAll()
    markAsModified()
   }catch(e){
 console.error("Failed to apply filters");

   }

}


const handleBlurChange =  async(value)=>{
  const newBlurValue = value[0];
  dispatchShape({
    type:"SET_BLUR",
    payload:newBlurValue
   });
   console.log(blur,'filter32')
    if(!canvas || !selectedObject || !selectedObject.type!== 'image' || filter !== "blur") return

    try{
       const {filters} = await import('fabric');
       selectedObject.filters.push(new filters.Blur({ blur: newBlurValue/100 })); 
       selectedObject.applyFilters();
       canvas.renderAll();
       markAsModified()
       dispatchShape({
        type:"SET_BLUR",
        payload:newBlurValue
       });

    }catch(e){
console.error('Error while applying blur !', e);

    }

}
    

  return (
    <div className='fixed right-0 top-[56px] bottom-0 w-[280px] bg-white border-l border-gray-200 z-10'>
      <div className='flex items-center justify-between p-3 border-b'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Properties</span>
        </div>
      </div>

      <div className='h-[calc(100%-96px)] overflow-auto p-4 space-y-6'>
        <h3 className='text-sm font-medium'>Size & Position</h3>

        {/* Width & Height */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1'>
            <Label className="text-sm">Width</Label>
            <input
              type="number"
              value={width}
              onChange={handleWidthChange}
              className="h-9 px-3 py-2 border rounded-md w-full"
            />
          </div>

          <div className='space-y-1'>
            <Label className="text-sm">Height</Label>
            <input
              type="number"
              value={height}
              onChange={handleHeightChange}
              className="h-9 px-3 py-2 border rounded-md w-full"
            />
          </div>
        </div>

        {/* Opacity */}
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <Label htmlFor="opacity" className="text-sm">Opacity</Label>
            <span>{opacity}%</span>
          </div>
          <Slider
            id="opacity"
            min={0}
            max={100}
            step={1}
            value={[opacity]}
            onValueChange={handleOpacityChange}
          />
        </div>

        {/* Flip H, Flip V */}
        <div className='flex flex-wrap gap-2'>
          <Button variant={'outline'} onClick={handleFlipHorizontal} size='sm' className={"h-8 text-xs"}>
             <FlipHorizontal className='h-4 w-4 mr-1'/>
             Flip H
          </Button>
          <Button  variant={'outline'} onClick={handleFlipVertical} size='sm' className={"h-8 text-xs"}>
             <FlipVertical className='h-4 w-4 mr-1'/>
             Flip v
          </Button>
          </div>

          {/* Arrangement */}
          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-sm font-medium'>
               Layer Position
            </h3>
            <div className='grid grid-cols-2 gap-2'>
                  <Button variant={'outline'} onClick={handleSendToFront} size='sm' className={"h-8 text-xs"}>
                    <MoveUp className='w-4 h-4'/>
                    <span>Bring to front</span>
                  </Button>
                  <Button variant={'outline'} size='sm'onClick={handleSentToBack} className={"h-8 text-xs"}>
                    <MoveDown className='w-4 h-4'/>
                    <span>Send to back</span>
                  </Button>

            </div>
          </div>

          {/* Duplicate and Delete */}
          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-sm font-medium'>
               Duplicate and Delete
            </h3>
            <div className='grid grid-cols-2 gap-2'>
                  <Button variant={'default'} size='sm' className={"h-8 text-xs"}
                  onClick={handleDuplicate}
                  >
                    <Copy  className='w-4 h-4'/>
                    <span>Duplicate</span>
                  </Button>
                  <Button variant={'destructive'} size='sm' className={"h-8 text-xs"}  onClick={handleDelete}>
                    <Trash className='w-4 h-4'/>
                    <span>Delete</span>
                  </Button>

            </div>
          </div>


          {/* Text related properties */}

          {
            objectType && objectType === "text" && (
              <div className='space-y-4 border-t'>
                <h3 className='text-sm font-medium'>Text Properties</h3>
                <div className='space-y-2'>
                  <Label htmlFor="text-content" className={'text-sm'}
                  >
                   
                    Text Content 
                  </Label>
                  <Textarea
                    id="text-content"
                    value={text}
                    onChange={handleTextChange}
                    className={'h-20 resize-none'}
                    />
                  </div>
                  <div className='space-y-2'>
                  <Label htmlFor="font-size" className={'text-sm'}
                  >
                   
                    Font Size
                  </Label>
                  <Input
                    id="font-size"
                    value={fontSize}
                    className={"w-16 h-7 text-sm"}
                    onChange={(e)=>handleFontSizeChange(e)}
                    type={"number"}
                    />
                  </div>

            <div className='space-y-2'>

              <Label htmlFor="font-family"
              className="text-sm"
              >
               Font family
              </Label>
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
               <SelectTrigger id="font-family" className={'h-10'}>
                      <SelectValue placeholder="Select FontFamily"/>
               </SelectTrigger>
                <SelectContent>
                  {
                    fontFamilies.map(fontItem =>
                      <SelectItem key={fontItem} value={fontItem} style={{
                        fontFamily:fontItem
                      }}>
                        {fontItem}
                      </SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
              </div>
              <div className='space-y-2'>
                  <Label  className={'text-sm'}
                  >
                   Style
                  </Label>
                  <div className='flex gap-2'>

                    <Button className={'w-8 h-8'} variant={fontWeight === "bold" ? "default" :"outline"}
                    size="icon"
                    onClick={handleToggleBold}
                    >
                     <Bold className='w-4 h-4'/>
                    </Button>

                    <Button className={'w-8 h-8'} variant={fontStyle === "italic" ? "default" :"outline"}
                    size="icon"
                    onClick={handleToggleItalic}
                    >
                     <Italic className='w-4 h-4'/>
                    </Button>

                    <Button 
                    className={'w-8 h-8'} 
                    variant={underline? "default" :"outline"}
                    size="icon"
                    onClick={handleToggleUnderLine}
                    >
                     <Underline className='w-4 h-4'/>
                    </Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                  <Label  className={'text-sm'} htmlFor="text-color" 
                  >
                   Text Color
                  </Label>
                  <div className='relative w-8 h-8 overflow-hidden rounded-md border'>
                    <div className='absolute inset-0'
                    
                    style={{backgroundColor: textColor}}>
                    <Input
                  id="text-color"
                  type="color"
                  value={
                    textColor
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleToggleTextColorChange}
                  />
                      </div>
                    </div>

                  
                  <Label  className={'text-sm'} htmlFor="text-color" 
                  >
                   Text BG Color
                  </Label>
                  <div className='relative w-8 h-8 overflow-hidden rounded-md border'>
                    <div className='absolute inset-0'
                    
                    style={{backgroundColor: textBackGroundColor}}>
                    <Input
                  id="text-color"
                  type="color"
                  value={
                    textColor
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleToggleTextBackgroundColorChange}
                  />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                 <div className='flex justify-between'>
                 <Label  className={'text-xs'} htmlFor="letter-spacing" 
                  >
                   Lateral Spacing
                  </Label>

                  <span className='text-xs'>
    {letterSpacing}
                  </span>
                  </div>
                 <Slider id="letter-spacing"
                 min={-200}
                 max={800}
                 step={10}
                 value={[letterSpacing]}
                 onValueChange={(value)=>handleLetterSpacingChange(value)}
                 />
                  </div>
                  </div>
                
                
            )
          }


          {
            objectType == 'shape' && (
              <div className='space-y-4 p-4 border-t'>
                <h3 className='text-sm'>Shape Properties</h3>
                <div>
                 
                  

                  <div className='flex justify-between'>
                  <div className='space-y-2'>
                  <Label  className={'text-sm'} htmlFor="fill-color" 
                  >
                   Fill Color
                  </Label>
                  <div className='relative w-8 h-8 overflow-hidden rounded-md border'>
                    <div className='absolute inset-0'
                    
                    style={{backgroundColor: fillColor}}>
                    <Input
                  id="fill-color"
                  type="color"
                  value={
                    fillColor
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFillColorChange}
                  />
                      </div>
                    </div>
                    </div>

{/* BorderColor */}
                    <div className='space-y-2'>
                  <Label  className={'text-sm'} htmlFor="border-color" 
                  >
                   Border Color
                  </Label>
                  <div className='relative w-8 h-8 overflow-hidden rounded-md border'>
                    <div className='absolute inset-0'
                    
                    style={{backgroundColor: borderColor}}>
                    <Input
                  id="border-color"
                  type="color"
                  value={
                    borderColor
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleBorderColorChange}
                  />
                      </div>
                    </div>
                    </div>

                    </div>



                  

                 <div className='space-y-2 mt-2'>
                           <Label htmlFor="border-width" className={'text-xs'}>
                                 Border Width
                           </Label>
                           <span className={'text-xs mb-2'}>
                            {borderWidth}%
                           </span>
                           <Slider
                           id="border-width"
                           min={0}
                           max={20}
                           step={1}
                           value={[borderWidth]}
                           onValueChange={(value)=> handleBorderWidthChange(value)}
                           />
                    </div>

                    <div className='space-y-2 mt-2'>
                           <Label htmlFor="border-style" className={'text-xs'}>
                                 Border style
                           </Label>
                           <Select  value={borderStyle} onValueChange={handleBorderStyle}>
               <SelectTrigger id="border-style" className={'h-10'}>
                      <SelectValue placeholder="Select Border Style"/>
               </SelectTrigger>
                <SelectContent>
                  {
                    borderStyles.map((style) => (
                      <SelectItem
                        key={style}
                        value={style}
                        style={{
                          border: `2px ${style} black`,
                          padding: "4px",
                        }}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
                    </div>

                </div>
                </div>
            )
          }

          {
            objectType === "image" && (
              <div className='space-y-4 p-4 border-t'>
              <h3 className='text-sm font-bold'>Image Properties</h3>



              <div className='space-y-2'>
                  <Label  className={'text-sm'} htmlFor="border-color" 
                  >
                   Border Color
                  </Label>
                  <div className='relative w-8 h-8 overflow-hidden rounded-md border'>
                    <div className='absolute inset-0'
                    
                    style={{backgroundColor: borderColor}}>
                    <Input
                  id="border-color"
                  type="color"
                  value={
                    borderColor
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleBorderColorChange}
                  />
                      </div>
                    </div>
                    </div>



                    <div className='space-y-2 mt-2'>
                           <Label htmlFor="border-width" className={'text-xs'}>
                                 Border Width
                           </Label>
                           <span className={'text-xs mb-2'}>
                            {borderWidth}%
                           </span>
                           <Slider
                           id="border-width"
                           min={0}
                           max={20}
                           step={1}
                           value={[borderWidth]}
                           onValueChange={(value)=> handleBorderWidthChange(value)}
                           />
                    </div>

                    <div className='space-y-2 mt-2'>
                           <Label htmlFor="border-style" className={'text-xs'}>
                                 Border style
                           </Label>
                           <Select  value={borderStyle} onValueChange={handleBorderStyle}>
               <SelectTrigger id="border-style" className={'h-10'}>
                      <SelectValue placeholder="Select Border Style"/>
               </SelectTrigger>
                <SelectContent>
                  {
                    borderStyles.map((style) => (
                      <SelectItem
                        key={style}
                        value={style}
                        style={{
                          border: `2px ${style} black`,
                          padding: "4px",
                        }}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
                    </div>



                    <div className='space-y-2'>
                  <Label  className={'text-sm'} htmlFor="filter" 
                  >
                   Filter
                  </Label>
                  <Select  value={filter} onValueChange={handleImageFilterChange}>
               <SelectTrigger id="filter" className={'h-10'}>
                      <SelectValue placeholder="Select Image Style"/>
               </SelectTrigger>
                <SelectContent>
                  
                <SelectItem value="none">None</SelectItem>
<SelectItem value="grayscale">Grayscale</SelectItem>
<SelectItem value="sepia">Sepia</SelectItem>
<SelectItem value="invert">Invert</SelectItem>
<SelectItem value="blur">Blur</SelectItem>
<SelectItem value="brightness">Brightness</SelectItem>
<SelectItem value="contrast">Contrast</SelectItem>
<SelectItem value="saturate">Saturate</SelectItem>
<SelectItem value="hue-rotate">Hue Rotate</SelectItem>
<SelectItem value="opacity">Opacity</SelectItem>

                </SelectContent>
              </Select>
              <div>
                {
                  filter === "blur" && (
                    <div className='space-y-2'>
                      <div className='flex justify-between mb-2'>
                        <Label htmlFor="blur" className='text-xs'>Blur Amount</Label>
                        <span className='font-medium text-xs'>{blur}%</span>
                      </div>
                      <Slider
                      id="blur"
                      min={0}
                      max={100}
                      step={1}
                      value={[blur]}
                      onValueChange={(value)=> handleBlurChange(value)}
                      />


                      </div> 
                  )
                }
                </div>
                      </div>
              </div>
            )
          }

{
            objectType === "path" && (
              <div className='space-y-4 p-4 border-t'>
              <h3 className='text-sm font-bold'>Path Properties</h3>



              <div className='space-y-2'>
                  <Label  className={'text-sm'} htmlFor="border-color" 
                  >
                   Border Color
                  </Label>
                  <div className='relative w-8 h-8 overflow-hidden rounded-md border'>
                    <div className='absolute inset-0'
                    
                    style={{backgroundColor: borderColor}}>
                    <Input
                  id="border-color"
                  type="color"
                  value={
                    borderColor
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleBorderColorChange}
                  />
                      </div>
                    </div>
                    </div>



                    <div className='space-y-2 mt-2'>
                           <Label htmlFor="border-width" className={'text-xs'}>
                                 Border Width
                           </Label>
                           <span className={'text-xs mb-2'}>
                            {borderWidth}%
                           </span>
                           <Slider
                           id="border-width"
                           min={0}
                           max={20}
                           step={1}
                           value={[borderWidth]}
                           onValueChange={(value)=> handleBorderWidthChange(value)}
                           />
                    </div>

                    <div className='space-y-2 mt-2'>
                           <Label htmlFor="border-style" className={'text-xs'}>
                                 Border style
                           </Label>
                           <Select  value={borderStyle} onValueChange={handleBorderStyle}>
               <SelectTrigger id="border-style" className={'h-10'}>
                      <SelectValue placeholder="Select Border Style"/>
               </SelectTrigger>
                <SelectContent>
                  {
                    borderStyles.map((style) => (
                      <SelectItem
                        key={style}
                        value={style}
                        style={{
                          border: `2px ${style} black`,
                          padding: "4px",
                        }}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
                    </div>



                   
              </div>
            )
          }
      </div>
    </div>
  );
}

export default Properties;
