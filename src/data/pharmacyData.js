// Bangladeshi Pharmacy Directory & Stock Availability

export const PHARMACIES = [
  {
    id: "ph-1",
    name: "Lazz Pharma (Dhanmondi Branch)",
    area: "Dhanmondi, Dhaka",
    address: "House 28, Road 7, Dhanmondi, Dhaka-1205",
    phone: "+880 1711-223344",
    openHours: "24 Hours Open",
    distanceKm: 1.2,
    rating: 4.8,
    homeDelivery: true,
    discountPercent: 5,
    inventory: {
      "Napa Extra": { stock: "In Stock (350+ units)", status: "available", price: 3.0 },
      "Seclo 20": { stock: "In Stock (500+ units)", status: "available", price: 6.0 },
      "Monas 10": { stock: "In Stock (120 units)", status: "available", price: 16.0 },
      "Maxpro 20": { stock: "In Stock (400 units)", status: "available", price: 8.0 },
      "Azithrocin 500": { stock: "Low Stock (14 units)", status: "low", price: 35.0 },
      "Fexo 120": { stock: "In Stock (280 units)", status: "available", price: 9.0 },
      "Bizoran 5/20": { stock: "In Stock (95 units)", status: "available", price: 14.0 },
      "Compathik 500": { stock: "In Stock (210 units)", status: "available", price: 5.5 },
      "Ceevit": { stock: "In Stock (600 units)", status: "available", price: 2.25 },
      "Ace Plus": { stock: "In Stock (300 units)", status: "available", price: 3.0 }
    }
  },
  {
    id: "ph-2",
    name: "Tamanna Pharmacy (Gulshan 2)",
    area: "Gulshan, Dhaka",
    address: "Plot 12, Block NW(J), Gulshan-2, Dhaka-1212",
    phone: "+880 1819-998877",
    openHours: "8:00 AM - 12:00 AM",
    distanceKm: 3.8,
    rating: 4.7,
    homeDelivery: true,
    discountPercent: 7,
    inventory: {
      "Napa Extra": { stock: "Out of Stock", status: "out_of_stock", price: 3.0, substitute: "Ace Plus" },
      "Seclo 20": { stock: "In Stock (220 units)", status: "available", price: 6.0 },
      "Monas 10": { stock: "In Stock (85 units)", status: "available", price: 16.0 },
      "Maxpro 20": { stock: "In Stock (150 units)", status: "available", price: 8.0 },
      "Azithrocin 500": { stock: "In Stock (60 units)", status: "available", price: 35.0 },
      "Fexo 120": { stock: "In Stock (140 units)", status: "available", price: 9.0 },
      "Bizoran 5/20": { stock: "Low Stock (8 units)", status: "low", price: 14.0 },
      "Compathik 500": { stock: "In Stock (110 units)", status: "available", price: 5.5 },
      "Ceevit": { stock: "In Stock (400 units)", status: "available", price: 2.25 },
      "Ace Plus": { stock: "In Stock (500 units)", status: "available", price: 3.0 }
    }
  },
  {
    id: "ph-3",
    name: "Arogga Express Hub (Mirpur 10)",
    area: "Mirpur, Dhaka",
    address: "Section 10, Roundabout Plaza, Mirpur, Dhaka-1216",
    phone: "+880 1312-345678",
    openHours: "24 Hours Online Delivery",
    distanceKm: 2.5,
    rating: 4.9,
    homeDelivery: true,
    discountPercent: 10,
    inventory: {
      "Napa Extra": { stock: "In Stock (800+ units)", status: "available", price: 2.85 },
      "Seclo 20": { stock: "In Stock (600+ units)", status: "available", price: 5.70 },
      "Monas 10": { stock: "In Stock (350 units)", status: "available", price: 15.20 },
      "Maxpro 20": { stock: "In Stock (500 units)", status: "available", price: 7.60 },
      "Azithrocin 500": { stock: "In Stock (120 units)", status: "available", price: 33.25 },
      "Fexo 120": { stock: "In Stock (400 units)", status: "available", price: 8.55 },
      "Bizoran 5/20": { stock: "In Stock (200 units)", status: "available", price: 13.30 },
      "Compathik 500": { stock: "In Stock (300 units)", status: "available", price: 5.20 },
      "Ceevit": { stock: "In Stock (1000 units)", status: "available", price: 2.10 },
      "Ace Plus": { stock: "In Stock (450 units)", status: "available", price: 2.85 }
    }
  },
  {
    id: "ph-4",
    name: "Popular Model Pharmacy (Uttara)",
    area: "Uttara, Dhaka",
    address: "Sector 7, Main Road, Uttara, Dhaka-1230",
    phone: "+880 1912-776655",
    openHours: "7:00 AM - 11:30 PM",
    distanceKm: 6.4,
    rating: 4.6,
    homeDelivery: false,
    discountPercent: 4,
    inventory: {
      "Napa Extra": { stock: "In Stock (150 units)", status: "available", price: 3.0 },
      "Seclo 20": { stock: "Low Stock (12 units)", status: "low", price: 6.0 },
      "Monas 10": { stock: "Out of Stock", status: "out_of_stock", price: 16.0, substitute: "Montene 10" },
      "Maxpro 20": { stock: "In Stock (90 units)", status: "available", price: 8.0 },
      "Azithrocin 500": { stock: "Out of Stock", status: "out_of_stock", price: 35.0, substitute: "Zimax 500" },
      "Fexo 120": { stock: "In Stock (110 units)", status: "available", price: 9.0 },
      "Bizoran 5/20": { stock: "In Stock (45 units)", status: "available", price: 14.0 },
      "Compathik 500": { stock: "In Stock (80 units)", status: "available", price: 5.5 },
      "Ceevit": { stock: "In Stock (300 units)", status: "available", price: 2.25 },
      "Ace Plus": { stock: "In Stock (120 units)", status: "available", price: 3.0 }
    }
  }
];
