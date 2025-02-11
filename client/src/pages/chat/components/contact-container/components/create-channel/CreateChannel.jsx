import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { useState,useEffect } from "react";
  import { FaPlus } from "react-icons/fa";
  import { Input } from "@/components/ui/input";
  import { apiClient } from "@/lib/api-client.js";
  import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants.js";
  import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/Multiselect";
  
  const CreateChannel = () => {
    const { setSelectedChatType, setSelectedChatData ,addChannel} = useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
                withCredentials: true,
            });
            // console.log("Fetched contacts:", response.data.contacts);
            setAllContacts(response.data.contacts);
          };
          getData();
        }, []);
      
    const createChannel = async () => {
      try {
        if(channelName.length>0 && selectedContacts.length>0){
const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{
  name: channelName,
  members:selectedContacts.map((contact)=>contact.value),
},{
  withCredentials:true
})
if(response.status===201){
  setChannelName("");
  setSelectedContacts([])
  setNewChannelModal(false)
  addChannel(response.data.channel)

}
        }
        
      } catch (error) {
        console.log(error)
        
      }
    };
   
  
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="text-neutral-400 font-light font-serif text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={() => setNewChannelModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#eba46d] rounded-lg border-none text-black p-2 font-serif">
              Create New Channel
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
  
        <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
          <DialogContent className="bg-[#1c1b1e] border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center font-serif font-thin">
                Please fill up the details for new channel.
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <Input
                placeholder="Channel Name"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
            </div>
            <div >
            {allContacts.length > 0 ? (
    <MultipleSelector
        className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
        options={allContacts}
        placeholder="Search Contacts"
        value={selectedContacts}
        onChange={setSelectedContacts}
        emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600">
                No results found.
            </p>
        }
    />
) : (
    <p className="text-center text-lg leading-10 text-gray-600">
        Loading contacts...
    </p>
)}

</div>
<div>
    <Button
        className="w-full bg-[#eba46d] hover:bg-[#da7b32] transition-all duration-300"
        onClick={createChannel}
    >
      Create Channel
    </Button>
</div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
export default CreateChannel;
  