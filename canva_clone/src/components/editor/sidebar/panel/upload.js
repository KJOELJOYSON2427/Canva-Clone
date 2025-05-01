"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addImageToCanvas } from "@/fabric/fabric-utils";
import { fetchWithAuth } from "@/services/base-service";
import { uploadFileWithAuth } from "@/services/upload-services";
import { useEditorStore } from "@/store";

import { Loader, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useReducer, useState } from "react";

function UploadPanel() {
  const { canvas } = useEditorStore();
  const { data: session, status } = useSession();
  const [userUploads, setUserUploads] = useState([]);

  const initialState = {
    isUploading: false,
    isLoading: false,
  };

  const actionTypes = {
    START_UPLOAD: "START_UPLOAD",
    UPLOAD_SUCCESS: "UPLOAD_SUCCESS",
    UPLOAD_FAIL: "UPLOAD_FAIL",
    SET_LOADING: "SET_LOADING",
    STOP_LOADING: "STOP_LOADING",
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case actionTypes.START_UPLOAD:
        return { ...state, isUploading: true };

      case actionTypes.UPLOAD_SUCCESS:
        return { ...state, isUploading: false };

      case actionTypes.UPLOAD_FAIL:
        return { ...state, isUploading: false };

      case actionTypes.SET_LOADING:
        return { ...state, isLoading: true };

      case actionTypes.STOP_LOADING:
        return { ...state, isLoading: false };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, isUploading } = state;

  const fetchUserUploads = useCallback(async () => {
    if (status !== "authenticated" || !session?.idToken) return;

    try {
      dispatch({ type: actionTypes.SET_LOADING });
      const data = await fetchWithAuth("/v1/media/get");
      setUserUploads(data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: actionTypes.STOP_LOADING });
    }
  }, [status, session?.idToken]);

  const handleFileUpload = async (e) => {
    const files = e.target.files[0];
  
    if (!files || files.length === 0) return;
  
    dispatch({ type: actionTypes.START_UPLOAD });
  
    try {
      // Assuming uploadFileWithAuth handles FormData and POSTing
      const result = await uploadFileWithAuth(files); 
      console.log("Upload result:", result);
      setUserUploads(result?.data || [])
      dispatch({ type: actionTypes.UPLOAD_SUCCESS });
  
      // Refetch uploaded media if necessary
      fetchUserUploads?.();
  
    } catch (error) {
      console.error("Error while uploading the file", error);
      dispatch({ type: actionTypes.UPLOAD_FAIL });
    } finally {
      
      e.target.value = "";
    }
  };
  


  const handleAddImageUrl =( url)=>{
    if(!canvas) return ;
  

    addImageToCanvas(canvas, url)

  }
  useEffect(() => {
    if (status === "authenticated") fetchUserUploads();
  }, [status, fetchUserUploads]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Label
            htmlFor="file-upload" // Associate the label with the input
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-600
             rounded-md cursor-pointer h-12 font-medium transition-colors ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <Upload className="w-5 h-5" />
            <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
          </Label>

          <Input
            id="file-upload" 
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
        <div className="mt-5">
          <h4 className="text-sm text-gray-500 mb-5">
            Your Uploads
          </h4>
          {
            isLoading ?
            <div className="border p-6 flex rounded-md items-center justify-center">
             
                <Loader className="w-4 h-4"/>
                <p className="font-bold text-sm">
                Loading your uploads...
              </p>
              </div>:
              <div className="grid grid-cols-3 gap-4 ">
                {
                  userUploads.length >0 ?  
                  userUploads.map(imageData=>(
                           <div 
                             className="aspect-auto bg-gray-50 rounded-md overflow-hidden hover:opacity-85 transition-opacity relative group"
                           key={imageData._id} onClick={()=>handleAddImageUrl(imageData.url)}>
                            <img src={imageData.url}
                             alt={imageData.name}
                             className="w-full h-full object-cover" 
                            />
                            </div>
                  )):<div>No Uploads Yet</div>
                }
                </div>
          }
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
