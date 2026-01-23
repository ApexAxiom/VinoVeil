import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../components/layout/RootLayout";
import { RequireAdmin, RequireAuth } from "./guards";
import { Home } from "../pages/Home";
import { Shop } from "../pages/Shop";
import { ProductDetail } from "../pages/ProductDetail";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { PaymentPlaceholder } from "../pages/PaymentPlaceholder";
import { Account } from "../pages/Account";
import { AccountOrders } from "../pages/AccountOrders";
import { OrderDetail } from "../pages/OrderDetail";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { ForgotPassword } from "../pages/ForgotPassword";
import { FAQ } from "../pages/FAQ";
import { Contact } from "../pages/Contact";
import { ShippingReturns } from "../pages/ShippingReturns";
import { Privacy } from "../pages/Privacy";
import { Terms } from "../pages/Terms";
import { Admin } from "../pages/Admin";
import { NotFound } from "../pages/NotFound";

/** Application router configuration. */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      {
        path: "checkout",
        element: (
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        )
      },
      { path: "checkout/payment-placeholder", element: <PaymentPlaceholder /> },
      {
        path: "account",
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        )
      },
      {
        path: "account/orders",
        element: (
          <RequireAuth>
            <AccountOrders />
          </RequireAuth>
        )
      },
      {
        path: "orders/:id",
        element: (
          <RequireAuth>
            <OrderDetail />
          </RequireAuth>
        )
      },
      { path: "auth/sign-in", element: <SignIn /> },
      { path: "auth/sign-up", element: <SignUp /> },
      { path: "auth/forgot-password", element: <ForgotPassword /> },
      { path: "faq", element: <FAQ /> },
      { path: "contact", element: <Contact /> },
      { path: "shipping-returns", element: <ShippingReturns /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      {
        path: "admin",
        element: (
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        )
      },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
