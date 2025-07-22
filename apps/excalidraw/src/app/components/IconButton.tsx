import React, { ReactNode } from 'react';

interface IconButtonInterface {
  onclick: () => void;
  icon: ReactNode;
  activated: boolean;
}

export default function IconButton({ onclick, icon, activated }: IconButtonInterface) {
  return (
    <button
      onClick={onclick}
      className={`
        p-2 rounded-full transition-colors ease-linear duration-200
        ${activated ? 'bg-blue-500 text-white' : 'bg-white text-black'}
        hover:bg-blue-400 hover:text-white
      `}
    >
      {icon}
    </button>
  );
}
