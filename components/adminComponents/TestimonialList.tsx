"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TestimonialItem } from "./TestimonialItem";
import "react-toastify/dist/ReactToastify.css";
import EditTestimonialModal from "./EditTestimonialModal";
import { Testimonial } from "./TestimonialItem";
import Link from "next/link";
import { IoMdAddCircleOutline } from "react-icons/io";

interface UpdateResponse {
  success: boolean;
  testimonial: Testimonial;
}

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const isAdmin = true;

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Testimonial[]>("/api/admin/testimonial");
        setTestimonials(res.data);
      } catch (err) {
        console.error("שגיאה בשליפת ציטוטים:", err);
        toast.error("שגיאה בטעינת הציטוטים");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleToggleShow = async (id: string) => {
    try {
      setLoading(true);
      const current = testimonials.find((t) => t._id === id);
      if (!current) return;

      const response = await axios.put<UpdateResponse>(
        `/api/admin/testimonial`,
        {
          id,
          show: !current.show,
        }
      );

      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? response.data.testimonial : t))
      );
      toast.success("הציטוט עודכן בהצלחה");
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס הצגה:", err);
      toast.error("שגיאה בעדכון הציטוט");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/admin/testimonial/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success("הציטוט נמחק בהצלחה");
    } catch (err) {
      console.error("שגיאה במחיקה:", err);
      toast.error("שגיאה במחיקת הציטוט");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
  };

  const handleSaveEdit = async (updated: Partial<Testimonial>) => {
    if (!editing) return;
    try {
      setLoading(true);
      const response = await axios.put<UpdateResponse>(
        `/api/admin/testimonial`,
        {
          id: editing._id,
          ...updated,
        }
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === editing._id ? response.data.testimonial : t))
      );
      toast.success("הציטוט עודכן בהצלחה");
      setEditing(null);
    } catch (err) {
      console.error("שגיאה בעריכה:", err);
      toast.error("שגיאה בעדכון הציטוט");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link
        className="inline-block mb-6 px-4 py-2 bg-myColor_pink text-white rounded-3xl hover:bg-myColor_red transition"
        href={"/admin/testimonial/add"}
      >
        <div className="flex justify-center items-center gap-2">
          <IoMdAddCircleOutline className="size-8" />
          <span className=" font-bold">הוספת המלצה</span>
        </div>
      </Link>
      <div className="space-y-6 relative">
        {editing && (
          <EditTestimonialModal
            testimonial={editing}
            onClose={() => setEditing(null)}
            onSave={handleSaveEdit}
          />
        )}

        <ToastContainer position="top-center" autoClose={3000} rtl />
        <h1 className="text-2xl font-bold">ציטוטים</h1>

        {loading && (
          <div className="text-center text-blue-500 font-medium">טוען...</div>
        )}

        {!loading &&
          testimonials.map((t) => (
            <TestimonialItem
              key={t._id}
              testimonial={t}
              onToggleShow={handleToggleShow}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
      </div>
    </>
  );
}
