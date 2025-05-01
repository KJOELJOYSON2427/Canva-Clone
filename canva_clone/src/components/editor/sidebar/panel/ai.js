"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addImageToCanvas } from "@/fabric/fabric-utils";
import { generateImageFromAi } from "@/services/upload-services";
import { useEditorStore } from "@/store";
import { Loader, Sparkle, Sparkles, Wand2 } from "lucide-react";

import { useReducer } from 'react';
  
function AiPanel() {

  const {canvas}=useEditorStore();

const initialState = {
  prompt: '',
  isLoading: false,
  generatedImage: null,
  isUploading: false,
  uploadSuccess: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GENERATED_IMAGE':
      return { ...state, generatedImage: action.payload };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_SUCCESS':
      return { ...state, uploadSuccess: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
const {prompt,isLoading, isUploading, generatedImage,uploadSuccess}=state


const handlePromptChange=(event)=>{
  dispatch({type:"SET_PROMPT",payload:event.target.value})
}


const handleGenerate =async()=>{
  dispatch({type:"SET_LOADING",payload:true})
  dispatch({type:"SET_GENERATED_IMAGE",payload:null})
  dispatch({type:"SET_UPLOAD_SUCCESS",payload:false})


  try{
  
    await generateImageFunction(prompt);

  }catch(e){
  console.error(e);
  
  }finally{
    dispatch({type:"SET_LOADING",payload:false})
  }
}


const generateImageFunction =async(prompt)=>{
try{
  const response =await generateImageFromAi(prompt);
  console.log(response?.url,"Abdul Kalam");
  
  if(response && response?.url){
    dispatch({type:"SET_GENERATED_IMAGE",payload:response?.url})
  }
  console.log(generatedImage);
}catch(e){
  console.error("Generating Image Error from AI",e);
  
  throw e;
}
}

const handleAiImageToCanvas = async()=>{
  if(!canvas && !generatedImage) return;
   addImageToCanvas(canvas,generatedImage)
}
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2 mb-2">

                  <Wand2 className="w-5 h-5 text-purple-500"/>
                  <h3 className="text-lg font-semibold">AI Image generator</h3>
                </div>
                <div className="space-y-2">
                          <Textarea 
                          onChange={handlePromptChange}
                          value={prompt}
                          placeholder="e.g., A cute dog image..."
                          className={'resize-none min-h-[200px]'}
                          disabled={isLoading}
                          />
                </div>
                <Button
                onClick={handleGenerate}
                disabled ={!prompt.trim() || isLoading}
                className={'w-full'}
                size='lg'
                >
    {
      isLoading ?( <>
       <Loader className="mr-2 h-4 w-4 animate-spin"/>
       Generating...
      </>):<>
       <Sparkles className="mr-2 h-4 w-4"/>
       Generate Image 
      </>
    }
                </Button>
      </div>
      
        {
          isLoading && (
            <div className="border rounded-md bg-gray-50 p-6 flex-col items-center justify-center">
                         <Loader className="w-8 h-8 animate-spin text-purple-500 mb-3"/>
                         <p className="text-sm text-center text-gray-600 ">
                          Creating your image ...
                         </p>
              </div>
          )
        }
      

      {
        generatedImage && !isLoading && 
        <div className="space-y-2">
          <div className="border rounded-md overflow-hidden">

            <img
            src={generatedImage}
           className="w-full h-auto"
            />

            </div>

            <div>
              <Button 
              onClick={handleAiImageToCanvas}
              className={'flex-1'}
              variant={uploadSuccess ? 'outline' :'default'}
              disabled={isUploading}
              >
                  Add to Canvas 
              </Button>
              </div>
          </div>
      }
    </div>
  )
}

export default AiPanel