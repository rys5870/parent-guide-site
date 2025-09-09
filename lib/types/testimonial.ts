export interface Testimonial {
  _id: string;             // חובה
  type: "text" | "image";
  quote: string;           // אם type === "text"
  image?: string;          // אם type === "image"
  name: string;
  details?: string;
  show: boolean;
}
