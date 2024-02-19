import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// EventCard component
const EventCard = ({ item }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Extracting necessary data from the item prop
    let eventId = item[0];
    let eventInfo = item[1]?.eventInfo;

    // Initializing status variable
    let status = null;

    // Getting current time in milliseconds
    let nowTime = moment().valueOf() * 1e6;

    // Parsing start and end time from eventInfo
    let startTime = parseInt(eventInfo?.startTime);
    let endTime = parseInt(eventInfo?.endTime);

    // Determining the status based on current time and event times
    status = nowTime < startTime ? t("eventCard.upcoming") : nowTime > startTime && nowTime < endTime ? t("eventCard.ongoing") : nowTime > startTime && nowTime > endTime ? t("eventCard.past") : t("eventCard.noStatus");

    return (
        <div className="lg:w-2/6 sm:w-3/6 w-full p-4">
            <div className="w-full h-96 px-8 bg-white rounded-xl shadow-lg flex flex-col justify-between">
                <div className='flex justify-end mt-5  sm:mt-[5%] mr-[-5%]'>
                    {/* Displaying status badge based on the status */}
                    <div className={`shadow-xl px-2 text-white rounded-full uppercase border-[2px] ${status === t("eventCard.upcoming") ? `border-yellow-700 bg-yellow-700` : status === t("eventCard.ongoing") ? `border-green-700 bg-green-700` : status === t("eventCard.past") ? `border-red-700 bg-red-700` : 'border-black bg-black'}`}>
                        <p className='text-xs font-semibold'>{status ?? t("eventCard.noStatus")}</p>
                    </div>
                </div>
                <div className='flex justify-center w-full'>
                    {/* Displaying event name */}
                    <p className="text-center w-3/5 truncate text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">
                        {eventInfo?.name}
                    </p>
                </div>
                <div className="overflow-y-auto overflow-x-hidden my-4 flex justify-start items-start h-full flex-wrap w-full">
                    {/* Displaying event description */}
                    <p className="text-md sm:text-lg md:text-lg text-gray-600 lg:my-3 md:my-2 sm:my-1 max-h-32 px-2">
                        {eventInfo?.description}
                    </p>
                </div>
                <div className="flex gap-2 justify-between py-4">
                    {/* Button to navigate to view event page */}
                    <button className="flex w-full justify-center items-center p-2 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out"
                        onClick={() => navigate(`/viewevent?event_id=${eventId}`)}>
                        <span className="text-md lg:text-lg md:text-lg font-semibold">
                            {t("eventCard.viewEvent")}
                        </span>
                    </button>
                    {/* Button to navigate to QR session page (only shown for ongoing events) */}
                    {status === t("eventCard.ongoing") ?
                        <button className="flex w-full justify-center items-center p-2 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out"
                            onClick={() => navigate(`/qrsession?event_id=${eventId}`)}>
                            <span className="text-md lg:text-lg md:text-lg font-semibold">
                                {t("eventCard.showQr")}
                            </span>
                        </button> : ''}
                </div>
            </div>
        </div>
    )
}

export default EventCard;