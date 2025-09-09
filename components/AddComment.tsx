"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import axios from "axios";
import { EmojiClickData } from "emoji-picker-react";

interface AddCommentProps {
  id: string;
    onCommentAdded: () => void;
}
interface CommentResponse {
  success: boolean;
  msg: string;
}

const AddComment: React.FC<AddCommentProps> = ({ id, onCommentAdded }) => {
    
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("id", id);
    formData.append("comment", comment);

    try {
const response = await axios.post<CommentResponse>("/api/comments", formData);    
  if (response.data.success) {
      onCommentAdded();
        toast.success(" התגובה נשלחה בהצלחה!");
        setName("");
        setComment("");
        setShowEmojiPicker(false);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("שגיאה בשליחה");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="border-t space-y-3 border-gray-300 px-4 py-3">
      <Input
        className="w-60"
        placeholder="הכנס שם..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onFocus={() => setShowEmojiPicker(false)}
        required
      />
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm relative">
        <Button
          size="icon"
          variant="ghost"
          className="mr-2"
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile size={20} />
        </Button>

        <Input
          className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
          placeholder="הקלד תגובה..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={() => setShowEmojiPicker(false)}
          required
        />

        <Button size="icon" className="ml-2 rounded-full" type="submit">
          <Send size={18} />
        </Button>

        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </form>
  );
};

export default AddComment;