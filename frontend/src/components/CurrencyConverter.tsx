import { useState, useEffect } from "react";
import { FaExchangeAlt, FaSync } from "react-icons/fa";

interface Rates {
  [key: string]: number;
}

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", countryCode: "us", symbol: "$" },
  { code: "EUR", name: "Euro", countryCode: "eu", symbol: "€" },
  { code: "GBP", name: "British Pound", countryCode: "gb", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", countryCode: "ca", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", countryCode: "au", symbol: "A$" },
  { code: "AED", name: "UAE Dirham", countryCode: "ae", symbol: "د.إ" },
  { code: "JPY", name: "Japanese Yen", countryCode: "jp", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", countryCode: "sg", symbol: "S$" },
  { code: "NPR", name: "Nepali Rupee", countryCode: "np", symbol: "Rs" },
  { code: "INR", name: "Indian Rupee", countryCode: "in", symbol: "₹" },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchRates = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${baseCurrency}`,
      );
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();
      setRates(data.rates);
      setLastUpdated(
        new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (err: any) {
      console.error(err);
      setError("Service Unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  const handleSwap = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  const getFlagUrl = (code: string) => {
    const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    return currency
      ? `https://flagcdn.com/w80/${currency.countryCode}.png`
      : "";
  };

  const convertedAmount =
    rates && rates[targetCurrency]
      ? (amount * rates[targetCurrency]).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden font-sans w-full max-w-[320px] transform scale-[0.8] origin-top mx-auto">
      {/* Header */}
      <div className="bg-[#001f3f] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg p-2 shadow-sm">
            <FaExchangeAlt className="text-[#001f3f] text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Currency Exchange
            </h3>
            <p className="text-[10px] text-blue-200/60 font-medium">
              Official Rates
            </p>
          </div>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className={`text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10 ${
            loading ? "animate-spin" : "active:rotate-180"
          }`}
          title="Refresh Rates"
        >
          <FaSync size={12} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Input */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Amount
          </label>
          <div className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-6 h-4 flex items-center justify-center">
              <img
                src={getFlagUrl(baseCurrency)}
                alt={baseCurrency}
                className="w-full h-full object-contain"
              />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-md pr-4 pl-10 py-2.5 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none placeholder-slate-300"
              placeholder="1000"
            />
          </div>
        </div>

        {/* Currency Selectors */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          {/* Base Currency */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              From
            </label>
            <div className="relative bg-white border border-slate-300 rounded-md hover:border-slate-400 transition-colors">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-6 h-4 flex items-center justify-center">
                <img
                  src={getFlagUrl(baseCurrency)}
                  alt={baseCurrency}
                  className="w-full h-full object-contain"
                />
              </div>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full h-10 pl-10 pr-6 text-sm font-semibold text-slate-700 bg-transparent outline-none appearance-none cursor-pointer relative z-0"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-500 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all border border-slate-200 mb-[1px]"
            title="Swap Currencies"
          >
            <FaExchangeAlt size={10} />
          </button>

          {/* Target Currency */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              To
            </label>
            <div className="relative bg-white border border-slate-300 rounded-md hover:border-slate-400 transition-colors">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-6 h-4 flex items-center justify-center">
                <img
                  src={getFlagUrl(targetCurrency)}
                  alt={targetCurrency}
                  className="w-full h-full object-contain"
                />
              </div>
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="w-full h-10 pl-10 pr-6 text-sm font-semibold text-slate-700 bg-transparent outline-none appearance-none cursor-pointer relative z-0"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-500 pointer-events-none">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-slate-50 rounded-md p-4 border border-slate-200/50">
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Estimated Value
            </p>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              Live Rate
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-slate-900 tracking-tight">
              {loading ? (
                <span className="text-slate-300 animate-pulse">---</span>
              ) : (
                convertedAmount
              )}
            </h4>
            <span className="text-sm font-semibold text-slate-500">
              {targetCurrency}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center gap-2 border-t border-slate-200/50 pt-2">
            <span>Exchange:</span>
            <div className="flex items-center gap-1">
              <img
                src={getFlagUrl(baseCurrency)}
                alt={baseCurrency}
                className="w-4 h-3 object-contain"
              />
              <span className="text-slate-600 font-bold">1 {baseCurrency}</span>
            </div>
            <span>=</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-600 font-bold">
                {rates ? rates[targetCurrency]?.toFixed(4) : "..."}{" "}
                {targetCurrency}
              </span>
              <img
                src={getFlagUrl(targetCurrency)}
                alt={targetCurrency}
                className="w-4 h-3 object-contain"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-[10px] text-red-600 font-semibold bg-red-50 p-2 rounded-md border border-red-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            {error}
          </div>
        )}

        <div className="flex justify-center items-center pt-2">
          <span className="text-[10px] font-medium text-slate-400">
            {lastUpdated || "Syncing..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
