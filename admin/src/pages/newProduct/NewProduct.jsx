import { useState } from "react";
import "./newProduct.css";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

export default function NewProduct() {
  const dispatch = useDispatch();

 
  const validCategories = ["polo", "cipo", "kiegeszito"];

  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [sizeArray, setSizeArray] = useState([]);
  const [error, setError] = useState("");


  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products");
    data.append("cloud_name", "dnibjeo2n"); 

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnibjeo2n/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;

   
    if (name === "color") {
      const formatted =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      return setInputs((prev) => ({ ...prev, color: formatted }));
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
    const sizes = e.target.value.split(",").map((n) => Number(n));
    setSizeArray(sizes);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Kép feltöltése kötelező!");
      return;
    }

  
    const imgUrl = await uploadImage(file);

    const product = {
      ...inputs,
      img: imgUrl,
      size: sizeArray,
    };

    addProduct(product, dispatch);

    alert("Termék sikeresen létrehozva!");
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">Termék létrehozása</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="addProductForm" onSubmit={handleSubmit}>
        <div className="addProductItem">
          <label>Kép</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div className="addProductItem">
          <label>Neve</label>
          <input
            name="title"
            type="text"
            placeholder="Példa: Adidas cipő"
            onChange={handleChange}
            required
          />
        </div>

        <div className="addProductItem">
          <label>Leírás</label>
          <input
            name="desc"
            type="text"
            placeholder="Rövid leírás..."
            onChange={handleChange}
            required
          />
        </div>

        <div className="addProductItem">
          <label>Márka</label>
          <input
            name="Brand"
            type="text"
            placeholder="Adidas, Nike..."
            onChange={handleChange}
            required
          />
        </div>

        <div className="addProductItem">
          <label>Szín</label>
          <input
            name="color"
            type="text"
            placeholder="Piros"
            onChange={handleChange}
            required
          />
        </div>

        <div className="addProductItem">
          <label>Ár (HUF)</label>
          <input
            name="price"
            type="number"
            placeholder="20000"
            onChange={handleChange}
            required
          />
        </div>

        <div className="addProductItem">
          <label>Kategória</label>
          <select required onChange={handleCategoryChange}>
            <option value="">Válassz</option>
            {validCategories.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* póló mérete + gender */}
        {category === "polo" && (
          <>
            <div className="addProductItem">
              <label>Méretek (XS,S,M,L...)</label>
              <input
                type="text"
                placeholder="S,M,L,XL"
                onChange={handlePoloSizes}
              />
            </div>

            <div className="addProductItem">
              <label>Nem</label>
              <select name="gender" onChange={handleChange}>
                <option value="ferfi">Férfi</option>
                <option value="noi">Női</option>
              </select>
            </div>
          </>
        )}

        {/* cipő mérete */}
        {category === "cipo" && (
          <div className="addProductItem">
            <label>Cipő méretek (41,42,43...)</label>
            <input
              type="text"
              placeholder="41,42,43"
              onChange={handleShoeSizes}
            />
          </div>
        )}

        <div className="addProductItem">
          <label>Készleten</label>
          <select name="inStock" onChange={handleChange} required>
            <option value="true">Igen</option>
            <option value="false">Nem</option>
          </select>
        </div>

        <button type="submit" className="addProductButton">
          Létrehozás
        </button>
      </form>
    </div>
  );
}
