import React from "react";

type FeatureItem = {
  status: "correct" | "uncorrect";
  name: string;
};

type PricingPackageData = {
  name: string;
  price: string;
  unit: string;
  features: FeatureItem[];
  button: string;
  isActive: boolean;
};

type Props = {
  data: PricingPackageData;
};

const PricingPackageBox: React.FC<Props> = ({ data }) => {
  const { name, price, unit, features, button, isActive } = data;

  return (
    <div
      className={`w-full max-w-sm rounded-3xl p-8 transition-all shadow-md
        ${isActive ? "bg-blue-900 text-white" : "bg-white text-gray-900 hover:bg-blue-50"}
      `}
    >
      <h2 className="text-lg font-semibold mb-2 text-center">{name}</h2>

      <div className="text-2xl font-bold mb-6 text-center text-orange-500">
        {price}
        <span className="text-sm font-normal text-gray-400 ml-1">/{unit}</span>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((item, index) => (
          <li key={index} className="flex items-center space-x-3">
            <span className="text-lg">
              {item.status === "correct" ? (
                <span className="text-blue-500">✔</span>
              ) : (
                <span className="text-red-500">✖</span>
              )}
            </span>
            <span
              className={`text-sm ${
                item.status === "uncorrect" ? "text-red-400" : ""
              }`}
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2 px-4 rounded-xl font-semibold text-sm border transition
          ${
            isActive
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          }`}
      >
        {button}
      </button>
    </div>
  );
};

export default PricingPackageBox;
