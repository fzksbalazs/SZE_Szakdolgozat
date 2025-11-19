import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import "./widgetLg.css";
import {format} from "timeago.js"

export default function WidgetLg() {
  const [orders, setOrders] = useState([]);

  const getUserById = async (id) => {
  try {
    const res = await userRequest.get(`/users/find/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

  useEffect(() => {
  const getOrders = async () => {
    try {
      const res = await userRequest.get("orders");

     
      const ordersWithUsers = await Promise.all(
        res.data.map(async (order) => {
          const user = await getUserById(order.userId);
          return {
            ...order,
            username: user?.username || "Ismeretlen"
          };
        })
      );

      setOrders(ordersWithUsers);
    } catch (err) {
      console.log(err);
    }
  };

  getOrders();
}, []);


  



  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Legutóbbi vásárlások</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Vásárló ID</th>
          <th className="widgetLgTh">Dátum</th>
          <th className="widgetLgTh">Végösszeg</th>
          <th className="widgetLgTh">Állapota</th>
        </tr>
        {orders.map((order) => (
          <tr className="widgetLgTr" key={order._id}>
            <td className="widgetLgUser">
              <span className="widgetLgName">{order.userId} ({order.username})</span>
            </td>
            <td className="widgetLgDate">{format(order.createdAt)}</td>
            <td className="widgetLgAmount"> {order.amount} Ft</td>
            <td className="widgetLgStatus">
              <Button type={order.status} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
