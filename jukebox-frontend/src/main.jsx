import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import SolanaProvider from "./solana-provider";

import * as buffer from "buffer";

window.Buffer = buffer.Buffer;

ReactDOM.createRoot(document.getElementById("root")).render(
    <SolanaProvider>
        <App />
    </SolanaProvider>
);
