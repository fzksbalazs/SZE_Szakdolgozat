import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import { useSelector } from "react-redux";


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Designer from "./pages/Designer";


const App = () => {
  const user = useSelector(state=> state.user.currentUser);
  return (
    <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
      <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
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
            <Route path="/designer" component={Designer}/>                 
          </>
        ) : (
          <Redirect to="/login" />
        )}
    </Switch>
  </Router>
  );
};

export default App;