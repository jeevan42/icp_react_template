import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import icp from "../../../assets/icp.png";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { login, isAdmin, identity } = useAuth();
    const [adminHelpText, setAdminHelpText] = useState(t("adminLogin.logInAndGiveDeveloper"));
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle admin login
    const handleAdminLogin = async () => {
        setIsLoading(true);
        await login().then(() => window.location.reload());
    };

    useEffect(() => {
        // Function to check if the user is an admin
        if (isAdmin === true) {
            setAdminHelpText(t("adminLogin.adminRedirecting"));
            navigate("/dashboard");
        } else if (isAdmin === false) {
            setAdminHelpText(t("adminLogin.copyAndGiveDeveloper", { principalId: identity.getPrincipal().toText() }));
        }
    }, [isAdmin]);

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full bg-[#f1f1f1]" style={{ height: `calc(100vh - 93px)` }}>
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-4 sm:p-6 md:p-10 lg:p-10 xl:p-12 2xl:p-14 bg-white rounded-xl shadow-lg flex flex-col gap-4">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">{t("adminLogin.heading")}</h2>
                    <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 lg:my-3 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">{adminHelpText}</p>
                    <div className="flex flex-col mt-4 w-full justify-center items-center pt-4">
                        <button className={`w-fit flex gap-2 justify-center items-center py-1 px-4 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out ${isLoading ? 'bg-blue-900 text-white' : ''}`}
                            onClick={() => { !isLoading ? handleAdminLogin() : '' }} >
                            <img src={icp} alt="Internet Identity" className="w-10 h-10" />
                            <span className="text-md lg:text-lg md:text-lg font-semibold">
                                {isLoading ? t("adminLogin.loading") : t("adminLogin.internetIdentity")}
                            </span> 
                        </button>
                        <p className="uppercase first-line:font-bold cursor-pointer text-xs text-blue-900 hover:text-blue-700 underline mt-4" onClick={() => window.location.href = "/login"}>{t("adminLogin.continueAsAttendee")}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
