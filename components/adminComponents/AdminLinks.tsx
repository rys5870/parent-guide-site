import React from "react";
import { adminLinks } from "@/constants/data";
import Link from "next/link";
const AdminLinks = () => {
  return (
    <div>
      <ul className=" p-3 flex flex-wrap gap-3">
        {adminLinks.map((item,index) => (
          <li key={index} className="p-2 bg-myColor_orange text-white rounded-2xl"><Link href={item.href}>{item.title}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default AdminLinks;
