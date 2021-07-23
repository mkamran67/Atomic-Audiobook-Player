import React from "react";

function OpenFolder() {
  const handleClick = (e: any) => {
    e.preventDefault();
    console.log(e);
    console.log(`I got clicked`);
  };

  return (
    <div>
      <button onClick={handleClick} className="generic-button">
        Click To view Folders
      </button>
    </div>
  );
}

export default OpenFolder;
