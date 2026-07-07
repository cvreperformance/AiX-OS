const fs = require('fs');

const networkContent = fs.readFileSync('src/app/(site)/network/page.tsx', 'utf8');
const wealthContent = fs.readFileSync('src/app/(site)/wealth/WealthClient.tsx', 'utf8');
const offMarketContent = fs.readFileSync('src/app/(site)/off-market/page.tsx', 'utf8');

const extractImports = (content) => {
  const imports = content.match(/import .* from .*;/g);
  return imports || [];
};

const extractConstants = (content) => {
  const parts = content.split(/export default function \w+\(\) {/);
  const importsAndConstants = parts[0].replace(/"use client";/g, '').replace(/import .* from .*;/g, '').trim();
  return importsAndConstants;
};

let imports = [...new Set([
  ...extractImports(networkContent),
  ...extractImports(wealthContent),
  ...extractImports(offMarketContent),
  'import { useState } from "react";'
])].filter(i => !i.includes('import { useState }')).join('\n');

const lucideMatch1 = networkContent.match(/import {([^}]+)} from "lucide-react";/);
const lucideMatch2 = wealthContent.match(/import {([^}]+)} from "lucide-react";/);
const lucideMatch3 = offMarketContent.match(/import {([^}]+)} from "lucide-react";/);

let allLucide = [];
if (lucideMatch1) allLucide.push(lucideMatch1[1]);
if (lucideMatch2) allLucide.push(lucideMatch2[1]);
if (lucideMatch3) allLucide.push(lucideMatch3[1]);

let lucideIcons = [...new Set(allLucide.join(',').split(',').map(i => i.trim()).filter(Boolean))];

imports = imports.replace(/import \{[^}]+\} from "lucide-react";/g, '');

let finalImports = `"use client";\n\nimport { useState, useEffect } from "react";\nimport { ${lucideIcons.join(', ')} } from "lucide-react";\n${imports}`;

let constants = extractConstants(networkContent) + '\n' + extractConstants(wealthContent) + '\n' + extractConstants(offMarketContent);

let networkBody = networkContent.replace(/export default function \w+\(\) {/, 'function NetworkTab() {').replace(/"use client";/g, '').replace(/import .* from .*;/g, '');
let wealthBody = wealthContent.replace(/export default function \w+\(\) {/, 'function WealthTab() {').replace(/"use client";/g, '').replace(/import .* from .*;/g, '');
let offMarketBody = offMarketContent.replace(/export default function \w+\(\) {/, 'function OffMarketTab() {').replace(/"use client";/g, '').replace(/import .* from .*;/g, '');

const stripConstants = (body) => body.replace(/^[\s\S]*?function /, 'function ');
networkBody = stripConstants(networkBody);
wealthBody = stripConstants(wealthBody);
offMarketBody = stripConstants(offMarketBody);

let finalFile = [
  finalImports,
  constants,
  networkBody,
  wealthBody,
  offMarketBody,
  "export default function PrivateWealthClient() {",
  "  const [activeTab, setActiveTab] = useState('wealth');",
  "  return (",
  "    <div className=\"mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-8 animate-in\">",
  "      <div className=\"flex justify-center border-b border-zinc-800 pb-4\">",
  "        <div className=\"flex gap-4\">",
  "          <button onClick={() => setActiveTab('wealth')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'wealth' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-900/50 text-zinc-400 hover:text-white'}`}>Wealth Manager</button>",
  "          <button onClick={() => setActiveTab('network')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'network' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-900/50 text-zinc-400 hover:text-white'}`}>Private Network</button>",
  "          <button onClick={() => setActiveTab('offmarket')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'offmarket' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-900/50 text-zinc-400 hover:text-white'}`}>Off-Market Deals</button>",
  "        </div>",
  "      </div>",
  "      <div>",
  "        {activeTab === 'wealth' && <WealthTab />}",
  "        {activeTab === 'network' && <NetworkTab />}",
  "        {activeTab === 'offmarket' && <OffMarketTab />}",
  "      </div>",
  "    </div>",
  "  );",
  "}"
].join('\n');

fs.mkdirSync('src/app/(site)/private-wealth', { recursive: true });
fs.writeFileSync('src/app/(site)/private-wealth/PrivateWealthClient.tsx', finalFile);
fs.writeFileSync('src/app/(site)/private-wealth/page.tsx', 'import type { Metadata } from "next";\nimport PrivateWealthClient from "./PrivateWealthClient";\n\nexport const metadata: Metadata = { title: "Private Wealth & Network | AiX OS" };\n\nexport default function PrivateWealthPage() { return <PrivateWealthClient />; }');

console.log("Merged");
