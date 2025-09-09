import React from "react";

interface DecorationsProps {
  width?: number;
  height?: number;
}

const Decorations: React.FC<DecorationsProps> = ({
  width = 80,
  height = 80,
}) => {
  return (
    <svg
      viewBox="0 0 500 300"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width={width}
      height={height}
    >
      <path
        d="M80 40 C 20 90, 40 210, 120 220 C 200 230, 260 120, 180 60 C 140 30, 110 30, 80 40 Z"
        fill="#F7B76E"
        fillOpacity="0.7"
      />
      <path
        d="M160 60 C 120 120, 220 220, 320 200 C 410 180, 360 100, 300 80 C 260 70, 220 70, 200 80 Z"
        fill="#F4978E"
        fillOpacity="0.7"
      />
      <path
        d="M240 140 C 200 180, 260 260, 360 250 C 440 240, 420 180, 340 140 C 300 120, 280 130, 240 140 Z"
        fill="#F79FB0"
        fillOpacity="0.66"
      />
    </svg>
  );
};

export default Decorations;