'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {Description, Dialog, DialogContent, DialogTitle , DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { exportAsBmp, exportAsCsv, exportAsJpeg, exportAsJson, exportAsPDF, exportAsPng, exportAsSvg, exportAsTxt, exportAsXml, exportAsZip } from "@/services/export-service";
import { useEditorStore } from "@/store"

import { Download, File, FileArchive, FileCode2, FileIcon, FileImage, FileJson, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

export function ExportModal({isOpen, onClose}){
    const {canvas} =useEditorStore();

    const [selectedFormat, setSelectedFormat] =useState('png');
    const [isExporting, setIsExporting] = useState(false);
    const exportFormats = [
        {
          id: 'png',
          name: 'PNG Image',
          icon: FileImage,
          description: 'Best for web and social media'
        },
        {
          id: 'svg',
          name: 'SVG Vector',
          icon: FileIcon,
          description: 'Scalable vector format'
        },
        {
          id: 'pdf',
          name: 'PDF Document',
          icon: File,
          description: 'Best for printing'
        },
        {
          id: 'json',
          name: 'JSON Template',
          icon: FileJson,
          description: 'Editable Template format'
        },
        {
          id: 'jpeg',
          name: 'JPEG Image',
          icon: FileImage,
          description: 'Compressed image for web use'
        },
        {
          id: 'webp',
          name: 'WebP Image',
          icon: FileImage,
          description: 'Modern image format for faster loading'
        },
        {
          id: 'bmp',
          name: 'BMP Image',
          icon: FileImage,
          description: 'Uncompressed raster image format'
        },
        {
          id: 'txt',
          name: 'Text File',
          icon: FileText,
          description: 'Plain text format for logs or data'
        },
        {
          id: 'csv',
          name: 'CSV File',
          icon: FileSpreadsheet,
          description: 'Comma-separated values, great for spreadsheets'
        },
        {
          id: 'xml',
          name: 'XML File',
          icon: FileCode2,
          description: 'Structured data format used in configs and data exchange'
        },
        {
          id: 'zip',
          name: 'ZIP Archive',
          icon: FileArchive,
          description: 'Compressed package of multiple files'
        }
      ];
    
      if(!isOpen) return null;


      const handleExport=async ()=>{
           if(!canvas) return
           setIsExporting(true);
           try{
             
            switch (selectedFormat) {
                case 'json':
                    successFlag=exportAsJson(canvas, 'JSON FileName')
                    break;
                case 'png':
                    successFlag=exportAsPng(canvas, 'PNG FileName')
                       break;
               case 'svg':
                    successFlag=exportAsSvg(canvas, 'SVG FileName')
                       break; 
               case 'pdf':
                    successFlag=exportAsPDF(canvas, 'PDF FileName')
                       break;  
              case 'jpeg': 
                  successFlag=exportAsJpeg(canvas, 'JPEG FileName')
                   break; 
              case 'webp':
                successFlag=exportAsJpeg(canvas, 'WEBP FileName')
                break; 
              case 'bmp':
                successFlag=exportAsBmp(canvas, 'BMP FileName')
                break;
                
              case 'xml':
                successFlag=exportAsXml(canvas, 'XML FileName')
                break;
                
              case 'zip':
                successFlag=exportAsZip(canvas, 'ZIP FileName')
                break;
                  
                  
              case 'txt':
                  successFlag=exportAsTxt(canvas, 'TEXT FileName')
                  break; 
              case 'csv':
                  successFlag=exportAsCsv(canvas, 'CSV FileName')
                  break;     
                default:
                    break;
            }

            if(successFlag){
                console.log(successFlag);
                
                setTimeout(()=>{
                    onClose()
                },500)
            }

           }catch(e){

            throw new Error('Export failed')
           }finally{
            setIsExporting(false)
           }
      }


    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={'sm:max-w-md'}>
         <DialogHeader>
            <DialogTitle className="text-xl">
                Export Design
            </DialogTitle>
         </DialogHeader>

         <div className="py-4">
  <h3 className="text-xs font-medium mb-3">Choose Format</h3>
  
  <div className="max-h-64 overflow-y-auto pr-1">
    <div className="grid grid-cols-2 gap-3">
      {exportFormats.map((exportFormat) => (
        <Card
          key={exportFormat.id}
          className={cn(
            "cursor-pointer border transition-colors hover:bg-accent hover:text-accent-foreground",
            selectedFormat === exportFormat.id
              ? "border-primary bg-accent"
              : "border-border"
          )}
          onClick={() => setSelectedFormat(exportFormat.id)}
        >
          <CardContent className="p-4 flex flex-col items-center text-center">
            <exportFormat.icon className={cn("w-8 h-8 mb-2", selectedFormat === exportFormat.id ? 'text-primary':'text-muted-foreground')}/>
            <h4 className="font-medium">{exportFormat.name}</h4>
            <p className="text-xs text-muted-foreground">{exportFormat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</div>

<DialogFooter className={'sm:justify-between'}>
  <Button onClick={onClose} variant='outline'>Cancel</Button>
  <Button onClick={handleExport} variant='default'
  disabled ={isExporting}
  className="min-w-[120px] bg-purple-700 text-white"
  >
    {
        isExporting ? (
            <>
            <Loader2 className="mr-2 h-4 w-4"/>
            Exporting...
            </>
            
        ):(<>
           <Download className="mr-2 h-4 w-4"/>
           Export {selectedFormat.toUpperCase()}
        </>)
    }
  </Button>
</DialogFooter>
        </DialogContent>

      </Dialog>
    )
    
}