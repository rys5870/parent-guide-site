import Image from "next/image";
import { FaEye, FaEyeSlash, FaTrash, FaEdit } from "react-icons/fa";

export interface Testimonial {
  _id: string;  // עכשיו חובה
  type: "text" | "image";
  quote: string;
  image?: string;
  name: string;
  details?: string;
  show: boolean;
}



interface TestimonialItemProps {
  testimonial: Testimonial;
  onToggleShow: (id: string) => void;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export function TestimonialItem({
  testimonial,
  onToggleShow,
  onEdit,
  onDelete,
  isAdmin,
}: TestimonialItemProps) {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition">
      {testimonial.type === "text" ? (
        <blockquote className="italic text-lg text-gray-800">“{testimonial.quote}”</blockquote>
      ) : (
       <Image
          src={testimonial.image ||"/placeholder.png"}
          alt={testimonial.name}
          height={300}
          width={300}
          className="rounded-lg shadow-md max-w-full h-auto mb-2"
        />
      )}

      <p className="font-semibold mt-2 text-gray-900">{testimonial.name}</p>
      {testimonial.details && (
        <p className="text-sm text-gray-600">{testimonial.details}</p>
      )}

      {isAdmin && (
        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            onClick={() => onToggleShow(testimonial._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              testimonial.show
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {testimonial.show ? <FaEyeSlash /> : <FaEye />}
            {testimonial.show ? "הסתר" : "הצג"}
          </button>

          <button
            onClick={() => onEdit(testimonial)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          >
            <FaEdit />
            ערוך
          </button>

          <button
            onClick={() => onDelete(testimonial._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <FaTrash />
            מחק
          </button>
        </div>
      )}
    </div>
  );
}
