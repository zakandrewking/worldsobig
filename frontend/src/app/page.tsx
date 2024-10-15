// 3d maps
// https://developers.google.com/maps/documentation/javascript/3d-maps-getting-started

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  throw Error("Missing environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
}

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          padding: "2px",
          fontFamily: "monospace",
          textAlign: "center",
          width: "100%",
        }}
      >
        hello big world
      </div>
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
