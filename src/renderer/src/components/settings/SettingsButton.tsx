import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import React, { MouseEventHandler } from "react";

type Props = {
  tooltip?: string;
  children?: React.ReactNode;
  className?: string;
  description: string;
  setAction: MouseEventHandler;
  isDisabled: boolean;
  btnText: string;
};

function SettingsButton({ description, setAction, isDisabled, btnText, tooltip }: Props) {
  return (
    <div className="flex items-center justify-between w-full">
      {description && <p className="font-mono text-center text-base-content cursor-default">{description}</p>}

      <div className="flex items-center justify-center">
        <button
          onClick={setAction}
          type="button"
          className="inline-flex items-center rounded border border-base-300 bg-base-100 px-2.5 py-1.5 text-xs font-medium text-base-content shadow-sm hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={isDisabled}
        >
          {btnText}
        </button>
        {
          <div className={tooltip ? "z-50 ml-2 tooltip" : "z-50 ml-2 invisible"} data-tip={tooltip}>
            <QuestionMarkCircleIcon className="w-5 h-5" aria-hidden="true" />
          </div>
        }
      </div>
    </div>
  );
}

export default SettingsButton;
