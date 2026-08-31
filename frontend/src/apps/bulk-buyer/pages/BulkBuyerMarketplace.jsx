import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import "../bulkBuyer.css";

function BulkBuyerMarketplace({ bulkBuyer }) {
  const navigate = useNavigate();

  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [deliveryLocation, setDeliveryLocation] = useState("");

  /* =========================
     TEMPORARY REQUIREMENT FLOW
  ========================= */

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requirementConfirmed, setRequirementConfirmed] =
    useState(false);


  const products = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      farmer_name: "Ramesh Kumar",
      location: "Tanjavur",
      quantity: 800,
      unit: "kg",
      price: 28,
      description:
        "Freshly harvested farm tomatoes available in bulk quantity.",
    },
    {
      id: 2,
      name: "Farm Potatoes",
      category: "Vegetables",
      farmer_name: "Selvam",
      location: "Salem",
      quantity: 1500,
      unit: "kg",
      price: 22,
      description:
        "Fresh potatoes sourced directly from the farm.",
    },
    {
      id: 3,
      name: "Premium Onions",
      category: "Vegetables",
      farmer_name: "Murugan",
      location: "Dindigul",
      quantity: 1200,
      unit: "kg",
      price: 30,
      description:
        "Bulk quantity onions available for wholesale procurement.",
    },
  ];

  const categories = [
    {
      value: "All Products",
      label: t("allProducts"),
    },
    {
      value: "Vegetables",
      label: t("vegetables"),
    },
    {
      value: "Fruits",
      label: t("fruits"),
    },
    {
      value: "Grains",
      label: t("grains"),
    },
    {
      value: "Leafy Greens",
      label: t("leafyGreens"),
    },
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      category === "All Products" ||
      item.category === category;

    const searchValue = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchValue) ||
      item.farmer_name.toLowerCase().includes(searchValue) ||
      item.location.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });


  /* =========================
     FIND SUPPLIERS
  ========================= */

  const handleFindSuppliers = (event) => {
    event.preventDefault();

    if (!product.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!quantity) {
      alert("Please enter the required quantity.");
      return;
    }

    if (!deliveryLocation.trim()) {
      alert("Please enter the delivery location.");
      return;
    }

    const requiredQuantity = Number(quantity);

    const productSearch = product.trim().toLowerCase();

    const matchingProduct = products.find((item) => {
      return (
        item.name.toLowerCase().includes(productSearch) ||
        item.category.toLowerCase().includes(productSearch)
      );
    });

    if (!matchingProduct) {
      alert(
        `No ${product} is currently available from our temporary farmer listings.`
      );

      setSelectedProduct(null);
      setRequirementConfirmed(false);

      return;
    }

    if (requiredQuantity > matchingProduct.quantity) {
      alert(
        `Only ${matchingProduct.quantity} ${matchingProduct.unit} is currently available.`
      );

      setSelectedProduct(null);
      setRequirementConfirmed(false);

      return;
    }

    setSelectedProduct(matchingProduct);
    setRequirementConfirmed(false);
  };


  /* =========================
     PROFILE INITIAL
  ========================= */

  const getInitial = () => {
    const name =
      bulkBuyer?.full_name ||
      bulkBuyer?.business_name ||
      "B";

    return name.charAt(0).toUpperCase();
  };

  const displayName =
    bulkBuyer?.full_name ||
    bulkBuyer?.business_name ||
    t("bulkBuyer");


  return (
    <div className="bulk-app">

      {/* ================= SIDEBAR ================= */}

      <aside className="bulk-sidebar">

        {/* LOGO */}

        <div className="bulk-logo-section">

          <div className="bulk-logo-icon">
            A
          </div>

          <div>
            <h1>ANNAM</h1>

            <p>
              Farm to Market
            </p>
          </div>

        </div>


        {/* NAVIGATION */}

        <div className="bulk-sidebar-menu">

          <p className="bulk-sidebar-heading">
            {t("bulkProcurement")}
          </p>


          <button
            type="button"
            className="bulk-sidebar-link active"
            onClick={() =>
              navigate("/bulk-marketplace")
            }
          >
            <span className="bulk-nav-icon">
              ▦
            </span>

            <span>
              {t("Market place")}
            </span>
          </button>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-requirements")
            }
          >
            <span className="bulk-nav-icon">
              ▤
            </span>

            <span>
              {t("My Requirements")}
            </span>
          </button>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-orders")
            }
          >
            <span className="bulk-nav-icon">
              □
            </span>

            <span>
              {t("Bulk Orders")}
            </span>
          </button>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-track-delivery")
            }
          >
            <span className="bulk-nav-icon">
              ↝
            </span>

            <span>
              {t("trackDelivery")}
            </span>
          </button>

          <button
  type="button"
  className="bulk-sidebar-link"
  onClick={() =>
    navigate("/bulk-payment-history")
  }
>
  <span className="bulk-nav-icon">
    ₹
  </span>

  <span>
    Payment History
  </span>
</button>

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="bulk-sidebar-bottom">

          <p>
            {t("directProcurement")}
          </p>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="bulk-main">


        {/* ================= TOP BAR ================= */}

        <header className="bulk-topbar">


          {/* LARGE SEARCH */}

          <div className="bulk-search-container">

            <span className="bulk-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button
              type="button"
              className="bulk-search-button"
            >
              {t("search")}
            </button>

          </div>


          {/* RIGHT ACTIONS */}

          <div className="bulk-top-actions">


            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="bulk-notification-button"
              onClick={() =>
                navigate("/bulk-notifications")
              }
              aria-label={t("notifications")}
            >
              🔔
            </button>


            {/* PROFILE */}

            <button
              type="button"
              className="bulk-profile-button"
              onClick={() =>
                navigate("/bulk-profile")
              }
            >

              <div className="bulk-profile-avatar">
                {getInitial()}
              </div>


              <div className="bulk-profile-info">

                <strong>
                  {displayName}
                </strong>

              </div>

            </button>

          </div>

        </header>


        {/* ================= CONTENT ================= */}

        <div className="bulk-content">


          {/* ================= HERO ================= */}

          <section className="bulk-page-header">

            <p className="bulk-section-kicker">
              {t("BUY YOUR REQUIREMENTS IN ONE PLACE")}
            </p>

            <h2>
              {t("Source Fresh Produce Directly from Farmers")}
            </h2>

            <p>
              {t("Connect with farmers and source fresh agricultural produce in the quantities your business needs.")}
            </p>

          </section>


          {/* ================= PROCUREMENT ================= */}

          <section className="bulk-procurement-section">

            <p className="bulk-section-kicker">
              {t("Search Your Product")}
            </p>

            <h2>
              {t("Tell Us What You Need")}
            </h2>


            <form
              className="bulk-procurement-form"
              onSubmit={handleFindSuppliers}
            >

              <div className="bulk-input-group">

                <label>
                  {t("Product")}
                </label>

                <input
                  type="text"
                  placeholder={t("Product Example")}
                  value={product}
                  onChange={(event) =>
                    setProduct(event.target.value)
                  }
                />

              </div>


              <div className="bulk-input-group">

                <label>
                  {t("Required Quantity")}
                </label>

                <input
                  type="number"
                  placeholder={t("Quantity Example")}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                />

              </div>


              <div className="bulk-input-group">

                <label>
                  {t("Unit")}
                </label>

                <select
                  value={unit}
                  onChange={(event) =>
                    setUnit(event.target.value)
                  }
                >
                  <option value="kg">
                    {t("Kilograms")}
                  </option>

                  <option value="ton">
                    {t("tons")}
                  </option>

                  <option value="bags">
                    {t("bags")}
                  </option>

                  <option value="units">
                    {t("units")}
                  </option>
                </select>

              </div>


              <div className="bulk-input-group">

                <label>
                  {t("Delivery Location")}
                </label>

                <input
                  type="text"
                  placeholder={t("City Or Area")}
                  value={deliveryLocation}
                  onChange={(event) =>
                    setDeliveryLocation(event.target.value)
                  }
                />

              </div>


              <button
                type="submit"
                className="bulk-find-button"
              >
                {t("Find Suppliers")}
              </button>

            </form>

          </section>


          {/* ================= TEMPORARY SEARCH RESULT ================= */}

          {selectedProduct && !requirementConfirmed && (

            <section className="bulk-search-result-section">

              <p className="bulk-section-kicker">
                SUPPLIER FOUND
              </p>

              <h2>
                Available Product
              </h2>


              <div className="bulk-result-card">

                <div className="bulk-result-header">

                  <div>

                    <p className="bulk-product-category">
                      {selectedProduct.category}
                    </p>

                    <h3>
                      {selectedProduct.name}
                    </h3>

                  </div>


                  <div className="bulk-result-price">

                    ₹{selectedProduct.price}

                    <small>
                      / {selectedProduct.unit}
                    </small>

                  </div>

                </div>


                <p className="bulk-product-description">
                  {selectedProduct.description}
                </p>


                <div className="bulk-card-line"></div>


                <div className="bulk-result-details">

                  <div>

                    <span>
                      FARMER
                    </span>

                    <strong>
                      👨‍🌾 {selectedProduct.farmer_name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      FARM LOCATION
                    </span>

                    <strong>
                      📍 {selectedProduct.location}
                    </strong>

                  </div>


                  <div>

                    <span>
                      AVAILABLE
                    </span>

                    <strong>
                      {selectedProduct.quantity}{" "}
                      {selectedProduct.unit}
                    </strong>

                  </div>


                  <div>

                    <span>
                      YOUR REQUIREMENT
                    </span>

                    <strong>
                      {quantity} {unit}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DELIVERY LOCATION
                    </span>

                    <strong>
                      📍 {deliveryLocation}
                    </strong>

                  </div>

                </div>


                <div className="bulk-result-total">

                  <div>

                    <span>
                      Estimated Total
                    </span>

                    <strong>
                      ₹
                      {(
                        Number(quantity) *
                        Number(selectedProduct.price)
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>


                  <button
                    type="button"
                    className="bulk-find-button"
                    onClick={() =>
                      setRequirementConfirmed(true)
                    }
                  >
                    Confirm Requirement →
                  </button>

                </div>

              </div>

            </section>

          )}


          {/* ================= CONFIRMED REQUIREMENT ================= */}

          {selectedProduct && requirementConfirmed && (

            <section className="bulk-confirmed-section">

              <p className="bulk-section-kicker">
                REQUIREMENT CONFIRMED
              </p>

              <h2>
                Review Your Order
              </h2>


              <div className="bulk-confirmed-card">

                <div className="bulk-confirmed-success">
                  ✓
                </div>


                <h3>
                  {selectedProduct.name}
                </h3>


                <p>
                  Your requirement has been confirmed.
                </p>


                <div className="bulk-order-summary">

                  <div>

                    <span>
                      Farmer
                    </span>

                    <strong>
                      {selectedProduct.farmer_name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Product
                    </span>

                    <strong>
                      {selectedProduct.name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Quantity
                    </span>

                    <strong>
                      {quantity} {unit}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Price
                    </span>

                    <strong>
                      ₹{selectedProduct.price} /{" "}
                      {selectedProduct.unit}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Delivery Location
                    </span>

                    <strong>
                      {deliveryLocation}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {(
                        Number(quantity) *
                        Number(selectedProduct.price)
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>


                <div className="bulk-payment-actions">

                  <button
                    type="button"
                    className="bulk-secondary-button"
                    onClick={() => {
                      setRequirementConfirmed(false);
                    }}
                  >
                    ← Change Requirement
                  </button>


                  <button
                    type="button"
                    className="bulk-payment-button"
                    onClick={() =>
                      alert(
                        "Payment gateway will open here."
                      )
                    }
                  >
                    💳 Make Payment
                  </button>

                </div>

              </div>

            </section>

          )}


          {/* ================= CATEGORIES ================= */}

          <section className="bulk-category-section">

            <div className="bulk-category-header">

              <div>

                <p className="bulk-section-kicker">
                  {t("bulkProduce")}
                </p>

                <h2>
                  {t("Explore Available Produce")}
                </h2>

              </div>

            </div>


            <div className="bulk-category-buttons">

              {categories.map((item) => (

                <button
                  key={item.value}
                  type="button"
                  className={
                    category === item.value
                      ? "bulk-category active"
                      : "bulk-category"
                  }
                  onClick={() =>
                    setCategory(item.value)
                  }
                >
                  {item.label}
                </button>

              ))}

            </div>

          </section>


          {/* ================= PRODUCTS ================= */}

          <section className="bulk-available-section">

            <div className="bulk-products-header">

              <div>

                <p className="bulk-section-kicker">
                  {t("Available From Farmers")}
                </p>

                <h2>
                  {t("Fresh Produce Available Now")}
                </h2>

              </div>


              <span className="bulk-product-count">

                {filteredProducts.length}{" "}

                {filteredProducts.length === 1
                  ? t("product")
                  : t("products")}{" "}

                {t("found")}

              </span>

            </div>


            <div className="bulk-products-grid">

              {filteredProducts.length > 0 ? (

                filteredProducts.map((item) => (

                  <div
                    className="bulk-product-card"
                    key={item.id}
                  >

                    <div className="bulk-product-top">

                      <p className="bulk-product-category">
                        {item.category}
                      </p>

                      <span className="bulk-product-price">
                        ₹{item.price}

                        <small>
                          / {item.unit}
                        </small>

                      </span>

                    </div>


                    <h3>
                      {item.name}
                    </h3>


                    <p className="bulk-product-description">
                      {item.description}
                    </p>


                    <div className="bulk-card-line"></div>


                    <div className="bulk-product-info">

                      <p>
                        👨‍🌾

                        <strong>
                          {t("farmer")}:
                        </strong>

                        {" "}

                        {item.farmer_name}
                      </p>


                      <p>
                        📍

                        <strong>
                          {t("location")}:
                        </strong>

                        {" "}

                        {item.location}
                      </p>

                    </div>


                    <div className="bulk-product-bottom">

                      <div className="bulk-quantity-box">

                        <span>
                          {t("availableQuantity")}
                        </span>

                        <strong>
                          {item.quantity} {item.unit}
                        </strong>

                      </div>


                      <button
                        type="button"
                        className="bulk-request-button"
                      >
                        {t("requestQuantity")}
                      </button>

                    </div>

                  </div>

                ))

              ) : (

                <div className="bulk-empty-state">

                  <h3>
                    {t("noProductsFound")}
                  </h3>

                  <p>
                    {t("tryAnotherSearch")}
                  </p>

                </div>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default BulkBuyerMarketplace;