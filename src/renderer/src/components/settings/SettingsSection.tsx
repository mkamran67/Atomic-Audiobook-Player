import React from 'react'

type SectionProperties = {
  mainText: string,
  description: string,
  updateHandler: () => void,
  buttonText: string,
}

type SectionListType = {
  sectionTitle: string,
  sectionDescription: string,
  sectionAction: () => void,
  sectionBtnText: string,
  sectionProperties: SectionProperties[],

}

type Props = {
  settingSections: SectionListType,
}

// This is A section of the settings page
// Not a list of sections
function SettingsSection({ settingSections }: Props) {

  const { sectionTitle, sectionDescription, sectionAction, sectionProperties, sectionBtnText } = settingSections;

  return (
    <section>
      {sectionTitle && (<h2 className="text-base font-semibold leading-7 text-white-900">{sectionTitle}</h2>)}
      {sectionDescription && (
        <p className="mt-1 text-sm leading-6 text-white-500">
          {sectionDescription}
        </p>
      )}
      <ul role="list" className="mt-6 text-sm leading-6 border-t border-gray-600 divide-y divide-gray-100">
        {sectionProperties.map((sectionItem: SectionProperties, index: number) => (
          <li key={sectionItem.mainText + index} className="flex justify-between py-6 gap-x-6">
            <div className="font-medium text-white-900">{sectionItem.mainText}</div>
            {sectionItem.description && (<div className="text-white-900">{sectionItem.description}</div>)}
            <button type="button" onClick={sectionItem.updateHandler} className="font-semibold text-indigo-600 hover:text-indigo-500">
              {sectionItem.buttonText}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex pt-6 border-t border-gray-700">
        <button onClick={sectionAction} type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          {sectionBtnText}
        </button>
      </div>
    </section>

  )
}

export default SettingsSection