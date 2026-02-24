import React from 'react';

type Props = {
  title: string;
};

function SettingsLoadingItem({ title }: Props) {
  return (
    <div className='flex items-center justify-between py-6 gap-x-6'>
      <p>{title}</p>
      <div className="w-56 h-2 bg-base-300 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-pulse w-2/3"></div>
      </div>
    </div>
  );
}

export default SettingsLoadingItem;
