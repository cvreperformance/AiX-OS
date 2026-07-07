const fs = require('fs');
const osintFile = fs.readFileSync('src/app/(site)/osint/page.tsx', 'utf8');
const resourcesFile = fs.readFileSync('src/app/(site)/resources/ResourcesClient.tsx', 'utf8');

let newContent = osintFile.replace('export default function OsintPage() {', `
export default function ResearchCenterPage() {
`);

newContent = newContent.replace('Centrul de Comandă OSINT', 'Research Center & OSINT');
newContent = newContent.replace('Market Intelligence', 'Research & Intelligence');

let resourcesROMatch = resourcesFile.match(/const resourcesRO = \[[\s\S]*?\];/)[0];
let resourcesEUMatch = resourcesFile.match(/const resourcesEU = \[[\s\S]*?\];/)[0];

newContent = newContent.replace('const osintCategories = [', `
  ${resourcesROMatch}
  ${resourcesEUMatch}

  const osintCategories = [
`);

newContent = newContent.replace('{/* Directory of Links */}', `
      {/* Directory of Links */}
      <section className="space-y-8 mb-16">
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
          <Database className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-light text-white">Registre Publice România</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesRO.map((res) => {
            const Icon = res.icon || Globe;
            return (
              <div key={res.title} className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded-full bg-zinc-950/20">
                      {res.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{res.title}</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-900/60 mt-4">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 font-semibold transition-colors">
                    Accesează Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-8 mb-16">
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
          <Globe className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-light text-white">Resurse & Date Uniunea Europeană</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesEU.map((res) => {
            const Icon = res.icon || Globe;
            return (
              <div key={res.title} className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded-full bg-zinc-950/20">
                      {res.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{res.title}</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed mt-2">{res.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-900/60 mt-4">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400/80 hover:text-blue-400 font-semibold transition-colors">
                    Accesează Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Directory of Links */}
`);

fs.writeFileSync('src/app/(site)/research/page.tsx', newContent);
console.log('Successfully merged resources and osint into research/page.tsx');
