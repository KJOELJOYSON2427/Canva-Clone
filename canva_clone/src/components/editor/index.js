"use client"

import React, { useCallback, useEffect, useState } from 'react'
import EditorHeader from './header'
import SideBar from './sidebar'
import Canvas from './canvas'
import { useParams, useRouter } from 'next/navigation'
import { useEditorStore } from '@/store'
import { getUserDesignByID } from '@/services/design-service'
import Properties from './properties'
import SubscriptionModal from '../subscription/premium-modal'

function MainEditor() {

  const params = useParams();
  const router = useRouter();
  const designId = params?.slug;


  const [isLoading, setIsLoading] = useState(!!designId);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [error, setError] = useState(null);
  const { canvas, 
    restoreStore ,
    setName, 
    setDesignId,
    setShowProperties,
     showProperties
     ,isEditing, showPremiumModal,setShowPremiumUser} = useEditorStore();

  useEffect(() => {
    //reset the store

    restoreStore();

    if (designId) setDesignId(designId)


    return () => {
      restoreStore()
    };
  }, [])

  useEffect(() => {
    setLoadAttempted(false);
    setError(null)
  }, [designId])

  useEffect(() => {
    if (isLoading && !canvas && designId) {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.log("Canvas init timeout");
          setIsLoading(false)
        }
      }, 5000)
      return () => clearTimeout(timer);

    }
  }, [isLoading, canvas, designId])

  useEffect(() => {
    if (canvas) {
      console.log('Canvas is now available in editor');

    }
  }, [canvas])



  //load th design ->

  const loadDesign = useCallback(async () => {
    if (!canvas || !designId || loadAttempted) return;

    try {
      setIsLoading(true);
      setLoadAttempted(true);

      const response = await getUserDesignByID(designId);
      const design = response.data;
      if (design) {
        //update name
        //todo

        setName(design.name)

        setDesignId(designId)
        try {
          if (design.canvasData) {
            canvas.clear();
            if (design.width && design.height) {
              canvas.setDimensions({
                width: design.width,
                height: design.height
              })
            }

            const canvasData = typeof design.canvasData === "string" ?
              JSON.parse(design.canvasData) : design.canvasData;


            const hasObjects = canvasData.objects && canvasData.objects.length > 0;

            if (canvas.background) {
              canvas.backgroundColor = canvasData.background;

            } else {
              canvas.backgroundColor = "#ffffff"
            }

            if (!hasObjects) {
              canvas.renderAll();
              return true;
            }
            canvas.loadFromJSON(design.canvasData).then(canvas => canvas.requestRenderAll())


          } else {
            console.log("no canvas data");
            canvas.clear();
            canvas.setWidth(design.width);
            canvas.setHeight(design.height);
            canvas.backgroundColor = "#ffffff";
            canvas.renderAll();
          }
        } catch (e) {

          console.error("Error loading Canvas", e);
          setError("Error loading Canvas")
        } finally {
          setIsLoading(false)
        }
      }

    } catch (e) {
      console.error("Failed to load design", e);

      setError("failed to load design");
      setIsLoading(false);

    }
  }, [canvas, designId, loadAttempted, setDesignId,setName]);

  useEffect(() => {
    if (designId && canvas && !loadAttempted) {
      loadDesign();

    } else if (!designId) {
      router.replace('/')
    }
  }, [canvas, designId, loadDesign, loadAttempted, router])

  useEffect(()=>{
    if(!canvas) return;

    const handleSelectionCreatedOrUpdated =()=>{
     const activeObject= canvas.getActiveObject();
     if(activeObject){
      setShowProperties(true) //created or updated
     }
     console.log(activeObject, "Called");
     
    }

    const handleSelectionCleared=()=>{
      
       setShowProperties(false) //created or updated
       console.log( "dead");
     }

     canvas.on('selection:created',handleSelectionCreatedOrUpdated)
     canvas.on('selection:updated',handleSelectionCreatedOrUpdated)
     canvas.on('selection:cleared',handleSelectionCleared)
     return ()=>{
      canvas.off('selection:created',handleSelectionCreatedOrUpdated)
     canvas.off('selection:updated',handleSelectionCreatedOrUpdated)
     canvas.off('selection:cleared',handleSelectionCleared)
     }
  },[canvas])
  return (
    <div className='flex flex-col h-screen overflow-hidden '>
      <EditorHeader/>
      <div className='flex flex-1 overflow-hidden'>
       {
        isEditing &&  <SideBar />
       }
        <div className='flex-1 flex flex-col overflow-hidden relative'>
          <main className='flex-1 overflow-hidden flex  items-center justify-center bg-[#f0f0f0]'>
            <Canvas />
          </main>
        </div>
      </div>
      {
        showProperties && isEditing && <Properties/>
      }
 <SubscriptionModal 
      isOpen={showPremiumModal}
      onClose={setShowPremiumUser}
      />
      
    </div>
  )
}

export default MainEditor
