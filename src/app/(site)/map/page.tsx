"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/ui";
import {
  MapPin,
  Building,
  Briefcase,
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
  Globe,
  Plus,
  Minus,
  Layers,
  Plane,
  Heart,
  BookOpen,
  Anchor,
  HelpCircle,
  Activity,
  Star,
} from "lucide-react";
import Link from "next/link";
import { designSystem } from "@/styles/designSystem";

interface MapNode {
  id: string;
  type: "property" | "developer" | "project" | "airport" | "hotel" | "metro" | "school" | "hospital";
  title: string;
  location: string;
  city: "București" | "Dubai" | "Monaco";
  price?: string;
  x: number; // coordinate X
  y: number; // coordinate Y
  aixScore?: number;
  slug?: string;
  tags?: string[];
  image?: string;
  investmentLevel: "low" | "mid" | "high";
  clusterId?: string;
}

interface MapDisplayItem {
  isCluster: boolean;
  id: string;
  x: number;
  y: number;
  count?: number;
  children?: MapNode[];
  data?: MapNode;
}

const MAP_NODES: MapNode[] = [
  // București
  { id: "b1", type: "property", title: "Penthouse Floreasca Lake", location: "Floreasca", city: "București", price: "4.850.000 €", x: 42, y: 35, aixScore: 9.2, slug: "penthouse-floreasca-lake", tags: ["luxury", "lakeview"], image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80", investmentLevel: "high", clusterId: "cl-buc-north" },
  { id: "b2", type: "property", title: "Vilă Modernă Pipera", location: "Pipera", city: "București", price: "2.100.000 €", x: 55, y: 22, aixScore: 8.7, slug: "vila-premium-pipera", tags: ["sustainable", "swimming-pool"], image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80", investmentLevel: "mid", clusterId: "cl-buc-north" },
  { id: "b3", type: "developer", title: "One United Properties HQ", location: "Calea Floreasca", city: "București", x: 40, y: 38, aixScore: 9.1, slug: "one-united-properties", investmentLevel: "high", clusterId: "cl-buc-north" },
  { id: "b4", type: "project", title: "One Lake District", location: "Sector 2", city: "București", price: "320.000 €", x: 48, y: 45, aixScore: 8.9, investmentLevel: "low", clusterId: "cl-buc-north" },
  { id: "b5", type: "airport", title: "Aeroportul Otopeni (OTP)", location: "Otopeni", city: "București", x: 45, y: 10, investmentLevel: "high" },
  { id: "b6", type: "hotel", title: "The Ritz-Carlton Bucharest", location: "Centru", city: "București", x: 38, y: 65, investmentLevel: "high" },
  { id: "b7", type: "metro", title: "Statia Metro Aurel Vlaicu", location: "Aviației", city: "București", x: 43, y: 32, investmentLevel: "low" },
  { id: "b8", type: "school", title: "British School of Bucharest", location: "Pipera", city: "București", x: 58, y: 15, investmentLevel: "mid" },
  { id: "b9", type: "hospital", title: "Spitalul Clinic Floreasca", location: "Floreasca", city: "București", x: 35, y: 48, investmentLevel: "high" },

  // Dubai
  { id: "d1", type: "property", title: "Marina Glass Penthouse", location: "Dubai Marina", city: "Dubai", price: "6.200.000 $", x: 28, y: 62, aixScore: 9.3, tags: ["beachfront", "highrise"], image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80", investmentLevel: "high", clusterId: "cl-dxb-marina" },
  { id: "d2", type: "developer", title: "Emaar Properties HQ", location: "Downtown Dubai", city: "Dubai", x: 50, y: 45, aixScore: 9.5, slug: "emaar-properties", investmentLevel: "high", clusterId: "cl-dxb-downtown" },
  { id: "d3", type: "project", title: "Burj Crown Residences", location: "Downtown Dubai", city: "Dubai", price: "850.000 $", x: 53, y: 42, aixScore: 9.0, investmentLevel: "mid", clusterId: "cl-dxb-downtown" },
  { id: "d4", type: "airport", title: "Dubai International Airport (DXB)", location: "Deira", city: "Dubai", x: 75, y: 25, investmentLevel: "high" },
  { id: "d5", type: "hotel", title: "Burj Al Arab Jumeirah", location: "Jumeirah", city: "Dubai", x: 42, y: 55, investmentLevel: "high" },
  { id: "d6", type: "metro", title: "Burj Khalifa Metro Station", location: "Downtown", city: "Dubai", x: 48, y: 47, investmentLevel: "low" },
  { id: "d7", type: "school", title: "Dubai International Academy", location: "Emirates Hills", city: "Dubai", x: 25, y: 68, investmentLevel: "high" },
  { id: "d8", type: "hospital", title: "Dubai Hospital", location: "Al Baraha", city: "Dubai", x: 70, y: 20, investmentLevel: "high" },

  // Monaco
  { id: "m1", type: "property", title: "Tour Odeon Sky Penthouse", location: "Monte-Carlo", city: "Monaco", price: "24.000.000 €", x: 62, y: 32, aixScore: 9.8, tags: ["royal", "sea-view"], image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80", investmentLevel: "high", clusterId: "cl-mc-odeon" },
  { id: "m2", type: "developer", title: "Pastor Group Monaco", location: "Monte-Carlo", city: "Monaco", x: 55, y: 40, aixScore: 9.7, slug: "pastor-group", investmentLevel: "high" },
  { id: "m3", type: "airport", title: "Heliport de Monaco (MCM)", location: "Fontvieille", city: "Monaco", x: 20, y: 70, investmentLevel: "high" },
  { id: "m4", type: "hotel", title: "Hotel de Paris Monte-Carlo", location: "Casino Square", city: "Monaco", x: 50, y: 48, investmentLevel: "high" },
  { id: "m5", type: "school", title: "International School of Monaco", location: "Port Hercule", city: "Monaco", x: 40, y: 55, investmentLevel: "high" },
  { id: "m6", type: "hospital", title: "Princess Grace Hospital Centre", location: "Les Moneghetti", city: "Monaco", x: 35, y: 38, investmentLevel: "high" },
];

const CITY_COORDS = {
  București: { lat: "44.4396° N", lng: "26.1024° E" },
  Dubai: { lat: "25.2048° N", lng: "55.2708° E" },
  Monaco: { lat: "43.7384° N", lng: "7.4246° E" },
};

export default function MapExperiencePage() {
  const [selectedCity, setSelectedCity] = useState<"București" | "Dubai" | "Monaco">("București");
  
  // Layer visibility state toggles
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    property: true,
    developer: true,
    project: true,
    airport: true,
    hotel: true,
    metro: true,
    school: true,
    hospital: true,
  });

  const [investmentFilter, setInvestmentFilter] = useState<"all" | "low" | "mid" | "high">("all");
  const [isClustered, setIsClustered] = useState(true);
  const [activeNode, setActiveNode] = useState<MapNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [radarAngle, setRadarAngle] = useState(0);

  // Radar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const toggleLayer = (layer: string) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const filteredNodes = useMemo(() => {
    return MAP_NODES.filter((node) => {
      if (node.city !== selectedCity) return false;
      if (!visibleLayers[node.type]) return false;
      if (investmentFilter !== "all" && node.investmentLevel !== investmentFilter) return false;
      return true;
    });
  }, [selectedCity, visibleLayers, investmentFilter]);

  // Compute simulated clusters
  const mapDisplayItems: MapDisplayItem[] = useMemo(() => {
    if (!isClustered) return filteredNodes.map(n => ({ isCluster: false, id: n.id, x: n.x, y: n.y, data: n }));

    const clusters: Record<string, MapNode[]> = {};
    const unclustered: MapNode[] = [];

    filteredNodes.forEach(node => {
      if (node.clusterId) {
        if (!clusters[node.clusterId]) clusters[node.clusterId] = [];
        clusters[node.clusterId].push(node);
      } else {
        unclustered.push(node);
      }
    });

    const displayItems: MapDisplayItem[] = [];

    // Add clusters containing more than 1 item
    Object.entries(clusters).forEach(([id, items]) => {
      if (items.length > 1) {
        const avgX = items.reduce((sum, item) => sum + item.x, 0) / items.length;
        const avgY = items.reduce((sum, item) => sum + item.y, 0) / items.length;
        displayItems.push({
          isCluster: true,
          id,
          x: avgX,
          y: avgY,
          count: items.length,
          children: items,
        });
      } else {
        // Only 1 item in clusterId, keep as unclustered pin
        items.forEach((item) => {
          displayItems.push({
            isCluster: false,
            id: item.id,
            x: item.x,
            y: item.y,
            data: item,
          });
        });
      }
    });

    // Add remaining unclustered
    unclustered.forEach(item => {
      displayItems.push({
        isCluster: false,
        id: item.id,
        x: item.x,
        y: item.y,
        data: item,
      });
    });

    return displayItems;
  }, [filteredNodes, isClustered]);

  const layerTypes = [
    { key: "property", label: "Properties", icon: Building, color: "text-amber-500" },
    { key: "developer", label: "Developers", icon: Compass, color: "text-amber-400" },
    { key: "project", label: "Projects", icon: Sparkles, color: "text-sky-400" },
    { key: "airport", label: "Airports", icon: Plane, color: "text-blue-500" },
    { key: "hotel", label: "Luxury Hotels", icon: Star, color: "text-amber-300" },
    { key: "metro", label: "Metro", icon: Activity, color: "text-purple-400" },
    { key: "school", label: "Schools", icon: BookOpen, color: "text-emerald-400" },
    { key: "hospital", label: "Hospitals", icon: Heart, color: "text-red-400" },
  ];

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in ${isFullscreen ? "fixed inset-0 bg-[#060606] z-[60] overflow-y-auto p-4 sm:p-8" : ""}`}>
      
      {/* Header Info */}
      <div className="flex justify-between items-start gap-4">
        <PageHeader
          badge="GIS Spatial Terminal"
          title={`Hartă GIS Interactivă · ${selectedCity}`}
          subtitle="Vizualizarea activelor imobiliare de lux, dezvoltatorilor, instituțiilor academice și rețelelor de transport în capitalele financiare."
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl border border-zinc-850 p-3 bg-zinc-950/60 text-zinc-400 hover:text-white transition-colors"
            title={isFullscreen ? "Minimizează" : "Maximizează Hartă"}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-wrap gap-2.5 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-850 justify-center max-w-md mx-auto">
        {(["București", "Dubai", "Monaco"] as const).map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedCity(city);
              setActiveNode(null);
            }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedCity === city
                ? "bg-amber-500 text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Main Map Visual Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Map Grid */}
        <div className="lg:col-span-8 rounded-3xl border border-zinc-800 bg-[#040404] p-4 relative overflow-hidden min-h-[320px] sm:min-h-[420px] lg:h-[540px] shadow-2xl flex flex-col justify-between">
          {/* Repeating Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(251, 191, 36, 0.02) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px, 40px 40px, 40px 40px",
            }}
          />

          {/* Golden Radar Lines & Concentric Target Circles */}
          <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full object-cover select-none opacity-20 pointer-events-none">
            <circle cx="500" cy="300" r="100" fill="none" stroke="rgba(251,191,36,0.1)" strokeWidth="1" />
            <circle cx="500" cy="300" r="220" fill="none" stroke="rgba(251,191,36,0.06)" strokeWidth="0.75" />
            <circle cx="500" cy="300" r="340" fill="none" stroke="rgba(251,191,36,0.03)" strokeWidth="0.5" strokeDasharray="6 6" />
            <line
              x1="500"
              y1="300"
              x2={500 + 500 * Math.cos((radarAngle * Math.PI) / 180)}
              y2={300 + 500 * Math.sin((radarAngle * Math.PI) / 180)}
              stroke="rgba(251, 191, 36, 0.07)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Coordinate ticker labels */}
          <div className="absolute top-4 inset-x-4 flex justify-between text-[8px] font-mono text-zinc-650 pointer-events-none select-none">
            <span>LNG: {CITY_COORDS[selectedCity].lng}</span>
            <span>LAT: {CITY_COORDS[selectedCity].lat}</span>
          </div>

          {/* Interactive Pins / Clusters */}
          {mapDisplayItems.map((item) => {
            if (item.isCluster) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsClustered(false);
                    if (item.children && item.children.length > 0) {
                      setActiveNode(item.children[0]);
                    }
                  }}
                  className="absolute transition-all duration-300 z-10"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="absolute inset-0 rounded-full bg-amber-500/20 scale-150 animate-ping" />
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-amber-500 text-black border border-amber-400 font-bold text-xs font-mono shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
                    {item.count}
                  </div>
                </button>
              );
            }

            const node = item.data;
            if (!node) return null;
            const isSelected = activeNode?.id === node.id;
            const itemTypeInfo = layerTypes.find(l => l.key === node.type);
            const Icon = itemTypeInfo?.icon || Building;

            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node)}
                className="absolute transition-all duration-300 z-10"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) ${isSelected ? "scale(1.2)" : "scale(1)"}`,
                }}
              >
                <div className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-300 ${
                  isSelected ? "bg-black border-amber-500 shadow-lg shadow-amber-500/25 text-amber-400" : "bg-[#0b0b0b] border-zinc-850 text-zinc-400 hover:text-white"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
              </button>
            );
          })}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
            <button
              onClick={() => setIsClustered(!isClustered)}
              className={`px-3 py-1.5 rounded-xl border text-[10px] uppercase font-mono tracking-wider transition-all ${
                isClustered ? "bg-amber-500 text-black border-amber-400 font-bold" : "bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:text-white"
              }`}
            >
              Cluster
            </button>
          </div>
        </div>

        {/* Right Column: Layer Toggles & Preview Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Layer Checks */}
          <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-4`}>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-amber-500/85" />
              Straturi active (Layers)
            </h3>
            
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {layerTypes.map((t) => {
                const isActive = visibleLayers[t.key];
                return (
                  <button
                    key={t.key}
                    onClick={() => toggleLayer(t.key)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-xs font-semibold ${
                      isActive
                        ? "bg-zinc-950 text-white border-zinc-700 shadow-md"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <t.icon className={`h-4 w-4 ${isActive ? t.color : "text-zinc-650"}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Investment Level Filter */}
          <div className={`p-4 rounded-2xl ${designSystem.glass} flex items-center justify-between gap-2`}>
            <span className="text-[10px] uppercase tracking-wider text-zinc-550 font-semibold font-mono">Buget Tier:</span>
            <div className="flex gap-1.5">
              {[
                { key: "all", label: "All" },
                { key: "low", label: "<500k" },
                { key: "mid", label: "500k-1.5M" },
                { key: "high", label: "1.5M+" },
              ].map((b) => (
                <button
                  key={b.key}
                  onClick={() => setInvestmentFilter(b.key as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    investmentFilter === b.key
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Active Card */}
          {activeNode ? (
            <div className={`p-5 rounded-3xl ${designSystem.glassSolid} space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[8.5px] uppercase tracking-widest text-amber-500 font-mono font-bold">
                    {activeNode.type}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-1 group-hover:text-amber-400 transition-colors">
                    {activeNode.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-650" />
                    {activeNode.location}
                  </p>
                </div>
                {activeNode.aixScore && (
                  <div className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 px-2 py-1 rounded-lg text-amber-400 font-mono text-[9px] font-bold">
                    Score: {activeNode.aixScore}
                  </div>
                )}
              </div>

              {activeNode.image && (
                <div className="h-32 w-full overflow-hidden rounded-xl bg-zinc-900">
                  <img
                    src={activeNode.image}
                    alt={activeNode.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {activeNode.price && (
                <div className="pt-3 border-t border-zinc-900/60 flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valoare estimată</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{activeNode.price}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                {activeNode.slug ? (
                  <Link
                    href={`/${activeNode.type === "developer" ? "dezvoltatori" : "proprietati"}/${activeNode.slug}`}
                    className="flex-1 text-center py-2.5 rounded-xl bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Detalii Complete
                  </Link>
                ) : (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                    className="flex-1 text-center py-2.5 rounded-xl bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Informații Suplimentare
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-550 flex flex-col items-center justify-center gap-2 min-h-[140px] rounded-3xl">
              <Layers className="h-6 w-6 text-zinc-650 animate-pulse" />
              <span>Selectați un pin pe hartă pentru a deschide analiza spațială a activului.</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
