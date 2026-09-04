import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { ConsumerOrdersPanel, ConsumerTrackingPanel } from "./ConsumerAccountPanels.jsx";
import "../consumer.css";
import { getTrendingProducts } from "../../../services/aiService";
import { addCartItem, getAllProducts, getCart } from "../../../services/annamService";

const categories = [
  {
    key: "allProducts",
    value: "All Products",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "vegetables",
    value: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "fruits",
    value: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "grains",
    value: "Grains",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "leafyGreens",
    value: "Leafy Greens",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80",
  },

  /* EXTRA CATEGORIES */

  {
    key: "dairyProducts",
    value: "Dairy Products",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "spices",
    value: "Spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80",
  },
  {
    key: "flowers",
    value: "Flowers",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80",
  },
];

const productImages = {
  rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=85",
  basmati: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=85",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=85",
  fruit: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=85",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=85",
  banana: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1200&q=85",
  milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1200&q=85",
  spice: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85",
  flower: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
  leafy: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=85",
  tomato:
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",

  tomatoes:
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",

  carrot:
    "https://images.unsplash.com/photo-1447175008436-1701707536e0?auto=format&fit=crop&w=900&q=80",

  carrots:
    "https://images.unsplash.com/photo-1447175008436-1701707536e0?auto=format&fit=crop&w=900&q=80",

  onion:
    "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80",

  onions:
    "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80",

  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",

  potatoes:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",

  default:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
};

const categoryImageKeys = { grains: "rice", fruits: "fruit", vegetables: "tomato", "leafy greens": "leafy", dairy: "milk", spices: "spice", flowers: "flower" };

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="icon"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="icon"
      fill="none"
      stroke="currentColor"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="icon"
      fill="none"
      stroke="currentColor"
    >
      <path d="M3 4h2l2 11h10l2-8H7" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function Marketplace({ buyer }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const consumerName =
    buyer?.full_name || t("consumer");

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [sortOption, setSortOption] =
    useState("recommended");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");
  const [aiTrends, setAiTrends] = useState([]);
  const [aiStatus, setAiStatus] = useState("loading");

  /* CART COUNT */
  const [cartCount, setCartCount] =
    useState(() => {
      const savedCart =
        JSON.parse(
          localStorage.getItem("annam.cart")
        ) || [];

      return savedCart.reduce(
        (total, item) =>
          total + (item.cartQuantity || 1),
        0
      );
    });

  /* VIEW ALL STATE */
  const [showAllCategories, setShowAllCategories] =
    useState(false);

  const [activeView, setActiveView] = useState("marketplace");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        setProducts((await getAllProducts()).filter((product) => !product.is_upcoming));
      } catch (err) {
        console.error(err);

        setError(
          "Unable to connect to the product database."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!buyer?.id) return;
    getCart(buyer.id)
      .then((items) => setCartCount(items.reduce((total, item) => total + (item.cartQuantity || 0), 0)))
      .catch(() => {});
  }, [buyer?.id]);

  useEffect(() => {
    getTrendingProducts(buyer?.location)
      .then((result) => { setAiTrends(result.top_products || []); setAiStatus("ready"); })
      .catch(() => { setAiTrends([]); setAiStatus("offline"); });
  }, [buyer?.location]);

  /* ADD PRODUCT TO CART */
  const handleAddToCart = async (product) => {
    if (!buyer?.id) {
      setError("Your buyer account is still syncing. Please wait a moment and try again.");
      return;
    }
    try {
      setError("");
      await addCartItem(buyer.id, product.id);
      const items = await getCart(buyer.id);
      setCartCount(items.reduce((total, item) => total + (item.cartQuantity || 0), 0));
    } catch (error) {
      setError(error.message || "Could not add this product to your cart.");
    }
  };

  const filteredProducts =
    products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const farmerName =
        product.farmer_name?.toLowerCase() || "";

      const productLocation =
        product.location?.toLowerCase() || "";

      const productCategory =
        product.category?.toLowerCase() || "";

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        productName.includes(search) ||
        farmerName.includes(search) ||
        productLocation.includes(search);

      const matchesCategory =
        selectedCategory === "All Products" ||
        productCategory ===
          selectedCategory.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  const sortedProducts =
    [...filteredProducts].sort(
      (a, b) => {
        if (sortOption === "low-high") {
          return (
            Number(a.price) -
            Number(b.price)
          );
        }

        if (sortOption === "high-low") {
          return (
            Number(b.price) -
            Number(a.price)
          );
        }

        return 0;
      }
    );

  const getProductImage = (product) => {
    if (product.image_url) return product.image_url;
    const name =
      product.name?.toLowerCase() || "";

    const matchedImage =
      Object.keys(productImages).find(
        (key) =>
          name.includes(key)
      );

    if (matchedImage) return productImages[matchedImage];
    const category = product.category?.toLowerCase() || "";
    const categoryKey = Object.keys(categoryImageKeys).find((key) => category.includes(key));
    return categoryKey ? productImages[categoryImageKeys[categoryKey]] : productImages.default;
  };

  /* FIRST 5 CATEGORIES */
  const mainCategories =
    categories.slice(0, 5);

  /* EXTRA 3 CATEGORIES */
  const extraCategories =
    categories.slice(5);

  return (
    <div className="consumer-app">

      {/* SIDEBAR */}
      <aside className="consumer-sidebar">

        <div className="consumer-logo">

          <div className="logo-box">
            A
          </div>

          <div>
            <h1>ANNAM</h1>

            <span>
              Farm to Market
            </span>
          </div>

        </div>

        <div className="sidebar-label">
          {t("marketplace").toUpperCase()}
        </div>

        <nav className="sidebar-nav">

          {/* MARKETPLACE */}
          <button
            className={`nav-item ${activeView === "marketplace" ? "active" : ""}`}
            onClick={() => setActiveView("marketplace")}
          >
            <span className="nav-icon">
              ▦
            </span>

            {t("marketplace")}
          </button>

          {/* ORDERS */}
          <button
            className={`nav-item ${activeView === "orders" ? "active" : ""}`}
            onClick={() => setActiveView("orders")}
          >
            <span className="nav-icon">
              □
            </span>

            {t("myOrders")}
          </button>

          {/* TRACK DELIVERY */}
          <button
            className={`nav-item ${activeView === "delivery" ? "active" : ""}`}
            onClick={() => setActiveView("delivery")}
          >
            <span className="nav-icon">
              ⌁
            </span>

            {t("trackDelivery")}
          </button>

          <button className="nav-item" onClick={() => navigate("/ai-insights")}>
            <span className="nav-icon">✦</span>
            AI Insights
          </button>

        </nav>

      </aside>

      {/* MAIN AREA */}
      <main className="consumer-main">

        {/* HEADER */}
        <header className="consumer-header">

          {/* SEARCH */}
          <div className="global-search">

            <SearchIcon />

            <input
              type="text"
              placeholder={t(
                "searchPlaceholder"
              )}
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            <button
              type="button"
              className="search-button"
            >
              <SearchIcon />
            </button>

          </div>

          <div className="header-actions">

            {/* NOTIFICATIONS */}
            <button
              type="button"
              className="header-icon-button notification-button"
              onClick={() =>
                navigate("/notifications")
              }
            >
              <BellIcon />

              <span className="notification-count">
                3
              </span>
            </button>

            {/* CART */}
            <button
              type="button"
              className="cart-button"
              onClick={() =>
                navigate("/cart")
              }
            >
              <CartIcon />

              <span>
                {t("cart")}
              </span>

              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="header-divider" />

            {/* PROFILE */}
            <button
              type="button"
              className="consumer-profile"
              onClick={() =>
                navigate("/profile")
              }
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
                textAlign: "left",
              }}
            >

              <div className="profile-avatar">
                {consumerName
                  ?.charAt(0)
                  ?.toUpperCase() || "C"}
              </div>

              <div className="profile-details">

                <strong>
                  {consumerName}
                </strong>

                <span>
                  {t("buyer")}
                </span>

              </div>

            </button>

          </div>

        </header>

        {/* PAGE CONTENT */}
        {activeView === "orders" ? <ConsumerOrdersPanel /> : activeView === "delivery" ? <ConsumerTrackingPanel /> : <section className="marketplace-content">

          <section className="card" style={{ marginBottom: "24px", borderColor: "#bbf7d0", background: "#f0fdf4" }}>
            <p className="section-kicker">ANNAM AI PICKS</p>
            <h2 style={{ margin: "4px 0 12px" }}>High-demand near {buyer?.location || "you"}</h2>
            {aiStatus === "loading" && <p>Loading demand insights…</p>}
            {aiStatus === "offline" && <p>AI insights are unavailable. Start the main backend on port 8000 to show local demand recommendations.</p>}
            {aiTrends.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {aiTrends.map((trend) => <button key={trend.product} type="button" className="secondary-btn" onClick={() => setSearchTerm(trend.product)}>{trend.product} · {Math.round(trend.predicted_qty_kg)} kg · {trend.trend}</button>)}
            </div>}
          </section>

          {/* CATEGORY SECTION */}
          <div className="section-header">

            <div>

              <p className="section-kicker">
                {t("marketplace").toUpperCase()}
              </p>

              <h2>
                {t("browseByCategory")}
              </h2>

            </div>

            {/* VIEW ALL BUTTON */}
            <button
              type="button"
              className="view-all-button"
              onClick={() =>
                setShowAllCategories(
                  !showAllCategories
                )
              }
            >
              {showAllCategories
                ? "Show Less ↑"
                : t("viewAll")}
            </button>

          </div>

          {/* MAIN CATEGORIES */}
          <div className="category-grid">

            {mainCategories.map(
              (category) => (

                <button
                  type="button"
                  className={`category-card ${
                    selectedCategory ===
                    category.value
                      ? "selected"
                      : ""
                  }`}
                  key={category.value}
                  onClick={() =>
                    setSelectedCategory(
                      category.value
                    )
                  }
                >

                  <div className="category-image-wrapper">

                    <img
                      src={category.image}
                      alt={t(category.key)}
                      className="category-image"
                    />

                  </div>

                  <span>
                    {t(category.key)}
                  </span>

                </button>

              )
            )}

          </div>

          {/* EXTRA CATEGORIES */}
          {showAllCategories && (

            <div
              className="category-grid"
              style={{
                marginTop: "24px",
              }}
            >

              {extraCategories.map(
                (category) => (

                  <button
                    type="button"
                    className={`category-card ${
                      selectedCategory ===
                      category.value
                        ? "selected"
                        : ""
                    }`}
                    key={category.value}
                    onClick={() =>
                      setSelectedCategory(
                        category.value
                      )
                    }
                  >

                    <div className="category-image-wrapper">

                      <img
                        src={category.image}
                        alt={category.value}
                        className="category-image"
                      />

                    </div>

                    <span>
                      {category.value}
                    </span>

                  </button>

                )
              )}

            </div>

          )}

          {/* PRODUCTS HEADER */}
          <div className="products-header">

            <div>

              <p className="section-kicker">
                {t("marketplace").toUpperCase()}
              </p>

              <h2>
                {t("featuredProducts")}
              </h2>

            </div>

            <select
              className="sort-select"
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value
                )
              }
            >

              <option value="recommended">
                Sort by: Recommended
              </option>

              <option value="low-high">
                Price: Low to High
              </option>

              <option value="high-low">
                Price: High to Low
              </option>

            </select>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="products-message">
              Loading fresh products...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="products-message error-message">
              {error}
            </div>
          )}

          {/* PRODUCTS */}
          {!loading &&
            !error && (

              <div className="products-grid">

                {sortedProducts.map(
                  (product) => (

                    <article
                      className="product-card"
                      key={product.id}
                    >

                      <div className="product-image-container" style={{ "--product-photo": `url("${getProductImage(product)}")` }}>

                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="product-image"
                          loading="lazy"
                          onError={(event) => { event.currentTarget.src = productImages.default; }}
                        />

                        <span
                          className={`stock-badge ${
                            !product.is_available
                              ? "out-of-stock"
                              : ""
                          }`}
                        >
                          {product.is_available
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>

                      </div>

                      <div className="product-details">

                        <h3>
                          {product.name}
                        </h3>

                        <p className="farm-name">
                          {product.farmer_name}
                        </p>

                        <p className="product-location">
                          {product.location ||
                            "Location not available"}
                        </p>

                        <p className="product-description">
                          {product.description}
                        </p>

                        <div className="product-price-row">

                          <span className="product-price">

                            ₹{product.price}

                            <small>
                              {" "}
                              / {product.unit}
                            </small>

                          </span>

                          <span className="product-quantity">

                            {product.quantity}{" "}
                            {product.unit}

                          </span>

                        </div>

                        <button
                          type="button"
                          className="add-cart-button"
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          disabled={
                            !product.is_available
                          }
                        >

                          <CartIcon />

                          {product.is_available
                            ? "Add to Cart"
                            : "Unavailable"}

                        </button>

                      </div>

                    </article>

                  )
                )}

                {sortedProducts.length ===
                  0 && (
                    <div className="products-message">
                      No products found.
                    </div>
                  )}

              </div>

            )}

        </section>}

      </main>

    </div>
  );
}

export default Marketplace;
