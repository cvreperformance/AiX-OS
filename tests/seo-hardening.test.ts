import { describe, it, expect } from "vitest";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import { canonical, buildPropertySchema } from "../src/lib/seo";
import fs from "fs";
import path from "path";

describe("SEO & Metadata Hardening Regression Suite", () => {
  it("robots.ts should disallow private routes and reference canonical sitemap.xml", async () => {
    const robotsObj = await robots();
    const rules = Array.isArray(robotsObj.rules) ? robotsObj.rules[0] : robotsObj.rules;

    expect(robotsObj.sitemap).toBe("https://os.cristianvaduva.com/sitemap.xml");
    expect(rules.disallow).toContain("/api/");
    expect(rules.disallow).toContain("/admin/");
    expect(rules.disallow).toContain("/dashboard/");
    expect(rules.disallow).toContain("/workspace/");
  });

  it("sitemap.ts should return valid public URLs and exclude admin/private/auth routes", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(5);

    const urls = entries.map((e) => e.url);

    // Should contain core public routes
    expect(urls).toContain("https://os.cristianvaduva.com");
    expect(urls).toContain("https://os.cristianvaduva.com/technology");
    expect(urls).toContain("https://os.cristianvaduva.com/proprietati");

    // Should NOT contain private/admin/api routes
    urls.forEach((url) => {
      expect(url).not.toMatch(/\/admin(\/|$)/);
      expect(url).not.toMatch(/\/dashboard(\/|$)/);
      expect(url).not.toMatch(/\/workspace(\/|$)/);
      expect(url).not.toMatch(/\/api(\/|$)/);
      expect(url).not.toContain("example.com");
    });
  });

  it("canonical helper should generate valid absolute production URLs", async () => {
    const url = await canonical("/technology");
    expect(url).toContain("/technology");
  });

  it("buildPropertySchema should generate valid Schema.org RealEstateListing JSON-LD", async () => {
    const schema = await buildPropertySchema({
      title: "Luxury Penthouse",
      description: "Exclusive penthouse in Bucharest",
      price: 500000,
      currency: "EUR",
      location: "Nord",
      city: "București",
      slug: "luxury-penthouse-nord",
      area_sqm: 180,
      image_url: "https://os.cristianvaduva.com/test.jpg",
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("RealEstateListing");
    expect(schema.name).toBe("Luxury Penthouse");
    expect(schema.offers.price).toBe(500000);
    expect(schema.offers.priceCurrency).toBe("EUR");
  });

  it("should have zero unintended example.com references in active src code", () => {
    const srcDir = path.resolve(__dirname, "../src");
    
    function scanDir(dir: string): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          if (!file.includes("__tests__")) {
            results = results.concat(scanDir(filePath));
          }
        } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
          const content = fs.readFileSync(filePath, "utf-8");
          if (content.includes("example.com")) {
            results.push(filePath);
          }
        }
      });
      return results;
    }

    const matches = scanDir(srcDir);
    expect(matches).toEqual([]);
  });
});
