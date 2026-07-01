import { getProperties } from "@/lib/data";
import { PropertyCard } from "@/components/ui/PropertyCard";

export default async function ProprietatiPage() {
  const properties = await getProperties();

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {properties.map((property: any) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}