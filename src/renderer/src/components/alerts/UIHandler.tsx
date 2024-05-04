import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import Popup from './Popup';

type Props = {
  testBoolean?: boolean;
};

function UIHandler({ testBoolean = false }: Props) {

  const {
    error,
    errorMessage,
    electronError,
    electronErrorMessage,
    info,
    infoMessage,
    warning,
    warningMessage } = useSelector((state: RootState) => state.errors);

  if (!testBoolean) {
    if (!error && !electronError && !info && !warning) {
      return null;
    }
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
  } else if (testBoolean) {
    type = 'error';
    message = 'This is a test error message.';
  }


  return (
    <Popup type={type} message={message} />
  );
}

export default UIHandler;