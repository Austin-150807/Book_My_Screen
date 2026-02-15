import React, { useState } from "react";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useAuth } from "../../context/AuthContext";
import { useCountdown } from "../../hooks/useCountdown";
import { IoClose } from "react-icons/io5";

const StepOTP = ({ onNext }) => {
  const { email, hash, setUser, setStep, toggleModal } = useAuth();

  const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);

  const { displayTime, isExpired } = useCountdown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otp = otpArray.join("");

    try {
      setLoading(true);

      const res = await axiosWrapper.post("/auth/verify-otp", {
        email,
        otp,
        hash,
      });

      const loggedUser = res.data.user;

      setUser(loggedUser);

      // 🔥 If user already activated → skip account creation
      if (loggedUser.activateUser) {
        setStep(1);
        toggleModal();
      } else {
        onNext(); // go to StepAccountCreation
      }
    } catch (err) {
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter the code we just mailed you
      </h2>
      <p className="text-center text-sm text-gray-500">
        If you don't have an account, we'll create one for you.
      </p>

      <div className="flex items-center justify-center">
        {otpArray.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            className="w-12 h-12 font-bold text-center rounded-md mx-1 border border-gray-200 outline-none"
          />
        ))}
        <button
          type="button"
          className="w-8 h-8 border border-gray-200 text-[#f74565] ml-1 font-bold rounded-md"
        >
          <IoClose size={24} />
        </button>
      </div>

      {isExpired ? (
        <p className="text-center text-xs text-indigo-500">OTP expired.</p>
      ) : (
        <p className="text-center text-sm">OTP expires in {displayTime}</p>
      )}

      <button
        onClick={handleVerifyOtp}
        className="w-full text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        {loading ? "Verifying..." : "Continue"}
      </button>
      <p className="text-[#c4c5c5] text-center m-auto text-[12px]">
        By entering your OTP, you're agreeing to our{" "}
        <a href="" className="text-[#f74565]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="" className="text-[#f74565]">
          Privacy Policy
        </a>
        . Thanks!
      </p>
    </div>
  );
};

export default StepOTP;
