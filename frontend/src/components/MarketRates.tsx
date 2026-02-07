import { useState, useEffect } from "react";
import { FaGem, FaSync, FaChartLine, FaCoins } from "react-icons/fa";

interface Rates {
  [key: string]: number;
}

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "NPR", name: "Nepali Rupee", symbol: "Rs" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

const UNITS = [
  { id: "oz", name: "Ounce", factor: 1 },
  { id: "g", name: "Gram", factor: 1 / 31.1035 },
  { id: "tola", name: "Tola", factor: 11.66 / 31.1035 },
];

const MarketRates = () => {
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("oz");

  const fetchRates = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
      );
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();

      const usdGold = 1 / data.usd.xau;
      const usdSilver = 1 / data.usd.xag;

      const newRates: Rates = {
        XAU_USD: usdGold,
        XAG_USD: usdSilver,
      };

      SUPPORTED_CURRENCIES.forEach((curr) => {
        if (curr.code !== "USD") {
          const conversion = data.usd[curr.code.toLowerCase()];
          if (conversion) {
            newRates[`XAU_${curr.code}`] = usdGold * conversion;
            newRates[`XAG_${curr.code}`] = usdSilver * conversion;
          }
        }
      });

      setRates(newRates);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setError("Market data temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const getPrice = (metal: "XAU" | "XAG", currency: string) => {
    const key = `${metal}_${currency}`;
    const basePrice = rates?.[key];
    if (!basePrice) return "---";

    const unitFactor = UNITS.find((u) => u.id === selectedUnit)?.factor || 1;
    const finalPrice = basePrice * unitFactor;

    return finalPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden font-sans w-full max-w-[320px] transform scale-[0.8] origin-top mx-auto">
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg p-2 shadow-sm text-amber-700">
            <FaChartLine className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Live Market Rates
            </h3>
            <p className="text-[10px] text-amber-200/60 font-medium">
              Pure Metal (24K)
            </p>
          </div>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className={`text-amber-200/60 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10 ${
            loading ? "animate-spin" : ""
          }`}
          title="Refresh Rates"
        >
          <FaSync size={12} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Unit Selection */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {UNITS.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(unit.id)}
              className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
                selectedUnit === unit.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              per {unit.name}
            </button>
          ))}
        </div>

        {/* Gold Section */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform">
            <FaCoins size={70} className="text-amber-500" />
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FaCoins className="text-amber-600 animate-bounce" />
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                Gold 24K (XAU)
              </span>
            </div>
            <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
              SPOT
            </span>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {getPrice("XAU", "USD")}
              </span>
              <span className="text-xs font-bold text-slate-500">USD</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/50">
              <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded">
                <span className="text-[9px] font-bold text-slate-400">NPR</span>
                <span className="text-[10px] font-bold text-slate-700">
                  {getPrice("XAU", "NPR")}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded">
                <span className="text-[9px] font-bold text-slate-400">EUR</span>
                <span className="text-[10px] font-bold text-slate-700">
                  {getPrice("XAU", "EUR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Silver Section */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
            <FaGem size={70} className="text-slate-400" />
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FaGem className="text-slate-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                Silver (XAG)
              </span>
            </div>
            <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
              SPOT
            </span>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {getPrice("XAG", "USD")}
              </span>
              <span className="text-xs font-bold text-slate-500">USD</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
              <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded">
                <span className="text-[9px] font-bold text-slate-400">NPR</span>
                <span className="text-[10px] font-bold text-slate-700">
                  {getPrice("XAG", "NPR")}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded">
                <span className="text-[9px] font-bold text-slate-400">EUR</span>
                <span className="text-[10px] font-bold text-slate-700">
                  {getPrice("XAG", "EUR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-[10px] text-red-600 font-semibold bg-red-50 p-2 rounded-md border border-red-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 px-1">
          <span className="text-[9px] font-medium text-slate-400 italic">
            * Pure Metal (24K) Spot Prices
          </span>
          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {lastUpdated || "Syncing..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketRates;
