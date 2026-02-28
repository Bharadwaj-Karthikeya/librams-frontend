import { useState } from "react";

export default function BookForm({ onSubmit, initialData, loading }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      author: "",
      category: "",
      publishedYear: "",
      availableCopies: 1,
    },
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="flex flex-col gap-4"
    >
      <input
        placeholder="Title"
        className="p-2 border rounded-md"
        value={formData.title}
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
        required
      />

      <input
        placeholder="Author"
        className="p-2 border rounded-md"
        value={formData.author}
        onChange={(e) =>
          setFormData({
            ...formData,
            author: e.target.value,
          })
        }
        required
      />

      <input
        placeholder="Category"
        className="p-2 border rounded-md"
        value={formData.category}
        onChange={(e) =>
          setFormData({
            ...formData,
            category: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Published Year"
        className="p-2 border rounded-md"
        value={formData.publishedYear}
        onChange={(e) =>
          setFormData({
            ...formData,
            publishedYear: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Available Copies"
        className="p-2 border rounded-md"
        value={formData.availableCopies}
        onChange={(e) =>
          setFormData({
            ...formData,
            availableCopies: e.target.value,
          })
        }
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isActive ?? true}
          onChange={(e) =>
            setFormData({
              ...formData,
              isActive: e.target.checked,
            })
          }
        />
        Active (visible in system)
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isAvailableforIssue ?? true}
          onChange={(e) =>
            setFormData({
              ...formData,
              isAvailableforIssue: e.target.checked,
            })
          }
        />
        Available For Issue
      </label>

      <button
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded-md"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
