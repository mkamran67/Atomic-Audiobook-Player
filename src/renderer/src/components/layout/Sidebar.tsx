import appLogo from '../../assets/app-icon.png';
import Player from '../player/Player';
import LeftNav from './LeftNav';



function Sidebar() {
  return (
    <div className="fixed inset-y-0 z-50 flex flex-col w-72">
      <div className="flex flex-col px-6 pb-40 overflow-y-auto grow gap-y-5 bg-black/10 ring-1 ring-white/5">
        {/* Icon */}
        <div className="flex items-center h-16 shrink-0">
          <img
            className="w-12 h-auto cursor-default "
            src={appLogo}
            alt="Atomic Audiobook Player Logo"
          />
          <p className='cursor-default'>Atomic Audiobook Player</p>
        </div>
        {/* Navigation */}
        <LeftNav />
      </div>
      <Player />
    </div>
  );
}

export default Sidebar;