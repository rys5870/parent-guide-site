import React from "react";
interface Props {
  commenter: string;
  timestamp?: Date;
  articleId: string;
  content: string;
}
const Comment: React.FC<Props> = ({
  commenter,
  // timestamp,
  // articleId,
  content,
}) => {
  return (
    <div className="flex items-start gap-1">
      <div className=" flex justify-center items-center w-8 h-8 rounded-[50%] bg-myColor_orange text-white font-bold">
        {commenter.slice(0, 1)}
      </div>
      <div className=" p-2 rounded-2xl bg-myColor_orange/10 ">
        <p className="text-myColor_red">{commenter}</p>
        <p className=" text-sm">{content}</p>
        {/* <p className="">{timestamp?.toDateString()}</p> */}
      </div>
    </div>
  );
};

export default Comment;
