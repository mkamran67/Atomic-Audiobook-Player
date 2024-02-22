import { useState } from 'react'
import { Dialog, Switch } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import {
  BellIcon,
  CreditCardIcon,
  CubeIcon,
  FingerPrintIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'

const navigation = [
  { name: 'Home', href: '#' },
  { name: 'Invoices', href: '#' },
  { name: 'Clients', href: '#' },
  { name: 'Expenses', href: '#' },
]
const secondaryNavigation = [
  { name: 'General', href: '#', icon: UserCircleIcon, current: true },
  { name: 'Security', href: '#', icon: FingerPrintIcon, current: false },
  { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  { name: 'Plan', href: '#', icon: CubeIcon, current: false },
  { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Team members', href: '#', icon: UsersIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {

  // Handle saves
  // Read updates from Redux
  const {
    previoousBookDirectory,
    rootDirectories,
    themeMode,
    volume,
    fontSize
  } = useSelector((state: RootState) => state.settings)




  return (
    <>
      <div className="pt-16 mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="max-w-2xl mx-auto space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            {/* Section of Settings */}
            <section>
              <h2 className="text-base font-semibold leading-7 text-white-900">Home</h2>
              <p className="mt-1 text-sm leading-6 text-white-500">
                Settings for the Home tab.
              </p>
              <ul role="list" className="mt-6 text-sm leading-6 border-t border-gray-600 divide-y divide-gray-100">
                <li className="flex justify-between py-6 gap-x-6">
                  <div className="font-medium text-white-900">"/dummy/path/to/root/directory"</div>
                  <div className="text-white-900">Choose the root directory of audio books. lorem*15</div>

                  <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </li>
              </ul>
              <div className="flex pt-6 border-t border-gray-700">
                <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  + Add another directory
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold leading-7 text-white-900">Language and dates</h2>
              <p className="mt-1 text-sm leading-6 text-white-500">
                Choose what language and date format to use throughout your account.
              </p>

              <dl className="mt-6 space-y-6 text-sm leading-6 border-t border-gray-200 divide-y divide-gray-100">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-white-900 sm:w-64 sm:flex-none sm:pr-6">Language</dt>
                  <dd className="flex justify-between mt-1 gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-white-900">English</div>
                    <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Update
                    </button>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-white-900 sm:w-64 sm:flex-none sm:pr-6">Date format</dt>
                  <dd className="flex justify-between mt-1 gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-white-900">DD-MM-YYYY</div>
                    <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Update
                    </button>
                  </dd>
                </div>
                {/* <Switch.Group as="div" className="flex pt-6">
                  <Switch.Label as="dt" className="flex-none pr-6 font-medium text-white-900 sm:w-64" passive>
                    Automatic timezone
                  </Switch.Label>
                  <dd className="flex items-center justify-end flex-auto">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className={classNames(
                        automaticTimezoneEnabled ? 'bg-indigo-600' : 'bg-gray-200',
                        'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          automaticTimezoneEnabled ? 'translate-x-3.5' : 'translate-x-0',
                          'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </dd>
                </Switch.Group> */}
              </dl>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
