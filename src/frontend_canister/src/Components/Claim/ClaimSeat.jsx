import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { getValueByKeyFromString } from "../utils/getValueByKeyFromString";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import Loader from "../utils/Loader";

// Component for claiming a seat
const ClaimSeat = () => {
  const { t } = useTranslation();
  const { backendActor } = useAuth();
  const [isClaimed, setIsClaimed] = useState(null);
  const [seatNo, setSeatNo] = useState(null);
  const [noEvent, setNoEvent] = useState(null);
  const [eventData, setEventData] = useState(null);
  const event = Cookies.get("event_id");
  const hexCode = Cookies.get("unique_code");

  // Function to fetch single event data
  const fetchSingleEventData = async () => {
    try {
      const response = await backendActor.getEvent(event);
      if (response) {
        let event_name = response?.eventInfo?.name ?? null;
        setEventData({ name: event_name })
      }
    } catch (error) {
      let errMessage = getValueByKeyFromString(error.toString(), "Message");
      toast.error(errMessage);
      setEventData(null);
      return false;
    }
  }

  // Handler function to claim a seat
  const claimSeatHandler = async () => {
    try {
      const response = await backendActor.validateUserQrCode(event, hexCode);
      toast.success(response);
      setIsClaimed(true);
      window.location.reload();
      return true;

    } catch (error) {
      let errMessage = getValueByKeyFromString(error.toString(), "Reject text");
      toast.error(errMessage);
      setIsClaimed(false);
      return false;
    }
  };

  // Function to check if the seat is already claimed
  const isAlreadyClaimed = async () => {
    try {
      const result = await backendActor.getUserSeat(event);
      if (!result || Object.keys(result).length === 0) {
        setIsClaimed(false);
      } else {
        setSeatNo(result?.seatNo ? Number(result?.seatNo) : null)
        setIsClaimed(true);
      }
    } catch (error) {
      let errMessage = getValueByKeyFromString(error.toString(), "Message");
      toast.error(errMessage);
      setIsClaimed(false);
      return false;
    }
  }

  useEffect(() => {
    if (!event || !hexCode) {
      setNoEvent(true)
    } else {
      setNoEvent(false);
      fetchSingleEventData();
      isAlreadyClaimed();
    }
  }, []);

  return (
    <>
      {noEvent === null ? <Loader /> :
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#f1f1f1]">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-4 sm:p-6 md:p-10 lg:p-10 xl:p-12 2xl:p-14 bg-white rounded-xl shadow-lg flex flex-col gap-4 lg:py-1 md:py-4 sm:py-6">
            {noEvent === true ?
              <div className="flex justify-start text-justify h-full cursor-pointer my-2">
                <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">
                  <span className="font-semibold text-blue-900 mx-2">{t("claimSeat.sometingWentWrong")}</span>{t("claimSeat.noCreds")}</p>
              </div> : <>
                <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4 mb-4">{eventData?.name ?? t('claimSeat.noEvent')} </h2>
                <div className="flex justify-start text-justify mt-[-20px] h-2/4 cursor-pointer my-2">
                  <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 lg:my-6 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">
                    {!isClaimed ? t("claimSeat.helpText") : t("claimSeat.welcomeText", { eventName: eventData?.name ?? t('claimSeat.noEvent') , seatNo: seatNo ?? t('claimSeat.noSeat')})} </p>
                </div>
                <div className="w-full flex justify-center">
                  <button className={`${isClaimed ? `bg-green-700 text-white border-green-700` : `bg-white hover:bg-blue-900`} border-2  text-blue-900 px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl  hover:text-white duration-300 ease-in-out border-blue-900`} onClick={() => { !isClaimed ? claimSeatHandler() : "" }}>
                    {isClaimed ? t('claimSeat.alreadyClaimed') : t('claimSeat.claimSeat')}
                  </button>
                </div>
              </>}
          </div>
        </div>}
      <Toaster />
    </>
  );
};

export default ClaimSeat;
