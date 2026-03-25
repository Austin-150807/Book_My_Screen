import React, { useState, useRef } from "react";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useAuth } from "../../context/AuthContext";
import { useCountdown } from "../../hooks/useCountdown";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

const StepOTP = ({ onNext }) => {
  // 🔥 ADD setHash here
  const { email, hash, setHash, setUser, setStep, toggleModal } = useAuth();

  const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputsRef = useRef([]);

  const { displayTime, isExpired, reset } = useCountdown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);

    if (index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpArray[index]) {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        setOtpArray(newOtpArray);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pastedData.length === 4) {
      const newOtpArray = pastedData.split("");
      setOtpArray(newOtpArray);
      inputsRef.current[3]?.focus();
    }
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

      toast.success("OTP Verified ✅");

      if (loggedUser.activateUser) {
        setStep(1);
        toggleModal();
      } else {
        onNext();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESEND OTP (FIXED)
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const res = await axiosWrapper.post("/auth/resend-otp", {
        email,
      });

      // ✅ CRITICAL: update hash
      setHash(res.data.hash);

      toast.success("OTP resent successfully 📩");

      reset(); // restart timer
      setOtpArray(new Array(4).fill(""));
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP ❌");
    } finally {
      setResendLoading(false);
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
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-12 h-12 font-bold text-center rounded-md mx-1 border border-gray-200 outline-none"
          />
        ))}

        <button
          type="button"
          onClick={() => setOtpArray(new Array(4).fill(""))}
          className="w-8 h-8 border border-gray-200 text-[#f74565] ml-1 font-bold rounded-md"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* TIMER / RESEND */}
      {isExpired ? (
        <div className="text-center">
          <p className="text-xs text-red-500 mb-2">OTP expired</p>

          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-sm text-[#f74565] underline"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      ) : (
        <p className="text-center text-sm">OTP expires in {displayTime}</p>
      )}

      <button
        onClick={handleVerifyOtp}
        disabled={loading}
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
