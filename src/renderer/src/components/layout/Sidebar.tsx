import appLogo from '../../assets/app-icon.png';
import LeftNav from './LeftNav';
import { useSidebar } from '../../context/SidebarContext';

function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <div className={`
      fixed inset-y-0 z-50 flex flex-col w-72
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      <div className="flex flex-col px-6 pb-4 overflow-y-auto grow gap-y-5 bg-black/10 ring-1 ring-white/5">
        {/* Icon */}
        <div className="flex items-center h-16 shrink-0">
          <img
            className="w-12 h-auto cursor-default"
            src={appLogo}
            alt="Atomic Audiobook Player Logo"
          />
          <p className='cursor-default'>Atomic Audiobook Player</p>
        </div>
        {/* Navigation */}
        <LeftNav />
      </div>
    </div>
  );
}

export default Sidebar;
