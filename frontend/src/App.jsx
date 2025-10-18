import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import { useSelector } from "react-redux";
import ResetPassword from "./components/ResetPassword";
import Designer from "./pages/Designer";
import NotFound from "./pages/NotFound";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Router>
      <Switch>
        {/* Publikus oldalak */}
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/login">
          {user ? <Redirect to="/" /> : <Auth />}
        </Route>

        <Route path="/register">
          {user ? <Redirect to="/" /> : <Auth />}
        </Route>

        <Route path="/reset-password">
          <ResetPassword />
        </Route>

       
      {user ? (
  <>
    <Route path="/products/:category">
      <ProductList />
    </Route>
    <Route path="/product/:id">
      <Product />
    </Route>
    <Route path="/cart">
      <Cart />
    </Route>
    <Route path="/success">
      <Success />
    </Route>
    <Route path="/designer">
      <Designer />
    </Route>
    <Route component={NotFound} /> 
  </>
) : (
  <Redirect to="/login" />
)}

        <Route>
          <NotFound />
        </Route>
       
      </Switch>
    </Router>
  );
};

export default App;
