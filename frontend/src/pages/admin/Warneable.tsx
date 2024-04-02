import Popup from 'reactjs-popup';
import '../../assets/styles/warneable.css'
import { useState } from 'react';

export default function(props: {
    text: string, 
    trigger: (onClick: () => void) => JSX.Element, 
    proceed: () => void,
}) {

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const onProceed = () => {
        props.proceed()
        closeModal()
    };

    return (
            <>
                {props.trigger(() => {setOpen(o => !o)})}

                <Popup open={open} closeOnDocumentClick onClose={closeModal} modal>
                    <div className="warning-header"> Warning! </div>

                    <div className="warning-content">
                        {props.text}
                    </div>

                    <div className="warning-actions">

                        <button className="warning-button warning-proceed" onClick={onProceed}> 
                            Proceed 
                        </button>
                        
                        <button className="warning-button warning-close" onClick={closeModal}>
                            Cancel
                        </button>

                    </div>
                </Popup>

            </>
    )
}
