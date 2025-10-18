import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import { useSelector } from "react-redux";
import ResetPassword from "./components/ResetPassword";
import Designer from "./pages/Designer";
import Notfound from "./pages/Notfound";

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
        <Route exact path="/" component={Home} />
        <Route path="/login" render={() => (user ? <Redirect to="/" /> : <Auth />)} />
        <Route path="/register" render={() => (user ? <Redirect to="/" /> : <Auth />)} />
        <Route path="/reset-password" component={ResetPassword} />

        {/* ✅ A designer oldal mindig elérhető */}
        <Route
          path="/designer"
          render={(props) => <Designer {...props} />}
        />

        {/* 🔒 Privát oldalak (csak ha van user) */}
        <Route
          path="/products/:category"
          render={(props) =>
            user ? <ProductList {...props} /> : <Redirect to="/login" />
          }
        />
        <Route
          path="/product/:id"
          render={(props) =>
            user ? <Product {...props} /> : <Redirect to="/login" />
          }
        />
        <Route
          path="/cart"
          render={(props) =>
            user ? <Cart {...props} /> : <Redirect to="/login" />
          }
        />
        <Route
          path="/success"
          render={(props) =>
            user ? <Success {...props} /> : <Redirect to="/login" />
          }
        />

        {/* ⚠️ 404-es oldal mindig legvégül */}
        <Route component={Notfound} />
      </Switch>
    </Router>
  );
};

export default App;
