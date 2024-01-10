// The below is for response consistency
// ELECTRON_RESPONSE -> is what React is expecting
// Response constants from Electron - strings
const ELECTRON_RESPONSE_SETTINGSDATA_TYPE = "settingsData";
const ELECTRON_RESPONSE_BOOKDATA_TYPE = "bookData";
const ELECTRON_RESPONSE_BOOK_DETAILS_TYPE = "bookDetails";
const ELECTRON_ERROR = "error_type";

// REACT_RESPONSE -> is what Electron is expecting
// Requests from React - strings
const REACT_REQUEST_SETTINGSDATA_TYPE = "settingsData";
const REACT_REQUEST_BOOKDATA_TYPE = "bookData";
const REACT_REQUEST_BOOK_DETAILS_TYPE = "bookDetails";
const REACT_REQUEST_ERROR = "error_type";

export {
  ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
  ELECTRON_RESPONSE_BOOKDATA_TYPE,
  ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
  ELECTRON_ERROR,
  REACT_REQUEST_SETTINGSDATA_TYPE,
  REACT_REQUEST_BOOKDATA_TYPE,
  REACT_REQUEST_BOOK_DETAILS_TYPE,
  REACT_REQUEST_ERROR,
};
