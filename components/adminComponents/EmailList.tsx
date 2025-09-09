"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import { MdDelete } from "react-icons/md";


type Email = {
  email: string;
  date: Date;
  isDelete: boolean;
};

const EmailList = () => {
  const [emailList, setEmailList] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ emails: Email[] }>("/api/email");
      setEmailList(response.data.emails);
    } catch (error) {
      console.error("שגיאה בשליפה:", error);
      toast.error("אירעה שגיאה בעת טעינת המיילים");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmails();
  }, []);
  return (
 <div className="m-4 overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
  {loading ? (
    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
      טוען מיילים...
    </div>
  ) : emailList.length === 0 ? (
    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
      אין מיילים להצגה
    </div>
  ) : (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-3 text-center  text-sm font-semibold text-gray-700 dark:text-gray-300">
            כתובת מייל
          </th>
          <th className="px-4 py-3 text-center  text-sm font-semibold text-gray-700 dark:text-gray-300">
            תאריך
          </th>
          <th className="px-4 py-3 text-center  text-sm font-semibold text-gray-700 dark:text-gray-300">
            סטטוס
          </th>
           <th className="px-4 py-3  text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
           <IoSettings />
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
        {emailList.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <td className="px-4 py-3 text-sm text-right text-gray-800  dark:text-gray-200">{item.email}</td>
            <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
              {new Date(item.date).toLocaleDateString()}
            </td>
            <td className="px-4 py-3 text-sm text-center">
              {item.isDelete ? (
                <span className="text-red-500 font-medium">נמחק</span>
              ) : (
                <span className="text-green-600 font-medium">פעיל</span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-center">
             <MdDelete className="  text-myColor_red size-6" />

            </td>

          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
);

};

export default EmailList;
