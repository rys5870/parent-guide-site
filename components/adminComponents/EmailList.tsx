"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAxiosLikeError } from "@/lib/getAxiosLikeError";

type EmailRow = {
  _id: string;
  email: string;
  date: Date | string;
  isDelete: boolean;
};

const EmailList = () => {
  const [emailList, setEmailList] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ emails: EmailRow[] }>(
        "/api/admin/email"
      );
      setEmailList(response.data.emails ?? []);
    } catch (error) {
      console.error("שגיאה בשליפה:", error);
      toast.error(getAxiosLikeError(error) ?? "אירעה שגיאה בעת טעינת המיילים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmails();
  }, []);

  const removeEmail = async (id: string) => {
    if (!confirm("האם למחוק כתובת זו מהרישום?")) return;
    try {
      await axios.delete(`/api/admin/email?id=${encodeURIComponent(id)}`);
      toast.success("נמחק");
      await fetchEmails();
    } catch (e) {
      toast.error(getAxiosLikeError(e) ?? "מחיקה נכשלה");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md dark:border-gray-700 m-4">
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
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                כתובת מייל
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                תאריך
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                סטטוס
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <IoSettings />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {emailList.map((item) => (
              <tr
                key={item._id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 text-right text-sm text-gray-800 dark:text-gray-200">
                  {item.email}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString("he-IL")}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {item.isDelete ? (
                    <span className="font-medium text-red-500">נמחק</span>
                  ) : (
                    <span className="font-medium text-green-600">פעיל</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => void removeEmail(item._id)}
                    className="inline-flex items-center justify-center rounded-lg p-1 text-myColor_red hover:bg-red-50"
                    aria-label="מחק"
                  >
                    <MdDelete className="size-6" />
                  </button>
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
