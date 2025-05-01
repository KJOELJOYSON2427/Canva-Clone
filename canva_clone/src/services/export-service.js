import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";

function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: mimeString });
  }


export function exportAsJson(canvas, fileName= "FileName"){
    if(!canvas) return
    try{
        const canvasData=canvas.toJSON(['id', 'filters']);

        const jsonString=JSON.stringify(canvasData,null,2);

        const canvasJsonBlob= new Blob([jsonString],{
            type:'application/json'
        })
        
        saveAs(canvasJsonBlob, `${fileName}.json`)
        return true;
    }catch(e){
        return false;
    }
    
}

export function exportAsPng(canvas, fileName= "PNG FileName", options={}){
    if(!canvas) return
    try{
        const defaultOptions ={
            format :'png',
            quality:1,
            multiplier:1,
            enableRetinaScaling:true
        }
        const dataUrl =canvas.toDataURL(defaultOptions)
        saveAs(dataUrl, `${fileName}.png`)
        return true;
    }catch(e){
        return false;
    }
    
}

export function exportAsSvg(canvas,fileName= "SVG Design", options={}){

    if(!canvas) return

    try{
        const svgData = canvas.toSVG()
       
        const blob =new Blob([svgData], {
            type:"image/svg+xml"
        })
        saveAs(blob, `${fileName}.svg`)
        return true;
    }catch(e){
        return false;
    }
}

export function exportAsPDF(canvas, fileName = "PDF Design", options = {}) {
    if (!canvas) return;
    
    console.log('Starting PDF export');
  
    try {
      const defaultOptions = {
        format: 'a4',
        orientation: 'landscape',
        unit: 'mm',
        ...options
      };
  
      const pdf = new jsPDF(
        defaultOptions.orientation,
        defaultOptions.unit,
        defaultOptions.format
      );
  
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      // Get PDF page size
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      console.log(`Canvas Size: ${canvasWidth}x${canvasHeight}`);
      console.log(`PDF Size: ${pdfWidth}x${pdfHeight}`);
  
      // Calculate scale to fit the canvas inside PDF
      const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight) * 0.9;
      console.log(`Scale: ${scale}`);
  
      const x = (pdfWidth - canvasWidth * scale) / 2;
      const y = (pdfHeight - canvasHeight * scale) / 2;
  
      console.log(`Position: x = ${x}, y = ${y}`);
  
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      console.log('Adding image to PDF');
  
      // Add the canvas image to PDF
      pdf.addImage(
        imgData,
        'PNG',
        x,
        y,
        canvasWidth * scale,
        canvasHeight * scale
      );
  
      // Save the PDF with the given file name
      pdf.save(`${fileName}.pdf`);
      
      console.log('PDF export completed');
      return true;
  
    } catch (e) {
      console.error('Error during PDF export:', e);
      return false;
    }

  }



//jpeg
  export function exportAsJpeg(canvas, fileName = "JPEG FileName") {
    if (!canvas) return;
  
    try {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgBlob = dataURLtoBlob(imgData);
      saveAs(imgBlob, `${fileName}.jpeg`);
      return true;
    } catch (e) {
      return false;
    }
  }

  //webp
  export function exportAsWebp(canvas, fileName = "WEBP FileName") {
    if (!canvas) return;
  
    try {
      const imgData = canvas.toDataURL('image/webp', 1.0);
      const imgBlob = dataURLtoBlob(imgData);
      saveAs(imgBlob, `${fileName}.webp`);
      return true;
    } catch (e) {
      return false;
    }
  }
  

  //BMP
  export function exportAsBmp(canvas, fileName = "BMP FileName") {
    if (!canvas) return;
  
    try {
      const imgData = canvas.toDataURL('image/bmp', 1.0);
      const imgBlob = dataURLtoBlob(imgData);
      saveAs(imgBlob, `${fileName}.bmp`);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  
  //xml

  export function exportAsXml(canvas, fileName = "XML FileName") {
  if (!canvas) return;

  try {
    const canvasData = canvas.toJSON(['id','filters']);
    const xmlContent =convertToXml(canvasData);
    const xmlBlob = new Blob([xmlContent], { type: 'application/xml' });
    saveAs(xmlBlob, `${fileName}.xml`);
    return true;
} catch (e) {
    return false;
  }
}



//zip Archive
export function exportAsZip(canvas, fileName = "ZIP FileName") {
    if (!canvas) return;
  
    try {
      const zip = new JSZip();
  
      const canvasData = canvas.toJSON(['id', 'filters']);
      const jsonString = JSON.stringify(canvasData, null, 2);
      
      zip.file(`${fileName}.json`, jsonString);  // Add JSON file to ZIP
  
      
      zip.generateAsync({ type: "blob" })
        .then(function (content) {
          saveAs(content, `${fileName}.zip`);
        });
  
      return true;
    } catch (e) {
      return false;
    }
  }

  export function exportAsTxt(canvas, fileName = "TEXT FileName") {
    if (!canvas) return;
  
    try {
      const canvasData = canvas.toJSON(['id', 'filters']);  // or any other data you want to save
      const textContent = JSON.stringify(canvasData, null, 2);
      const txtBlob = new Blob([textContent], { type: 'text/plain' });
      saveAs(txtBlob, `${fileName}.txt`);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  export function exportAsCsv(canvas, fileName = "CSV FileName") {
    if (!canvas) return;
  
    try {
      const canvasData = canvas.toJSON(['id', 'filters']);  // Adjust data as needed
      const csvContent = convertToCsv(canvasData);  // Write a function to convert JSON to CSV
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      saveAs(csvBlob, `${fileName}.csv`);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function convertToCsv(jsonData) {
    const keys = Object.keys(jsonData[0]);
    const csvRows = jsonData.map(item =>
      keys.map(key => item[key]).join(',')
    );
    return [keys.join(','), ...csvRows].join('\n');
  }
  
function convertToXml(jsonData) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<canvas>';
  
    if (Array.isArray(jsonData.objects)) {
      jsonData.objects.forEach((item) => {
        xml += `<item>`;
        for (let key in item) {
          // Safely handle nested objects (like 'filters')
          let value = typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key];
          xml += `<${key}>${value}</${key}>`;
        }
        xml += `</item>`;
      });
    }
  
    xml += '</canvas>';
    return xml;
  }
  