import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import catalogData from "../../catalog.json";
import { COLORS, itemKey } from "../data";

const STORAGE_KEY = "rime_cart_v1";
const MAX_QTY = 10;
const StoreContext = createContext(null);

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const merged = new Map();
    for (const item of parsed) {
      if (!item || typeof item.sku !== "string") continue;
      const product = catalogData.products[item.sku];
      if (!product) continue;
      const color = product.color
        ? COLORS[item.color]
          ? item.color
          : "glacier"
        : null;
      const qty = Math.min(
        MAX_QTY,
        Math.max(1, Number.isFinite(item.qty) ? Math.floor(item.qty) : 1)
      );
      const key = itemKey(item.sku, color);
      const existing = merged.get(key);
      if (existing) {
        existing.qty = Math.min(MAX_QTY, existing.qty + qty);
      } else {
        merged.set(key, { sku: item.sku, color, qty });
      }
    }
    return [...merged.values()];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  const [color, setColor] = useState("glacier");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState("cart");
  const [lastOrder, setLastOrder] = useState(null);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* private mode */
    }
  }, [cart]);

  useEffect(() => {
    const locked = cartOpen || safetyOpen || menuOpen;
    document.body.classList.toggle("is-locked", locked);
    return () => document.body.classList.remove("is-locked");
  }, [cartOpen, safetyOpen, menuOpen]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3400);
  }, []);

  const addItem = useCallback(
    (sku, selectedColor = "glacier", qty = 1) => {
      const product = catalogData.products[sku];
      if (!product) return;
      const resolvedColor = product.color ? selectedColor : null;
      const key = itemKey(sku, resolvedColor);
      setCart((current) => {
        const found = current.find((item) => itemKey(item.sku, item.color) === key);
        if (found) {
          return current.map((item) =>
            itemKey(item.sku, item.color) === key
              ? { ...item, qty: Math.min(MAX_QTY, item.qty + qty) }
              : item
          );
        }
        return [...current, { sku, color: resolvedColor, qty }];
      });
      const colorNote =
        product.color && COLORS[resolvedColor]
          ? ` — ${COLORS[resolvedColor].name}`
          : "";
      showToast(`${product.short}${colorNote} added to cart`);
    },
    [showToast]
  );

  const removeItem = useCallback((key) => {
    setCart((current) =>
      current.filter((item) => itemKey(item.sku, item.color) !== key)
    );
  }, []);

  const setQty = useCallback((key, qty) => {
    const next = Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));
    setCart((current) => {
      if (next <= 0) {
        return current.filter((item) => itemKey(item.sku, item.color) !== key);
      }
      return current.map((item) =>
        itemKey(item.sku, item.color) === key ? { ...item, qty: next } : item
      );
    });
  }, []);

  const changeQty = useCallback((key, delta) => {
    setCart((current) =>
      current
        .map((item) => {
          if (itemKey(item.sku, item.color) !== key) return item;
          return {
            ...item,
            qty: Math.min(MAX_QTY, Math.max(0, item.qty + delta)),
          };
        })
        .filter((item) => item.qty > 0)
    );
  }, []);

  const openCart = useCallback((nextView = "cart") => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setView(nextView);
    setCartOpen(true);
    setMenuOpen(false);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setView("cart"), 520);
  }, []);

  const completeOrder = useCallback((order) => {
    setLastOrder(order);
    setCart([]);
    setView("success");
  }, []);

  const continueShopping = useCallback(() => {
    setCartOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setView("cart");
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    }, 420);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = catalogData.products[item.sku];
        return sum + (product ? product.price * item.qty : 0);
      }, 0),
    [cart]
  );

  const shippingCost = useMemo(() => {
    const method = catalogData.shipping[shippingMethod] || catalogData.shipping.standard;
    if (
      shippingMethod === "standard" &&
      subtotal >= catalogData.freeShippingThreshold
    ) {
      return 0;
    }
    return method.price;
  }, [shippingMethod, subtotal]);

  const total = subtotal + shippingCost;

  const value = {
    catalog: catalogData,
    cart,
    cartCount,
    subtotal,
    shippingCost,
    total,
    color,
    setColor,
    shippingMethod,
    setShippingMethod,
    addItem,
    removeItem,
    setQty,
    changeQty,
    cartOpen,
    openCart,
    closeCart,
    view,
    setView,
    lastOrder,
    completeOrder,
    continueShopping,
    safetyOpen,
    setSafetyOpen,
    menuOpen,
    setMenuOpen,
    toast,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
