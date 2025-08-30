import dayjs from "dayjs";

// const BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "https://YOUR_BACKEND/api";

export async function getEventsByDate(dateISO) {
//   const r = await fetch(`${BASE}/events?date=${dateISO}`);
//   if (!r.ok) throw new Error("Failed to load day events");
//   return r.json(); // 
  return [
      { "id": 1, "title": "Youth", "eventDate": "2025-06-02" },
  { "id": 2, "title": "Sunday Service", "eventDate": "2025-07-02" },
  { "id": 3, "title": "Prayer", "eventDate": "2025-08-15" }
  ];
}

export async function getEventsByRange(fromISO, toISO) {
//   const r = await fetch(`${BASE}/events?from=${fromISO}&to=${toISO}`);
//   if (!r.ok) throw new Error("Failed to load month events");
//   return r.json();
    return [
  { "id": 1, "title": "Youth", "eventDate": "2025-07-02" },
  { "id": 2, "title": "Sunday Service", "eventDate": "2025-07-02" },
  { "id": 3, "title": "Prayer", "eventDate": "2025-08-15" }
];
}

export function monthRange(anchorISO) {
  const d = dayjs(anchorISO);
  return {
    from: d.startOf("month").format("YYYY-MM-DD"),
    to: d.endOf("month").format("YYYY-MM-DD"),
  };
}
