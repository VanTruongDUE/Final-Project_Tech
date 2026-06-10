import { useState } from "react";
import { CustomerLayout } from "./CustomerLayout";
import { CustomerHome } from "./Home";
import { ProductList } from "./ProductList";
import { ProductDetail } from "./ProductDetail";
import { Cart } from "./Cart";
import { Checkout } from "./Checkout";
import { MyOrders } from "./MyOrders";
import { Profile } from "./Profile";
import { Chat } from "./Chat";
import { OrderDetail } from "./OrderDetail";
import { CreateReview } from "./CreateReview";

type Page = "home" | "list" | "detail" | "cart" | "checkout" | "orders" | "order-detail" | "create-review" | "profile" | "chat";

export function CustomerApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<Page>("home");
  const [pid, setPid] = useState("p1");
  const [oid, setOid] = useState("ORD-1003");

  return (
    <CustomerLayout page={page} setPage={(p: any) => { if (p === "logout") { onLogout(); } else setPage(p); }}>
      {page === "home" && <CustomerHome onProduct={(id) => { setPid(id); setPage("detail"); }} onCategory={() => setPage("list")} />}
      {page === "list" && <ProductList onProduct={(id) => { setPid(id); setPage("detail"); }} />}
      {page === "detail" && <ProductDetail id={pid} onCart={() => setPage("cart")} onBack={() => setPage("home")} />}
      {page === "cart" && <Cart onCheckout={() => setPage("checkout")} />}
      {page === "checkout" && <Checkout onDone={() => setPage("orders")} />}
      {page === "orders" && <MyOrders onView={(id) => { setOid(id); setPage("order-detail"); }} onReview={(id) => { setOid(id); setPage("create-review"); }} />}
      {page === "order-detail" && <OrderDetail id={oid} onBack={() => setPage("orders")} onReview={() => setPage("create-review")} onCancel={() => setPage("orders")} />}
      {page === "create-review" && <CreateReview id={pid} onBack={() => setPage("order-detail")} onSubmit={() => setPage("orders")} />}
      {page === "profile" && <Profile onLogout={onLogout} />}
      {page === "chat" && <Chat />}
    </CustomerLayout>
  );
}
