import React, {JSX, useState} from "react";
import {CiLink} from "react-icons/ci";
import {RegularButton} from "./RegularButton.tsx";
import {useTranslation} from "react-i18next";

export default function CopyLink(props: { link: string }): JSX.Element {
    const [modalActive, setModalActive] = useState(false);
    const inputRef = React.createRef<HTMLInputElement>();
    const [copied, setCopied] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const {t} = useTranslation();

    const changeModal = () => {
        setModalActive(!modalActive);
    };
    const copyToClipboard = () => {
        if (timer !== null) {clearTimeout(timer);}
        void navigator.clipboard.writeText(props.link);
        setCopied(true);
        setTimer(setTimeout(() => {
            setCopied(false);
        }, 1500));
    }

    return (
        <>
            <button className="js-modal-trigger button is-rounded" onClick={changeModal}>
                <CiLink size={25}/>
            </button>
            <div id="modal-stats" className={`modal ${modalActive ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={changeModal}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t('popups.share')}</p>
                        <button className="delete" aria-label="close" onClick={changeModal}></button>
                    </header>
                    <section className="modal-card-body py-6">
                        <p>
                            {t('popups.share_warning')}
                        </p>
                    </section>
                    <footer className="modal-card-foot is-flex is-justify-content-center">
                        <input type="text" readOnly size={45} ref={inputRef} onClick={() => inputRef.current?.select()}
                               value={props.link}/>

                        {!copied &&
                            <RegularButton placeholder={t('popups.share_link')} add={false} styling={"is-success ml-4"}
                                           onClick={copyToClipboard}/>}
                        {copied && <RegularButton placeholder={t('popups.copied')} onClick={copyToClipboard} add={false}
                                                  styling={"is-success ml-4"}/>}
                    </footer>
                </div>
            </div>
        </>
    )
}
