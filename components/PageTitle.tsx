import React from "react";

const PageTitle = ({ text }: { text: string }) => {
  return (
<h1 className="p-4 text-black  text-center font-semibold text-2xl lg:text-6xl">
  {text}
</h1>
  );
};

export default PageTitle;
