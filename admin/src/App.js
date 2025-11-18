import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Analytics from "./pages/analytics/analytics";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import Welcome from "./pages/welcome/welcome";
import OrdersList from "./pages/orders/OrderList";

function App() {
  const admin = useSelector((state) => state.user.currentUser?.isAdmin);

  return (
    <Router>
      <Switch>

     
        <Route path="/login">
          {admin ? <Redirect to="/welcome" /> : <Login />}
        </Route>

       
        {admin && (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />

              <Route exact path="/welcome">
                <Welcome />
              </Route>

              <Route path="/orders">
  <OrdersList />
</Route>

              <Route exact path="/analytics">
                <Analytics />
              </Route>
              


              <Route exact path="/users">
                <UserList />
              </Route>

              <Route exact path="/user/:userId">
                <User />
              </Route>

              <Route exact path="/products">
                <ProductList />
              </Route>

              <Route exact path="/product/:productId">
                <Product />
              </Route>

              <Route exact path="/newproduct">
                <NewProduct />
              </Route>
            </div>
          </>
        )}

       
        {!admin && <Redirect to="/login" />}

       
        <Redirect to="/welcome" />
      </Switch>
    </Router>
  );
}


export default App;
