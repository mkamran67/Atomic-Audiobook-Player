import { REQUEST_TO_ELECTRON, TEST_TEST_TEST } from "../../../../../src/shared/constants";

function Stats() {

  const testDirectory = () => {
    console.log('Test Directory');
    window.api.send(REQUEST_TO_ELECTRON, {
      type: TEST_TEST_TEST,
      data: null,
    });
  };


  return (
    <div className='grid w-full h-full mb-32 place-items-center'>
      <button className="btn" onClick={testDirectory}>
        Test Directory
      </button>
    </div>
  );
}

export default Stats;