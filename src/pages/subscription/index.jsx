import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button";
import Modal from "../../components/common/modal";
import { getAPI } from "../../api/services";
import { APIS } from "../../api/endPoints";

const PLANS = [
  {
    id: 1,
    name: "Basic Plan",
    details: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Morbi mauris magna, lobortis ac erat id, ultrices fringilla velit.",
      "In hac habitasse platea dictumst.",
      "Quisque at commodo diam.",
      "Ut lectus lectus, porta nec elit a, aliquet euismod leo.",
    ],
  },
  {
    id: 2,
    name: "Premium Plan",
    details: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed malesuada, felis nec sollicitudin efficitur, orci felis malesuada enim.",
      "Aenean volutpat, mauris nec bibendum pharetra, urna ipsum aliquam augue.",
      "Duis consequat, ante ut aliquet luctus, mauris purus fringilla purus.",
    ],
  },
  {
    id: 3,
    name: "Enterprise Plan",
    details: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Fusce et odio ante. Phasellus vel lectus eros.",
      "Aenean fringilla erat et dolor tincidunt tempor.",
      "Nulla facilisi. Suspendisse potenti. Integer tincidunt libero in urna malesuada.",
    ],
  },
  {
    id: 4,
    name: "Ultimate Plan",
    details: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Duis consectetur, velit non fermentum lacinia, arcu libero scelerisque velit.",
      "Donec nec sapien ac dui fermentum vehicula.",
      "Vivamus id sollicitudin risus, eget cursus magna. Nulla facilisi.",
    ],
  },
];

const Subscription = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [individualData, setIndividualData] = useState([]);
  const [brokerData, setBrokerlData] = useState([]);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const [individualRes, brokerRes] = await Promise.all([
        getAPI(`${APIS.SUBSCRIPTIONS}?type=Individual`),
        getAPI(`${APIS.SUBSCRIPTIONS}?type=Broker`),
      ]);

      setIndividualData(individualRes);
      setBrokerlData(brokerRes);
    } catch (error) {
      console.error("Failed to fetch subscription plans", error);
    }
  };

  const activatePlan = async () => {
    try {
      const params = { type: planName };
      await getAPI(APIS.ACTIVATE, params);
      toast.success("Plan activated successfully.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to activate plan", error);
    }
  };

  const openModal = (type) => {
    setPlanName(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-5">
      <div className="cursor-pointer mb-2">
        <IoArrowBack size={24} onClick={() => navigate("/plans")} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Individual Plans</div>
          <Button
            variant={"secondary"}
            title="Activate Trial"
            className="text-sm px-6"
            onClick={() => openModal("individual")}
          />{" "}
        </div>

        <div className="flex overflow-x-auto py-4 space-x-4 scrollbar-hide">
          {individualData?.description?.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-[#1A1919] border border-[#626262] text-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex-shrink-0 w-[80%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <ul className="flex flex-col gap-y-2 text-xs text-[#BABABA] font-medium">
                <li
                  key={index}
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: plan?.msg_des_lon }}
                />
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Broker Plans</div>
          <Button
            variant={"secondary"}
            title="Activate Trial"
            className="text-sm px-6"
            onClick={() => openModal("broker")}
          />{" "}
        </div>

        <div className="flex overflow-x-auto py-4 space-x-4 scrollbar-hide">
          {brokerData?.description?.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-[#1A1919] border border-[#626262] text-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex-shrink-0 w-[80%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <ul className="flex flex-col gap-y-2 text-xs text-[#BABABA] font-medium">
                <li
                  key={index}
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: plan?.msg_des_lon }}
                />
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        label={`You are subscribing to the ${planName} Trial Plan`}
        title="Continue?"
        onClick={activatePlan}
        closeModal={closeModal}
        className="flex-col space-y-2"
      />
    </div>
  );
};

export default Subscription;
