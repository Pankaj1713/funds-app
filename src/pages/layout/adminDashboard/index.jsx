import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { getAPI, postAPI } from "../../../api/services";
import { APIS } from "../../../api/endPoints";
import Button from "../../../components/common/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [paymentReferenceData, setPaymentReferenceData] = useState(null);

  const validationSchema = Yup.object().shape({
    userPaymentReference: Yup.string()
      .required("Required")
      .min(1, "Must be at least 1 characters"),
  });

  const getPaymentReference = async (values) => {
    const params = {
      usr_cde: values.userPaymentReference,
    };
    try {
      const res = await getAPI(APIS.PAYMENT_REFERENCE, params);
      setPaymentReferenceData(res?.data);
      toast.success("Success");
    } catch {
      toast.error("No pending subscription");
    }
  };

  const handleCapturePayment = async () => {
    if (!paymentReferenceData) {
      toast.error("Type valid payment reference number");
      return;
    }
    const params = {
      usr_cde: paymentReferenceData?.pendingSubscriptions[0]?.usr_cde,
      hed_cde: paymentReferenceData?.pendingSubscriptions[0]?.hde_cde,
      val: paymentReferenceData?.pendingSubscriptions[0]?.totl_prc,
    };
    try {
      await postAPI(APIS.CAPTURE_PAYMENT, params);
      toast.success("Capture Successfully");
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div className="bg-black text-white p-6">
      <IoArrowBack size={24} className="cursor-pointer" />

      <Formik
        initialValues={{ userPaymentReference: "" }}
        validationSchema={validationSchema}
        onSubmit={getPaymentReference}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              type="text"
              name="userPaymentReference"
              placeholder="User Payment Reference..."
              className="w-full mt-5 p-3 rounded-lg bg-[#272626] text-white placeholder-white text-[14px] font-normal"
            />
            <ErrorMessage
              name="userPaymentReference"
              component="div"
              className="text-red-500 mt-1"
            />

            <Button
              type="submit"
              title="Get"
              variant="secondary"
              className="mt-5"
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>

      <div className="mt-5">
        <h2 className="text-xl font-bold">User Detail</h2>
        <div>
          <div className="flex w-full">
            <div className="py-3 px-5 flex-2">Code</div>
            <div className="py-3 px-14 flex-1 text-center">Name</div>
          </div>
          {paymentReferenceData?.userGridResults?.map((data, index) => (
            <div className="flex gap-x-1 w-full" key={index}>
              <div className="bg-[#272626] py-3 px-5 flex-2">
                {data?.UserCode}
              </div>
              <div className="bg-[#272626] py-3 px-14 flex-1">
                {data?.usr_nme}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-xl font-bold">Pending Subscription</h2>
        <div>
          <div className="w-full flex justify-between pt-4 text-sm">
            <span className="flex-1 ml-5">Invoice #</span>
            <span className="flex-[2] ml-20">Item</span>
            <span className="flex-1">R</span>
          </div>

          {paymentReferenceData?.pendingSubscriptions?.length > 0 ? (
            paymentReferenceData?.pendingSubscriptions?.map((data, index) => (
              <div className="flex gap-x-1 w-full py-3 text-sm" key={index}>
                <span className="bg-[#272626] py-3 px-5 flex-1 text-center">
                  {data?.hde_cde}
                </span>
                <span className="bg-[#272626] py-3 px-5 flex-[2] text-center">
                  {data?.prc_nme}
                </span>
                <span className="bg-[#272626] py-3 px-5 flex-1 text-center">
                  $ {parseFloat(data?.totl_prc).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <div className="flex gap-x-1 w-full py-3 text-sm">
              <span className="bg-[#272626] py-3 px-5 flex-1 text-center">
                No data
              </span>
              <span className="bg-[#272626] py-3 px-5 flex-[2] text-center">
                No data
              </span>
              <span className="bg-[#272626] py-3 px-5 flex-1 text-center">
                No data
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-7">
        <h2 className="text-xl font-bold pb-3">Capture Payment</h2>
        <input
          type="text"
          value="0.00"
          className="w-full p-3 rounded-lg bg-[#272626] text-white placeholder-gray-500"
          readOnly
        />
        <input
          type="text"
          placeholder="Correct Reference"
          className="w-full p-3 mt-3 rounded-lg bg-[#272626] text-white placeholder-white mb-5"
          readOnly
        />
        <Button title="Capture Payment" onClick={handleCapturePayment} />
      </div>
    </div>
  );
};

export default AdminDashboard;
