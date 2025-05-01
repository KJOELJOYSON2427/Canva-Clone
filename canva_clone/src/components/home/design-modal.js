'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent,DialogTitle } from '../ui/dialog'
import { useEditorStore } from '@/store'

import { CheckCircle, Clock, Crown, Loader2, Palette, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { createPayPalOrder } from '@/services/subscription-service';

function DesignModal({isOpen, onClose,userDesigns}) {


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className={'sm:max-w-[900px] p-0 gap-0 overflow-hidden'}>
             <div className='flex flex-col md:flex-row'>
                <div className='p-6 flex-1'>
                  
                            <DialogTitle className='text-2xl font-bold mb-4 flex items-center'>
                                <Sparkles className="w-6 h-6  text-yellow-500 mr-2"/>
                                Youre a premium Member!
                            </DialogTitle>
                        
                       </div>
                
             </div>
          
          

         </DialogContent>
    </Dialog>
  )
}

export default DesignModal