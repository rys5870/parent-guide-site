"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
type CommentProps = {
  _id: string;
  comment: string;
  articleId: string;
  name: string;
  timestamp: Date;
};
interface CommentsProps {
  id?: string;
  refreshTrigger?: number;
}

const CommentManage: React.FC<CommentsProps> = ({ id, refreshTrigger }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
const handleDelete = async (_id: string) => {
  try {
    await axios.delete(`/api/comments/${_id}`);
    setComments((prev) => prev.filter((comment) => comment._id !== _id));
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<CommentProps[]>(`/api/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id, refreshTrigger]);
  return (
    <div className=" space-y-4 ">
      {comments.map((item) => (
        <div
          className="lg:w-1/5 bg-myColor_red text-white  p-3 rounded-4xl "
          key={item._id}
        >
            <div className="flex justify-between gap-4">
          <div>
            <div className="text-sm">{item.name}</div>
            <div className="font-bold">{item.comment}</div>
          </div>

           <button onClick={()=>handleDelete(item._id)}  aria-label="מחיקת מאמר">
                      <MdDelete className="text-white size-5.5 hover:scale-110 transition" />
                    </button>
        </div>
        </div>
      ))}
    </div>
  );
};

export default CommentManage;
