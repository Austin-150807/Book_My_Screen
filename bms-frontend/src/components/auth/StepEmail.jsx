import React, { useState } from "react";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useAuth } from "../../context/AuthContext";

const StepEmail = ({ onNext }) => {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { setEmail, setHash } = useAuth();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axiosWrapper.post("/auth/send-otp", {
        email: emailInput,
      });

      setEmail(res.data.email);
      setHash(res.data.hash);

      onNext();
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">Enter your email</h2>
      <p className="text-center text-sm text-gray-500">
        If you don't have an account, we'll create one for you.
      </p>

      <div className="flex items-center border rounded-md border-gray-300 px-4 py-3">
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Enter your email"
          className="flex-grow outline-none text-base"
          required
        />
      </div>

      <button
        onClick={handleSendOtp}
        className="w-full cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        {loading ? "Sending..." : "Continue"}
      </button>
      <p className="text-[#c4c5c5] text-center m-auto text-[12px]">
        By entering your email id, you're agreeing to our
        <a href="" className="text-[#f74565]">
          Terms of Service
        </a>{" "}
        and
        <a href="" className="text-[#f74565]">
          Privacy Policy
        </a>
        . Thanks!
      </p>
    </div>
  );
};

export default StepEmail;
