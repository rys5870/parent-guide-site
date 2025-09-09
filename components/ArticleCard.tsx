import Link from "next/link";
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";


import { TbHandMove } from "react-icons/tb";

interface ArticleProps {
  id:string;
  title: string;
  topic: string;
  content: string;
  readTime: string;
  createdAt: string; 
  imageUrl: string;
}

const ArticleCard: React.FC<ArticleProps> = ({
  id,
  title,
  topic,
  content,
  readTime,
  createdAt,
  imageUrl,
}) => {
  return (
    <div className="w-80 flex flex-col  rounded-2xl shadow-lg shadow-red-950 bg-white h-[450] text-black">
      <div className="rounded-t-lg h-2 bg-gradient-to-r from-pink-500 to-red-600"></div>

    
      <div className=" relative" >
        
         <p className=" absolute m-1 p-0.7  bg-pink-600/70 rounded-2xl w-30 text-white flex justify-center font-bold ">{topic}</p> 
        <img className="h-52 w-full object-cover" src={imageUrl} alt={title} />
      </div>

      
      <div className="p-2">
        <div>
          <h2 className="text-pink-950 font-bold">{title}</h2>

          <p className="text-pink-950">{content}</p>
        </div>

        <div style={styles.footer}>
          <div className="flex flex-col justify-center items-center gap-0.5">
            <div>
             <IoMdTime/>

            </div>
            <div>{readTime}</div>
          </div>

          <div className="flex flex-col justify-center items-center gap-0.5">
            <div>
              <FaRegCalendarAlt />
            </div>
            <div> {createdAt}</div>
          </div>

          <Link href={`/articles/${id}`} className="text-pink-950 flex align-center  cursor-pointer"><span className="font-bold">לקריאת המאמר</span><span className="text-2xl"><TbHandMove /></span> </Link>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "320px",
    margin: "auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    minWidth: "280px",

    alignItems: "center",
    borderTop: "5px solid rgba(231, 138, 138, 0.5)",
  },
  image: {
    width: "100%",
    height: "250px",
    borderRadius: 8,
  },
  meta: {
    paddingTop: 16,
  },
  content: {
    marginTop: 10,
    lineHeight: 1.6,
  },
  footer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#555",
  },
  topic: {
    padding: "10px",
    background: "rgba(220, 137, 85, 0.5)",
    borderRadius: "15px",
  },
};

export default ArticleCard;
