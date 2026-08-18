"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.success && data.news.length > 0) {
        setNewsList(data.news);
        setSelectedNews(data.news[0]);
        const now = new Date();
        setLastSync(now.toLocaleTimeString("pl-PL"));
      }
    } catch (e) {
      console.error("Błąd pobierania newsów:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // odświeżaj co minutę
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: "#0b0f17", color: "#e2e8f0", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      {/* NAGŁÓWEK */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "15px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ color: "#38bdf8", margin: 0, fontSize: "24px", letterSpacing: "1px" }}>⚡ AURALIVE MARKET STREAM</h1>
          <p style={{ margin: "5px 0 0 0", color: "#94a3b8", fontSize: "14px" }}>Na żywo z rynków finansowych • Ostatnia synchronizacja: {lastSync || "Wczytywanie..."}</p>
        </div>
        <button onClick={fetchNews} style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          🔄 Odśwież teraz
        </button>
      </header>

      {/* PASEK AKTYWÓW */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", overflowX: "auto", paddingBottom: "10px" }}>
        {[
          { symbol: "NVDA", name: "NVIDIA Corp.", price: "$128.50", change: "+4.15%", up: true },
          { symbol: "TSLA", name: "Tesla Inc.", price: "$215.30", change: "-2.40%", up: false },
          { symbol: "AAPL", name: "Apple Inc.", price: "$224.10", change: "+0.85%", up: true },
          { symbol: "BTC-USD", name: "Bitcoin", price: "$64,200.00", change: "+3.12%", up: true },
          { symbol: "CL=F", name: "Ropa WTI", price: "$78.45", change: "+1.82%", up: true },
        ].map((item, idx) => (
          <div key={idx} style={{ backgroundColor: "#1e293b", padding: "12px 18px", borderRadius: "8px", minWidth: "160px" }}>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>{item.symbol}</div>
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>{item.name}</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "4px" }}>{item.price}</div>
            <div style={{ color: item.up ? "#4ade80" : "#f87171", fontSize: "13px", fontWeight: "bold" }}>{item.change}</div>
          </div>
        ))}
      </div>

      {/* GŁÓWNY KONTENER GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px" }}>
        
        {/* LEWA KOLUMNA: LISTA NEWSÓW */}
        <div>
          <h2 style={{ fontSize: "18px", borderBottom: "1px solid #1e293b", paddingBottom: "8px", marginBottom: "15px" }}>
            📰 Strumień Wiadomości Światowych ({newsList.length})
          </h2>

          {loading && newsList.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Pobieranie i analiza najnowszych wydarzeń...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {newsList.map((item) => {
                const isSelected = selectedNews?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    style={{
                      backgroundColor: isSelected ? "#1e293b" : "#0f172a",
                      borderLeft: `4px solid ${item.actionColor === "RED" ? "#f87171" : item.actionColor === "YELLOW" ? "#facc15" : "#4ade80"}`,
                      padding: "14px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", marginBottom: "6px" }}>
                      <span><strong>{item.source}</strong> • {item.timeAgo}</span>
                      <span style={{ color: item.actionColor === "RED" ? "#f87171" : item.actionColor === "YELLOW" ? "#facc15" : "#4ade80", fontWeight: "bold" }}>
                        {item.actionRecommendation}
                      </span>
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#f8fafc" }}>{item.title}</div>
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "#cbd5e1" }}>
                      🎯 <strong>Aktywo:</strong> {item.mainImpactAsset}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRAWA KOLUMNA: PANEL SZCZEGÓŁÓW AI */}
        <div>
          <h2 style={{ fontSize: "18px", borderBottom: "1px solid #1e293b", paddingBottom: "8px", marginBottom: "15px", color: "#38bdf8" }}>
            🤖 Panel Analizy AI
          </h2>

          {selectedNews ? (
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px", position: "sticky", top: "20px" }}>
              <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>
                Główny Obiekt Wpływu
              </div>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#f8fafc" }}>{selectedNews.mainImpactAsset}</h3>

              {/* REKOMENDACJA CARD */}
              <div style={{
                backgroundColor: selectedNews.actionColor === "RED" ? "#450a0a" : selectedNews.actionColor === "YELLOW" ? "#422006" : "#052e16",
                border: `1px solid ${selectedNews.actionColor === "RED" ? "#991b1b" : selectedNews.actionColor === "YELLOW" ? "#854d0e" : "#166534"}`,
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "15px"
              }}>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>REKOMENDACJA AI</div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: selectedNews.actionColor === "RED" ? "#f87171" : selectedNews.actionColor === "YELLOW" ? "#facc15" : "#4ade80" }}>
                  {selectedNews.actionRecommendation}
                </div>
              </div>

              {/* HORYZONT CZASOWY */}
              <div style={{ marginBottom: "15px", backgroundColor: "#1e293b", padding: "12px", borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "bold" }}>⏱ HORYZONT CZASOWY INWESTYCJI</div>
                <div style={{ fontWeight: "bold", marginTop: "4px", fontSize: "14px" }}>{selectedNews.timeframe}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{selectedNews.timeframeDetail}</div>
              </div>

              {/* PODSUMOWANIE POWIĄZANYCH AKTYWÓW */}
              <div style={{ marginBottom: "15px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Powiązane Instrumenty:</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {selectedNews.secondaryAssets?.map((asset: string, i: number) => (
                    <span key={i} style={{ backgroundColor: "#1e293b", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              {/* TREŚĆ NAGŁÓWKA I KROTKI OPIS */}
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", marginTop: "12px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Oryginalna wiadomość ({selectedNews.source}):</div>
                <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.4" }}>{selectedNews.title}</p>
                <p style={{ fontSize: "12px", color: "#64748b" }}>{selectedNews.analysisShort}</p>
              </div>

              <a
                href={selectedNews.url}
                target="_blank"
                rel="noreferrer"
                style={{ display: "block", textAlign: "center", backgroundColor: "#1e293b", color: "#38bdf8", padding: "10px", borderRadius: "6px", marginTop: "15px", textDecoration: "none", fontSize: "13px", fontWeight: "bold" }}
              >
                🔗 Przeczytaj pełny artykuł w {selectedNews.source}
              </a>
            </div>
          ) : (
            <p style={{ color: "#94a3b8" }}>Wybierz wiadomość z listy, aby zobaczyć analizę.</p>
          )}
        </div>

      </div>
    </div>
  );
}