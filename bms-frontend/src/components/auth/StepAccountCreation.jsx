import { useState } from "react";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useAuth } from "../../context/AuthContext";

const StepAccountCreation = () => {
  const { user, setUser, toggleModal, setStep } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivateAccount = async (e) => {
    e.preventDefault();

    if (!name || !phone) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axiosWrapper.put(`/users/activate/${user._id}`, {
        name,
        phone,
        activateUser: true,
      });

      setUser(res.data);
      setStep(1);
      toggleModal(); // close modal
    } catch (err) {
      setError("Activation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter your account details
      </h2>

      <div className="flex items-center border border-gray-300 rounded-md px-4 py-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="flex-grow outline-none text-base"
        />
      </div>

      <div className="flex items-center border border-gray-300 rounded-md px-4 py-3">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="flex-grow outline-none text-base"
        />
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <button
        onClick={handleActivateAccount}
        className="w-full text-white bg-black py-2 rounded-md"
      >
        {loading ? "Activating..." : "Create Account"}
      </button>
    </div>
  );
};

export default StepAccountCreation;
