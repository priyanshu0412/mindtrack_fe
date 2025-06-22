"use client";
import Link from "next/link";
import React, { useState } from "react";
import Icon from "../Icon";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";

// ------------------------------------------------

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const [showAlert, setShowAlert] = useState(true);

    if (!showAlert) return null;

    return (
        <>
            {showAlert && (
                <div
                    className="flex items-center p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
                    role="alert"
                >
                    <svg
                        className="shrink-0 w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div className="ms-3 text-sm font-medium">
                        This website is currently <strong>under development</strong>. Some features may not work as expected, and bug fixes are in progress.
                    </div>
                    <button
                        onClick={() => setShowAlert(false)}
                        type="button"
                        className="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700"
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                </div>
            )}


            <nav className="bg-primaryColor text-white border-b-thirdColor border-b">
                <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link className="w-fit" href={"/"}>
                                <h1 className="text-2xl font-bold text-thirdColor" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    MindTrack
                                </h1>
                            </Link>
                        </div>
                        <div className="hidden md:flex md:space-x-6 lg:space-x-8">
                            <Link href="/" className="hover:text-secondaryColor hover:underline font-semibold transition duration-300">
                                Home
                            </Link>
                            <Link href="/todo" className="hover:text-secondaryColor hover:underline font-semibold transition duration-300">
                                Todo
                            </Link>
                            <Link href="/diary" className="hover:text-secondaryColor hover:underline font-semibold transition duration-300">
                                Diary
                            </Link>
                            <Link href="/about-me" className="hover:text-secondaryColor hover:underline font-semibold transition duration-300">
                                About
                            </Link>
                            <Link href="/contact-us" className="hover:text-secondaryColor hover:underline font-semibold transition duration-300">
                                ContactUs
                            </Link>
                        </div>
                        {
                            user?.isVerified ? (
                                <div className="hidden md:flex">
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2 bg-transparent border-2 border-thirdColor text-thirdColor rounded hover:bg-thirdColor hover:text-primaryColor transition duration-300">
                                        Logout
                                    </button>
                                </div>
                            ) : <div className="hidden md:flex space-x-4">
                                <Link href={"/login"} className="w-fit">
                                    <button className="px-5 py-2 bg-transparent border-2 border-thirdColor text-thirdColor rounded hover:bg-thirdColor hover:text-primaryColor transition duration-300">
                                        Login
                                    </button>
                                </Link>
                                <Link href={"/signup"} className="w-fit">
                                    <button className="px-5 py-2 bg-thirdColor text-primaryColor rounded hover:bg-secondaryColor hover:text-white transition duration-300">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        }
                        {/* Mobile Hamburger Icon */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-2xl focus:outline-none text-thirdColor"
                            >
                                <Icon icon={"mdi:menu"} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-primaryColor">
                        <div className="space-y-2 pt-4 pb-8 px-8">
                            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/" className="block hover:text-secondaryColor font-semibold transition duration-300">
                                Home
                            </Link>
                            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/todo" className="block hover:text-secondaryColor font-semibold transition duration-300">
                                Todo
                            </Link>
                            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/diary" className="block hover:text-secondaryColor font-semibold transition duration-300">
                                Diary
                            </Link>
                            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/about" className="block hover:text-secondaryColor font-semibold transition duration-300">
                                About
                            </Link>
                            <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href="/contact-us" className="block hover:text-secondaryColor font-semibold transition duration-300">
                                ContactUs
                            </Link>

                            {/* Auth Buttons */}
                            {user?.isVerified ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 mt-2 border-2 border-thirdColor text-thirdColor rounded hover:bg-thirdColor hover:text-primaryColor transition duration-300"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href={"/login"} className="w-fit">
                                        <button className="block w-full text-left px-4 py-2 mt-2 border-2 border-thirdColor text-thirdColor rounded hover:bg-thirdColor hover:text-primaryColor transition duration-300">
                                            Login
                                        </button>
                                    </Link>
                                    <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href={"/signup"} className="w-fit">
                                        <button className="block w-full mt-2 text-left px-4 py-2 bg-thirdColor text-primaryColor rounded hover:bg-secondaryColor hover:text-white transition duration-300">
                                            Sign Up
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </nav>
        </>
    );
};

export default Navbar;
