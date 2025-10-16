import styled from "styled-components";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { useLocation } from "react-router";
import { useState } from "react";

const Container = styled.div`
  color: #000;
`;

const Wrapper = styled.div`
  background: #fff;
  color: #000;
`;

const Title = styled.h1`
  margin: 40px 20px 20px;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 2px;
  border-bottom: 2px solid #000;
  display: inline-block;
  padding-bottom: 8px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  border-bottom: 1px solid #ddd;
  ${mobile({ flexDirection: "column", gap: "15px", padding: "15px 20px" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  ${mobile({ flexDirection: "column", alignItems: "flex-start", gap: "8px" })}
`;

const FilterText = styled.span`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid #000;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #000;
    color: #fff;
  }

  ${mobile({ width: "100%" })}
`;

const Option = styled.option`
  font-size: 14px;
`;

const ProductList = () => {
  const location = useLocation();
  const cat = location.pathname.split("/")[2];

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (value === "" || value === "Szin" || value === "Méret" || value === "Márka") {
      const newFilters = { ...filters };
      delete newFilters[name];
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <Container>
      <Navbar />

      <Wrapper>
        <div style={{ textAlign: "center" }}>
          <Title>
            {cat === "polo"
              ? "POLÓK"
              : cat === "cipo"
              ? "CIPŐK"
              : cat === "kiegeszito"
              ? "KIEGÉSZÍTŐK"
              : "TERMÉKEK"}
          </Title>
        </div>
        <FilterContainer>
          <Filter>
            <FilterText>Szűrés:</FilterText>
             <Select name="color" onChange={handleFilterChange}>
              <Option value="">Szin</Option>
              <Option value="Fehér">Fehér</Option>
              <Option value="Fekete">Fekete</Option>
              <Option value="Piros">Piros</Option>
              <Option value="Kék">Kék</Option>
              <Option value="Sárga">Sárga</Option>
              <Option value="Rózsaszin">Rózsaszín</Option>
            </Select>
          
            <Select name="size" onChange={handleFilterChange}>
              <Option value="">Méret</Option>
              {cat === "cipo" ? (
                <>
                  {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((num) => (
                    <Option key={num} value={num}>
                      {num}
                    </Option>
                  ))}
                </>
              ) : (
                <>
                  <Option value="XS">XS</Option>
                  <Option value="S">S</Option>
                  <Option value="M">M</Option>
                  <Option value="L">L</Option>
                  <Option value="XL">XL</Option>
                </>
              )}
            </Select>
            {/* Márka szűrő hozzáadása */}
            <Select name="Brand" onChange={handleFilterChange}>
              <Option value="">Márka</Option>
              <Option value="Adidas">Adidas</Option>
              <Option value="Puma">Puma</Option>
              <Option value="Nike">Nike</Option>
              <Option value="Under Armour">Under Armour</Option>
              <Option value="Reebok">Reebok</Option>
              <Option value="New Balance">New Balance</Option>
              <Option value="Converse">Converse</Option>
              <Option value="Asics">Asics</Option>
              <Option value="Calvin Klein">Calvin Klein</Option>
              <Option value="Oakley">Oakley</Option>
              <Option value="The North Face">The North Face</Option>
            </Select>
          </Filter>
          <Filter>
            <FilterText>Rendezés:</FilterText>
            <Select onChange={handleSortChange}>
              <Option value="newest">Legújabb</Option>
              <Option value="asc">Ár szerint növekvő</Option>
              <Option value="desc">Ár szerint csökkenő</Option>
            </Select>
          </Filter>
        </FilterContainer>
        <Products cat={cat} filters={filters} sort={sort} />
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default ProductList;
