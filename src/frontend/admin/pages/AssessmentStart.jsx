import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { FadeLoader } from "react-spinners";

import ErrorModal from "../../shared/elements/ErrorModal";
import { Link } from "react-router-dom";

export default function AssessmentStart() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [appData, setAppData] = useState();
  useEffect(() => {
    const curD = new Date();

    const today = curD.toLocaleDateString("en-CA");

    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          `${
            import.meta.env.VITE_SERVER_NAME
          }api/dashboard/appointment/2024-05-11`
        );
        responseData.appointment?.length > 0 &&
          handleAppData(responseData.appointment);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [sendRequest]);

  const handleAppData = (appDat) => {
    let apps = [];
    for (const app of appDat) {
      if (
        app.status === "PAID AND CONFIRMED" ||
        app.status === "USER CONFIRMED"
      ) {
        apps.push(app);
      }
    }
    setAppData(apps);
  };

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
      {!isLoading && appData?.length > 0 && (
        <div className="row">
          {appData.map((elem) => {
            return (
              <div className="col-lg-4 col-12" key={elem.id}>
                <div className="card">
                  <div className="card-header">
                    <h4 className="text-success">{elem.courseName}</h4>
                    <div className="d-flex justify-content-between mt-2">
                      <h5>
                        <span className="badge bg-danger-subtle text-danger">
                          {elem.startTime}
                        </span>
                      </h5>
                      <h5>
                        <span className="badge bg-warning-subtle text-warning">
                          {elem.endTime}
                        </span>
                      </h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <table className="table table-nowrap">
                      <thead>
                        <tr>
                          <th scope="col">Title</th>
                          <th scope="col">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Customer Name</th>
                          <td>{elem.name}</td>
                        </tr>
                        <tr>
                          <th scope="row">Customer Adress</th>
                          <td>{elem.address}</td>
                        </tr>
                        <tr>
                          <th scope="row">Customer Number</th>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              {elem.number}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Appointment Status</th>
                          <td>{elem.status}</td>
                        </tr>
                      </tbody>
                    </table>
                    {elem.status != "USER CONFIRMED" && (
                      <p>
                        <span className="bg-danger-subtle text-danger">
                          The user has not confirmed appointment, please check
                          their commitment
                        </span>
                      </p>
                    )}
                    <div className="d-flex justify-content-between">
                      <Link to={`/admin/evaluate/${elem.id}/${elem.userId}`}>
                        <button className="btn btn-primary">
                          Start Assessment
                        </button>
                      </Link>
                      <button className="btn btn-danger">Delay 30 Mins</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
