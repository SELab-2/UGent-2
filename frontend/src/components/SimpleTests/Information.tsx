import Popup from 'reactjs-popup';
import '../../assets/styles/SimpleTests/information.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Information(props: {
    content: JSX.Element, 
    trigger: (onClick: () => void) => JSX.Element, 
}) {

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
            <>
                {props.trigger(() => {setOpen(o => !o)})}

            <Popup 
                open={open} 
                closeOnDocumentClick 
                modal
            >
                <button className="information-close" onClick={closeModal}>
                    &times;
                </button>
                <div className="information-header">{t('submission_files.information.title')}</div>
                <div className="information-content">
                   {props.content}
                </div>
            </Popup>
            
            </>
    )
}
