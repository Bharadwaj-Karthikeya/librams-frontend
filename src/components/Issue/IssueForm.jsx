import { useState } from "react";

export default function IssueForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    bookId: "",
    toUserEmail: "",
    dueDate: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <input
        name="bookId"
        placeholder="Book ID"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="toUserEmail"
        placeholder="Student Email"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        name="dueDate"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Issue Book
      </button>
    </form>
  );
}