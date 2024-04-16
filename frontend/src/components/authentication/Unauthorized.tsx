import {JSX} from "react";
import DefaultErrorPage from "../DefaultErrorPage.tsx";
import { useTranslation } from 'react-i18next';

export default function Unauthorized(): JSX.Element {

    const { t } = useTranslation();

    return (
        DefaultErrorPage(
            t('unauthorized.title'),
            t('unauthorized.text')
        )
    )
}