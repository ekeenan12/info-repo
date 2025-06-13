"use client";
import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-backend-url';

export default function InfoRepositoryUI() {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/resources?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then(setResources)
      .catch(console.error);
  }, [query]);

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (urlInput) formData.append("url", urlInput);
    formData.append("notes", notes);
    formData.append("tags", tags);

    try {
      await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      setFile(null);
      setUrlInput("");
      setNotes("");
      setTags("");
      setQuery("");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/resources/${id}`, { method: "DELETE" });
      setQuery(query); // refresh list
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = async (id: string, updatedNotes: string, updatedTags: string) => {
    const formData = new FormData();
    formData.append("notes", updatedNotes);
    formData.append("tags", updatedTags);
    
    try {
      await fetch(`${BACKEND_URL}/api/resources/${id}`, { method: "PUT", body: formData });
      setQuery(query); // refresh list
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-3xl font-bold text-gray-900">Info Repository</div>

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Search documents, videos, or websites..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          className="btn btn-primary"
          onClick={() => setQuery(query)}
        >
          Search
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">
            All Resources
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res: any) => (
            <div key={res.id} className="card">
              <div className="card-content space-y-2">
                <div className="text-lg font-semibold">{res.title}</div>
                <div className="text-sm text-gray-600">
                  {res.type} - {new Date(res.created_at).toLocaleDateString()}
                </div>
                <textarea
                  className="textarea"
                  defaultValue={res.notes}
                  onBlur={(e) => handleEdit(res.id, e.target.value, res.tags?.join(",") || "")}
                  rows={3}
                />
                <input
                  className="input"
                  defaultValue={res.tags?.join(",") || ""}
                  onBlur={(e) => handleEdit(res.id, res.notes, e.target.value)}
                  placeholder="Tags (comma-separated)"
                />
                <div className="flex gap-2 pt-2 flex-wrap">
                  {res.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="badge">{tag}</span>
                  ))}
                </div>
                <button 
                  className="btn btn-destructive"
                  onClick={() => handleDelete(res.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="text-xl font-semibold">Add New Resource</div>
        <input 
          className="input"
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
        />
        <input
          className="input"
          placeholder="Or paste a URL (YouTube, website, PDF)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Optional notes or summary..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
        <input
          className="input"
          placeholder="Comma-separated tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button 
          className="btn btn-primary"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
