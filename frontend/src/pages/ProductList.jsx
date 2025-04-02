import styled from "styled-components";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { useLocation } from "react-router";
import { useState } from "react";

const Container = styled.div``;

const Title = styled.h1`
  margin: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Filter = styled.div`
  margin: 20px;
  ${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })}
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  ${mobile({ margin: "10px 0px" })}
`;

const Option = styled.option``;

const ProductList = () => {
  const location = useLocation();
  const cat = location.pathname.split("/")[2];

  // Állapotok a szűréshez és rendezéshez
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  // Szűrőválasztás kezelése
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Ha az érték "Szin" vagy "Méret", akkor töröljük a filtert
    if (value === "" || value === "Szin" || value === "Méret") {
      const newFilters = { ...filters };
      delete newFilters[name]; // Töröljük az adott szűrőt
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };


  // Rendezés kezelése
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Title>Dresses</Title>
      <FilterContainer>
        <Filter>
          <FilterText>Szürés:</FilterText>
          <Select name="color" onChange={handleFilterChange}>
            <Option value="">Szin</Option>
            <Option value="Fehér">Fehér</Option>
            <Option value="Fekete">Fekete</Option>
            <Option value="Piros">Piros</Option>
            <Option value="Kék">Kék</Option>
            <Option value="Sárga">Sárga</Option>
            <Option value="Rózsaszin">Rózsaszin</Option>
          </Select>
          <Select name="size" onChange={handleFilterChange}>
            <Option value="">Méret</Option>
            {cat === "cipo" ? (
              <>
                <Option value="36">36</Option>
                <Option value="37">37</Option>
                <Option value="38">38</Option>
                <Option value="39">39</Option>
                <Option value="40">40</Option>
                <Option value="41">41</Option>
                <Option value="42">42</Option>
                <Option value="43">43</Option>
                <Option value="44">44</Option>
                <Option value="45">45</Option>
                <Option value="46">46</Option>
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
        </Filter>
        <Filter>
          <FilterText>Rendezés:</FilterText>
          <Select onChange={handleSortChange}>
            <Option value="newest">Legújabb</Option>
            <Option value="asc">Ár szerint növekvő </Option>
            <Option value="desc">Ár szerint csökkenő </Option>
          </Select>
        </Filter>
      </FilterContainer>
      <Products cat={cat} filters={filters} sort={sort} />
      <Footer />
    </Container>
  );
};

export default ProductList;
