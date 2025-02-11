import { create } from "zustand";
import { createAuthSlice } from "@/store/slice/auth-slice";
import { createChatSlice } from "./slice/chat-slice";

export const useAppStore = create()((...a)=>({ 
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))