interface SendButtonProps {
  onClick: () => void;
}

const SendButton = ({ onClick }: SendButtonProps) => {
  return (
    <button className="text-white bg-[#F26722] shadow-md px-6 py-2 rounded-md font-semibold" onClick={onClick}>
      Send
    </button>
  );
};
export default SendButton;
