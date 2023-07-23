import { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from 'prop-types';

const Modal = ({ children, onBackdropClose, onKeydownClose }) => {
    const modalRoot = document.querySelector('#root-modal');
    useEffect(() => {
        window.addEventListener('keydown', onKeydownClose);
    }, [onKeydownClose]);
    useEffect(() => {
        return () => {
            window.removeEventListener('keydown', onKeydownClose);
        }
    }, [onKeydownClose])

    return createPortal(
        <div id="modal-backdrop" className="Overlay" onClick={onBackdropClose}>
            <div id="modal-window" className="Modal">
                {children}
            </div>
        </div>, modalRoot
    )
}
export default Modal;

Modal.propTypes = {
    onSubmit: PropTypes.func,
}