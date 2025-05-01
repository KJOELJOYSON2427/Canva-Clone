'use client'

import { centerCanvas } from "@/fabric/fabric-utils";
import { saveCanvasState } from "@/services/design-service";
import { create } from "zustand"
import debounce from 'lodash/debounce';

export const useEditorStore = create((set, get)=>({
    canvas:null,
    setCanvas:(canvas)=>{
        set({canvas});
        if(canvas){
            centerCanvas(canvas);
        }
    },
    designId : null,
    setDesignId:(id)=> set({ designId: id}),
    isEditing: true,
    setIsEditing: (flag)=> set({isEditing: flag}),

    name: "Untitled Design",
    setName: (value)=> set({name: value}),
    

    showProperties: false,
    setShowProperties: (flag)=> set({showProperties: flag}),

    saveStatus : 'saved',
    setSaveStatus:(status)=>set({
        saveStatus:status
    }),
    lastModified:Date.now(),
    isModifidied : false,

  
     


    markAsModified :()=>{
        const designId = get().designId;

        if(designId){
            set({
                lastModified :Date.now(),
                saveStatus:'Saving...',
                isModifidied:true
            });
            get().debouncedSaveToServer();
            
        }else{
            console.error('No design ID Available');
            
        }
    },


    saveToServer : async ()=>{
  
        const designId = get().designId;
        const canvas =get().canvas;

        if(!canvas || !designId){
            console.log('No design ID Available or canvas instance is not available');
            return null;
        }
        try{
            const savedDesign = await saveCanvasState(canvas, designId, get().name)
            
            
            set({
                saveStatus:"saved",
                isModifidied:false,
                 
            })
         
            return savedDesign;
        }catch(e){
            set({saveStatus :'Error'})
            return null;
            
        }
    },

    debouncedSaveToServer :debounce(
        () =>{
                  get().saveToServer();
        },500
    ),

    restoreStore:()=>{
        set({
            canvas :null,
            designId:null,
            isEditing:true,
            name:"Untitled Design",
            showProperties: false,
            saveStatus:'saved',
            isModifidied:false,
            lastModified:Date.now()
        })
    },



    userSubscription: null,
    setUserSubscription:(data)=> set({
        userSubscription: data
    }),
    showPremiumModal: false,
    setShowPremiumUser:(fla)=> set({
        showPremiumModal: fla
    })
,
showDesignModal: false,
setShowDesignModal:(flag)=> set({
    showPremiumModal: flag
}),
    userDesigns: [],
    setUserDesigns:(data)=> set({
        userDesigns: data
    })
}))