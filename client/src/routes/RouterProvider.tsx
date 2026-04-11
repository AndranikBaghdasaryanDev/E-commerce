import { RouterProvider } from "react-router-dom";
import router from "./routes";
export const ProviderRouter = () => {
    return <RouterProvider router={router} />
}