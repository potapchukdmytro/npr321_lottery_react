import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config/lotteryConfig";

const LotteryPage = () => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState("0");
    const [manager, setManager] = useState(null);

    useEffect(() => {
        setInterval(fetchBalance, 1000, contract);
    });

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);

            const contractEther = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );

            const mng = await contractEther.manager();
            setManager(mng);
            setContract(contractEther);
            fetchBalance(contractEther);
        } else {
            toast("Встановіть Metamask!");
        }
    };

    const fetchBalance = async (contractEther) => {
        if (!contractEther) {
            return;
        }

        const balanceWEI = await contractEther.getBalance();
        const balanceETH = `${ethers.formatEther(balanceWEI)} ETH`;
        setBalance(balanceETH);
    };

    const joinLottery = async () => {
        if (!contract) {
            return;
        }

        try {
            const transaction = await contract.join({
                value: ethers.parseEther("1"),
            });
            await transaction.wait();
            fetchBalance(contract);
            toast.success("Ви приєдналися до лотереї");
        } catch (error) {
            console.error(error);
            toast("Не вдалося приєднатися до лотереї");
        }
    };

    const rollLottery = async () => {
        if (!contract) return;

        try {
            const transaction = await contract.roll();
            await transaction.wait();
            fetchBalance(contract);
            alert("Жеребкування проведено!");
        } catch (error) {
            console.error(error);
            alert("Помилка під час жеребкування!");
        }
    };

    return (
        <div>
            <h1>Лотерея</h1>
            {account ? (
                <div>
                    <p style={{ color: "lightcyan" }}>
                        Ваш гаманець: {account}
                    </p>
                    <h2 style={{ color: "lightgreen" }}>
                        Сума розіграшу: {balance}
                    </h2>
                    <div>
                        <button
                            onClick={joinLottery}
                            style={{
                                width: "300px",
                                marginBottom: "10px",
                                backgroundColor: "green",
                            }}
                        >
                            Взяти участь (1 ETH)
                        </button>
                    </div>
                    {manager === account && (
                        <div>
                            <button
                                style={{ width: "300px" }}
                                onClick={rollLottery}
                            >
                                Провести жеребкування
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={connectWallet}>Підключити гаманець</button>
            )}
        </div>
    );
};

export default LotteryPage;
