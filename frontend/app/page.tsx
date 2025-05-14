"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-backend-url';

export default function InfoRepositoryUI() {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/resources?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then(setResources);
  }, [query]);

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (urlInput) formData.append("url", urlInput);
    formData.append("notes", notes);
    formData.append("tags", tags);

    await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    setFile(null);
    setUrlInput("");
    setNotes("");
    setTags("");
    setQuery("");
  };

  const handleDelete = async (id) => {
    await fetch(`${BACKEND_URL}/api/resources/${id}`, { method: "DELETE" });
    setQuery(query); // refresh list
  };

  const handleEdit = async (id, updatedNotes, updatedTags) => {
    const formData = new FormData();
    formData.append("notes", updatedNotes);
    formData.append("tags", updatedTags);
    await fetch(`${BACKEND_URL}/api/resources/${id}`, { method: "PUT", body: formData });
    setQuery(query); // refresh list
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-3xl font-bold">My Information Repository</div>

      <div className="flex gap-2">
        <Input
          placeholder="Search documents, videos, or websites..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => setQuery(query)}>Search</Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pdf">PDFs</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="web">Websites</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <Card key={res.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="text-lg font-semibold">{res.title}</div>
                  <div className="text-sm text-muted">{res.type} - {new Date(res.created_at).toLocaleDateString()}</div>
                  <Textarea
                    defaultValue={res.notes}
                    onBlur={(e) => handleEdit(res.id, e.target.value, res.tags.join(","))}
                  />
                  <Input
                    defaultValue={res.tags.join(",")}
                    onBlur={(e) => handleEdit(res.id, res.notes, e.target.value)}
                  />
                  <div className="flex gap-2 pt-2">
                    {res.tags?.map((tag, idx) => <Badge key={idx}>{tag}</Badge>)}
                  </div>
                  <Button variant="destructive" onClick={() => handleDelete(res.id)}>Delete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t pt-6 space-y-4">
        <div className="text-xl font-semibold">Add New Resource</div>
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Input
          placeholder="Or paste a URL (YouTube, website, PDF)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <Textarea
          placeholder="Optional notes or summary..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Input
          placeholder="Comma-separated tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
}
