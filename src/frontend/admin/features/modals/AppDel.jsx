import PropTypes from "prop-types";
import Input from "../../../home/elements/form-elements/input";

import useForm from "../../../shared/hooks/form-hook";

import { Modal, ModalHeader, ModalBody, ModalFooter, Label } from "reactstrap";
import { useContext } from "react";
import { VALIDATOR_REQUIRE } from "../../../../../public/frontend/validators";
import { FaTrash } from "react-icons/fa";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import { AppDelContext } from "../../context/app-del-context";
import { AdminAuthContext } from "../../../shared/context/admin-auth-context";

export default function AppDelete({ curApp }) {
  const del = useContext(AppDelContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const aID = useParams().aid;
  const adminAuth = useContext(AdminAuthContext);

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const toggle = () => {
    del.showToggler(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formState.inputs.name.value === curApp.courseName) {
      try {
        await sendRequest(
          `${import.meta.env.VITE_SERVER_NAME}api/admin/appointment/delete/${
            curApp.id
          }`,
          "DELETE",
          null,
          {
            Authorization: "Bearer " + adminAuth.adminToken,
          }
        );

        navigate(`/admin/${aID}`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Modal isOpen={del.show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Admin</ModalHeader>
      <ModalBody>
        {curApp && (
          <div className="container">
            <div className="d-flex justify-content-center">
              <form
                className="d-flex justify-content-center flex-column gap-4"
                onSubmit={handleSubmit}
              >
                <Label>
                  Enter the appointment name{" "}
                  <strong>{curApp.courseName}</strong> to delete the appointment
                </Label>
                <div className="form-icon">
                  <Input
                    id="name"
                    type="text"
                    elem="input"
                    className="form-control form-control-icon"
                    placeholder="Appointment name"
                    errorText="Please Enter a Valid Name"
                    validator={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                  />
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-1 col-md-3"></div>
                    <div className="col-10 col-md-6">
                      <button
                        disabled={!formState.isValid}
                        className="btn btn-danger d-flex justify-content-around"
                      >
                        <FaTrash
                          style={{ marginTop: "3px", marginRight: "7px" }}
                        />
                        <span>Delete</span>
                      </button>
                    </div>
                    <div className="col-1 col-md-3"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <button
          className="btn rounded-pill btn-danger waves-effect waves-light"
          onClick={toggle}
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}

AppDelete.propTypes = {
  curApp: PropTypes.object,
};
