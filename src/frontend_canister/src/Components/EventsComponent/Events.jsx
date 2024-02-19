import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/useAuthClient";
import { getValueByKeyFromString } from "../utils/getValueByKeyFromString";
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from "react-hot-toast";
import noEvents from "../../../assets/calender.png";
import EventCard from "./EventCard";
import Loader from "../utils/Loader";

// Define the Events component
const Events = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { backendActor, isAdmin } = useAuth();
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all events data
  const getAllEventsData = async () => {
    try {
      // Call the getAllEvent method of the backend actor
      const res = await backendActor.getAllEvent();
      // Set the events data and loading state
      setEventsData(res);
      setIsLoading(false);
    } catch (error) {
      // Handle error and display toast message
      let errMessage = getValueByKeyFromString(error.toString(), "Message");
      toast.error(errMessage);
      setEventsData([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is an admin
    if (isAdmin === true) {
      // Fetch all events data
      getAllEventsData();
    } else if (isAdmin === false) {
      // If not an admin, navigate to the login page
      navigate('/');
    }
  }, []);

  return (
    <>
      <div className="flex justify-center w-full bg-[#f1f1f1]" style={{ height: `calc(100vh - 93px)` }}>
        <div className="w-full max-w-6xl px-4 py-4 gap-4 flex flex-col">
          <div className="w-full flex px-4 justify-between mt-4 items-end">
            <div className="w-full">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 underline decoration-2 underline-offset-4">{t("events.totalEvents")} {eventsData.length}</h2>
            </div>
            <div className="w-full flex justify-end">
              <button className="flex px-4 font-bold justify-center items-center p-2 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out"
                onClick={() => navigate('/addevent')}>{t("events.createNewEvent")}</button>
            </div>
          </div>
          {(isLoading === true) ? <Loader /> :
            (eventsData && eventsData.length > 0) ?
              <div className="flex justify-start flex-wrap w-full mt-4 overflow-y-auto">
                {eventsData.map((item, index) => (<EventCard item={item} key={index} />))}
              </div> :
              <div className="flex justify-center items-center w-full h-screen mt-4 overflow-y-auto px-4">
                <div className="flex flex-col items-center gap-2">
                  <img src={noEvents} alt={t("events.noEvents")} />
                  <p className="text-2xl font-bold">{t("events.noEvents")}</p>
                </div>
              </div>}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Events;
