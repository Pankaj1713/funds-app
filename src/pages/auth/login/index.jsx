import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { loginSuccess } from "../../../store/auth/actions";
import { CiMail } from "react-icons/ci";
import Button from "../../../components/common/button";
import { getAPI, postAPI } from "../../../api/services";
import { APIS } from "../../../api/endPoints";
import OtpInput from "react-otp-input";
import { IoArrowBack, IoLockClosedOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import store from "../../../store";
import { STRINGS } from "../../../components/strings";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Validation Schema for Login Form
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Initial values for the login form
const INITIAL_VALUES = {
  email: "",
  password: "",
};

// OTP Form Validation Schema
const VALIDATION_SCHEMA = Yup.object().shape({
  otp: Yup.string()
    .length(4, "OTP must be 4 digits")
    .required("OTP is required"),
});
// Initial values for the OTP form
const INITIAL_OTP_VALUES = { otp: "" };

const Login = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [currentTab, setCurrentTab] = useState("form");
  const [showPassword, setShowPassword] = useState(false);
  const [usrCde, setUsrCde] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      navigate("/plans");
    }
  }, [accessToken, navigate]);

  const handleLogin = async (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    setLoading(true);
    try {
      const payload = {
        email: credentials?.email,
        password: credentials?.password,
      };
      const res = await postAPI(APIS.LOGIN, payload);
      if (res) {
        setCurrentTab("otp");
        setUsrCde(res?.data?.usr_cde);
      }
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (!email || !password) {
      toast.error("Email and password are required to resend OTP.");
      return;
    }
    const payload = {
      email: email,
      password: password,
    };
    postAPI(APIS.LOGIN, payload)
      .then((res) => {
        if (res) {
          setCurrentTab("otp");
          setUsrCde(res?.data?.usr_cde);
          toast.success("OTP resent successfully.");
        } else {
          toast.error("Unable to resend OTP. Please try again.");
        }
      })
      .catch((err) => {
        toast.error("Failed to resend OTP. Please try again later.");
      });
  };

  const handleOtpLogin = (values) => {
    const payload = `/${usrCde}/${values?.otp}`;
    const apiUrl = `${APIS.OTP}${payload}`;

    getAPI(apiUrl).then((res) => {
      const userData = res?.data;
      store.dispatch(loginSuccess(userData));
      toast.success("Login success!");

      if (userData?.usr_cde === 1) {
        navigate("/plans");
      } else if (userData?.usr_cde === 4) {
        navigate("/admin-dashboard");
      }
    });
  };

  return (
    <div className="p-5">
      {currentTab === "otp" && (
        <div className="">
          <div className="py-5 cursor-pointer">
            <IoArrowBack size={24} onClick={() => setCurrentTab("form")} />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Verification</h1>
            <p className="text-sm text-gray-400 mb-6">
              In order to verify your email address, we sent you a 4-digit
              verification code.
            </p>

            <Formik
              initialValues={INITIAL_OTP_VALUES}
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
                          style={{ width: "80px", height: "72px" }}
                          className="border border-[#272626] rounded-lg bg-[#272626] text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-orange-500 mx-2"
                        />
                      )}
                    />
                  </div>

                  {errors.otp && touched.otp && (
                    <p className="text-red-500 text-center text-sm mb-4">
                      {errors.otp}
                    </p>
                  )}

                  <div className="mt-6">
                    <Button title={"Verify OTP"} type="submit" />
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-5 text-center">
              <button
                className="text-white hover:text-gray-200"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {currentTab === "form" && (
        <>
          <div className="flex flex-col gap-y-5">
            <h1 className="text-[24px] font-bold leading-[30px]">
              {STRINGS.LOGIN_TITLE}
            </h1>
            <div className="flex flex-col gap-y-5 mb-5">
              <p>{STRINGS.LOGIN_SUBTITLE}</p>
              <p>{STRINGS.LOGIN_SUBTITLE2}</p>
            </div>
          </div>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ touched, errors, setFieldValue }) => (
              <Form>
                <div className="mb-4 relative">
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email Address"
                    className={`flex mt-1 p-2 w-full bg-[#272626] text-white placeholder-[#787777] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } pl-10`}
                  />
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500">
                    <CiMail color="#787777" />
                  </div>
                </div>
                {touched.email && errors.email && (
                  <div className="text-sm text-red-500">{errors.email}</div>
                )}

                <div className="mb-4">
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Password"
                      className={`flex mt-1 p-2 w-full bg-[#272626] text-white placeholder-[ 787777] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        touched.password && errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } pl-10`}
                    />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500">
                      <IoLockClosedOutline color="#787777" />
                    </div>
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEye color="#626262" />
                      ) : (
                        <FiEyeOff color="#626262" />
                      )}
                    </div>
                  </div>
                </div>
                {touched.password && errors.password && (
                  <div className="text-sm text-red-500">{errors.password}</div>
                )}

                <Button
                  title={loading ? "Signing In..." : "Sign In"}
                  disabled={loading}
                  className="mt-6"
                />
              </Form>
            )}
          </Formik>
          <div className="mt-5 font-medium">
            *Use your app should you need to reset password.
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
