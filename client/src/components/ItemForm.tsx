import { type FormEvent, useState } from "react";
import type { CreateItemPayload, Item } from "../types/item";
import "./ItemForm.css";

interface ItemFormProps {
  onSubmit: (payload: CreateItemPayload) => Promise<Item>;
}

export function ItemForm({ onSubmit }: ItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CreateItemPayload["status"]>("active");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({ name: name.trim(), description: description.trim(), status });
      setName("");
      setDescription("");
      setStatus("active");
    } catch {
      setError("Failed to create item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="item-form" onSubmit={(e) => void handleSubmit(e)}>
      <h2 className="form-title">Create New Item</h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="item-name">Name</label>
        <input
          id="item-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name..."
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="item-description">Description</label>
        <textarea
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter item description..."
          maxLength={500}
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="item-status">Status</label>
        <select
          id="item-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CreateItemPayload["status"])}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? (
          <span className="spinner" />
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Item
          </>
        )}
      </button>
    </form>
  );
}
