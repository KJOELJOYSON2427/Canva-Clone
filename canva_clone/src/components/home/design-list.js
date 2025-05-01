import React from 'react'
import DesignPreview from './design-preview'
import { useRouter } from "next/navigation";
import { Trash2 } from 'lucide-react';
import { deleteDesign, getUserDesigns } from '@/services/design-service';
import { useEditorStore } from '@/store';

function DesignList({listOfUserDesigns}) {
    const router= useRouter();
    const {setUserDesigns} =useEditorStore();
      async function fetchUserDesigns(){
           const result =await getUserDesigns();

           if(result?.success) setUserDesigns(result?.data);
           
          }
    const handleDeleteDesign = async (e,getCurrentDesignId)=>{
        e.stopPropagation(); // Prevent navigation
        const response =await deleteDesign(getCurrentDesignId)

        if(response.success){
             fetchUserDesigns();
        }
    }
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4'>
    {
        !listOfUserDesigns.length && <h1>No Design Found!</h1>
    }
    {
        listOfUserDesigns.map(design => (
            <div key={design._id} onClick={()=>router.push(`/editor/${design?._id}`)} className='group cursor-pointer'>
                
                <div className="w-[300px]  h-[300px] rounded-lg mb-2 overflow-hidden transition-shadow">
                    {
                        design?.canvasData && <DesignPreview key={design._id} design={design}/>
                    }
                </div>
                <div className="w-[300px] flex items-center justify-between">
            <p className="truncate text-sm font-bold max-w-[240px]">
              {design.name}
            </p>
            <Trash2
              className="w-5 h-5 text-white bg-purple-600 rounded p-1 shrink-0"
              onClick={(e)=>handleDeleteDesign(e,design?._id)}
            />
          </div>
                
            </div>
        ))
    }
</div>
  )
}

export default DesignList