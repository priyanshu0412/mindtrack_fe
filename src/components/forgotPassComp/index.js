"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ForgotPassComp = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (isTimerActive && timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [isTimerActive, timer]);

    const handleSendLink = async () => {
        if (!emailOrUsername.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Email or Username is required.",
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailOrUsername }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Reset password link has been sent to your email.",
                });
                setIsTimerActive(true);
                setTimer(60);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "User with this email is not found.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: "Something went wrong. Please try again later.",
            });
        }
    };

    const handleResendLink = async () => {
        if (!emailOrUsername.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Email or Username is required.",
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailOrUsername }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Reset password link has been resent to your email.",
                });
                setIsTimerActive(true);
                setTimer(60);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "User with this email is not found.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: "Something went wrong. Please try again later.",
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primaryColor px-6 py-12">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg transform transition-all hover:scale-[1.02]">
                <div className="text-center w-full flex justify-center flex-col items-center">
                    <h2 className="text-3xl font-extrabold text-thirdColor">Forgot Password?</h2>
                    <p className="mt-2 text-sm text-gray-700">
                        Enter your email or username to receive a reset password link.
                    </p>
                </div>
                <form className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="emailOrUsername" className="block text-sm font-medium text-secondaryColor">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            name="emailOrUsername"
                            id="emailOrUsername"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                            className="mt-2 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:ring-thirdColor focus:border-thirdColor transition-all"
                            placeholder="Enter your email or username"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleSendLink}
                            disabled={isTimerActive}
                            className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-md transition-all focus:ring-2 focus:ring-offset-2 ${isTimerActive
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-thirdColor hover:bg-secondaryColor hover:text-white focus:ring-thirdColor"
                                }`}
                        >
                            {isTimerActive ? "Link Sent" : "Send Reset Link"}
                        </button>
                    </div>
                </form>
                {isTimerActive && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Resend link in <span className="font-bold text-thirdColor">{timer}s</span>
                    </p>
                )}
                {timer === 0 && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleResendLink}
                            className="text-sm font-medium text-thirdColor hover:underline"
                        >
                            Resend Reset Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassComp;