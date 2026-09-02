import { useState } from "react";
import { ItemList } from "./components/ItemList";
import { ItemForm } from "./components/ItemForm";
import { useItems } from "./hooks/useItems";
import "./App.css";

function App() {
  const { items, loading, error, createItem, deleteItem, fetchItems } = useItems();
  const [view, setView] = useState<"list" | "create">("list");

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Full-Stack TypeScript Monorepo</h1>
          <nav className="app-nav">
            <button
              className={`nav-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              Items
            </button>
            <button
              className={`nav-btn ${view === "create" ? "active" : ""}`}
              onClick={() => setView("create")}
            >
              Create New
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {view === "list" ? (
          <ItemList
            items={items}
            loading={loading}
            error={error}
            onDelete={deleteItem}
            onRetry={fetchItems}
          />
        ) : (
          <div className="form-wrapper">
            <ItemForm
              onSubmit={async (payload) => {
                await createItem(payload);
                setView("list"); // redirect to list on success
                return {} as any; // The hook already returns the created item
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
