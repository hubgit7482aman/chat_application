import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set,get) => ({
  messages: [],     // list of all messages between you and selected user
  users: [],           // all available users that you can chat with
  selectedUser: null,     // user that you are currently chatting with
  isUsersLoading: false,   // show spinner while fetching users
  isMessagesLoading: false,   // show spinner while fetching messages

  getUsers: async () => {
    set({ isUsersLoading: true });        // set loading true before fetching users
    try {
      const res = await axiosInstance.get("/messages/users");    // send get req to backend and save received users in state
      set({ users: res.data });  // setting received users
    } catch (error) {
      console.error("Get users error:", error);
      const message = error?.response?.data?.message || "Get users failed";
      toast.error(message);
    } finally {
      set({ isUsersLoading: false });      // always stop the loading spinner after the request finishes,success or fail
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Get messages error:", error);
      const message = error?.response?.data?.message || "Get messages failed";
      toast.error(message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const {selectedUser,messages}=get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Send message error:", error);
      const message = error?.response?.data?.message || "Send message failed";
      toast.error(message);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),


}));
