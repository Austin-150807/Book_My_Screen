import { createContext, useContext, useEffect, useState } from "react";
import { axiosWrapper } from "../apis/axiosWrapper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [email, setEmail] = useState("");
  const [hash, setHash] = useState("");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // 🔥 Persist login on refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosWrapper.get("/users/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        step,
        setStep,
        showModal,
        toggleModal,
        email,
        setEmail,
        hash,
        setHash,
        user,
        setUser,
        loadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
