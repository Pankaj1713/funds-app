import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import Button from "../../components/common/button";
import { APIS } from "../../api/endPoints";
import { deleteAPI, getAPI, postAPI } from "../../api/services";
import { toast } from "react-toastify";
import { customStyles } from "../../utils";
import Modal from "../../components/common/modal";

const Plans = () => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [pendingSubData, setPendingSubData] = useState();
  const [pendingActiveSubData, setPendingActiveSubData] = useState();
  const [profileData, setProfileData] = useState();
  const [pricingPlans, setPricingPlans] = useState([]);
  const [selectedPricePlan, setSelectedPricePlan] = useState(null);
  const [modalActionType, setModalActionType] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isImmediate, setIsImmediate] = useState(true);
  const [isSecondUpgradeModalOpen, setIsSecondUpgradeModalOpen] =
    useState(false);
  const [isSecondDowngradeModalOpen, setIsSecondDowngradeModalOpen] =
    useState(false);

  useEffect(() => {
    fetchSubscriptionPlans();
    fetchPendingSubscription();
    fetchProfile();
    fetchPlans();
  }, [subscriptionPlan]);

  useEffect(() => {
    fetchPendingActiveSubscription();
    fetchPendingSubscription();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const res = await getAPI(APIS.SUBSCRIPTIONS);
      setSubscriptions(res?.data);
    } catch (error) {
      console.error("Failed to fetch subscription plans", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await getAPI(APIS.PROFILE);
      setProfileData(res?.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const fetchPlans = async () => {
    let params = { sub_cde: "" };
    if (subscriptionPlan?.sub_cde) {
      params.sub_cde = subscriptionPlan?.sub_cde;
    }
    try {
      const res = await getAPI(APIS.PRICING, params);
      setPricingPlans(res);
      setSelectedPricePlan(null);
    } catch (error) {
      console.error("Failed to fetch pricing plans", error);
    }
  };

  const fetchPendingSubscription = async () => {
    try {
      const res = await getAPI(APIS.PENDING_SUBSCRIPTION);
      if (res?.data?.length > 0) {
        setPendingSubData(res.data[0]);
      } else {
        console.error("No pending subscription");
      }
    } catch (error) {
      console.error("Failed to fetch pending subscription", error);
    }
  };

  const fetchPendingActiveSubscription = async () => {
    try {
      const res = await getAPI(APIS.PENDING_ACTIVE_SUBSCRIPTION);
      if (res?.data?.length > 0) {
        setPendingActiveSubData(res?.data);
      } else {
        console.error("No pending active subscription");
      }
    } catch (error) {
      console.error("Failed to fetch pending active subscription", error);
    }
  };

  const subscriptionOptions = subscriptions.map((plan) => ({
    value: plan.sub_cde,
    label: plan.sub_nme,
    sub_lvl: plan.sub_lvl,
    ...plan,
  }));

  const planPriceOptions = pricingPlans?.data?.map((plan) => ({
    value: plan.itm_prc_cde,
    label: `${plan.itm_prc_nme} - ${plan.dur_mth} months - $${plan.prc}`,
    ...plan,
  }));

  const handlePlanSelect = () => {
    if (!subscriptionPlan) {
      toast.error("Please select a subscription plan.");
      return;
    }

    if (!selectedPricePlan || selectedPricePlan.length === 0) {
      toast.error("Please select a price plan.");
      return;
    }

    const currentSubLvl = profileData?.subscription_details
      ? parseInt(profileData?.subscription_details?.sub_lvl, 10)
      : 0;
    const selectedSubLvl = parseInt(subscriptionPlan?.sub_lvl, 10);

    // Check if downgrading is required
    if (currentSubLvl > selectedSubLvl) {
      // Show downgrade modal
      setModalActionType("downgrade");
      setIsModalOpen(true);
    } else if (!profileData?.subscription_details) {
      setModalActionType("subscribe");
      setIsModalOpen(true);
    } else if (selectedSubLvl > currentSubLvl) {
      setModalActionType("upgrade");
      setIsUpgradeModalOpen(true);
    }
  };

  const handleResendInvoice = async () => {
    if (!pendingSubData) {
      toast.error("No pending subscription to resend invoice.");
      return;
    }
    setModalActionType("resend_invoice");
    setIsModalOpen(true);
  };

  const handleCancelPendingSubscription = async () => {
    if (!pendingSubData) {
      toast.error("No pending subscription to cancel.");
      return;
    }
    setModalActionType("cancel_subscription");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpgradeModalOpen(false);
    setIsSecondUpgradeModalOpen(false);
    setIsSecondDowngradeModalOpen(false);
  };

  const confirmSubscription = async () => {
    const payload = {
      sub_cde: subscriptionPlan.value,
      itm_prc_cde: selectedPricePlan.value,
      ind: isImmediate,
    };
    try {
      await postAPI(APIS.SUBSCRIBE, payload);
      fetchPendingSubscription();
      toast.success("Subscription successful!");
      closeModal();
    } catch (err) {
      toast.error("Subscription failed, please try again.");
      console.error(err);
    }
  };

  const resendInvoice = async () => {
    const params = { hed_cde: pendingSubData.hed_cde };
    try {
      await getAPI(APIS.RESEND_INVOICE, params);
      toast.success("Invoice resent successfully.");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to resend invoice.");
      console.error(err);
    }
  };

  const cancelPendingSubscription = async () => {
    const payload = { hed_cde: pendingSubData.hed_cde };
    try {
      await deleteAPI(APIS.CANCEL_PENDING_SUBSCRIPTION, payload);
      toast.success("Subscription cancelled successfully.");
      setPendingSubData(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to cancel subscription.");
      console.error(err);
    }
  };

  const handleUpgradeContinue = () => {
    setIsUpgradeModalOpen(false);
    setIsSecondUpgradeModalOpen(true);
  };

  const handleAfterCurrentSub = () => {
    if (modalActionType === "downgrade") {
      setIsSecondDowngradeModalOpen(true);
    } else {
      const payload = {
        sub_cde: subscriptionPlan.value,
        itm_prc_cde: selectedPricePlan.value,
        ind: false,
      };
      postAPI(APIS.SUBSCRIBE, payload)
        .then(() => {
          fetchPendingSubscription();
          closeModal();
        })
        .catch((err) => {
          toast.error("Subscription failed, please try again.");
          console.error(err);
        });
    }
  };

  return (
    <div className="p-5">
      {/* Current Subscription Plan */}
      <div className="border border-borderColor rounded-2xl p-2 flex flex-col items-center">
        <div className="text-[#808080] text-sm font-normal">
          Current Subscription Plan
        </div>
        <div className="text-[28px] text-borderColor uppercase font-semibold">
          {profileData?.subscription_details === null
            ? "No subscription plan"
            : profileData?.subscription_details?.itm_nme}
        </div>
        <div className="text-sm font-semibold">
          {profileData?.subscription_details === null
            ? ""
            : `(ends on:-${profileData?.subscription_details?.eff_dte_too}`}
        </div>
      </div>

      {/* Subscription Selection */}
      <div className="pt-5">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-bold">Subscribe</div>
          <Link
            to="/subscription-plans"
            className="border-b text-sm font-medium text-[#808080]"
          >
            View subscription plans
          </Link>
        </div>

        <div className="pt-5">
          <Select
            options={subscriptionOptions}
            placeholder="Select Subscription Plan"
            value={subscriptionPlan}
            onChange={setSubscriptionPlan}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>

        <div className="pt-2">
          <Select
            options={planPriceOptions}
            placeholder="Select Price Plan"
            value={selectedPricePlan}
            onChange={setSelectedPricePlan}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>

        <div className="pt-5">
          <Button title="Subscribe" onClick={handlePlanSelect} />
        </div>
      </div>
      {/* Pending Subscription */}
      <div className="pt-7">
        <div className="text-[20px] font-bold">
          Subscription Pending Payment
        </div>
        <div
          className="bg-[#1A1919] border border-[#626262] p-5 mt-2 rounded-lg text-base text-[#8C8C8C] font-medium
"
        >
          {pendingSubData ? (
            <div className="font-medium">
              <div>Subscription Name : {pendingSubData.sub_nme}</div>
              <div>Subscription Price Name : {pendingSubData.prc_nme}</div>
              <div>Invoice : {pendingSubData.hed_cde}</div>
              <div>
                Total Price : $ {parseFloat(pendingSubData.totl_prc).toFixed(2)}
              </div>
            </div>
          ) : (
            <div>No Pending Subscription</div>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant={"secondary"}
            title="Resend Invoice"
            onClick={handleResendInvoice}
          />
          <Button
            variant={"secondary"}
            title=" Cancel Pending Subscription"
            onClick={handleCancelPendingSubscription}
          />
        </div>
      </div>
      <div className="mt-5">
        <div className="text-[20px] font-bold">
          Subscription To Be Activated
        </div>
        <div
          className="bg-[#1A1919] border border-[#626262] p-5 mt-2 rounded-lg text-base text-[#8C8C8C] font-medium
"
        >
          {pendingActiveSubData && pendingActiveSubData?.length > 0 ? (
            <div>
              {pendingActiveSubData?.map((item, index) => (
                <div key={index}>
                  <div>Subscription : {item.itm_nme}</div>
                  <div>Effective From : {item.eff_dte_fro}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>No Pending Active Subscription</div>
          )}
        </div>
      </div>
      {/* Modal for Confirmation */}
      <Modal
        isModalOpen={isModalOpen}
        label={modalActionType === "subscribe" ? subscriptionPlan?.label : ""}
        title={
          modalActionType === "subscribe"
            ? "Subscribe to this plan?"
            : modalActionType === "resend_invoice"
            ? "Resend the invoice?"
            : modalActionType === "cancel_subscription"
            ? "Cancel the pending subscription?"
            : "Upgrade Subscription"
        }
        onClick={
          modalActionType === "subscribe"
            ? confirmSubscription
            : modalActionType === "resend_invoice"
            ? resendInvoice
            : modalActionType === "cancel_subscription"
            ? cancelPendingSubscription
            : handleUpgradeContinue
        }
        closeModal={closeModal}
      />

      {/* First Upgrade Modal */}
      <Modal
        isModalOpen={isUpgradeModalOpen}
        // title={subscriptionPlan?.sub_nme}
        title={`You are about to upgrade your subscription from ${profileData?.subscription_details?.itm_nme} to ${subscriptionPlan?.sub_nme}`}
        label="Upgrade Subscription"
        onClick={handleUpgradeContinue}
        closeModal={closeModal}
        firstBtnTitle="Continue"
        secondBtnTitle="Cancel"
        className="flex-col space-y-2"
      />

      {/* Second Modal for Upgrade Timing */}
      <Modal
        isModalOpen={isSecondUpgradeModalOpen}
        closeModal={handleAfterCurrentSub}
        firstBtnTitle="Immediately"
        secondBtnTitle="After Current Subscription"
        className="flex-col space-y-2"
        onClick={confirmSubscription}
      />

      {/*Downgrade Modal Update*/}
      <Modal
        isModalOpen={isModalOpen && modalActionType === "downgrade"}
        title={`You are about to downgrade your subscription from ${profileData?.subscription_details?.itm_nme} to ${subscriptionPlan?.sub_nme}`}
        label="Downgrade Subscription"
        onClick={handleAfterCurrentSub}
        closeModal={closeModal}
        firstBtnTitle="Continue"
        secondBtnTitle="Cancel"
        className="flex-col space-y-2"
      />

      {/* Second Modal for Downgrade Modal Update */}
      <Modal
        isModalOpen={isSecondDowngradeModalOpen}
        title={`The downgrade will only become effective once current subscription ends ${profileData?.subscription_details?.eff_dte_too}`}
        label="Confirm Downgrade"
        onClick={confirmSubscription}
        closeModal={closeModal}
        firstBtnTitle="Continue"
        secondBtnTitle="Cancel"
        className="flex-col space-y-2"
      />
    </div>
  );
};

export default Plans;
