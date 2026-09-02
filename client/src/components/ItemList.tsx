import type { Item } from "../types/item";
import "./ItemList.css";

interface ItemListProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
  onRetry: () => void;
}

const STATUS_CONFIG: Record<Item["status"], { label: string; className: string }> = {
  active: { label: "Active", className: "badge-active" },
  inactive: { label: "Inactive", className: "badge-inactive" },
  archived: { label: "Archived", className: "badge-archived" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ItemList({ items, loading, error, onDelete, onRetry }: ItemListProps) {
  if (loading) {
    return (
      <div className="item-list-state">
        <div className="loader" />
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-list-state error-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{error}</p>
        <button className="retry-btn" onClick={onRetry}>Try Again</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="item-list-state empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <p>No items yet</p>
        <span className="empty-hint">Create your first item using the form</span>
      </div>
    );
  }

  return (
    <div className="item-grid">
      {items.map((item) => {
        const badge = STATUS_CONFIG[item.status];
        return (
          <div key={item._id} className="item-card">
            <div className="card-header">
              <h3 className="card-title">{item.name}</h3>
              <span className={`badge ${badge.className}`}>{badge.label}</span>
            </div>
            <p className="card-description">{item.description}</p>
            <div className="card-footer">
              <time className="card-date">{formatDate(item.createdAt)}</time>
              <button
                className="delete-btn"
                onClick={() => void onDelete(item._id)}
                aria-label={`Delete ${item.name}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
