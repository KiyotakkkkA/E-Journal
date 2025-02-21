import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/app.css";
import axios from "./axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import BrowseRoutes from "./BrowseRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const checkAuth = async () => {
    try {
        const response = await axios.get("/api/check-auth");
        return response.data;
    } catch (error) {
        return false;
    }
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

const Layout = ({ auth, children }) => {
    return (
        <AuthProvider auth={auth}>
            <BrowseRoutes>{children}</BrowseRoutes>
        </AuthProvider>
    );
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob([
            "./layouts/*.jsx",
            "./components/*.jsx",
            "./pages/*.jsx",
        ]);
        return pages;
    },
    setup({ el, App, props }) {
        checkAuth().then((data) => {
            const root = createRoot(el);
            root.render(
                <>
                    <QueryClientProvider client={queryClient}>
                        <Layout auth={data}>
                            <App {...props} />
                        </Layout>
                        <ReactQueryDevtools />
                    </QueryClientProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </>
            );
        });
    },
});
