import { AvatarCircles } from '../components/ui/AvatarCircles';
import { avatars } from '../lib/utils';
import { SendMessageData } from '../lib/types';

interface TeamHeaderProps {
  sendMessage: (data: SendMessageData) => void;
}

const TeamHeader = ({ sendMessage }: TeamHeaderProps) => {
  const handleClearAll = () => {
    sendMessage({ type: 'CLEAR_ALL' });
  };
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-3">
        <h2 className="sm:text-xl text-sm font-bold text-[#F26722]">
          #devOps-team
        </h2>
        <p className="text-gray-500 text-sm font-normal">
          Online <span className="text-[#F26722]">●</span> 4
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <AvatarCircles numPeople={12} avatarUrls={avatars} />
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 font-normal bg-[#F26722]/20 hover:bg-[#F26722]/30 transition duration-200 ease-in-out rounded-md px-3 py-1.5"
        >
          Clear All Messages
        </button>
      </div>
    </div>
  );
};

export default TeamHeader;
