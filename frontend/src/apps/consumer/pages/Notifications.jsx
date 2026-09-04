import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationRead } from "../../../services/annamService";
import "../buyerWorkflow.css";

export default function Notifications({ buyer }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!buyer?.id) return;
    getNotifications(buyer.id).then(setItems).catch((err) => setError(err.message || "Could not load notifications."));
  }, [buyer?.id]);

  const read = async (item) => {
    if (item.is_read) return;
    try {
      await markNotificationRead(item.id);
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_read: true } : entry));
    } catch (err) { setError(err.message || "Could not update notification."); }
  };

  const markAllRead = async () => {
    const unread = items.filter((item) => !item.is_read);
    if (!unread.length) return;
    try {
      setUpdating(true);
      await Promise.all(unread.map((item) => markNotificationRead(item.id)));
      setItems((current) => current.map((item) => ({ ...item, is_read: true })));
    } catch (err) { setError(err.message || "Could not update notifications."); }
    finally { setUpdating(false); }
  };

  const unreadCount = items.filter((item) => !item.is_read).length;
  const visibleItems = filter === "unread" ? items.filter((item) => !item.is_read) : items;

  return <main className="page-shell buyer-workflow">
    <header className="page-header"><div><p className="eyebrow">ANNAM updates</p><h1>Notifications</h1><p>Stay on top of cart, order, payment, and delivery updates.</p></div><div className="workflow-header-actions"><Link className="secondary-btn" to="/marketplace">Marketplace</Link><Link className="secondary-btn" to="/cart">My cart</Link></div></header>
    {error && <div className="notice error-notice">{error}</div>}
    {!!items.length && <div className="notification-toolbar"><div className="notification-filters"><button type="button" className={`notification-filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All ({items.length})</button><button type="button" className={`notification-filter ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>Unread ({unreadCount})</button></div><button type="button" className="secondary-btn" disabled={!unreadCount || updating} onClick={markAllRead}>{updating ? "Updating..." : "Mark all read"}</button></div>}
    {!items.length && !error && <div className="card empty-state"><h2>No updates yet.</h2><p>When you add items, place orders, or receive delivery updates, they will appear here.</p><Link className="primary-btn" to="/marketplace">Browse products</Link></div>}
    {!visibleItems.length && items.length > 0 && <div className="card empty-state"><h2>All caught up.</h2><p>You have read every update.</p></div>}
    <section className="notification-list">{visibleItems.map((item) => <article className={`order-card notification-card ${item.is_read ? "is-read" : "unread"}`} key={item.id}><button className="notification-card-button" type="button" onClick={() => read(item)}><div className="notification-card-top"><h2>{item.title}</h2><span className="status">{item.is_read ? "Read" : "New"}</span></div><p>{item.message}</p><time>{item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}</time></button></article>)}</section>
  </main>;
}
