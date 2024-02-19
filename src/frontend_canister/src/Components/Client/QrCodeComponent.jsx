import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuthClient';
import { getValueByKeyFromString } from '../utils/getValueByKeyFromString';
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import QRCode from 'react-qr-code';

// QrCodeComponent functional component
const QrCodeComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { backendActor, frontendCanisterId, isAdmin } = useAuth();
    const { URLSearchParams } = window;
    const [qrCodeName, setQrCodeName] = useState(""); // State to store QR code value
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event_id');

    // Function to get new QR code name from the backend
    const getNewQrCodeName = async (val) => {
        try {
            const response = await backendActor.getQrCode(val);
            setQrCodeName(response);
            return true;
        } catch (error) {
            let errMessage = getValueByKeyFromString(error.toString(), "Reject text");
            toast.error(errMessage);
            return false;
        }
    }

    // Function to approve generating a hex code
    const approveToMakeAHexcode = async (val) => await backendActor.changeQrGenerateStatus(val);

    // Effect to call getNewQrCodeName every 5 seconds
    useEffect(() => {
        if (eventId) {
            if (isAdmin === true) {
                approveToMakeAHexcode(eventId);
            } else if (isAdmin === false) {
                navigate('/login');
            }

            const interval = setInterval(() => {
                getNewQrCodeName(eventId);
            }, 5000);

            return () => clearInterval(interval);
        } else {
            navigate('/');
        }
    }, []);

    return (
        <>
            <div className="bg-[#f1f1f1] flex px-4 justify-center items-center h-screen">
                <div className='w-3/4 flex lg:gap-4 flex-col lg:flex-row'>
                    <div className="items-start justify-center pr-8 py-16 flex lg:w-3/5">
                        <div className='flex flex-col'>
                            <p className='text-[#333] text-4xl font-bold'>{t("qrCodeComponent.heading")}</p>
                            <p className='text-gray-600 my-4 font-normal'>{t("qrCodeComponent.helpText")}</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/5 h-full mt-2 flex items-start justify-start">
                        <div className="bg-white px-8 py-7 rounded-xl w-full lg:w-[600px] mb-2 mt-2 my-16 shadow-lg shadow-blue-300">
                            <div className='flex flex-col items-center justify-center'>
                                <span className='my-2 text-blue-900 font-extrabold text-xl cursor-pointer  underline decoration-2 underline-offset-4'>{t("qrCodeComponent.qrGenerated")}</span>
                                <div className='h-fit border-2 border-black rounded-lg my-2 p-2'>
                                    {qrCodeName ?
                                        <QRCode bgColor="#FFFFFF" fgColor="#000000" className="w-[180px] sm:w-[220px] md:w-[225px] h-[180px] sm:h-[200px] md:h-[225px]"
                                            title={`https://${frontendCanisterId}.icp0.io/login?event_id=${eventId}&unique_code=${qrCodeName}`}
                                            value={`https://${frontendCanisterId}.icp0.io/login?event_id=${eventId}&unique_code=${qrCodeName}`}
                                        /> :
                                        <div className="w-[180px] sm:w-[220px] md:w-[225px] h-[180px] sm:h-[200px] md:h-[225px] relative items-center block bg-white border border-gray-100 rounded-lg shadow-md">
                                            <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className='my-2 flex justify-center px-8'>
                                    <button onClick={() => navigate(-1)} className='w-32 flex gap-2 justify-center items-center p-2 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out'>
                                        <span className="text-md lg:text-lg md:text-lg font-semibold">{t("qrCodeComponent.hideQr")}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </ >
    );
};

export default QrCodeComponent;