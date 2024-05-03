import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import Popup from './Popup';

function UIHandler() {

  const {
    error,
    errorMessage,
    electronError,
    electronErrorMessage,
    info,
    infoMessage,
    warning,
    warningMessage } = useSelector((state: RootState) => state.errors);

  if (!error && !electronError && !info && !warning) {
    return null;
  }

  let type: "error" | "warning" | "info" | null = null;
  let message = '';

  if (error) {
    type = 'error';
    message = errorMessage;
  } else if (electronError) {
    type = 'error';
    message = electronErrorMessage;
  } else if (info) {
    type = 'info';
    message = infoMessage;
  } else if (warning) {
    type = 'warning';
    message = warningMessage;
  }


  return (
    <Popup type={type} message={message} />
  );
}

export default UIHandler;