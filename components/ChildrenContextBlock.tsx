import React from "react";

const ChildrenContextBlock = ({
  children,
  icon,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-4xl border-4 border-t-myColor_orange border-r-myColor_pink border-b-myColor_red border-l-pink-400 shadow-md text-center">
      
      {/* אייקון בראש הכרטיס */}
      {icon && (
        <div className="text-5xl text-pink-500">
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