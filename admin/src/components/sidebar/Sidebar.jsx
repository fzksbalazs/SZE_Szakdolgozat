import "./sidebar.css";
import {
  LineStyle,
  PermIdentity,
  Storefront,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Általános</h3>
          <ul className="sidebarList">
            <Link to="/welcome" className="link">
            <li className="sidebarListItem">
              <LineStyle className="sidebarIcon" />
              Üdvözlő oldal
            </li>
            </Link>        
          </ul>
          <ul className="sidebarList">
            <Link to="/analytics" className="link">
            <li className="sidebarListItem">
              <LineStyle className="sidebarIcon" />
              Statisztikák
            </li>
            </Link>        
          </ul>
          
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Hozzáadás/Törlés/Szerkesztés</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Felhasználók
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                Termékek
              </li>
            </Link>     
            <Link to="/orders" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                Rendelések
              </li>
            </Link>      
          </ul>
        </div>     
      </div>
    </div>
  );
}
