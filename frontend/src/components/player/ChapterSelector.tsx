function ChapterSelector() {
  return (
    <div className="dropdown dropdown-left dropdown-end">
      <label tabIndex={0} className="m-1 btn">
        Chapter
      </label>
      <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </div>
  );
}

export default ChapterSelector;
