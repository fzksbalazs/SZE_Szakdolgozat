import "./ordersList.css";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await userRequest.put(`/orders/${orderId}`, {
        status: newStatus,
      });

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="orders">
      <h1 className="ordersTitle">Rendelések</h1>

      <div className="ordersContainer">
        {orders.map(order => (
          <div className="orderCard" key={order._id}>
            
            <div className="orderHeader">
              <span><strong>ID:</strong> {order._id}</span>
              <span><strong>Dátum:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="orderBody">
              <div className="buyerInfo">
                <h4>Vásárló:</h4>
                <p>{order.userId}</p>
              </div>

              <div className="productList">
                {order.products.map(product => (
                  <div className="productItem" key={product.productId}>
                    <img src={product.img} alt="" />
                    <div>
                      <p><strong>Termék:</strong> {product.title}</p>
                      <p><strong>Mennyiség:</strong> {product.quantity}</p>
                      <p><strong>Méret:</strong> {product.size}</p>
                      <p><strong>Ár:</strong> {product.price} Ft/db</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="orderFooter">
              <span><strong>Végösszeg:</strong> {order.amount} Ft</span>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="pending">Folyamatban</option>
                <option value="shipped">Kiszállítva</option>
                <option value="delivered">Kézbesítve</option>
                <option value="cancelled">Törölve</option>
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
