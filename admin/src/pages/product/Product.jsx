import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import { updateProduct } from "../../redux/apiCalls";

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];

  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.product.products.find((p) => p._id === productId)
  );


  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(product.categories?.[0] || "");
  const [sizeArray, setSizeArray] = useState(product.size || []);
  const [error, setError] = useState("");

  const validCategories = ["ferfi", "noi", "polo", "cipo", "kiegeszito", "unisex"];

  const MONTHS = useMemo(
    () => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Agu","Sep","Oct","Nov","Dec"],
    []
  );

  const [pStats, setPStats] = useState([]);

  
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products");
    data.append("cloud_name", "dnibjeo2n"); 

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnibjeo2n/image/upload",
      { method: "POST", body: data }
    );
    const json = await res.json();
    return json.secure_url;
  };

 
  const handleChange = (e) => {
    let { name, value } = e.target;

  
    if (name === "color") {
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleCategoryChange = (e) => {
    const cat = e.target.value.toLowerCase();
    if (!validCategories.includes(cat)) {
      setError("Érvénytelen kategória!");
      return;
    }

    setError("");
    setCategory(cat);
    setInputs((prev) => ({ ...prev, categories: [cat] }));
  };

 
  const handlePoloSizes = (e) => {
    const sizes = e.target.value.toUpperCase().split(",");
    setSizeArray(sizes);
  };


  const handleShoeSizes = (e) => {
    const s = e.target.value.split(",").map((n) => Number(n));
    setSizeArray(s);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let imgUrl = product.img;

    if (file) {
      imgUrl = await uploadImage(file);
    }

    const updatedProduct = {
      ...product,
      ...inputs,
      img: imgUrl,
      size: sizeArray,
      categories: [category]
    };

    updateProduct(productId, updatedProduct, dispatch);
    alert("Termék sikeresen frissítve!");
  };

 
  useEffect(() => {
  const getStats = async () => {
    try {
      const res = await userRequest.get("orders/sales/" + productId);
      const sorted = res.data.sort((a, b) => a._id - b._id);

      setPStats(
        sorted.map((item) => ({
          name: MONTHS[item._id - 1],
          Sales: item.total,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };
  getStats();
}, [productId, MONTHS]);


  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Termék szerkesztés</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Új termék létrehozása</button>
        </Link>
      </div>

      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Eladási adatok" />
        </div>

        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>

          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">ID:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>

            <div className="productInfoItem">
              <span className="productInfoKey">Raktáron:</span>
              <span className="productInfoValue">{String(product.inStock)}</span>
            </div>

            <div className="productInfoItem">
              <span className="productInfoKey">Kategória:</span>
              <span className="productInfoValue">{product.categories.join(",")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- FORM ---------------- */}
      <div className="productBottom">
        <form className="productForm" onSubmit={handleSubmit}>
         <div className="productFormLeft">
  <label>Termék neve</label>
  <input
    name="title"
    type="text"
    defaultValue={product.title}
    onChange={handleChange}
  />

  <label>Termék leírása</label>
  <input
    name="desc"
    type="text"
    defaultValue={product.desc}
    onChange={handleChange}
  />

  <label>Márka</label>
  <input
    name="Brand"
    type="text"
    defaultValue={product.Brand}
    onChange={handleChange}
  />

  <label>Szín</label>
  <input
    name="color"
    type="text"
    defaultValue={product.color}
    onChange={handleChange}
  />

  <label>Termék ára</label>
  <input
    name="price"
    type="number"
    defaultValue={product.price}
    onChange={handleChange}
  />

  {/* KATEGÓRIA */}
  <label>Kategória</label>
  <select defaultValue={product.categories[0]} onChange={handleCategoryChange}>
    <option value="ferfi">ferfi</option>
    <option value="noi">noi</option>
    <option value="polo">polo</option>
    <option value="cipo">cipo</option>
    <option value="kiegeszito">kiegeszito</option>
    <option value="unisex">unisex</option>
  </select>

 

  {category === "polo" && (
    <>
      <label>Méretek</label>
      <input
        type="text"
        defaultValue={product.size?.join(",")}
        onChange={handlePoloSizes}
      />

      <label>Nem</label>
      <select name="gender" defaultValue={product.gender} onChange={handleChange}>
        <option value="ferfi">férfi</option>
        <option value="noi">női</option>
      </select>
    </>
  )}

  {category === "cipo" && (
    <>
      <label>Cipő méretek</label>
      <input
        type="text"
        defaultValue={product.size?.join(",")}
        onChange={handleShoeSizes}
      />
    </>
  )}

  <label>Készleten</label>
  <select name="inStock" defaultValue={product.inStock} onChange={handleChange}>
    <option value="true">Igen</option>
    <option value="false">Nem</option>
  </select>
</div>


          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />

              <label htmlFor="file">
                <Publish />
              </label>

              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button type="submit" className="productButton">
              Véglegesítés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
