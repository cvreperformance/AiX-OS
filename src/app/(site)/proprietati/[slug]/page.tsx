import { getProperty } from "@/lib/data";

export default async function PropertyPage({ params }: any) {
  const property = await getProperty(params.slug);

  if (!property) {
    return <div className="p-10 text-white">Property not found</div>;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold">
        {property.title}
      </h1>

      <p className="mt-4 text-gray-400">
        {property.description}
      </p>

      <div className="mt-6 text-amber-400 text-xl">
        €{property.price}
      </div>
    </div>
  );
}