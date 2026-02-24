import React from 'react';

type Props = {
  type: 'error' | 'info' | 'warning' | null;
  message: string;
};

const typeStyles = {
  error: 'bg-error/15 text-error border-error/30',
  info: 'bg-info/15 text-info border-info/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
};

function Popup({ type, message }: Props) {

  if (type === null) {
    return null;
  }

  return (
    <div role="alert" className={`flex items-center gap-3 rounded-lg border p-4 mb-4 ${typeStyles[type]}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{type.toUpperCase()}! {message}</span>
    </div>
  );
}

export default Popup;
