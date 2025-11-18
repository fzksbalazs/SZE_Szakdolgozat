import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function FeaturedInfo() {
  const [income, setIncome] = useState([]);
  const [sales, setSales] = useState([]);
  const [incomePerc, setIncomePerc] = useState(0);
  const [salesPerc, setSalesPerc] = useState(0);

  // ----------------- BEVÉTEL -----------------
  useEffect(() => {
    const getIncome = async () => {
      try {
        const res = await userRequest.get("orders/income");
        setIncome(res.data);
        setIncomePerc((res.data[1].total * 100) / res.data[0].total - 100);
      } catch {}
    };
    getIncome();
  }, []);

  // ----------------- ELADÁSOK -----------------
  useEffect(() => {
    const getSales = async () => {
      try {
        const res = await userRequest.get("orders/stats");
        setSales(res.data);
        setSalesPerc((res.data[1].total * 100) / res.data[0].total - 100);
      } catch {}
    };
    getSales();
  }, []);

  return (
    <div className="featured">

      

  
      <div className="featuredItem">
        <span className="featuredTitle">Eladások</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{sales[1]?.total} db</span>
          <span className="featuredMoneyRate">
            %{Math.floor(salesPerc)}{" "}
            {salesPerc < 0 ? (
              <ArrowDownward className="featuredIcon negative" />
            ) : (
              <ArrowUpward className="featuredIcon" />
            )}
          </span>
        </div>
        
      </div>

     
    </div>
  );
}
