import { useState, type FormEvent } from "react";

interface CreateBatchFormProps {
  onCreate: (name: string) => Promise<void>;
}

export default function CreateBatchForm({
  onCreate,
}: CreateBatchFormProps) {
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!batchName.trim()) return;

    setLoading(true);

    try {
      await onCreate(batchName);
      setBatchName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Create New Batch</h2>
          <p>Register a new training batch</p>
        </div>
      </div>

      <form className="batch-form" onSubmit={handleSubmit}>
        <input
          placeholder="Enter batch name"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          required
        />

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "+ Create Batch"}
        </button>
      </form>
    </section>
  );
}