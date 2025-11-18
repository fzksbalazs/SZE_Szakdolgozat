import Chart from "../../components/chart/Chart";
import "./analytics.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";


  


export default function Home() {
  
  
  const [userStats, setUserStats] = useState([]);
 
  
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
  const getStats = async () => {
    try {
      const res = await userRequest.get("/orders/stats"); 
      const sortedData = res.data.sort((a, b) => a._id - b._id); 
      const stats = sortedData.map((item) => ({
        name: MONTHS[item._id - 1],
        Purchases: item.total,
      }));
      setUserStats(stats);
    } catch (err) {
      console.log(err);
    }
  };

  getStats();
}, [MONTHS]);



  return (
    
    <div className="home">
    <FeaturedInfo/>
      <Chart
        data={userStats}
        title="Vásárlások száma az elmúlt hónapokban"
        grid
        dataKey="Purchases"
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>

  );
}
