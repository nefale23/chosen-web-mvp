"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type RedeemCode = {
  id: string;
  code: string;
  hero_slug: string;
  is_redeemed: boolean;
  redeemed_by: string | null;
  redeemed_at: string | null;
  created_at: string;
};

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() || "";

export default function AdminCodesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [message, setMessage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [heroSlug, setHeroSlug] = useState("tj");
  const [customCode, setCustomCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.replace("/login");
          return;
        }

        const userEmail = user.email?.toLowerCase() || "";

        if (!ADMIN_EMAIL) {
          setMessage(
            "Admin email is not configured. Add NEXT_PUBLIC_ADMIN_EMAIL in Vercel."
          );
          setAuthorized(false);
          setCheckingAccess(false);
          setLoading(false);
          return;
        }

        if (userEmail !== ADMIN_EMAIL) {
          setAuthorized(false);
          setCheckingAccess(false);
          setLoading(false);
          return;
        }

        setAuthorized(true);
        setCheckingAccess(false);
        await loadCodes();
      } catch (err) {
        console.error("Admin access check error:", err);
        setMessage("Something went wrong checking admin access.");
        setCheckingAccess(false);
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  const loadCodes = async () => {
    try {
      setTableLoading(true);

      const { data, error } = await supabase
        .from("redeem_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load codes error:", error);
        setMessage(`Could not load codes: ${error.message}`);
        return;
      }

      setCodes((data as RedeemCode[]) || []);
    } catch (err) {
      console.error("Load codes unexpected error:", err);
      setMessage("Something went wrong loading codes.");
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  const generateCode = (slug: string) => {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${slug.toUpperCase()}-${random}-${timestamp}`;
  };

  const handleCreateCodes = async () => {
    setCreateLoading(true);
    setMessage("");

    try {
      const trimmedSlug = heroSlug.trim().toLowerCase();

      if (!trimmedSlug) {
        setMessage("Please enter a hero slug.");
        setCreateLoading(false);
        return;
      }

      if (customCode.trim()) {
        const codeValue = customCode.trim().toUpperCase();

        const { error } = await supabase.from("redeem_codes").insert({
          code: codeValue,
          hero_slug: trimmedSlug,
          is_redeemed: false,
        });

        if (error) {
          console.error("Create custom code error:", error);
          setMessage(`Could not create code: ${error.message}`);
          setCreateLoading(false);
          return;
        }

        setCustomCode("");
        setMessage(`Code created: ${codeValue}`);
        await loadCodes();
        setCreateLoading(false);
        return;
      }

      const safeQty = Math.max(1, Math.min(50, Number(quantity) || 1));

      const payload = Array.from({ length: safeQty }).map(() => ({
        code: generateCode(trimmedSlug),
        hero_slug: trimmedSlug,
        is_redeemed: false,
      }));

      const { error } = await supabase.from("redeem_codes").insert(payload);

      if (error) {
        console.error("Bulk create codes error:", error);
        setMessage(`Could not create codes: ${error.message}`);
        setCreateLoading(false);
        return;
      }

      setMessage(`${safeQty} code(s) created successfully.`);
      await loadCodes();
    } catch (err) {
      console.error("Create codes unexpected error:", err);
      setMessage("Something went wrong creating codes.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResetCode = async (id: string, code: string) => {
    const confirmed = window.confirm(`Reset code ${code}?`);
    if (!confirmed) return;

    setMessage("");

    try {
      const { error } = await supabase
        .from("redeem_codes")
        .update({
          is_redeemed: false,
          redeemed_by: null,
          redeemed_at: null,
        })
        .eq("id", id);

      if (error) {
        console.error("Reset code error:", error);
        setMessage(`Could not reset code: ${error.message}`);
        return;
      }

      setMessage(`Code reset: ${code}`);
      await loadCodes();
    } catch (err) {
      console.error("Reset code unexpected error:", err);
      setMessage("Something went wrong resetting the code.");
    }
  };

  const handleDeleteCode = async (id: string, code: string) => {
    const confirmed = window.confirm(`Delete code ${code}?`);
    if (!confirmed) return;

    setMessage("");

    try {
      const { error } = await supabase.from("redeem_codes").delete().eq("id", id);

      if (error) {
        console.error("Delete code error:", error);
        setMessage(`Could not delete code: ${error.message}`);
        return;
      }

      setMessage(`Code deleted: ${code}`);
      await loadCodes();
    } catch (err) {
      console.error("Delete code unexpected error:", err);
      setMessage("Something went wrong deleting the code.");
    }
  };

  const filteredCodes = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return codes;

    return codes.filter(
      (item) =>
        item.code.toLowerCase().includes(term) ||
        item.hero_slug.toLowerCase().includes(term) ||
        (item.redeemed_by || "").toLowerCase().includes(term)
    );
  }, [codes, search]);

  const totalCodes = codes.length;
  const redeemedCodes = codes.filter((c) => c.is_redeemed).length;
  const availableCodes = codes.filter((c) => !c.is_redeemed).length;

  if (checkingAccess || loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <p className="text-lg">Loading admin codes...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full border rounded-2xl p-6 shadow-sm text-center">
          <h1 className="text-2xl font-bold mb-3">Access denied</h1>
          <p className="text-sm text-gray-600">
            This page is only available to the configured admin email.
          </p>
          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="border rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                Admin
              </p>
              <h1 className="text-3xl font-bold mb-3">Manage Redeem Codes</h1>
              <p className="text-gray-700">
                Create, review, reset, and delete hero redeem codes.
              </p>
            </div>

            <button
              onClick={loadCodes}
              className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mt-6">
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Total Codes</p>
              <p className="font-semibold text-2xl">{totalCodes}</p>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Available</p>
              <p className="font-semibold text-2xl">{availableCodes}</p>
            </div>
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Redeemed</p>
              <p className="font-semibold text-2xl">{redeemedCodes}</p>
            </div>
          </div>
        </section>

        <section className="border rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold">Create Codes</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Slug</label>
              <input
                type="text"
                value={heroSlug}
                onChange={(e) => setHeroSlug(e.target.value)}
                placeholder="tj"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity for Auto Generate
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Single Code
              </label>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="TJ-TEST-006"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCreateCodes}
              disabled={createLoading}
              className="bg-black text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50"
            >
              {createLoading ? "Creating..." : "Create Code(s)"}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            If Custom Single Code is filled in, the page creates that one exact code.
            Otherwise it auto-generates codes using the hero slug.
          </p>

          {message && <p className="text-sm text-gray-700">{message}</p>}
        </section>

        <section className="border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-bold">All Codes</h2>

            <input
              type="text"
              placeholder="Search code, hero slug, or user id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 border rounded-lg px-4 py-3"
            />
          </div>

          {tableLoading ? (
            <p className="text-sm text-gray-600">Refreshing codes...</p>
          ) : filteredCodes.length === 0 ? (
            <p className="text-sm text-gray-600">No codes found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4">Code</th>
                    <th className="text-left py-3 pr-4">Hero</th>
                    <th className="text-left py-3 pr-4">Status</th>
                    <th className="text-left py-3 pr-4">Redeemed At</th>
                    <th className="text-left py-3 pr-4">Created</th>
                    <th className="text-left py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCodes.map((item) => (
                    <tr key={item.id} className="border-b align-top">
                      <td className="py-3 pr-4 font-mono">{item.code}</td>
                      <td className="py-3 pr-4">{item.hero_slug}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs border ${
                            item.is_redeemed
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {item.is_redeemed ? "redeemed" : "available"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {item.redeemed_at
                          ? new Date(item.redeemed_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-3 pr-4">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleResetCode(item.id, item.code)}
                            className="border rounded-lg px-3 py-2 text-xs font-medium hover:bg-gray-50"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleDeleteCode(item.id, item.code)}
                            className="border rounded-lg px-3 py-2 text-xs font-medium hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
