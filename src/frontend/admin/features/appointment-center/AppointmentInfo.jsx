import ErrorModal from "../../../shared/elements/ErrorModal";

import { IoIosCheckmarkCircle, IoIosEye } from "react-icons/io";
import { FaEdit, FaInfoCircle, FaLink } from "react-icons/fa";
import { MdCancel, MdDeleteForever } from "react-icons/md";

import { PropTypes } from "prop-types";
import { FadeLoader } from "react-spinners";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useContext, useState } from "react";

import { AppInfoContext } from "../../context/app-info-context";
import { AppDelContext } from "../../context/app-del-context";
import AppDelete from "../modals/AppDel";
import AppInfoModal from "../modals/AppInfo";
import { AdminAuthContext } from "../../../shared/context/admin-auth-context";
import { useNavigate } from "react-router-dom";
import { UserLinkContext } from "../../context/user-link-context";
import LinkModal from "../modals/userLink";

export default function AppointmentInfo({ appDat }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [appData, setAppData] = useState(appDat);
  const [curApp, setCurApp] = useState();
  const [info, setInfo] = useState(false);
  const [del, setDel] = useState(false);
  const [link, setLink] = useState(false);
  const [appId, setAppId] = useState();

  const navigate = useNavigate();
  const adminAuth = useContext(AdminAuthContext);

  const infoToggler = (val) => {
    setInfo(val);
  };

  const delToggler = (val) => {
    setDel(val);
  };

  const linkToggler = (val) => {
    setLink(val);
  };
  const handleStatus = async (appID) => {
    const index = appData.findIndex((elem) => elem.id === appID);
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_SERVER_NAME
        }api/admin/appointment/updateStatus/${appID}`,
        "PATCH",
        JSON.stringify({
          status: "ADMIN CONFIRMED",
          alertText: "Payment Due",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminAuth.adminToken,
        }
      );
      appData[index] = responseData.appointment;
    } catch (err) {
      console.log(err);
    }
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
      {!isLoading && appData && (
        <AppInfoContext.Provider
          value={{ show: info, showToggler: infoToggler }}
        >
          <AppDelContext.Provider
            value={{ show: del, showToggler: delToggler }}
          >
            <UserLinkContext.Provider
              value={{ show: link, showToggler: linkToggler }}
            >
              <div className="table-responsive table-card mb-3">
                <table
                  className="table align-middle table-nowrap mb-0"
                  id="customerTable"
                >
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="text-center">
                        Appointment Name
                      </th>
                      <th scope="col" className="text-center">
                        Date
                      </th>
                      <th scope="col" className="text-center">
                        Start Time
                      </th>
                      <th scope="col" className="text-center">
                        End Time
                      </th>
                      <th scope="col" style={{ textAlign: "Center" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    {appData.map((elem) => {
                      return (
                        <tr key={elem.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 ms-2 name text-center">
                                {elem.courseName}
                              </div>
                            </div>
                          </td>
                          <td className="owner text-center">{elem.date}</td>
                          <td className="industry_type text-center">
                            {elem.startTime}
                          </td>
                          <td className="d-flex justify-content-center ">
                            <h5>
                              <span
                                className={`badge mt-2 ${
                                  elem.status === "ADMIN CONFIRMED" ||
                                  elem.status === "PAID AND CONFIRMED" ||
                                  elem.status === "USER CONFIRMED" ||
                                  elem.status === "COMPLETED"
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                                }`}
                              >
                                {elem.status}
                              </span>
                            </h5>
                          </td>
                          <td>
                            {elem.status === "ADMIN CONFIRMED" ||
                            elem.status === "PAID AND CONFIRMED" ||
                            elem.status === "USER CONFIRMED" ||
                            elem.status === "COMPLETED" ||
                            elem.status === "EXPIRED" ? (
                              <ul className="d-flex justify-content-around mt-2">
                                <span className="badge bg-success-subtle action-btn">
                                  <IoIosEye
                                    className="text-success"
                                    style={{ fontSize: "23px" }}
                                    onClick={() => {
                                      infoToggler(true);
                                      setCurApp(elem);
                                    }}
                                  />
                                </span>
                                {elem.status == "PENDING" && (
                                  <span className="badge bg-warning-subtle action-btn">
                                    <FaEdit
                                      className="text-warning"
                                      style={{ fontSize: "23px" }}
                                      onClick={() => {
                                        navigate(
                                          `/admin/edit-appointment/${elem.id}`
                                        );
                                      }}
                                    />
                                  </span>
                                )}
                                <button
                                  className="btn  badge bg-danger-subtle action-btn"
                                  disabled={
                                    elem.status === "USER CONFIRMED" ||
                                    elem.paymentStatus === "PAID"
                                  }
                                >
                                  <MdDeleteForever
                                    className="text-danger"
                                    style={{ fontSize: "23px" }}
                                    onClick={() => {
                                      delToggler(true);
                                      setCurApp(elem);
                                    }}
                                  />
                                </button>
                              </ul>
                            ) : (
                              <ul className="d-flex justify-content-around mt-2">
                                {elem.userId == "guest" ? (
                                  <span
                                    className="badge bg-success-subtle action-btn"
                                    onClick={() => {
                                      linkToggler(true);
                                      setAppId(elem.id);
                                    }}
                                  >
                                    <FaLink
                                      className="text-success"
                                      style={{ fontSize: "23px" }}
                                    />
                                  </span>
                                ) : (
                                  <span
                                    className="badge bg-success-subtle action-btn"
                                    onClick={() => {
                                      handleStatus(elem.id);
                                    }}
                                  >
                                    <IoIosCheckmarkCircle
                                      className="text-success"
                                      style={{ fontSize: "23px" }}
                                    />
                                  </span>
                                )}
                                <span className="badge bg-primary-subtle action-btn">
                                  <FaInfoCircle
                                    className="text-primary"
                                    style={{ fontSize: "23px" }}
                                    onClick={() => {
                                      infoToggler(true);
                                      setCurApp(elem);
                                    }}
                                  />
                                </span>
                                <button className="btn  badge bg-danger-subtle action-btn">
                                  <MdCancel
                                    className="text-danger"
                                    style={{ fontSize: "23px" }}
                                    onClick={() => {
                                      delToggler(true);
                                      setCurApp(elem);
                                    }}
                                  />
                                </button>
                              </ul>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <AppInfoModal curApp={curApp} />
              <AppDelete curApp={curApp} />
              <LinkModal curId={appId}></LinkModal>
            </UserLinkContext.Provider>
          </AppDelContext.Provider>
        </AppInfoContext.Provider>
      )}
    </>
  );
}

AppointmentInfo.propTypes = {
  appDat: PropTypes.array,
};
