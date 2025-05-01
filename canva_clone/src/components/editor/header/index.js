"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useEditorStore } from '@/store'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Download, EyeIcon, Loader2, LogOut, Pencil, Save, SaveOff, Share, Star } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { ExportModal } from '../export'
import { toast } from 'sonner'
import { getUserSubscription } from '@/services/subscription-service'
import { getUserDesigns } from '@/services/design-service'

function EditorHeader() {
  const {isEditing, showPremiumModal,setShowPremiumUser,setIsEditing,name, setName, canvas,saveStatus, markAsModified,designId,userSubscription,userDesigns,setUserDesigns,setUserSubscription}= useEditorStore();
  const {data:session} = useSession();
  const [showExportModal, setShowExportModal] =useState(false)

  const handleLogOut =()=>{
    signOut();
  }

  const handleExport =()=>{
    
    if(userDesigns?.length >=5 && !userSubscription.isPremium){
      toast.error("Please upgrade to premium!", {
        description: "You need to upgrade for Premium to create more designs!",
      })
    }
    setShowExportModal(true)
  }

  const fetchUserSubscription =async()=>{
      const response = await getUserSubscription();
      console.log(response,'usersvo');
      
      if(response.success){
        setUserSubscription(response.data)
      }
      
    }
     async function fetchUserDesigns(){
         const result =await getUserDesigns();

         if(result?.success) setUserDesigns(result?.data);
         
        }
      useEffect(()=>{
        console.log("gaolj");
        
       fetchUserSubscription()
       fetchUserDesigns()
      }, []);
  useEffect(()=>{
    if(!canvas) return
    canvas.selection =isEditing
    canvas.getObjects().forEach((obj) => {
      obj.selectable=isEditing
      obj.evented=isEditing
    });
  },[isEditing])
  useEffect(()=>{
    if(!canvas) return;

    markAsModified()
  }, [name,designId, canvas])


  
  return (
    <header className='header-gradient header flex items-center justify-between px-4 h-14'>
       <div className='flex items-center space-x-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild="true">
                     <button className='header-button flex items-center text-white'>

                       <span>{isEditing ? 'Editing':'Viewing'}</span>
                       <ChevronDown  className='ml-1 h-4 w-4'/>
                     </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={()=>setIsEditing(true)}>
            <Pencil className='mr-2 h-4 w-4'/>
            <span>Editing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>setIsEditing(false)}>
            <EyeIcon className='mr-2 h-4 w-4'/>
            <span>Viewing</span>
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className='header-button ml-2 relative' title='Save'>
            
            <div className='absolute top-[-5px]'>
                     {
                      saveStatus === 'Saving...' && <Loader2 className='h-2 w-2 bg-yellow-400'/>
                     }
            </div>
            <Save className='w-5 h-5'/>
         </button>
         <button  onClick={handleExport} className='header-button ml-2 relative' title='export'>
             <Download className='w-5 h-5'/>
         </button>
       </div>
       <div className='flex-1 flex justify-center max-w-md '>
        <Input
        className='w-full'
        value={name}
        onChange={(event)=>setName(event.target.value)}
        />

       </div>
       <div className='flex items-center space-x-3'>
        <button onClick={
          
           ()=> setShowPremiumUser(true)
          
        } className='upgrade-button flex items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors'>
           <Star className='mr-1 h-4 w-4 text-yellow-400'/>
           <span>{!userSubscription?.isPremium ?'Upgrade To Premium':'Premium Member'}</span>
        </button>

        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center space-x-2 focus:outline-none'>
                      <Avatar>
                        <AvatarFallback>
                            {
                                session?.user?.name?.[0] || "U"
                            }
                        </AvatarFallback>
                        <AvatarImage src={session?.user?.image || '/placeholder-user.jpg'} alt="User"
  className="w-10 h-10 rounded-full object-cover"/>
                      </Avatar>
                      <span className='text-sm font-medium  hidden lg:block'>
                        {
                            session?.user?.name || "User"
                        }
                    </span>
                    </div>
                   
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
  <DropdownMenuItem
    onClick={handleLogOut}
    className="cursor-pointer font-bold text-sm text-gray-800 focus:bg-gray-100  "
  >
    <div className="flex items-center space-x-4 space-y-3">
      <LogOut className="w-4 h-4 mt-3" />
      <span>Log Out</span>
    </div>
  </DropdownMenuItem>
</DropdownMenuContent>

              </DropdownMenu>
       </div>
       <ExportModal 
       isOpen={showExportModal}
       onClose={setShowExportModal}
       />
    </header>  
    )
}

export default EditorHeader