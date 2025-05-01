"use client";

import React, { useEffect, useRef, useState } from 'react';

function DesignPreview({ design }) {
  const [canvasId] = useState(`canvas-${design._id}-${Date.now()}`);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    // Exit early if no design.canvasData exists
    if (!design?.canvasData) return;

    // Set up a timer to delay canvas initialization
    const timer = setTimeout(async () => {
      try {
        // Dispose of the previous canvas if it exists
        if (fabricCanvasRef.current && typeof fabricCanvasRef.current.dispose === 'function') {
          try {
            fabricCanvasRef.current.dispose();
            fabricCanvasRef.current = null;
          } catch (disposeError) {
            console.error('Error while disposing canvas:', disposeError);
          }
        }

        // Dynamically import fabric.js
        const fabric = await import('fabric');

        // Get the canvas element by ID
        const canvasElement = document.getElementById(canvasId);
        if (!canvasElement) {
          console.error('Canvas element not found:', canvasId);
          return;
        }

        // Initialize the fabric canvas
        const designPreviewCanvas = new fabric.StaticCanvas(canvasElement, {
          width: 300,
          height: 300,
          renderOnAddRemove: true,
        });

        // Assign the canvas to the ref
        fabricCanvasRef.current = designPreviewCanvas;

        // Parse the canvas data
        let canvasData;
        try {
          canvasData = typeof design.canvasData === 'string'
            ? JSON.parse(design.canvasData)
            : design.canvasData;
        } catch (parseError) {
          console.error('Error parsing canvas data:', parseError);
          return;
        }

        // Validate and apply background color if provided
        if (canvasData.background) {
          designPreviewCanvas.backgroundColor = canvasData.background;
          designPreviewCanvas.requestRenderAll();
        }

        // Load the design onto the canvas
        designPreviewCanvas.loadFromJSON(canvasData, () => {
          designPreviewCanvas.requestRenderAll();
        });

      } catch (error) {
        console.error('Error rendering design preview data:', error);
      }
    }, 100); // Delay for 100ms

    // Cleanup function to dispose of the canvas when the component is unmounted
    return () => {
      clearTimeout(timer); // Clear the timeout if the component is unmounted or updated
      if (fabricCanvasRef.current && typeof fabricCanvasRef.current.dispose === 'function') {
        try {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        } catch (disposeError) {
          console.error('Error during canvas disposal:', disposeError);
        }
      }
    };
  }, [design?._id, canvasId]);

  return <canvas id={canvasId} width="300" height="300" className="h-full w-full object-contain" />;
}

export default DesignPreview;
