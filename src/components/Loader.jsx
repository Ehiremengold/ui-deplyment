import "../loader.css"; 

const Loader = () => {
  return (
    <div className="loading-container">
      <svg viewBox="0 0 900 300">
        <text
          x="50%"
          y="50%"
          dy=".32rem"
          textAnchor="middle"
          className="text-body"
        >
          SBSC
        </text>
      </svg>
    </div>
  );
};

export default Loader;
