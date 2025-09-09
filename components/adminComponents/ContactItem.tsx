"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
interface contactProps {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isDelete: boolean;
  status: string;
}

const ContactItem = ({
  _id,
  name,
  email,
  phone,
  message,
  status,
}: contactProps) => {
  const [messageStatus, setMessageStatus] = useState(status);
const onStatusChange = async (newStatus: string) => {
  setMessageStatus(newStatus);

  try {
    const response = await axios.put("/api/contact", {
      _id,
      status: newStatus,
    });

    if (response.data) {
      toast.success("עודכן בהצלחה!");
    } else {
      toast.error("שגיאה בעדכון");
    }
  } catch (error) {
    toast.error("שגיאה בשליחה");
    console.error(error);
  }
};
  return (
    <div
      className={`p-2 m-4 rounded-2xl  ${
        messageStatus === ""
          ? "bg-red-400"
          : messageStatus === "בטיפול"
          ? "bg-amber-200"
          : messageStatus === "טופל"
          ? "bg-green-300"
          : "bg-red-400"
      }`}
    >
      <div className=" w-full md:w-1/3">
        <div className="p-3 space-y-2 ">
          <p>
            <span className=" font-bold">שם:</span>
            {name}
          </p>
          <p>
            <span className=" font-bold">כתובת מייל:</span>
            {email}
          </p>
          <p>
            <span className=" font-bold">טלפון:</span>
            {phone}
          </p>
          <p>
            <span className=" font-bold">הודעה:</span>
            {message}
          </p>
        </div>
        <div className="p-3 space-y-2">
          <form>
            <select
              className="w-[200px] rounded-xs"
              value={messageStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">בחר</option>
              <option value="בטיפול">בטיפול</option>
              <option value="טופל">טופל</option>
              <option value="לא טופל">לא טופל</option>
            </select>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
