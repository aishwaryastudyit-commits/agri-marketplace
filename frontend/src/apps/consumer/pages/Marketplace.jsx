import { useEffect, useState } from "react";
import "../consumer.css";

const categories = [
  {
    name: "All Products",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Grains",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Leafy Greens",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80",
  },
];

const productImages = {
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor">
      <path d="M3 4h2l2 11h10l2-8H7" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function Marketplace() {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [sortOption, setSortOption] =
    useState("recommended");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cartCount, setCartCount] = useState(0);

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://127.0.0.1:8000/products/"
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        setProducts(data);
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

  // ADD PRODUCT TO CART
  const handleAddToCart = () => {
    setCartCount((previousCount) => previousCount + 1);
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
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

    return matchesSearch && matchesCategory;
  });

  // SORT PRODUCTS
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {
      if (sortOption === "low-high") {
        return Number(a.price) - Number(b.price);
      }

      if (sortOption === "high-low") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    }
  );

  const getProductImage = (productName) => {
    const name =
      productName?.toLowerCase() || "";

    const matchedImage =
      Object.keys(productImages).find((key) =>
        name.includes(key)
      );

    return matchedImage
      ? productImages[matchedImage]
      : productImages.default;
  };

  return (
    <div className="consumer-app">

      {/* SIDEBAR */}

      <aside className="consumer-sidebar">
        <div className="consumer-logo">
          <div className="logo-box">A</div>

          <div>
            <h1>ANNAM</h1>
            <span>Farm to Market</span>
          </div>
        </div>

        <div className="sidebar-label">
          MARKETPLACE
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item active">
            <span className="nav-icon">▦</span>
            Marketplace
          </button>

          <button className="nav-item">
            <span className="nav-icon">□</span>
            My Orders
          </button>

          <button className="nav-item">
            <span className="nav-icon">⌁</span>
            Track Delivery
          </button>

          <button className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
          </button>

        </nav>
      </aside>


      {/* MAIN AREA */}

      <main className="consumer-main">

        {/* HEADER */}

        <header className="consumer-header">

          <div className="global-search">

            <SearchIcon />

            <input
              type="text"
              placeholder="Search crops, farmers, locations..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <button className="search-button">
              <SearchIcon />
            </button>

          </div>


          <div className="header-actions">

            <button className="header-icon-button notification-button">
              <BellIcon />
              <span className="notification-count">
                3
              </span>
            </button>


            <button className="cart-button">
              <CartIcon />

              <span>Cart</span>

              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount}
                </span>
              )}
            </button>


            <div className="header-divider"></div>


            <div className="consumer-profile">

              <div className="profile-avatar">
                C
              </div>

              <div className="profile-details">
                <strong>Consumer</strong>
                <span>Buyer</span>
              </div>

              <span className="profile-arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <section className="marketplace-content">


          {/* CATEGORY SECTION */}

          <div className="section-header">

            <div>
              <p className="section-kicker">
                MARKETPLACE
              </p>

              <h2>
                Browse by category
              </h2>
            </div>


            <button
              className="view-all-button"
              onClick={() =>
                setSelectedCategory(
                  "All Products"
                )
              }
            >
              View all →
            </button>

          </div>


          <div className="category-grid">

            {categories.map((category) => (

              <button
                className={`category-card ${
                  selectedCategory === category.name
                    ? "selected"
                    : ""
                }`}
                key={category.name}
                onClick={() =>
                  setSelectedCategory(
                    category.name
                  )
                }
              >

                <div className="category-image-wrapper">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />

                </div>


                <span>
                  {category.name}
                </span>

              </button>

            ))}

          </div>


          {/* FEATURED PRODUCTS */}

          <div className="products-header">

            <div>

              <p className="section-kicker">
                MARKETPLACE
              </p>

              <h2>
                Featured products
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

          {!loading && !error && (

            <div className="products-grid">

              {sortedProducts.map(
                (product) => (

                  <article
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-image-container">

                      <img
                        src={getProductImage(
                          product.name
                        )}
                        alt={product.name}
                        className="product-image"
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
                        className="add-cart-button"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
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


              {sortedProducts.length === 0 && (

                <div className="products-message">

                  No products found.

                </div>

              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Marketplace;