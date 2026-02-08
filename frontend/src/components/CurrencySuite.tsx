import { useState, useEffect } from "react";
import { FaBars, FaExchangeAlt, FaCoins, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Rates {
  [key: string]: number;
}

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "United States Dollar", countryCode: "us" },
  { code: "AED", name: "United Arab Emirates Dirham", countryCode: "ae" },
  { code: "AFN", name: "Afghan Afghani", countryCode: "af" },
  { code: "ALL", name: "Albanian Lek", countryCode: "al" },
  { code: "AMD", name: "Armenian Dram", countryCode: "am" },
  { code: "ANG", name: "Netherlands Antillean Guilder", countryCode: "cw" },
  { code: "EUR", name: "Euro", countryCode: "eu" },
  { code: "GBP", name: "British Pound", countryCode: "gb" },
  { code: "NPR", name: "Nepali Rupee", countryCode: "np" },
  { code: "INR", name: "Indian Rupee", countryCode: "in" },
];

const UNIT_CONVERSIONS = {
  ounce: 1, // Reference is 1 Troy Ounce
  gram: 0.0321507, // 1 Gram = 0.0321507 Troy Ounces
  tola: 0.375, // 1 Tola = 0.375 Troy Ounces (Vedic/Nepal/India standard)
};

const CurrencySuite = () => {
  const [activeTab, setActiveTab] = useState<"market" | "converter" | "metal">(
    "market",
  );
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(1);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("NPR");
  const [metalUnit, setMetalUnit] = useState<"ounce" | "gram" | "tola">("tola");
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Auto-detect location and currency
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.currency) {
          // Force baseCurrency to be the visitor's local currency
          setBaseCurrency(data.currency);
          // Default target to USD for comparison if we are in a non-USD country
          setTargetCurrency(data.currency === "USD" ? "NPR" : "USD");
          setUserLocation(data.city + ", " + data.country_name);
        }
      } catch (err) {
        console.error("Location detection failed", err);
      }
    };
    detectLocation();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      // Switch to an API that provides XAU/XAG directly linked to USD
      const res = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`,
      );
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();
      // jsdelivr API structure is { date: "...", usd: { ...rates } }
      setRates(data.usd);
    } catch (err: any) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []); // Fetch once and use USD as common pivot

  const handleSwap = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  const getFlagUrl = (code: string) => {
    if (!code) return "";
    const currency = SUPPORTED_CURRENCIES.find(
      (c) => c.code.toUpperCase() === code.toUpperCase(),
    );
    const countryCode = currency?.countryCode || code.slice(0, 2).toLowerCase();
    return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
  };

  // Conversions using USD pivot
  const getConvertedAmount = (amt: number, from: string, to: string) => {
    if (!rates || !rates[from.toLowerCase()] || !rates[to.toLowerCase()])
      return "0.00";
    const inUSD = amt / rates[from.toLowerCase()];
    return (inUSD * rates[to.toLowerCase()]).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getMetalPrice = (symbol: "xau" | "xag") => {
    if (!rates || !rates[symbol] || !rates[baseCurrency.toLowerCase()])
      return 0;

    // jsdelivr API: 1 USD = X units of currency/metal
    // For xau: 1 USD = API_VALUE xau (Troy Ounces)
    // So 1 Troy Ounce = 1 / API_VALUE USD
    const priceUSDPerOunce = 1 / rates[symbol];

    // Convert USD to local currency (baseCurrency)
    // mid_rate = local_units / 1 USD
    const localUnitsPerUSD = rates[baseCurrency.toLowerCase()] || 1;
    const priceLocalPerOunce = priceUSDPerOunce * localUnitsPerUSD;

    // Apply unit conversion (unit is relative to 1 Troy Ounce)
    const conversionFactor = UNIT_CONVERSIONS[metalUnit];
    return priceLocalPerOunce * conversionFactor;
  };

  return (
    <div className="w-full max-w-[360px] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden font-sans border border-gray-200">
      {/* Blue Header */}
      <div className="bg-[#1565C0] px-4 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <FaBars className="text-white text-xl cursor-pointer" />
          <h1 className="text-white text-lg font-bold tracking-wide">
            Exchange Rates
          </h1>
        </div>
        {userLocation && (
          <div className="flex items-center gap-1.5 text-white/90 bg-white/10 px-2 py-1 rounded-full border border-white/20">
            <FaMapMarkerAlt size={10} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-tight max-w-[100px] truncate">
              {userLocation}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "market", label: "MARKET RATES" },
          { id: "converter", label: "CONVERTER" },
          { id: "metal", label: "METAL RATES" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-[10px] font-black tracking-widest transition-all relative ${
              activeTab === tab.id ? "text-[#1565C0]" : "text-gray-400"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1565C0]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[450px] relative">
        <AnimatePresence mode="wait">
          {activeTab === "market" && (
            <motion.div
              key="market"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto"
            >
              <div className="bg-gray-50/50 px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest grid grid-cols-12 gap-2 border-b border-gray-100">
                <span className="col-span-6">Currency</span>
                <span className="col-span-3 text-right">Buy</span>
                <span className="col-span-3 text-right">Sell</span>
              </div>
              {SUPPORTED_CURRENCIES.filter((c) => c.code !== baseCurrency).map(
                (curr) => {
                  // Calculate rates relative to the detected base currency (e.g., NPR)
                  // Mid rate: How many 'base' units per 1 'curr' unit?
                  // data is in USD based. mid = rates[base] / rates[curr]
                  const mid =
                    (rates?.[baseCurrency.toLowerCase()] || 0) /
                    (rates?.[curr.code.toLowerCase()] || 1);
                  const buy = mid * 0.998; // 0.2% spread
                  const sell = mid * 1.002;

                  return (
                    <div
                      key={curr.code}
                      className="px-5 py-4 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition-colors cursor-default"
                    >
                      <div className="col-span-6 flex items-center gap-4">
                        <img
                          src={getFlagUrl(curr.code)}
                          alt={curr.name}
                          className="w-8 h-5 shadow-sm border border-gray-100 rounded-[2px] object-cover"
                        />
                        <div>
                          <div className="text-sm font-black text-slate-700 leading-none mb-1">
                            {curr.code}
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 truncate max-w-[80px]">
                            {curr.name}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-sm font-black text-slate-600">
                          {loading ? "..." : buy.toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-sm font-black text-[#1565C0]">
                          {loading ? "..." : sell.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
              <div className="px-5 py-4 text-center">
                <button className="text-[10px] font-black text-[#1565C0] uppercase tracking-widest hover:underline">
                  View More &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "converter" && (
            <motion.div
              key="converter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-8 space-y-6"
            >
              <div className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Amount
                  </label>
                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-transparent text-3xl font-black text-gray-800 outline-none w-full"
                    />
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                      <img
                        src={getFlagUrl(baseCurrency)}
                        alt={baseCurrency}
                        className="w-8 h-5 object-contain"
                      />
                      <select
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value)}
                        className="text-sm font-black text-[#1565C0] bg-transparent outline-none cursor-pointer"
                      >
                        {SUPPORTED_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="relative py-2 flex justify-center">
                  <button
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-[#1565C0] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-10"
                  >
                    <FaExchangeAlt className="rotate-90" size={14} />
                  </button>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 -translate-y-1/2"></div>
                </div>

                <div className="bg-[#E3F2FD] p-5 rounded-2xl border border-[#BBDEFB]">
                  <label className="text-[10px] font-black text-[#1565C0] uppercase tracking-widest block mb-1">
                    Result
                  </label>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-3xl font-black text-gray-800">
                      {loading
                        ? "..."
                        : getConvertedAmount(
                            amount,
                            baseCurrency,
                            targetCurrency,
                          )}
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                      <img
                        src={getFlagUrl(targetCurrency)}
                        alt={targetCurrency}
                        className="w-8 h-5 object-contain"
                      />
                      <select
                        value={targetCurrency}
                        onChange={(e) => setTargetCurrency(e.target.value)}
                        className="text-sm font-black text-[#1565C0] bg-transparent outline-none cursor-pointer"
                      >
                        {SUPPORTED_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "metal" && (
            <motion.div
              key="metal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-6"
            >
              {/* Unit Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(["ounce", "gram", "tola"] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setMetalUnit(unit)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      metalUnit === unit
                        ? "bg-white text-[#1565C0] shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Gold Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <FaCoins className="text-6xl text-amber-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                        <FaCoins className="text-white text-sm" />
                      </div>
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                        Gold 24K (XAU)
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-800">
                        {loading
                          ? "..."
                          : getMetalPrice("xau").toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={getFlagUrl(baseCurrency)}
                          alt={baseCurrency}
                          className="w-8 h-5 object-contain"
                        />
                        <span className="text-xs font-bold text-amber-600">
                          {baseCurrency} per {metalUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Silver Card */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-3xl border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <FaCoins className="text-6xl text-slate-400" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center shadow-lg shadow-slate-200">
                        <FaCoins className="text-white text-sm" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Silver (XAG)
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-800">
                        {loading
                          ? "..."
                          : getMetalPrice("xag").toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={getFlagUrl(baseCurrency)}
                          alt={baseCurrency}
                          className="w-8 h-5 object-contain"
                        />
                        <span className="text-xs font-bold text-slate-500">
                          {baseCurrency} per {metalUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[9px] text-gray-400 font-bold italic text-center">
                  * Prices are calculated based on live USD market data and
                  mid-market exchange rates.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">
          Last Updated: {new Date().toLocaleTimeString()}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-gray-600">LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencySuite;
