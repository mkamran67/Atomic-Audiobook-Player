import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ADD_BOOK_DIRECTORY, REQUEST_TO_ELECTRON, WRITE_SETTINGS_FILE } from '../../../../../src/shared/constants';
import { RootState } from '../../state/store';
import { InputEnumType, RangeInputProps } from '../../types/general.types';
import { useDebounceValue } from '../../utils/customHooks';
import InputSelector from '../InputSelector';
import SettingsLoadingItem from '../settings/SettingsLoadingItem';
import ThemeSettings from '../settings/ThemeSettings';

export default function Settings() {
  // Handle saves
  // Read updates from Redux
  const {
    themeMode,
    rootDirectories,
    previousBookDirectory,
    volume,
    fontSize
  } = useSelector((state: RootState) => state.settings);
  const { warning, error: hasError } = useSelector((state: RootState) => state.errors);
  const [itemLoading, setItemLoading] = useState(false);
  const counter = useRef(0);
  const prevDirState = useRef<string[]>([]);

  useEffect(() => {
    if (prevDirState.current !== rootDirectories) {
      setItemLoading(false);
    }

    prevDirState.current = rootDirectories;
  }, [rootDirectories]);

  useEffect(() => {
    if (warning || hasError) {
      setItemLoading(false);
    }
  }, [warning, hasError]);





  // FIXME: This is a temporary solution to get the volume to update
  const [rangeValue, setRangeValue] = useState(volume);
  // FIXME: Use this later
  // const debouncedVolume = useDebounceValue(rangeValue, 500);

  const rangeInputProps: RangeInputProps = {
    value: rangeValue,
    onChange: (e) => setRangeValue(Number(e.target.value)),
    min: '0',
    max: '100',
  };

  const dirChangeHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    const target = event.target as HTMLInputElement;
    const eventType = target.id;

    if (eventType === 'Add Directory') {
      prevDirState.current = rootDirectories;
      setItemLoading(true);
      window.api.send(REQUEST_TO_ELECTRON, {
        type: ADD_BOOK_DIRECTORY,
        data: {
          update: false
        }
      });
    } else if (eventType === 'Update Directory') {
      window.api.send(REQUEST_TO_ELECTRON, {
        type: ADD_BOOK_DIRECTORY,
        data: {
          update: true
        }
      });
    }
  };

  const deleteDirectory = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    const target = event.target as HTMLInputElement;
    const directory = target.getAttribute('data-tag');

    window.api.send(REQUEST_TO_ELECTRON, {
      type: WRITE_SETTINGS_FILE,
      data:
      {
        action: 'deleteADirectory',
        payload: directory,
      }

    });
  };


  return (
    <>
      <div className="pt-16 mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="max-w-2xl mx-auto space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <ThemeSettings />
            <section>
              <h2 className="text-base font-semibold leading-7 text-base-content/70">Settings</h2>
              <ul role="list" className="mt-6 text-sm leading-6 border-t border-base-300 divide-y divide-base-300">
                <li key={"volume" + 0} className="flex flex-col sm:flex-row justify-between py-6 gap-2 sm:gap-x-6">
                  {/* Title */}
                  <div className="font-medium text-base-content/70">Default Volume</div>
                  {/* Description */}
                  <div className="text-base-content/70">On launch volume will be set to this value.</div>
                  {/* Input */}
                  <InputSelector inputEnumSelector={InputEnumType.range} inputProps={rangeInputProps} />
                  <div className="text-base-content">{rangeValue}</div>
                </li>
              </ul>
              <ul role="list" className="mt-6 text-sm leading-6 border-t border-base-300 divide-y divide-base-300">
                {rootDirectories.length > 0 &&
                  rootDirectories.map((directory, index) => {
                    return (
                      <li key={"dirs" + index} className="flex flex-col sm:flex-row justify-between py-6 gap-2 sm:gap-x-6">
                        {/* Title */}
                        <div className="font-medium text-base-content/70">{directory}</div>
                        {/* Input */}
                        <div className='flex items-center justify-center'>
                          <button type="button" id='Update Directory' className="font-semibold text-primary hover:text-primary/80">
                            Update
                          </button>
                          <button onClick={deleteDirectory} type="button" data-tag={directory} id='Delete Directory' className="mx-6 font-semibold text-error hover:text-error/80">
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })
                }
                {itemLoading ? <SettingsLoadingItem title="Adding new directory..." /> : <p>{itemLoading}</p>}
                <div className="flex pt-6 border-base-100">
                  <button type="button" id='Add Directory' className="text-sm font-semibold leading-6 text-primary hover:text-primary/80" onClick={dirChangeHandler}>
                    <span aria-hidden="true">+</span> Add Directory
                  </button>
                </div>
              </ul>
            </section>
          </div>
        </main >
      </div >
    </>
  );
}
