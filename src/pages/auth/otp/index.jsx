import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { IoArrowBack } from "react-icons/io5";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../components/common";
import { useNavigate } from "react-router-dom";
import { APIS } from "../../../api/endPoints";
import { getAPI } from "../../../api/services";
import { use } from "react";

const VALIDATION_SCHEMA = Yup.object().shape({
  otp: Yup.string()
    .length(4, "OTP must be 4 digits")
    .required("OTP is required"),
});

const INITIAL_VALUES = {
  otp: "",
};

const Otp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getOtpData();
  }, []);

  const getOtpData = () => {
    getAPI(APIS.LOGIN).then((res) => {
    });
  };
  const handleOtpLogin = (values) => {
    const payload = {
      usr_cde: values?.email,
      otp: values?.otp,
    };
    getAPI(APIS.LOGIN, payload).then((res) => {

      // dispatch(loginSuccess(res?.data));
      // if (res?.data?.usr_cde === 4) {
      //   navigate("/otp");
      // }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-5 cursor-pointer">
        <IoArrowBack size={24} onClick={() => navigate("/login")} />
      </div>

      {/* Verification Content */}
      <div className="px-5">
        <h1 className="text-2xl font-bold mb-2">Verification</h1>
        <p className="text-sm text-gray-400 mb-6">
          In order to verify your email address, we sent you a 4-digit
          verification code.
        </p>

        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={VALIDATION_SCHEMA}
          onSubmit={handleOtpLogin}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="flex justify-center mb-6">
                <OtpInput
                  value={values.otp}
                  onChange={(otp) => setFieldValue("otp", otp)}
                  numInputs={4}
                  inputType="tel"
                  shouldAutoFocus
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{ width: "50px", height: "50px" }}
                      className={`border border-gray-700 rounded-lg bg-gray-800 text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-orange-500 mx-1`}
                    />
                  )}
                />
              </div>

              {errors.otp && touched.otp && (
                <p className="text-red-500 text-center text-sm mb-4">
                  {errors.otp}
                </p>
              )}

              {/* Verify Button */}
              <div className="mt-6">
                <Button title={"Verify OTP"} type="submit" />
              </div>
            </Form>
          )}
        </Formik>

        {/* Resend OTP */}
        <div className="mt-4 text-center">
          <button className="text-sm text-gray-400 hover:text-gray-200">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
