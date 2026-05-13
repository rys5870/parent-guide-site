import React from "react";

const ChildrenContextBlock = ({
  children,
  icon,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-3 rounded-[1.25rem] border border-myColor_pink/10 bg-gradient-to-b from-white to-[#fff8fb]/85 p-4 text-center shadow-md shadow-myColor_pink/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-5">
      
      {/* אייקון בראש הכרטיס */}
      {icon && (
        <div className="text-4xl text-myColor_pink drop-shadow-sm">
          {icon}
        </div>
      )}

      {/* תוכן פנימי */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {children}
      </div>
    </div>
  );
};

export default ChildrenContextBlock;