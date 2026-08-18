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
  const [lastRefreshed, setLastRefreshed] = useState("Przed chwilą");

  const assets = [
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 128.5, change: 4.15 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 215.3, change: -2.4 },
    { symbol: "AAPL", name: "Apple Inc.", price: 224.1, change: 0.85 },
    { symbol: "BTC-USD", name: "Bitcoin", price: 64200.0, change: 3.12 },
    { symbol: "CL=F", name: "Ropa WTI", price: 78.45, change: 1.82 },
  ];

  const initialNews = [
    {
      id: "evt-nvda",
      title:
        "Przełom w wydajności mikroprocesorów AI – Nvidia prezentuje architekturę nowej generacji",
      source: "TechCrunch",
      timeAgo: "3 min temu",
      hoursAgo: 0.05,
      impact: "BARDZO WYSOKI",
      isTrump: false,
      bullishProb: 88,
      neutralProb: 8,
      bearishProb: 4,
      confidence: 95,
      analysisShort:
        "Gwałtowny wzrost popytu ze strony gigantów chmurowych. Prognozowany natychmiastowy skok wyceny w handlu pozagiełdowym.",
      analysisLong:
        "Utrzymanie dominacji rynkowej w sektorze sprzętu AI na kolejne 18 miesięcy. Dalszy wzrost marży operacyjnej.",
      opportunity: {
        company: "NVIDIA Corporation",
        ticker: "NVDA",
        successProbability: 87,
        action: "KUPUJ (LONG)",
        targetPrice: "$142.00",
        stopLoss: "$122.50",
        horizon: "3 – 7 DNI",
        reasoning:
          "Prezentacja nowej architektury zniwelowała obawy inwestorów o spadek dynamiki zamówień ze strony klientów hyperscale.",
      },
    },
    {
      id: "evt-tsla-1",
      title:
        "Donald Trump zapowiada 100% cła na komponenty EV z Chin – cios w konkurencję Tesli",
      source: "Truth Social",
      timeAgo: "12 min temu",
      hoursAgo: 0.2,
      impact: "BARDZO WYSOKI",
      isTrump: true,
      bullishProb: 78,
      neutralProb: 12,
      bearishProb: 10,
      confidence: 91,
      analysisShort:
        "Ograniczenie napływu tanich chińskich aut elektrycznych do USA daje Tesli silną pozycję monopolistyczną na rynku domowym.",
      analysisLong:
        "Potencjalne odwetowe cła ze strony Pekinu mogą uderzyć w gigafabrykę Tesli w Szanghaju w dłuższym horyzoncie.",
      opportunity: {
        company: "Tesla Inc.",
        ticker: "TSLA",
        successProbability: 82,
        action: "KUPUJ (LONG)",
        targetPrice: "$235.00",
        stopLoss: "$204.00",
        horizon: "2 – 4 TYGODNIE",
        reasoning:
          "Eliminacja konkurencji chińskiej na rynku amerykańskim znacząco podnosi prognozy sprzedaży modelu Cybertruck i Model Y.",
      },
    },
    {
      id: "evt-tsla-2",
      title:
        "Agencja DOT nakłada inspekcję na system FSD Tesli po incydentach pogodowych",
      source: "Reuters",
      timeAgo: "45 min temu",
      hoursAgo: 0.75,
      impact: "WYSOKI",
      isTrump: false,
      bullishProb: 15,
      neutralProb: 25,
      bearishProb: 60,
      confidence: 84,
      analysisShort:
        "Krótkoterminowa presja spadkowa na akcje TSLA z powodu ryzyka opóźnień we wdrożeniu flot Robotaxi.",
      analysisLong:
        "Procesy regulacyjne mogą wydłużyć komercjalizację autonomicznej jazdy o 6–12 miesięcy.",
      opportunity: {
        company: "Tesla Inc.",
        ticker: "TSLA",
        successProbability: 74,
        action: "SPRZEDAJ (SHORT)",
        targetPrice: "$202.00",
        stopLoss: "$221.00",
        horizon: "1 – 3 DNI",
        reasoning:
          "Negatywny sentyment medialny i zapowiedź kontroli federalnej z reguły wywołują chwilową korektę wyceny o 4–7%.",
      },
    },
    {
      id: "evt-fed-alert",
      title:
        "Niespodziewany komunikat FED: Nadzwyczajna zmiana stopy rezerw obowiązkowych",
      source: "Federal Reserve",
      timeAgo: "2 godz. temu",
      hoursAgo: 2,
      impact: "BARDZO WYSOKI",
      isTrump: false,
      bullishProb: 65,
      neutralProb: 20,
      bearishProb: 15,
      confidence: 93,
      analysisShort:
        "Potężny zastrzyk płynności na rynki finansowe. Natychmiastowa reakcja sektora bankowego i indeksów giełdowych.",
      analysisLong:
        "Zwiększenie elastyczności kredytowej banków komercyjnych przed nadchodzącym cyklem obniżek stóp.",
    },
    {
      id: "evt-aapl",
      title:
        "Apple ogłasza integrację własnych modeli AI bezpośrednio w układach Apple Silicon",
      source: "Bloomberg",
      timeAgo: "6 godz. temu",
      hoursAgo: 6,
      impact: "WYSOKI",
      isTrump: false,
      bullishProb: 82,
      neutralProb: 13,
      bearishProb: 5,
      confidence: 89,
      analysisShort:
        "Oczekiwania na rekordowy cykl wymiany smartfonów (iPhone supercycle) dzięki unikalnym funkcjom generatywnym.",
      analysisLong:
        "Wzrost przychodów z usług (Services) poprzez subskrypcyjne pakiety rozszerzonych funkcji AI.",
      opportunity: {
        company: "Apple Inc.",
        ticker: "AAPL",
        successProbability: 85,
        action: "KUPUJ (LONG)",
        targetPrice: "$240.00",
        stopLoss: "$218.00",
        horizon: "1 – 3 MIESIĄCE",
        reasoning:
          "Wbudowanie modułów AI na poziomie sprzętowym zmusza konsumentów do zakupu najnowszych modeli urządzeń.",
      },
    },
  ];

  const [newsFeed, setNewsFeed] = useState(initialNews);

  // Bezpieczne sprawdzanie montowania na kliencie (rozwiązuje problem SSR / Hydration)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400 animate-spin" />
          <span>Ładowanie terminala AURA...</span>
        </div>
      </div>
    );
  }

  const highImpactRecentNews = newsFeed.filter(
    (item) => item.impact === "BARDZO WYSOKI" && item.hoursAgo <= 5
  );

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const refreshedFeed = [
        {
          id: `evt-refreshed-${now.getTime()}`,
          title:
            "ALERTY PILNE: Sąd Najwyższy USA podejmuje nagłą decyzję ws. regulacji chmury AI",
          source: "Wall Street Journal",
          timeAgo: "Przed chwilą",
          hoursAgo: 0.01,
          impact: "BARDZO WYSOKI",
          isTrump: false,
          bullishProb: 80,
          neutralProb: 15,
          bearishProb: 5,
          confidence: 92,
          analysisShort:
            "Zniesienie barier prawnych dla dalszej ekspansji centrów danych AI. Wzrost kursów spółek technologicznych.",
          analysisLong:
            "Przyspieszenie nakładów inwestycyjnych w branży budowy infrastruktury cyfrowej.",
        },
        ...newsFeed,
      ];

      setNewsFeed(refreshedFeed);
      setLastRefreshed(`Dzisiaj o ${timeString}`);
      setIsRefreshing(false);
    }, 1000);
  };

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
                TERMINAL AI
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Twój Asystent Inteligencji Rynkowej 24/7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Aktualizacja: {lastRefreshed}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-emerald-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            {isRefreshing ? "Odświeżanie..." : "Odśwież strumień"}
          </button>
        </div>
      </header>

      {/* Główna treść */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1800px] mx-auto w-full">
        {/* Lewy panel: Obserwowane aktywa */}
        <section className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Lista Obserwowana</span>
              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                NA ŻYWO
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

        {/* Środkowy panel: DUŻA ZMIANA + Strumień Wiadomości */}
        <section className="col-span-12 lg:col-span-6 space-y-6">
          {/* Okienko: DUŻA ZMIANA (Krytyczne wiadomości < 5h) */}
          <div className="bg-rose-950/20 border-2 border-rose-500/50 rounded-xl p-4 shadow-lg shadow-rose-950/20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-500/30">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
                <h2 className="text-sm font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  DUŻA ZMIANA RYNKOWA
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Ostatnie &lt; 5h
                  </span>
                </h2>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                KRYTYCZNY WPŁYW ({highImpactRecentNews.length})
              </span>
            </div>

            {highImpactRecentNews.length > 0 ? (
              <div className="space-y-2.5">
                {highImpactRecentNews.map((item) => (
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
            ) : (
              <p className="text-xs text-slate-400 text-center py-3">
                Brak wiadomości o krytycznym wpływie opublikowanych w ciągu ostatnich 5 godzin.
              </p>
            )}
          </div>

          {/* Główny Strumień Wiadomości */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Pełny Strumień Wydarzeń ({newsFeed.length})
              </h2>
            </div>

            <div className="space-y-3">
              {newsFeed.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedNews?.id === item.id
                      ? "bg-slate-800/80 border-emerald-500/80 ring-1 ring-emerald-500/50"
                      : item.isTrump
                      ? "bg-amber-950/10 border-amber-500/30 hover:border-amber-500/60"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.isTrump && (
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Trump Monitor
                        </span>
                      )}
                      {item.opportunity && (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Okazja: {item.opportunity.ticker}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-300">
                        {item.source}
                      </span>
                      <span className="text-xs text-slate-500">
                        • {item.timeAgo}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        item.impact === "BARDZO WYSOKI"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : item.impact === "WYSOKI"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
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
                      <span>Rozkład prawdopodobieństwa AI</span>
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
                    <div className="flex justify-between text-[10px] font-mono pt-1 text-slate-400">
                      <span className="text-emerald-400">
                        🟢 Wzrosty {item.bullishProb}%
                      </span>
                      <span className="text-slate-400">
                        ⚪ Neutralnie {item.neutralProb}%
                      </span>
                      <span className="text-rose-400">
                        🔴 Spadki {item.bearishProb}%
                      </span>
                    </div>
                  </div>

                  <button className="mt-3 w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    ANALIZUJ W PANELU AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prawy panel: Szczegóły analizy AI */}
        <section className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-20">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
              Panel Analizy AI
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

                {selectedNews.opportunity && (
                  <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase">
                          Sygnał Inwestycyjny
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {selectedNews.opportunity.ticker}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Szansa na sukces:
                      </span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        {selectedNews.opportunity.successProbability}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[9px]">
                          AKCJA
                        </span>
                        <span
                          className={`font-bold ${
                            selectedNews.opportunity.action.includes("KUPUJ")
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {selectedNews.opportunity.action}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[9px]">
                          HORYZONT
                        </span>
                        <span className="text-slate-200 font-bold">
                          {selectedNews.opportunity.horizon}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[9px]">
                          CEL (TP)
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {selectedNews.opportunity.targetPrice}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[9px]">
                          OBRONA (SL)
                        </span>
                        <span className="text-rose-400 font-bold">
                          {selectedNews.opportunity.stopLoss}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-normal italic bg-slate-950/40 p-2 rounded border border-emerald-500/10">
                      "{selectedNews.opportunity.reasoning}"
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Wpływ Krótkoterminowy
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    {selectedNews.analysisShort}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Perspektywa Długoterminowa
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    {selectedNews.analysisLong}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <Zap className="w-8 h-8 text-slate-700" />
                <p>
                  Kliknij na dowolne wydarzenie z listy, aby zobaczyć analizę oraz sygnały inwestycyjne AI.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}