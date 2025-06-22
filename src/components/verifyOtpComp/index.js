"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import Swal from "sweetalert2";

const VerifyOtpComp = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const getEmailFromToken = () => {
        const token = localStorage.getItem("authToken");

        if (token) {
            try {
                const decoded = jwt.decode(token); // or use jwtDecode(token) if using 'jwt-decode'
                return decoded?.email || "";
            } catch (err) {
                console.error("Error decoding token:", err);
                return "";
            }
        }

        console.error("authToken not found in localStorage.");
        return "";
    };
    const email = getEmailFromToken();

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setResendDisabled(false);
        }
    }, [timer]);

    const handleVerifyOTP = async () => {
        if (otp.join("").length !== 6 || !/^\d{6}$/.test(otp.join(""))) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setError("");
        const token = localStorage.getItem("authToken");
        if (!token || user.email !== email) {
            Swal.fire({
                icon: "error",
                title: "Something is wrong!",
                text: "Kindly log in again.",
            });
            setError("No token found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BE_URL}/auth/verify-otp`,
                { email: user.email, otp: otp.join("") },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                dispatch(setAuthUser({ ...user, isVerified: true }));
                window.location.href = "/todo";
            }
        } catch (err) {
            if (err.response?.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid OTP",
                    text: "The OTP you entered is incorrect. Try again or request a new OTP.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong",
                    text: "Please try again later.",
                });
            }
            setError(err.response?.data?.message || "Failed to verify OTP.");
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BE_URL}/auth/resend-otp`, {
                email: user?.email,
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Resent",
                    text: "A new OTP has been sent to your email.",
                });
                setTimer(60);
                setResendDisabled(true);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Resend Failed",
                text: error.response?.data?.message || "Failed to resend OTP. Try again later.",
            });
        }
    };


    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) {
            otp[index] = value;
            setOtp([...otp]);
            if (index < 5) inputRefs.current[index + 1].focus();
        } else {
            otp[index] = "";
            setOtp([...otp]);
        }
    };

    const handlePasteOtp = (e) => {
        const pastedValue = e.clipboardData.getData("text");
        if (/^\d{6}$/.test(pastedValue)) {
            setOtp(pastedValue.split(""));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primaryColor px-6 py-12">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg transform transition-all hover:scale-[1.02]">
                <div className="text-center w-full flex justify-center flex-col items-center">
                    <h2 className="text-3xl font-extrabold text-thirdColor">Verify OTP</h2>
                    <p className="mt-2 text-sm text-secondaryColor">
                        Enter the 6-digit OTP sent to your email.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondaryColor">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={user?.email}
                            disabled
                            className="mt-2 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:ring-thirdColor focus:border-thirdColor transition-all"
                        />
                    </div>
                    <div className="mt-4 flex justify-between space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e, index)}
                                onPaste={handlePasteOtp}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="text-black w-12 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 bg-gray-50 focus:ring-thirdColor focus:border-thirdColor"
                            />
                        ))}
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div>
                        <button
                            type="button"
                            onClick={handleVerifyOTP}
                            className="flex w-full justify-center rounded-md bg-thirdColor px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-secondaryColor transition-all focus:ring-2 focus:ring-thirdColor focus:ring-offset-2"
                        >
                            Verify OTP
                        </button>
                    </div>
                    <div className="mt-4 text-center text-sm text-secondaryColor">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendDisabled}
                            className={`font-medium ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-thirdColor hover:underline"}`}
                        >
                            Resend OTP
                        </button>
                        {resendDisabled && <p className="text-sm text-secondaryColor mt-2">Resend available in {timer} seconds</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpComp;
