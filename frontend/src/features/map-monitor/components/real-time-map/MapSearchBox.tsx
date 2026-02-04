import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, MapPin } from "lucide-react";
import { useMap } from "react-leaflet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Interface kết quả từ Nominatim
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const MapSearchBox = () => {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search để tránh spam API
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          // Gọi API OpenStreetMap (Miễn phí)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn`,
          );
          const data = await response.json();
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500); // Đợi 500ms sau khi gõ xong mới search

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    // Bay đến vị trí đã chọn
    map.flyTo([lat, lng], 16, { duration: 1.5 });

    // Reset
    setShowResults(false);
    setQuery(item.display_name.split(",")[0]); // Chỉ hiện tên ngắn gọn
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <div className="relative group">
        {/* Input Box */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/50 transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:scale-105">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm địa điểm, đường..."
            className="pl-10 pr-10 h-10 bg-transparent border-none shadow-none focus-visible:ring-0 rounded-full text-sm font-medium placeholder:font-normal"
          />

          {isLoading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
          ) : (
            query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="h-3 w-3" />
              </button>
            )
          )}
        </div>

        {/* Dropdown Results */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {results.map((item) => (
                <button
                  key={item.place_id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-start gap-3 transition-colors border-b last:border-0 border-gray-50"
                >
                  <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-600 rounded-full shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">
                      {item.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {item.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-3 py-1.5 bg-gray-50 text-[10px] text-gray-400 text-center border-t">
              Powered by OpenStreetMap
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSearchBox;
