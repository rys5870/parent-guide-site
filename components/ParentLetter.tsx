export default function CloudLetterSVG({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[80%] h-[90vh] mx-auto flex items-center justify-center relative">
     <svg width="400" height="100" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 20C44.7715 20 0 64.7715 0 120C0 125 0 130 0 130H200C200 130 200 125 200 120C200 64.7715 155.228 20 100 20Z" fill="#cccccc" stroke="none"/>
  <circle cx="50" cy="80" r="40" fill="#cccccc"/>
  <circle cx="150" cy="80" r="40" fill="#cccccc"/>
</svg>

      <div className="relative z-10 w-[70%] max-w-2xl px-10 py-8 text-center font-serif text-gray-800">
        {children}
      </div>
    </div>
  );
}