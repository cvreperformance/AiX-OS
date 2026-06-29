"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

interface AdminTableProps {
  title: string;
  description?: string;
  columns: Column[];
  data: Record<string, unknown>[];
  basePath: string;
}

export function AdminTable({ title, description, columns, data, basePath }: AdminTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">{title}</h1>
          {description && <p className="text-zinc-500 text-sm mt-1">{description}</p>}
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 transition-all">
          <Plus className="h-4 w-4" />
          Adaugă
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={String(row.id || i)}
                className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-zinc-300">
                    {String(row[col.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`${basePath}/${row.slug}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-600 mt-4">
        Demo mode — conectează Supabase pentru CRUD real (add/edit/delete).
      </p>
    </div>
  );
}
