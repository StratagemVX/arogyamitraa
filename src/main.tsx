import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.customerUserId = "test_user_001";

createRoot(document.getElementById("root")!).render(<App />);
