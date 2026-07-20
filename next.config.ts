import type { NextConfig } from "next";

function getSupabaseImagePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    try {
      const hostname = new URL(url).hostname;
      patterns.push({
        protocol: "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      });
    } catch {
      // ignore invalid URL
    }
  }

  // Fallback for known project during local dev without env
  patterns.push({
    protocol: "https",
    hostname: "fcpsafjgjnecdlyqfcid.supabase.co",
    pathname: "/storage/v1/object/public/**",
  });

  return patterns;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: getSupabaseImagePatterns(),
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/anunturi",
        destination: "/proprietati",
        permanent: true,
      },
      {
        source: "/anunturi/:slug",
        destination: "/proprietati/:slug",
        permanent: true,
      },
      {
        source: "/stiri/liviu-dragnea-sus-ine-c-doi-lideri-psd-l-au-vizitat-nainte-de-ie-irea-la-guvernare-ce-le-a-spus-fostul-pre-edinte-al-social-democra-ilor",
        destination: "/stiri/liviu-dragnea-sustine-ca-doi-lideri-psd-l-au-vizitat-inainte-de-iesirea-la-guvernare-ce-le-a-spus-fostul-presedinte-al-social-democratilor",
        permanent: true,
      },
      {
        source: "/stiri/b-t-lia-de-2-800-000-000-de-euro-de-ce-fran-a-i-spania-se-nfrunt-n-cea-mai-scump-semifinal-a-cupei-mondiale-din-istorie",
        destination: "/stiri/batalia-de-2-800-000-000-de-euro-de-ce-franta-si-spania-se-infrunta-in-cea-mai-scumpa-semifinala-a-cupei-mondiale-din-istorie",
        permanent: true,
      },
      {
        source: "/stiri/termen-anaf-declara-iile-fiscale-pentru-aplicarea-ncetarea-aplic-rii-sistemului-tva-la-ncasare",
        destination: "/stiri/termen-anaf-declaratiile-fiscale-pentru-aplicarea-incetarea-aplicarii-sistemului-tva-la-incasare",
        permanent: true,
      },
      {
        source: "/stiri/c-nd-vrea-bce-s-lanseze-euro-digital-36-de-furnizori-de-pl-i-au-fost-selecta-i-pentru-faza-pilot-a-proiectului",
        destination: "/stiri/cand-vrea-bce-sa-lanseze-euro-digital-36-de-furnizori-de-plati-au-fost-selectati-pentru-faza-pilot-a-proiectului",
        permanent: true,
      },
      {
        source: "/stiri/vom-extrage-cantit-i-mari-ara-pe-al-c-rei-petrol-a-pus-ochii-trump",
        destination: "/stiri/vom-extrage-cantitati-mari-tara-pe-al-carei-petrol-a-pus-ochii-trump",
        permanent: true,
      },
      {
        source: "/stiri/unii-din-cei-mai-cunoscu-i-economi-ti-i-cercet-tori-din-lume-cer-guvernelor-s-ac-ioneze-acum-n-privin-a-ai",
        destination: "/stiri/unii-din-cei-mai-cunoscuti-economisti-si-cercetatori-din-lume-cer-guvernelor-sa-actioneze-acum-in-privinta-ai",
        permanent: true,
      },
      {
        source: "/stiri/mesajul-lui-nicu-or-dan-dup-vizita-la-paris-rom-nia-este-un-partener-activ-i-de-ncredere",
        destination: "/stiri/mesajul-lui-nicusor-dan-dupa-vizita-la-paris-romania-este-un-partener-activ-si-de-incredere",
        permanent: true,
      },
      {
        source: "/stiri/fran-a-spania-n-semifinal-la-cupa-mondial-2026-kylian-mbappe-i-lamine-yamal-fa-n-fa-de-la-22-00-surprizele-din-formula-de-start-a-francezilor",
        destination: "/stiri/franta-spania-in-semifinala-la-cupa-mondiala-2026-kylian-mbappe-si-lamine-yamal-fata-in-fata-de-la-22-00-surprizele-din-formula-de-start-a-francezilor",
        permanent: true,
      },
      {
        source: "/stiri/china-acuza-ii-grave-mpotriva-sua-la-onu-au-aruncat-regiunea-ntr-o-pr-pastie-periculoas",
        destination: "/stiri/china-acuzatii-grave-impotriva-sua-la-onu-au-aruncat-regiunea-intr-o-prapastie-periculoasa",
        permanent: true,
      },
      {
        source: "/stiri/un-avion-de-recunoa-tere-rusesc-interceptat-de-polonia-deasupra-m-rii-baltice",
        destination: "/stiri/un-avion-de-recunoastere-rusesc-interceptat-de-polonia-deasupra-marii-baltice",
        permanent: true,
      },
      {
        source: "/stiri/live-fran-a-spania-prima-semifinal-de-la-cm-2026-europenii-au-cucerit-dallasul-start-n-duelul-dintre-mbappe-i-yamal",
        destination: "/stiri/live-franta-spania-prima-semifinala-de-la-cm-2026-europenii-au-cucerit-dallasul-start-in-duelul-dintre-mbappe-si-yamal",
        permanent: true,
      },
      {
        source: "/stiri/interviu-secretomania-institu-ional-nu-protejeaz-securitatea-na-ional-guvernul-obligat-n-instan-s-comunice-informa-ii-despre-ajutoarele-date-ucrainei",
        destination: "/stiri/interviu-secretomania-institutionala-nu-protejeaza-securitatea-nationala-guvernul-obligat-in-instanta-sa-comunice-informatii-despre-ajutoarele-date-ucrainei",
        permanent: true,
      },
      {
        source: "/stiri/parchetul-european-condus-de-laura-kovesi-ancheteaz-firmele-unui-premier-din-ue",
        destination: "/stiri/parchetul-european-condus-de-laura-kovesi-ancheteaza-firmele-unui-premier-din-ue",
        permanent: true,
      },
      {
        source: "/stiri/trump-s-a-r-zg-ndit-i-nu-mai-impune-taxa-pentru-str-mtoarea-ormuz-ntr-un-anun-despre-blocada-total-a-spus-i-cu-ce-o-nlocuie-te",
        destination: "/stiri/trump-s-a-razgandit-si-nu-mai-impune-taxa-pentru-stramtoarea-ormuz-intr-un-anunt-despre-blocada-totala-a-spus-si-cu-ce-o-inlocuieste",
        permanent: true,
      },
      {
        source: "/stiri/misiune-spa-ial-ruso-american-eful-nasa-ajunge-la-baikonur-pentru-prima-dat-n-ultimii-8-ani",
        destination: "/stiri/misiune-spatiala-ruso-americana-seful-nasa-ajunge-la-baikonur-pentru-prima-data-in-ultimii-8-ani",
        permanent: true,
      },
      {
        source: "/stiri/doi-r-ni-i-grav-n-timpul-ultimei-curse-de-tauri-a-festivalului-san-fermin-din-pamplona",
        destination: "/stiri/doi-raniti-grav-in-timpul-ultimei-curse-de-tauri-a-festivalului-san-fermin-din-pamplona",
        permanent: true,
      },
      {
        source: "/stiri/ironii-din-pnl-la-adresa-matematicianului-grindeanu-confund-plus-cu-minus-i-compar-merele-cu-perele-cifrele-invocate",
        destination: "/stiri/ironii-din-pnl-la-adresa-matematicianului-grindeanu-confunda-plus-cu-minus-si-compara-merele-cu-perele-cifrele-invocate",
        permanent: true,
      },
      {
        source: "/stiri/cum-au-nchis-procurorii-bucure-teni-un-dosar-de-abuz-sexual-cu-apte-victime-ntre-13-i-19-ani",
        destination: "/stiri/cum-au-inchis-procurorii-bucuresteni-un-dosar-de-abuz-sexual-cu-sapte-victime-intre-13-si-19-ani",
        permanent: true,
      },
      {
        source: "/stiri/trump-amenin-c-va-ataca-n-iran-misteriosul-munte-al-t-rn-copului-o-lovitur-mare-i-frumoas-chiar-la-u-a-din-fa",
        destination: "/stiri/trump-ameninta-ca-va-ataca-in-iran-misteriosul-munte-al-tarnacopului-o-lovitura-mare-si-frumoasa-chiar-la-usa-din-fata",
        permanent: true,
      },
      {
        source: "/stiri/pedepsele-pentru-infrac-iuni-de-mediu-vor-ajunge-la-20-de-ani-de-nchisoare-ce-prevede-proiectul-ministerului-mediului",
        destination: "/stiri/pedepsele-pentru-infractiuni-de-mediu-vor-ajunge-la-20-de-ani-de-inchisoare-ce-prevede-proiectul-ministerului-mediului",
        permanent: true,
      },
      {
        source: "/stiri/japonia-recunoa-te-c-are-o-problem-dup-dezv-luirile-c-rusia-a-transformat-o-ntr-un-cuib-de-spioni",
        destination: "/stiri/japonia-recunoaste-ca-are-o-problema-dupa-dezvaluirile-ca-rusia-a-transformat-o-intr-un-cuib-de-spioni",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
