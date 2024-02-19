import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuthClient";
import { convertDateToNanoSeconds } from "../utils/nanoToDateTime";
import { getValueByKeyFromString } from "../utils/getValueByKeyFromString";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from 'react-hot-toast';
import Loader from "../utils/Loader";
import AddEventModal from "../utils/AddEventModal";
import CreateEvent from "../../../assets/createEvent.png";


const AddEvent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { backendActor, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const addEvent = async (val) => {
    setIsLoading(true);
    let argument =
    {
      name: val?.event_name || "",
      description: val?.event_description || "",
      startTime: convertDateToNanoSeconds(val?.start_date_time)?.toString() || "",
      endTime: convertDateToNanoSeconds(val?.end_date_time)?.toString() || "",
    }
    try {
      await backendActor.createEvent(argument).then((res) => {
        toast.success(res)
        setIsLoading(false);
        navigate('/dashboard');
        return true;
      }).catch((error) => {
        setIsLoading(false);
        toast.error(error);
        return false;
      });
    } catch (error) {
      setIsLoading(false);
      let errMessage = getValueByKeyFromString(error.toString(), "invalid data..Error");
      toast.error(errMessage);
      return false;
    }
  };

  // Effect hook to check user authentication
  useEffect(() => {
    if (isAdmin === false) {
      navigate('/');
    }
  }, []);

  return (
    <>
      {/* Container for the main content */}
      {isLoading ? <Loader /> :
        <div className="w-full bg-[#f1f1f1] flex px-4 justify-center lg:items-start  items-center h-screen  pt-8">
          <div className="items-center justify-center w-2/4 lg:flex hidden h-full">
            <img src={CreateEvent} alt={t("singleEvent.altCreateEvent")} className="drop-shadow-xl w-3/4 object-cover" /></div>
          <AddEventModal buttonDisabled={isLoading} crudEventHandler={addEvent} />
        </div>}
      <Toaster />
    </>
  );
};

export default AddEvent;
