import { REQUEST_TO_ELECTRON, REACT_ERROR } from '../../../../shared/constants';

type Props = {
  type: string,
  message: string
}

function Notifications({ type, message }: Props) {

  const alertTypes = ['error', 'warning', 'info', 'success'];

  if (!alertTypes.includes(type)) {
    window.api.send(REQUEST_TO_ELECTRON, {
      type: REACT_ERROR,
      data: `Invalid alert type: ${type}`
    });

    message = `Invalid alert type: ${type}`;
    type = 'error';
  }

  const errorClass = `alert alert-${type}`;

  return (
    <div role="alert" className={errorClass}>
      <svg xmlns="http://www.w3.org/2000/svg" className="z-50 w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{message ? message : "No message provided."}</span>
    </div>
  )
}

export default Notifications