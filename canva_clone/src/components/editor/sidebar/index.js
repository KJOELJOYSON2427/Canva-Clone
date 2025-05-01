"use client"

import { ArrowLeft, ChevronLeft, Grid, Pencil, Settings, Sparkle, Type, Upload } from 'lucide-react';
import React, { useState } from 'react'
import ElementsPanel from './panel/elements';
import UploadPanel from './panel/upload';
import DrawingPanel from './panel/draw';
import SettingsPanel from './panel/settings';
import AiPanel from './panel/ai';
import Textpanel from './panel/text';

function SideBar() {
  const [isPanelCollapsed, setIsPanelCollapsed] =useState(false);
 const [activeSidebar, setActiveSidebar] =useState(null);
 const sidebarItems =[
  {
    id:"elements",
    icon:Grid,
    label:"ELements",
    panel:()=><ElementsPanel/>

  },
  {
    id:"text",
    icon:Type,
    label:"Text",
    panel:()=><Textpanel/>

  },
  {
    id:"uploads",
    icon:Upload,
    label:"Uploads",
    panel:()=><UploadPanel/>

  },
  {
    id:"draw",
    icon:Pencil,
    label:"Draw",
    panel:()=><DrawingPanel/>

  },
  {
    id:"ai",
    icon:Sparkle,
    label:"AI",
    panel:()=><AiPanel/>

  },
  {
    id:"settings",
    icon:Settings,
    label:"Settings",
    panel:()=><SettingsPanel/>

  }

 ]

 const handleItemClick =(id)=>{
   if(id === activeSidebar && !isPanelCollapsed) return
  
   setActiveSidebar(id);
   setIsPanelCollapsed(false)

 }
 const ActiveItem =sidebarItems.find(item =>item.id === activeSidebar)


 const togglePanelCollapse = (e) => {
  e.stopPropagation();
  setIsPanelCollapsed(!isPanelCollapsed);
}
 const closeSecondaryPanel =()=>{
  setActiveSidebar(null);
 }
  return (
    <div className='flex h-full'>
       <aside className='sidebar'>
           {
            sidebarItems.map(item =>(
              <div onClick={()=>handleItemClick(item.id)} key={item.id} className={`sidebar-item ${activeSidebar === item.id ? 'active':''}`}>

                <item.icon className='sidebar-item-icon h-5 w-5'/>
                 <span  className="sidebar-item-label">{item.label}</span>
              </div>
            ))
           }
       </aside>
       {
        activeSidebar && <div className={`secondary-panel ${isPanelCollapsed ? 'collapsed' :''}`}
        
        style={{
          width:isPanelCollapsed ?'0':'320px',
          opacity:isPanelCollapsed ? 0 :1,
          overflow:isPanelCollapsed ?'hidden':'visible'
        }}>
               <div className='panel-header'>
                <button className='back-button' onClick={closeSecondaryPanel}>
                  <ArrowLeft className='h-5 w-5'/>
                </button>
                <span className='panel-title'>{ActiveItem.label}</span>
                </div>
                <div className='panel-content'>{ActiveItem?.panel()}</div>
                <button className='collapse-button'
                onClick={togglePanelCollapse}>
                   <ChevronLeft className='h-5 w-5'/>
                </button>
          </div>
       }
    </div>
  )
}

export default SideBar