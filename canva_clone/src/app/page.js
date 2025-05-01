'use client'

import SideBar from "@/components/home/sidebar";
import Login from "./login/page";
import Banner from "@/components/home/banner";
import Header from "@/components/home/header";
import DesignTypes from "@/components/home/design-types";
import AiFeatures from "@/components/home/ai-feature";
import RecentDesigns from "@/components/home/recent-design";
import { getUserSubscription } from "@/services/subscription-service";
import { useEffect } from "react";
import { useEditorStore } from "@/store";
import { getUserDesigns } from "@/services/design-service";
import SubscriptionModal from "@/components/subscription/premium-modal";
import DesignModal from "@/components/home/design-modal";

export default function Home() {

  const {setUserSubscription, setUserDesigns,showPremiumModal,
    setShowPremiumUser,showDesignModal,setShowDesignModal,userDesigns} =useEditorStore();

  const fetchUserSubscription =async()=>{
    const response = await getUserSubscription();
   

    if(response.success){
      setUserSubscription(response.data)
    }
    
  }
   async function fetchUserDesigns(){
       const result =await getUserDesigns();
       if(result?.success) setUserDesigns(result?.data);
       
      }
    useEffect(()=>{
     fetchUserSubscription()
     fetchUserDesigns()
    }, []);
 

  return (
    <div className="flex min-h-screen bg-white">
       <SideBar/>
       <div className="flex-1 flex flex-col ml-[72px] ">
        <Header/>
        <main className="flex-1 p-6 overflow-y-auto pt-20">
          <Banner/>
          <DesignTypes/>
          <AiFeatures/>
          <RecentDesigns/>

        </main>
       
       </div>
       <SubscriptionModal isOpen={showPremiumModal} onClose={setShowPremiumUser}/>
       <DesignModal isOpen={showDesignModal} onClose={setShowDesignModal}
       userDesigns={userDesigns}
       />
    </div>
  );
}
