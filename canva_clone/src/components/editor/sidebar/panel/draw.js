"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brushSizes, drawingPanelColorPresets } from "@/config";
import { toggleDrawingMode, toggleEraseMode, updateDrawingBrush } from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Droplets,
  EraserIcon,
  Minus,
  Paintbrush,
  Palette,
  PencilIcon,
  Plus,
} from "lucide-react";
import { useReducer } from "react";

const initialState = {
  isDrawingMode: false,
  isErasing: false,
  drawingColor: "#000000",
  brushWidth: 5,
  drawingOpacity: 100,
  activeTab: "colors",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DRAWING_MODE":
      return { ...state, isDrawingMode: action.payload };
    case "SET_ERASING":
      return { ...state, isErasing: action.payload };
    case "SET_DRAWING_COLOR":
      return { ...state, drawingColor: action.payload };
    case "SET_BRUSH_WIDTH":
      return { ...state, brushWidth: action.payload };
    case "SET_DRAWING_OPACITY":
      return { ...state, drawingOpacity: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}

function DrawingPanel() {
  const { canvas } = useEditorStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isDrawingMode, brushWidth, activeTab, isErasing, drawingColor, drawingOpacity } = state;

  const handleToggleDrawingMode = () => {
    if (!canvas) return;
    const newMode = !isDrawingMode;
    dispatch({ type: "SET_DRAWING_MODE", payload: newMode });

    if (newMode && isErasing) {
      dispatch({ type: "SET_ERASING", payload: false });
    }

    toggleDrawingMode(canvas, newMode, drawingColor, brushWidth);
  };

  const handleDrawingColorChange = (color) => {
    dispatch(
      {
         type: "SET_DRAWING_COLOR",
         payload: color 


        });

    if (canvas && isDrawingMode && !isErasing) {
      updateDrawingBrush(canvas, { color });
    }
  };

  const handleBrushWidthChange = (sizeValue) => {
    if (sizeValue >= 1 && sizeValue <= 30) {
      dispatch({ type: "SET_BRUSH_WIDTH", payload: sizeValue });

      if (canvas && isDrawingMode) {
        updateDrawingBrush(canvas, {
          width: isErasing ? sizeValue * 2 : sizeValue,
        });
      }
    }
  };

  const handleIncreaseBrushWidth = () => {
    if (brushWidth < 30) {
      const newSize = brushWidth + 1;
      dispatch({ type: "SET_BRUSH_WIDTH", payload: newSize });

      if (canvas && isDrawingMode) {
        updateDrawingBrush(canvas, {
          width: isErasing ? newSize * 2 : newSize,
        });
      }
    }
  };

  const handleDecreaseBrushWidth = () => {
    if (brushWidth > 1) {
      const newSize = brushWidth - 1;
      dispatch({ type: "SET_BRUSH_WIDTH", payload: newSize });

      if (canvas && isDrawingMode) {
        updateDrawingBrush(canvas, {
          width: isErasing ? newSize * 2 : newSize,
        });
      }
    }
  };

  const handleDrawingOpacityChange = (opacityValue) => {
    const value = opacityValue[0];
    dispatch({ type: "SET_DRAWING_OPACITY", payload: value });

    if (canvas && isDrawingMode) {
      updateDrawingBrush(canvas, {
        opacity: value ,
      });
    }
  };

  const handleToggleErasing = () => {
    if (!canvas || !isDrawingMode) return;
    const newErasing = !isErasing;

    dispatch({ type: "SET_ERASING", payload: newErasing });
    toggleEraseMode(canvas, newErasing, drawingColor, brushWidth * 2);
  };

  return (
    <div className="p-4">
      <div className="space-y-5">
        <Button
          variant={isDrawingMode ? "default" : "outline"}
          className="w-full py-6 group transition-all"
          size="lg"
          onClick={handleToggleDrawingMode}
        >
          <PencilIcon
            className={`mr-2 h-5 w-5 ${
              isDrawingMode ? "animate-bounce" : "hover:animate-bounce"
            }`}
          />
          <span className="font-medium">
            {isDrawingMode ? "Exit Drawing Mode" : "Enter Drawing Mode"}
          </span>
        </Button>

        {isDrawingMode && (
          <Tabs
            defaultValue="colors"
            className="w-full"
            value={activeTab}
            onValueChange={(value) =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: value })
            }
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="colors">
                <Palette className="mr-2 h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="brush">
                <Paintbrush className="mr-2 h-4 w-4" />
                Brush
              </TabsTrigger>
              <TabsTrigger value="tools">
                <EraserIcon className="mr-2 h-4 w-4" />
                Tools
              </TabsTrigger>
            </TabsList>

           
            <TabsContent value="colors">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Color Palette</Label>
                  <div
                    className="w-6 h-6 rounded-full border shadow-sm"
                    style={{ backgroundColor: drawingColor }}
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {drawingPanelColorPresets.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border transition-transform hover:scale-110 ${
                        color === drawingColor ? "ring-1 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleDrawingColorChange(color)}
                    />
                  ))}
                </div>
                <div className="flex mt-5 space-x-2">
                  <Input
                    type="color"
                    value={drawingColor}
                    onChange={(e) => handleDrawingColorChange(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                    disabled={isErasing}
                  />
                  <Input
                    type="text"
                    value={drawingColor}
                    onChange={(e) => handleDrawingColorChange(e.target.value)}
                    className="flex-1"
                    disabled={isErasing}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="brush" className="space-y-4">
              <div className="space-y-3">
                <Label className="block text-sm font-semibold">Brush Size</Label>
                <div className="flex items-center space-x-3">
                  <Minus
                    className="h-4 w-4 text-gray-500 cursor-pointer hover:text-black"
                    onClick={handleDecreaseBrushWidth}
                  />
                  <Slider
                    value={[brushWidth]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleBrushWidthChange(value[0])}
                    className="flex-1"
                  />
                  <Plus
                    className="h-4 w-4 text-gray-500 cursor-pointer hover:text-black"
                    onClick={handleIncreaseBrushWidth}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {brushSizes.map((size) => (
                    <Button
                      key={size.value}
                      variant={size.value === brushWidth ? "default" : "outline"}
                      className="px-2 py-1 h-auto"
                      onClick={() => handleBrushWidthChange(size.value)}
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <Label className="font-medium">
                      <Droplets className="mr-2 h-4 w-4" />
                      Opacity
                    </Label>
                    <span className="text-sm font-medium">{drawingOpacity}%</span>
                  </div>
                  <Slider
                    value={[drawingOpacity]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={handleDrawingOpacityChange}
                  />
                </div>
              </div>
            </TabsContent>

           
            <TabsContent value="tools">
              <Button
                onClick={handleToggleErasing}
                variant={isErasing ? "destructive" : "outline"}
                className="w-full py-6"
              >
                <EraserIcon className="mr-2 w-5 h-5" />
                {isErasing ? "Stop Erasing" : "Eraser Mode"}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default DrawingPanel;
