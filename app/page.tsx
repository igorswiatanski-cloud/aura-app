"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Radio,
  Activity,
  RefreshCw,
  Clock,
  ExternalLink,
  Target,
  Briefcase,
  Flame,
} from "lucide-react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Ładowanie...");
  const [newsFeed, setNewsFeed] = useState<any[]>([]);

  const assets = [
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 128.5, change: 4.15 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 215.3, change: -2.4 },
    { symbol: "AAPL", name: "Apple Inc.", price: 224.1, change: 0.85 },
    { symbol: "BTC-USD", name: "Bitcoin", price: 64200.0, change: 3.12 },
    { symbol: "CL=F", name: "Ropa WTI", price: 78.45, change: 1.82 },
  ];

  // Funkcja pobierająca najświeższe newsy z naszego API
  const fetchLiveNews = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.success && data.news.length > 0) {
        setNewsFeed(data.news);
        const now = new Date();
        setLastRefreshed(
          `Dzisiaj o ${now.getHours().toString().padStart(2, "0")}:${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
        );
      }
    } catch (err) {
      console.error("Błąd podczas pobierania newsów:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchLiveNews();

    // Automatyczne odświeżanie w tle co 30 sekund
    const interval = setInterval(() => {
      fetchLiveNews();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400 animate-spin" />
          <span>Łączenie ze strumieniem AURA...</span>
        </div>
      </div>
    );
  }

  const highImpactRecentNews = newsFeed.filter(
    (item) => item.impact === "BARDZO WYSOKI" || item.impact === "WYSOKI"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Pasek górny */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white uppercase flex items-center gap-2">
              AURA{" "}
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                LIVE MARKET STREAM
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Na żywo z rynków finansowych
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Ostatnia synchronizacja: {lastRefreshed}</span>
          </div>
          <button
            onClick={fetchLiveNews}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-emerald-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            {isRefreshing ? "Pobieranie..." : "Odśwież teraz"}
          </button>
        </div>
      </header>

      {/* Główna treść */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1800px] mx-auto w-full">
        {/* Lewy panel */}
        <section className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Rynki na żywo</span>
              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AUTOMATYCZNE API
              </span>
            </h2>
            <div className="space-y-2">
              {assets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-100">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-slate-400">{asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-semibold">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-mono flex items-center justify-end gap-1 ${
                        asset.change >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {asset.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {asset.change >= 0
                        ? `+${asset.change}%`
                        : `${asset.change}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Środkowy panel: Strumień na żywo */}
        <section className="col-span-12 lg:col-span-6 space-y-6">
          {/* Wysoki Wpływ */}
          <div className="bg-rose-950/20 border-2 border-rose-500/50 rounded-xl p-4 shadow-lg shadow-rose-950/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-500/30">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
                <h2 className="text-sm font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  KLUCZOWE WYDARZENIA RYNKOWE
                </h2>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                WYSOKI WPŁYW ({highImpactRecentNews.length})
              </span>
            </div>

            <div className="space-y-2.5">
              {highImpactRecentNews.slice(0, 3).map((item) => (
                <div
                  key={`high-${item.id}`}
                  onClick={() => setSelectedNews(item)}
                  className="p-3 bg-slate-950/90 border border-rose-500/40 hover:border-rose-400 rounded-lg transition cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-500/10 px-1.5 py-0.5 rounded">
                        {item.source}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        • {item.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition">
                      {item.title}
                    </p>
                  </div>

                  <button className="shrink-0 px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold rounded border border-rose-500/40 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    ANALIZA
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pełna lista wiadomości na żywo */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Strumień Wiadomości Światowych ({newsFeed.length})
              </h2>
            </div>

            <div className="space-y-3">
              {newsFeed.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedNews?.id === item.id
                      ? "bg-slate-800/80 border-emerald-500/80 ring-1 ring-emerald-500/50"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-emerald-400">
                        {item.source}
                      </span>
                      <span className="text-xs text-slate-500">
                        • {item.timeAgo}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        item.impact === "BARDZO WYSOKI" || item.impact === "WYSOKI"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                      }`}
                    >
                      Wpływ: {item.impact}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Prawdopodobieństwo reakcji rynku</span>
                      <span>Pewność: {item.confidence}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${item.bullishProb}%` }}
                        className="bg-emerald-500"
                      />
                      <div
                        style={{ width: `${item.neutralProb}%` }}
                        className="bg-slate-500"
                      />
                      <div
                        style={{ width: `${item.bearishProb}%` }}
                        className="bg-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prawy panel: Szczegóły wybranego newsa */}
        <section className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-20">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
              Panel Szczegółów AI
            </h2>

            {selectedNews ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                    Wybrane Wydarzenie
                  </span>
                  <p className="text-xs font-semibold text-slate-200 mt-1 leading-normal">
                    {selectedNews.title}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Podsumowanie Treści
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    {selectedNews.analysisShort}
                  </p>
                </div>

                {selectedNews.url && (
                  <a
                    href={selectedNews.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Przeczytaj pełny artykuł
                  </a>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <Zap className="w-8 h-8 text-slate-700" />
                <p>Kliknij artykuł z listy, aby zobaczyć opis i źródło.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}