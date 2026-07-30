import { RawEvent } from "../../session-pipeline/types";
import { KnowledgeExtractor, VisitorKnowledge } from "../types";

export class PropertyExtractor implements KnowledgeExtractor {
  public extract(events: RawEvent[], currentProfile: Partial<VisitorKnowledge>): Partial<VisitorKnowledge> {
    const propertyViews = events.filter((e) => e.event_type === "property_opened");
    
    const typesCount: Record<string, number> = {};
    const locationsCount: Record<string, number> = {};
    
    let priceMin = currentProfile.price_range_min ?? Infinity;
    let priceMax = currentProfile.price_range_max ?? -Infinity;
    let luxuryViews = 0;
    let residentialCount = 0;
    let commercialCount = 0;

    propertyViews.forEach((evt) => {
      const p = evt.payload || {};
      
      if (p.property_type) {
        typesCount[p.property_type] = (typesCount[p.property_type] || 0) + 1;
      }
      if (p.location) {
        locationsCount[p.location] = (locationsCount[p.location] || 0) + 1;
      }
      if (p.price != null) {
        const val = Number(p.price);
        if (val < priceMin) priceMin = val;
        if (val > priceMax) priceMax = val;
        if (val > 350000) luxuryViews++; // Threshold for luxury preference
      }

      // Infer category
      const type = (p.property_type || "").toLowerCase();
      if (type.includes("birou") || type.includes("commercial") || type.includes("spatiu") || type.includes("industrial")) {
        commercialCount++;
      } else {
        residentialCount++;
      }
    });

    // Merge locations
    const favoriteLocations = [...(currentProfile.favorite_locations || [])];
    Object.entries(locationsCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([loc]) => {
        if (!favoriteLocations.includes(loc)) favoriteLocations.push(loc);
      });

    // Merge types
    const favoriteTypes = [...(currentProfile.favorite_property_types || [])];
    Object.entries(typesCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([t]) => {
        if (!favoriteTypes.includes(t)) favoriteTypes.push(t);
      });

    // Resolve intent based on pages visited
    let intent: VisitorKnowledge["intent"] = currentProfile.intent || "undetermined";
    const pagesList = events.map(e => e.page.toLowerCase());
    const rentScore = pagesList.filter(p => p.includes("inchiri") || p.includes("rent")).length;
    const buyScore = pagesList.filter(p => p.includes("cumpar") || p.includes("buy") || p.includes("vinde") || p.includes("sell")).length;

    if (rentScore > buyScore) intent = "rental";
    else if (buyScore > rentScore) intent = "purchase";

    return {
      favorite_property_types: favoriteTypes.slice(0, 5),
      favorite_locations: favoriteLocations.slice(0, 5),
      price_range_min: priceMin === Infinity ? currentProfile.price_range_min || 0 : priceMin,
      price_range_max: priceMax === -Infinity ? currentProfile.price_range_max || 0 : priceMax,
      luxury_preference: luxuryViews > (propertyViews.length / 2) || (currentProfile.luxury_preference ?? false),
      interest_category: commercialCount > residentialCount ? "commercial" : "residential",
      intent,
    };
  }
}
