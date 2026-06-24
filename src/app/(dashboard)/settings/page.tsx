"use client";
// src/app/(dashboard)/settings/page.tsx

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CreditCard, User, Bell, Check, Loader2 } from "lucide-react";

const PLANS = [
  { id: "FREE", name: "Free", price: "$0", credits: 3 },
  { id: "STARTER", name: "Starter", price: "$19", credits: 20 },
  { id: "PRO", name: "Pro", price: "$49", credits: 100 },
  { id: "AGENCY", name: "Agency", price: "$149", credits: 500 },
];

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "notifications">("profile");
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: "MONTHLY" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setUpgrading(null);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Kelola akun dan subscription kamu</p>
      </div>

      <div className="flex gap-2 border-b border-white/5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? "border-violet-500 text-white"
                : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            {user?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="" className="w-16 h-16 rounded-full" />
            )}
            <div>
              <p className="text-base font-semibold text-white">{user?.fullName}</p>
              <p className="text-sm text-white/40">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
            <p className="text-sm text-white/40 mb-4">Pilih plan yang sesuai kebutuhanmu</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  className="border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xl font-bold text-white mt-1">{p.price}<span className="text-xs text-white/30">/mo</span></p>
                    <p className="text-xs text-violet-400 mt-1">{p.credits} kredit</p>
                  </div>
                  {p.id !== "FREE" && (
                    <button
                      onClick={() => handleUpgrade(p.id)}
                      disabled={upgrading === p.id}
                      className="w-full text-xs py-2 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {upgrading === p.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Pilih"
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6 space-y-4">
          {[
            { label: "Email saat video selesai", checked: true },
            { label: "Email saat kredit hampir habis", checked: true },
            { label: "Newsletter produk baru", checked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-white/70">{item.label}</span>
              <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${item.checked ? "bg-violet-500" : "bg-white/10"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.checked ? "translate-x-5" : ""}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
