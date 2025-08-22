import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Dashboard = () => {
    return (_jsx("div", { className: "min-h-screen bg-blue-500 flex items-center justify-center", children: _jsxs("div", { className: "text-white text-center", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Dashboard Test" }), _jsx("p", { className: "text-xl", children: "If you can see this, React is working!" }), _jsx("div", { className: "mt-8 p-4 bg-white bg-opacity-20 rounded-lg", children: _jsxs("p", { className: "text-sm", children: ["Current time: ", new Date().toLocaleTimeString()] }) })] }) }));
};
export default Dashboard;
