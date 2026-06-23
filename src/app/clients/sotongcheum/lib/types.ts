export interface RentalItem {
  id: string;
  name: string;
  engName: string;
  description: string;
  imageUrl: string;
  category: "sound" | "lighting" | "stage" | "video" | "tent" | "furniture";
}

export interface BusinessItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  imageUrl: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  category: string;
}
