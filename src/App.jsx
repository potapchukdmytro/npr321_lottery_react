import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LotteryPage from "./pages/LotteryPage";
import { ToastContainer, Flip } from "react-toastify";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <LotteryPage />
            <ToastContainer
                position="top-center"
                autoClose={2000}
                limit={10}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Flip}
            />
        </>
    );
}

export default App;
