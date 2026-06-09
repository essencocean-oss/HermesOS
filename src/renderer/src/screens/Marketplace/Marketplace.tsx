import { useEffect, useState } from 'react';

const LOCAL_REGISTRY = 'http://localhost:8000/skills';

interface RegistryItem {
  name: string;
  description?: string;
  version?: string;
  tags?: string[];
}

export default function Marketplace({}: { profile?: string }): React.ReactElement {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetch(LOCAL_REGISTRY)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Registry ${res.status}`);
        const json = await res.json();
        if (!cancelled) setItems(json.items ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="marketplace">
      <div className="page-header">
        <h1>Marketplace</h1>
      </div>

      {error && <div className="empty-state error">{error}</div>}

      <div className="skills-grid">
        {items.map((item, idx) => (
          <div className="skill-card" key={`${item.name}-${item.version ?? '0'}-${idx}`}>
            <div className="skill-name">{item.name}</div>
            <div className="skill-desc">{item.description ?? ''}</div>
            <div className="skill-meta">
              <span className="tag">{item.version}</span>
              {(item.tags ?? []).slice(0, 3).map((tag) => (
                <span className="tag muted" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!error && !items.length && <div className="empty-state">No registry items found.</div>}
    </div>
  );
}
