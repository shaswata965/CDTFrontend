import PageTitle from "../features/admin-body/pagetitle";
import ErrorModal from "../../shared/elements/ErrorModal";

import { FadeLoader } from "react-spinners";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { useState, useEffect } from "react";
import AppointmentInfo from "../features/appointment-center/AppointmentInfo";

export default function AppManage() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [appointmentData, setAppointmentData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_SERVER_NAME}api/admin/appointment/all`
        );

        setAppointmentData(responseData.appointment);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [sendRequest]);

  function errorHandler() {
    clearError();
    window.location.reload();
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <FadeLoader
          cssOverride={{
            height: "100%",
            position: "absolute",
            top: "40%",
            left: "50%",
            zIndex: "2000",
          }}
          color="#f43e18"
        />
      )}
      {!isLoading && appointmentData && (
        <>
          {" "}
          {/* <!-- start page title --> */}
          <PageTitle pageName="User Info" />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        <button
                          className="btn btn-soft-danger material-shadow-none"
                          id="remove-actions"
                        >
                          <i className="ri-delete-bin-2-line"></i>
                        </button>
                        <button className="btn btn-danger material-shadow-none">
                          <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                          Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--end col--> */}
            <div className="col-xxl-12">
              <div className="card" id="companyList">
                <div className="card-header">
                  <div className="row g-2">
                    <div className="col-md-3">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Search for user..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <AppointmentInfo appDat={appointmentData} />
                  </div>
                </div>
                {/* <!--end card--> */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
