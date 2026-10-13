"use client";

import React, { useState, useEffect } from "react";
import { Plane, Search, Clock, MapPin, RefreshCw, AlertCircle, CheckCircle2, Navigation } from "lucide-react";

interface Flight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    iata: string;
    terminal?: string | null;
    gate?: string | null;
    scheduled: string;
  };
  arrival: {
    airport: string;
    iata: string;
    terminal?: string | null;
    gate?: string | null;
    scheduled: string;
  };
  airline: {
    name: string;
    iata: string;
  };
  flight: {
    number: string;
    iata: string;
  };
}

export function LiveFlightTracker() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flights");
      const json = await res.json();
      if (json?.data && Array.isArray(json.data)) {
        setFlights(json.data);
      }
    } catch (err) {
      console.error("Failed to load flights:", err);
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter((f) => {
    const matchesStatus =
      filterStatus === "all" || f.flight_status.toLowerCase() === filterStatus.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      f.flight.iata.toLowerCase().includes(query) ||
      f.airline.name.toLowerCase().includes(query) ||
      f.departure.airport.toLowerCase().includes(query) ||
      f.departure.iata.toLowerCase().includes(query) ||
      f.arrival.airport.toLowerCase().includes(query) ||
      f.arrival.iata.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return isoString.substring(11, 16) || "--:--";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-sky-100 text-sky-800 border-sky-200 animate-pulse";
      case "landed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "delayed":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "scheduled":
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <section className="max-w-[1536px] mx-auto px-4 w-full">
      <div className="bg-gradient-to-br from-[#001f3f] via-[#003366] to-[#004f9a] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-blue-900/50">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 font-bold text-xs uppercase tracking-wider mb-2 border border-sky-400/30">
              <Plane className="w-3.5 h-3.5" />
              Live Aviation Radar · IBNK Travel Services
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Real-Time Flight Tracker & Airport Schedules
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Track live commercial departures & arrivals across Mumbai (BOM), Delhi, Dubai, Singapore, and worldwide hubs powered by Aviationstack.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {lastUpdated && (
              <span className="text-xs text-white/60 font-mono hidden sm:inline">
                Updated: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchFlights}
              disabled={loading}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs font-bold flex items-center gap-2 text-white border border-white/15"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Radar
            </button>
          </div>
        </div>

        {/* Controls: Filter Pills & Search */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-5">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Flights" },
              { id: "scheduled", label: "Scheduled" },
              { id: "active", label: "In Flight" },
              { id: "landed", label: "Landed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterStatus === tab.id
                    ? "bg-[#FFC220] text-slate-950 shadow-sm"
                    : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px] sm:max-w-xs">
            <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flight (e.g. AI101, BOM, SIN)"
              className="w-full bg-white/10 text-white placeholder:text-white/50 pl-9 pr-4 py-2 rounded-full text-xs outline-none focus:ring-2 focus:ring-[#FFC220] border border-white/15"
            />
          </div>
        </div>

        {/* Flight Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 animate-pulse h-44"
              />
            ))
          ) : filteredFlights.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/70 bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-300 mb-2" />
              <p className="font-bold text-sm">No flights found matching your search</p>
              <p className="text-xs text-white/50 mt-1">Try searching by flight number or airport code like BOM, DEL, DXB, SQ.</p>
            </div>
          ) : (
            filteredFlights.slice(0, 9).map((f, idx) => (
              <div
                key={`${f.flight.iata}-${idx}`}
                className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all border border-slate-200/80 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Top: Airline + Flight No + Status */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1554D1]/10 text-[#1554D1] flex items-center justify-center font-black text-xs font-mono">
                        {f.airline.iata || "FL"}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                          {f.airline.name}
                        </h4>
                        <span className="text-[11px] font-mono font-black text-[#1554D1]">
                          {f.flight.iata}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        f.flight_status
                      )}`}
                    >
                      {f.flight_status}
                    </span>
                  </div>

                  {/* Route Timeline */}
                  <div className="grid grid-cols-3 items-center text-center my-3">
                    {/* Departure */}
                    <div className="text-left">
                      <span className="text-2xl font-black text-slate-900 font-mono tracking-tight block">
                        {f.departure.iata}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 block line-clamp-1" title={f.departure.airport}>
                        {f.departure.airport}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1554D1] mt-0.5 block">
                        {formatTime(f.departure.scheduled)}
                      </span>
                    </div>

                    {/* Plane Travel Icon & Progress Line */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <div className="w-full flex items-center justify-center relative">
                        <div className="h-0.5 bg-slate-200 w-full" />
                        <div className="absolute w-6 h-6 rounded-full bg-[#1554D1] text-white flex items-center justify-center shadow-xs">
                          <Plane className="w-3 h-3 rotate-90" />
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 mt-2">Direct Flight</span>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900 font-mono tracking-tight block">
                        {f.arrival.iata}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 block line-clamp-1" title={f.arrival.airport}>
                        {f.arrival.airport}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1554D1] mt-0.5 block">
                        {formatTime(f.arrival.scheduled)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer details: Gate & Terminal + Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    {f.departure.terminal && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                        Term: {f.departure.terminal}
                      </span>
                    )}
                    {f.departure.gate && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                        Gate: {f.departure.gate}
                      </span>
                    )}
                  </div>
                  <span className="text-[#1554D1] font-bold hover:underline cursor-pointer">
                    Flight Details →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Banner for IBNK Travel & Booking */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FFC220]" />
            <span>
              Book Flights, Hotels & Bus tickets at 0% convenience fee with <strong>IBNK Rewards</strong> at Wadala Centre, Mumbai.
            </span>
          </div>
          <a
            href="#travel-services"
            className="px-5 py-2 rounded-full bg-[#FFC220] hover:bg-[#e5ac18] text-slate-950 font-black text-xs transition-colors shrink-0 shadow-sm"
          >
            Explore IBNK Travel Hub
          </a>
        </div>
      </div>
    </section>
  );
}
