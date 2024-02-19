import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Error404 = () => {
    const { t } = useTranslation();
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="text-center">
                <h1 className="mb-4 text-6xl font-semibold text-red-500">{t("error404.heading")}</h1>
                <p className="mb-4 text-lg text-gray-600">{t("error404.lostMessage")}</p>
                <div className="animate-bounce">
                    <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </div>
                <p className="mt-4 text-gray-600"><Link to="/" className="text-blue-500">{t("error404.goBack")}</Link>.</p>
            </div>
        </div>
    );
};

export default Error404;
