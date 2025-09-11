import React, { useEffect, useState } from 'react'
import Comment from './Comment';
import axios from 'axios';

type CommentProps ={
  _id: string;
  comment: string;
  articleId: string;
  name: string;
  timestamp: Date;
  
}
interface CommentsProps {
  id?: string;
  refreshTrigger?: number;
}



const Comments: React.FC<CommentsProps> = ({id , refreshTrigger }) => {

   const [comments, setComments] = useState<CommentProps[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<CommentProps[]>(`/api/comments/?articleId=${id}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id, refreshTrigger]);
  return (
    <div className='p-5 space-y-1.5'>
{Array.isArray(comments) &&

    comments.map((item)=>(
        <Comment key={item._id} commenter={item.name}  articleId={item.articleId} content={item.comment} timestamp={item.timestamp} />
    ))
}
    </div>
  )
}

export default Comments