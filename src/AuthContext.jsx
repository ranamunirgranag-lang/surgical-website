import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// 🌐 LIVE RAILWAY BACKEND
const API_URL = 'https://surgical-backend-production.up.railway.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. LOGIN ACTION
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        setUser(response.data.user);
        return {
          success: true,
          msg: response.data.msg
        };
      }

      return {
        success: false,
        msg: response.data.msg || 'Login failed'
      };

    } catch (error) {
      const errorMsg =
        error.response?.data?.msg ||
        'Network node login failure!';

      return {
        success: false,
        msg: errorMsg
      };
    }
  };

  // 2. SIGNUP ACTION
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        userData
      );

      return {
        success: true,
        msg: response.data.msg
      };

    } catch (error) {
      const errorMsg =
        error.response?.data?.msg ||
        'Database data submission timeout error!';

      return {
        success: false,
        msg: errorMsg
      };
    }
  };

  // 3. ADMIN READ USERS
  const getPendingDoctors = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/auth/admin/users`
      );

      return response.data.users;

    } catch (error) {
      return [];
    }
  };

  // 4. ADMIN APPROVE
  const approveDoctor = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/admin/approve/${id}`
      );

      return response.data.success;

    } catch (error) {
      return false;
    }
  };

  // 5. ADMIN REPLY
  const sendAdminReply = async (id, replyMessage, oldMessage) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/admin/reply/${id}`,
        {
          replyMessage,
          oldMessage
        }
      );

      return response.data.success;

    } catch (error) {
      return false;
    }
  };

  // 6. LOGOUT
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        getPendingDoctors,
        approveDoctor,
        sendAdminReply
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);