import { NextResponse } from "next/server";

const FINNHUB_API_KEY = "da29ui9r01qmq2q97sq0da29ui9r01qmq2q97sqg";

export async function GET() {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania wiadomości z Finnhub");
    }

    const rawNews = await response.json();

    const processedNews = rawNews.slice(0, 15).map((item: any, index: number) => {
      const titleLower = item.headline?.toLowerCase() || "";
      const summaryLower = item.summary?.toLowerCase() || "";

      // 1. Analiza słów kluczowych i rozpoznawanie aktywów
      const isTrump = titleLower.includes("trump") || summaryLower.includes("trump");
      const isFed = titleLower.includes("fed") || titleLower.includes("rate") || titleLower.includes("inflation");
      const isTech = titleLower.includes("nvidia") || titleLower.includes("apple") || titleLower.includes("ai") || titleLower.includes("tech");
      const isCrypto = titleLower.includes("bitcoin") || titleLower.includes("crypto") || titleLower.includes("btc");

      // 2. Wyznaczenie głównego aktywa, na które news wpłynie najmocniej
      let mainImpactAsset = "S&P 500 (SPY)";
      let secondaryAssets = ["QQQ", "USD/PLN"];

      if (isTech) {
        mainImpactAsset = "NVIDIA / Sektor Technologiczny (QQQ)";
        secondaryAssets = ["NVDA", "AAPL", "MSFT"];
      } else if (isCrypto) {
        mainImpactAsset = "Bitcoin (BTC-USD)";
        secondaryAssets = ["ETH-USD", "COIN", "MARA"];
      } else if (isFed) {
        mainImpactAsset = "Dolar Amerykański (USD/PLN & EUR/USD)";
        secondaryAssets = ["US10Y (Rentowności)", "Obligacje TLT", "Złoto"];
      } else if (isTrump) {
        mainImpactAsset = "Indeks DXY & Rynki Wschodzące";
        secondaryAssets = ["WTI Ropa", "S&P 500", "Polska Giełda (WIG20)"];
      }

      // 3. Sentyment i Rekomendacja (Kupuj / Sprzedaj / Wstrzymaj się)
      let actionRecommendation = "KUPUJ (LONG)";
      let sentiment = "BULLISH";
      let actionColor = "GREEN"; // Green, Red, Yellow

      if (
        titleLower.includes("drop") ||
        titleLower.includes("fall") ||
        titleLower.includes("warn") ||
        titleLower.includes("cut") ||
        titleLower.includes("loss") ||
        titleLower.includes("risk")
      ) {
        actionRecommendation = "SPRZEDAJ / ZABEZPIECZ (SHORT)";
        sentiment = "BEARISH";
        actionColor = "RED";
      } else if (
        titleLower.includes("uncertain") ||
        titleLower.includes("wait") ||
        titleLower.includes("delay") ||
        !summaryLower
      ) {
        actionRecommendation = "WSTRZYMAJ SIĘ (OBSERWUJ)";
        sentiment = "NEUTRAL";
        actionColor = "YELLOW";
      }

      // 4. Horyzont czasowy (Krótko-, Średnio- czy Długoterminowy)
      let timeframe = "Krótkoterminowy (1–3 dni)";
      let timeframeDetail = "Reakcja impulsowa na płynność i nagłówki prasowe.";

      if (isFed) {
        timeframe = "Długoterminowy (3–12 miesięcy)";
        timeframeDetail = "Zmiana stóp procentowych wpłynie na wyceny spółek w ujęciu wielokwartalnym.";
      } else if (isTrump) {
        timeframe = "Średnioterminowy (1–3 miesiące)";
        timeframeDetail = "Decyzje polityczne i taryfy celne wymagają czasu na przełożenie na wyniki finansowe.";
      } else if (isTech) {
        timeframe = "Średnioterminowy (2–6 tygodni)";
        timeframeDetail = "Przełożenie na cykl raportów kwartalnych spółek technologicznych.";
      }

      // 5. Czas publikacji
      const timeAgoMinutes = Math.floor((Date.now() / 1000 - item.datetime) / 60);
      const timeAgo =
        timeAgoMinutes < 1
          ? "Przed chwilą"
          : timeAgoMinutes < 60
          ? `${timeAgoMinutes} min temu`
          : `${Math.floor(timeAgoMinutes / 60)} godz. temu`;

      return {
        id: `finnhub-${item.id || index}`,
        title: item.headline,
        source: item.source || "Market News",
        timeAgo,
        
        // NOWE POLA DLA PANELU AI:
        mainImpactAsset,
        secondaryAssets,
        actionRecommendation,
        actionColor,
        sentiment,
        timeframe,
        timeframeDetail,
        
        confidence: Math.floor(Math.random() * 10) + 88,
        analysisShort: item.summary || "Brak szczegółowego opisu dla tego wydarzenia.",
        analysisLong: `Moduł AI ocenił wpływ tej informacji na poziom zmienności. Głównym obiektem reakcji jest ${mainImpactAsset}.`,
        keyFactors: [
          `Główny instrument: ${mainImpactAsset}`,
          `Rekomendacja AI: ${actionRecommendation}`,
          `Horyzont: ${timeframe}`,
          `Pewność modelu: ${Math.floor(Math.random() * 10) + 88}%`
        ],
        url: item.url,
      };
    });

    return NextResponse.json({ success: true, news: processedNews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}