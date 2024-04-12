import React from 'react';

type Props = {
  title: string;
};

function SettingsLoadingItem({ title }: Props) {
  return (
    <div className='flex items-center justify-between py-6 gap-x-6'>
      <p>{title}</p>
      <progress className="w-56 progress"></progress>
    </div>
  );
}

export default SettingsLoadingItem;