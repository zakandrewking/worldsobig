import { Scope_One } from "next/font/google";

const scopeOne = Scope_One({ subsets: ["latin"], weight: "400" });

// 3d maps
// https://developers.google.com/maps/documentation/javascript/3d-maps-getting-started

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  throw Error("Missing environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
}

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <span
        className={scopeOne.className}
        style={{
          fontSize: "20px",
          lineHeight: "18px",
          padding: "4px",
          textAlign: "center",
          width: "100%",
          fontWeight: "bold",
          cursor: "all-scroll",
        }}
      >
        Hello World
      </span>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=32.6690781,-117.2456072&pitch=-60&heading=-120`}
        // src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Cabrillo+National+Monument,San+Diego+CA&maptype=satellite`}
      ></iframe>
    </div>
  );
}
