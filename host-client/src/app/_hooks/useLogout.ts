'use client'
import Cookies from 'js-cookie';

const useLogout = () => {
    console.log("log out...")
    Cookies.remove('authToken');
    // Clear any additional client-side storage (localStorage, sessionStorage)
    localStorage.clear();
    sessionStorage.clear();
};

export default useLogout;
