import React from 'react'

type SectionListType = {
  mainText: string,
  description: string,
  buttonText: string,
  updateHandler: () => void,
}

type Props = {
  sectionText: string,
  sectionDescription?: string,
  settingsSectionList: SectionListType,
}


function SettingsSection({ sectionText, sectionDescription, settingsSectionList }: Props) {
  return (
    <section>
      {sectionText && (<h2 className="text-base font-semibold leading-7 text-white-900">{sectionText}</h2>)}
      {sectionDescription && (
        <p className="mt-1 text-sm leading-6 text-white-500">
          {sectionDescription}
        </p>
      )}
      <ul role="list" className="mt-6 text-sm leading-6 border-t border-gray-600 divide-y divide-gray-100">
        {settingsSectionList.map((section, index) => (
          <li key={section.mainText + index} className="flex justify-between py-6 gap-x-6">
            <div className="font-medium text-white-900">{section.mainText}</div>
            {/* FIXME -> Update UI to handle list */}
            {/* <div className="text-white-900">{settingsSectionList.}</div> */}

            <button type="button" onClick={section.updateHandler} className="font-semibold text-indigo-600 hover:text-indigo-500">
              {section.buttonText}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex pt-6 border-t border-gray-700">
        <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          <span aria-hidden="true">+</span> Add another directory
        </button>
      </div>
    </section>

  )
}

export default SettingsSection