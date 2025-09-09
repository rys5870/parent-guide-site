import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />

      {children}
      <div id="modal-root" />

      <ToastContainer position="top-center" autoClose={3000} />

      <Footer />
    </div>
  );
}
