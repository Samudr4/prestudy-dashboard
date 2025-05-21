
import type { DateRange } from "react-day-picker";
import { Ticket, CheckCircle2, Users, XCircle, BookOpen, FileText as ExamIconLucide, Brain, BarChart3, HelpCircle, ShieldCheck, Star, Settings, User, MessageSquare, ShieldAlert, Package, ThumbsUp, ThumbsDown, Edit3 } from "lucide-react"; // Added more icons

export type TopStatCardData = {
  title: string;
  amount: string;
  percentageChange: number;
  isPositiveChange: boolean;
  previousPeriodValue: string;
  trendLabel?: string;
  additionalPurchaseInfo?: string;
  additionalCompleteInfo?: string;
  completePercentageChange?: number;
  isCompletePositiveChange?: boolean;
};

export type ReportStat = {
  label: string;
  value: string;
};

export type WeeklyChartDataPoint = {
  day: string;
  value: number;
  highlighted?: boolean;
  highlightLabel?: string;
};

export type UserActivityDataPoint = {
  value: number;
};

export type LeaderboardUser = {
  rank: number;
  userName: string;
  points: number;
  avatarUrl?: string;
  quizCompletions: number;
  avgScore: number;
  memberSince: string;
};

export type Transaction = {
  id: string;
  customerId: string;
  orderDate: string;
  status: "Paid" | "Pending" | "Failed";
  amount: string;
  productName: string;
  paymentMethod: PaymentMethod;
  transactionType: "Purchase" | "Refund" | "Subscription";
};


export const mockTopStatCards: TopStatCardData[] = [
  {
    title: "Total Purchase Amount",
    amount: "₹30K",
    percentageChange: 10.4,
    isPositiveChange: true,
    previousPeriodValue: "Previous 7days (₹43K)",
    trendLabel: "Sales",
  },
  {
    title: "Total Purchase Quizzes",
    amount: "1.7K",
    percentageChange: 14.4,
    isPositiveChange: true,
    previousPeriodValue: "Previous 7days (0.6K)",
    trendLabel: "order",
  },
  {
    title: "Purchase & Complete Quizzes",
    amount: "1.7K",
    additionalPurchaseInfo: "user 204",
    percentageChange: 0,
    isPositiveChange: true,
    additionalCompleteInfo: "94",
    completePercentageChange: -14.4,
    isCompletePositiveChange: false,
    previousPeriodValue: "Last 7 days",
  },
];

export const mockReportStats: ReportStat[] = [
  { label: "Online User", value: "2k" },
  { label: "Total Quiz purchase", value: "3.5k" },
  { label: "Total Users", value: "22k" },
  { label: "Revenue", value: "₹35k" },
];

export const mockWeeklyReportData: WeeklyChartDataPoint[] = [
  { day: "Sun", value: 15000 },
  { day: "Mon", value: 18000 },
  { day: "Tue", value: 25000 },
  { day: "Wed", value: 28000, highlighted: true, highlightLabel: "Thursday 25,409" },
  { day: "Thu", value: 22000 },
  { day: "Fri", value: 30000 },
  { day: "Sat", value: 33000 },
];


export const mockUserActivityValue = 221;
export const mockUserActivityChartData: UserActivityDataPoint[] = Array.from({ length: 20 }, () => ({
  value: Math.floor(Math.random() * 100),
}));


export let mockLeaderboardData: LeaderboardUser[] = [
  { rank: 1, userName: "UserAlpha", points: 1432, avatarUrl: "https://placehold.co/32x32.png?text=UA", quizCompletions: 50, avgScore: 92, memberSince: "Jan 2023" },
  { rank: 2, userName: "BetaUser", points: 1342, avatarUrl: "https://placehold.co/32x32.png?text=BU", quizCompletions: 45, avgScore: 90, memberSince: "Mar 2023" },
  { rank: 3, userName: "GammaPlayer", points: 1135, avatarUrl: "https://placehold.co/32x32.png?text=GP", quizCompletions: 40, avgScore: 88, memberSince: "Feb 2023" },
  { rank: 4, userName: "DeltaChamp", points: 1003, avatarUrl: "https://placehold.co/32x32.png?text=DC", quizCompletions: 35, avgScore: 85, memberSince: "Apr 2023" },
  { rank: 5, userName: "EpsilonStar", points: 937, avatarUrl: "https://placehold.co/32x32.png?text=ES", quizCompletions: 30, avgScore: 82, memberSince: "May 2023" },
  { rank: 6, userName: "ZetaMaster", points: 921, avatarUrl: "https://placehold.co/32x32.png?text=ZM", quizCompletions: 28, avgScore: 80, memberSince: "Jun 2023" },
  { rank: 7, userName: "EtaGuru", points: 870, avatarUrl: "https://placehold.co/32x32.png?text=EG", quizCompletions: 25, avgScore: 78, memberSince: "Jul 2023" },
  { rank: 8, userName: "ThetaPro", points: 821, avatarUrl: "https://placehold.co/32x32.png?text=TP", quizCompletions: 22, avgScore: 75, memberSince: "Aug 2023" },
  { rank: 9, userName: "IotaExpert", points: 799, avatarUrl: "https://placehold.co/32x32.png?text=IE", quizCompletions: 20, avgScore: 73, memberSince: "Sep 2023" },
  { rank: 10, userName: "KappaAce", points: 750, avatarUrl: "https://placehold.co/32x32.png?text=KA", quizCompletions: 18, avgScore: 70, memberSince: "Oct 2023" },
];

export let mockTransactionsData: Transaction[] = [
  { id: "1", customerId: "#6545", orderDate: "01 Oct 2024 | 11:29 am", status: "Paid", amount: "₹199", productName: "General Knowledge Quiz Pack", paymentMethod: "UPI", transactionType: "Purchase" },
  { id: "2", customerId: "#5412", orderDate: "01 Oct 2024 | 10:15 am", status: "Pending", amount: "₹99", productName: "History Quiz", paymentMethod: "Credit Card", transactionType: "Purchase"},
  { id: "3", customerId: "#6622", orderDate: "30 Sep 2024 | 09:00 pm", status: "Paid", amount: "₹199", productName: "Science Challenge", paymentMethod: "Debit Card", transactionType: "Purchase" },
  { id: "4", customerId: "#6462", orderDate: "30 Sep 2024 | 05:30 pm", status: "Paid", amount: "₹199", productName: "Mathematics Advanced", paymentMethod: "UPI", transactionType: "Purchase" },
  { id: "5", customerId: "#7890", orderDate: "29 Sep 2024 | 02:00 pm", status: "Failed", amount: "₹49", productName: "Quick GK Test", paymentMethod: "Net Banking", transactionType: "Purchase"},
  { id: "6", customerId: "#1234", orderDate: "29 Sep 2024 | 11:00 am", status: "Paid", amount: "₹299", productName: "Full Aptitude Course", paymentMethod: "UPI", transactionType: "Subscription" },
  { id: "7", customerId: "#5678", orderDate: "28 Sep 2024 | 08:45 pm", status: "Paid", amount: "₹149", productName: "Reasoning Masterclass", paymentMethod: "Credit Card", transactionType: "Purchase" },
  { id: "8", customerId: "#9012", orderDate: "28 Sep 2024 | 03:15 pm", status: "Pending", amount: "₹199", productName: "Assam GK Special", paymentMethod: "Debit Card", transactionType: "Purchase" },
  { id: "9", customerId: "#3456", orderDate: "27 Sep 2024 | 06:00 pm", status: "Paid", amount: "₹99", productName: "SSC Exam Prep", paymentMethod: "UPI", transactionType: "Purchase" },
  { id: "10", customerId: "#7891", orderDate: "27 Sep 2024 | 01:00 pm", status: "Paid", amount: "₹79", productName: "TET Mock Test", paymentMethod: "Net Banking", transactionType: "Purchase" },
  { id: "11", customerId: "#1122", orderDate: "26 Sep 2024 | 10:30 am", status: "Failed", amount: "₹199", productName: "ADRE Full Pack", paymentMethod: "UPI", transactionType: "Purchase" },
  { id: "12", customerId: "#3344", orderDate: "26 Sep 2024 | 09:00 am", status: "Paid", amount: "₹59", productName: "Daily Current Affairs", paymentMethod: "Credit Card", transactionType: "Subscription" },
  { id: "13", customerId: "#6545", orderDate: "15 Oct 2024 | 09:00 am", status: "Paid", amount: "₹50", productName: "Refund for History Quiz", paymentMethod: "UPI", transactionType: "Refund" },
];


// Keep existing filter types if needed, or remove if not used by new dashboard
export type SalesData = {
  month: string;
  sales: number;
  target: number;
};

export type RevenueData = {
  date: string;
  revenue: number;
  profit?: number;
};

export type CategoryData = {
  name: string;
  value: number;
  fill?: string;
};

export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  retentionRate: number;
};

export const mockSalesData: SalesData[] = [];
export const mockRevenueData: RevenueData[] = [];
export const mockCategoryData: CategoryData[] = [];
export const mockUserStats: UserStats = { totalUsers: 0, activeUsers: 0, newSignups: 0, retentionRate: 0 };

export const initialFilters = {
  dateRange: {
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  },
  category: "all",
};


// Types for Order Management
export type OrderStatus = "Complete" | "Pending" | "Canceled";
export type PaymentMethod = "UPI" | "Debit Card" | "Credit Card" | "Net Banking";

export type Order = {
  id: string;
  orderId: string;
  userId: string;
  productName: string;
  date: string;
  price: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
};

export type OrderStat = {
  title: string;
  value: string;
  percentageChange: string;
  periodLabel: string;
  isPositive: boolean;
};

export const mockOrderStats: OrderStat[] = [
  {
    title: "Total Orders",
    value: "1,240",
    percentageChange: "+14.4%",
    periodLabel: "Last 7 days",
    isPositive: true,
  },
  {
    title: "Completed Orders",
    value: "960",
    percentageChange: "85%",
    periodLabel: "Last 7 days",
    isPositive: true,
  },
];

export let mockOrders: Order[] = [
  { id: "ord1", orderId: "#ORD2312", userId: "#1234567890", productName: "General Knowledge Quiz #521", date: "01-01-2025", price: "₹99.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord2", orderId: "#ORD2313", userId: "#1232674566", productName: "Mathematic Quiz #65", date: "01-01-2025", price: "₹199.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord3", orderId: "#ORD2314", userId: "#9879123120", productName: "General Science Quiz #452", date: "01-01-2025", price: "₹99.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord4", orderId: "#ORD2315", userId: "#8798324768", productName: "ADRE Quiz #452", date: "01-01-2025", price: "₹99.99", paymentMethod: "UPI", status: "Canceled" },
  { id: "ord5", orderId: "#ORD2316", userId: "#8473958459", productName: "General Knowledge Quiz #521", date: "01-01-2025", price: "₹199.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord6", orderId: "#ORD2317", userId: "#1278675389", productName: "Mathematic Quiz #452", date: "01-01-2025", price: "₹199.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord7", orderId: "#ORD2318", userId: "#9883768719", productName: "Assam GK Quiz #231", date: "01-01-2025", price: "₹49.99", paymentMethod: "UPI", status: "Pending" },
  { id: "ord8", orderId: "#ORD2319", userId: "#7896872099", productName: "General Knowledge Quiz #521", date: "01-01-2025", price: "₹99.99", paymentMethod: "Debit Card", status: "Complete" },
  { id: "ord9", orderId: "#ORD2320", userId: "#0897987363", productName: "General Science Quiz #452", date: "01-01-2025", price: "₹199.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord10", orderId: "#ORD2321", userId: "#1768756283", productName: "ADRE Quiz #122", date: "01-01-2025", price: "₹99.99", paymentMethod: "UPI", status: "Complete" },
  { id: "ord11", orderId: "#ORD2322", userId: "#2345678901", productName: "History Buff Challenge", date: "02-01-2025", price: "₹79.00", paymentMethod: "Credit Card", status: "Complete" },
  { id: "ord12", orderId: "#ORD2323", userId: "#3456789012", productName: "Geography Explorer Set", date: "02-01-2025", price: "₹149.50", paymentMethod: "UPI", status: "Pending" },
  { id: "ord13", orderId: "#ORD2324", userId: "#4567890123", productName: "Literature Lovers Pack", date: "03-01-2025", price: "₹129.00", paymentMethod: "Debit Card", status: "Complete" },
  { id: "ord14", orderId: "#ORD2325", userId: "#5678901234", productName: "Science Whiz Kit", date: "03-01-2025", price: "₹249.99", paymentMethod: "Net Banking", status: "Canceled" },
  { id: "ord15", orderId: "#ORD2326", userId: "#6789012345", productName: "Current Affairs Monthly", date: "04-01-2025", price: "₹29.00", paymentMethod: "UPI", status: "Complete" },
  { id: "ord16", orderId: "#ORD2327", userId: "#7890123456", productName: "Advanced Coding Bootcamp", date: "04-01-2025", price: "₹499.00", paymentMethod: "Credit Card", status: "Pending" },
  { id: "ord17", orderId: "#ORD2328", userId: "#8901234567", productName: "Creative Writing Workshop", date: "05-01-2025", price: "₹89.50", paymentMethod: "UPI", status: "Complete" },
  { id: "ord18", orderId: "#ORD2329", userId: "#9012345678", productName: "Data Science Fundamentals", date: "05-01-2025", price: "₹299.00", paymentMethod: "Debit Card", status: "Canceled" },
  { id: "ord19", orderId: "#ORD2330", userId: "#0123456789", productName: "Digital Marketing Crash Course", date: "06-01-2025", price: "₹199.00", paymentMethod: "Net Banking", status: "Complete" },
  { id: "ord20", orderId: "#ORD2331", userId: "#1122334455", productName: "Photography Masterclass", date: "06-01-2025", price: "₹159.00", paymentMethod: "UPI", status: "Pending" },
  { id: "ord21", orderId: "#ORD2332", userId: "#2233445566", productName: "Yoga and Meditation Guide", date: "07-01-2025", price: "₹49.00", paymentMethod: "Credit Card", status: "Complete" },
  { id: "ord22", orderId: "#ORD2333", userId: "#3344556677", productName: "Financial Planning 101", date: "07-01-2025", price: "₹75.00", paymentMethod: "Debit Card", status: "Canceled" },
  { id: "ord23", orderId: "#ORD2334", userId: "#4455667788", productName: "Public Speaking Essentials", date: "08-01-2025", price: "₹99.00", paymentMethod: "Net Banking", status: "Complete" },
  { id: "ord24", orderId: "#ORD2335", userId: "#5566778899", productName: "Graphic Design Basics", date: "08-01-2025", price: "₹120.00", paymentMethod: "UPI", status: "Pending" },
];

// Types for All Users page
export type UserStatCardData = {
  title: string;
  value: string;
  percentageChange: number;
  isPositiveChange: boolean;
  periodLabel: string;
};

export type CustomerOverviewStat = {
  label: string;
  value: string;
};

export type CustomerOverviewChartPoint = WeeklyChartDataPoint; // Can reuse

export type CustomerStatus = "Active" | "Inactive" | "VIP";

export type OrderOverviewStats = {
  totalPurchaseCount: number;
  completedCount: number;
  incompleteCount: number;
};

export type Customer = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  totalPurchase: string; // This is total monetary value
  status: CustomerStatus;
  registrationDate: string;
  lastPurchaseDate: string;
  orderOverview: OrderOverviewStats;
};

export const mockUserStatCards: UserStatCardData[] = [
  { title: "Total Customers", value: "11,040", percentageChange: 14.4, isPositiveChange: true, periodLabel: "Last 7 days" },
  { title: "New Customers", value: "2,370", percentageChange: 20, isPositiveChange: true, periodLabel: "Last 7 days" },
  { title: "Visitor", value: "250k", percentageChange: 20, isPositiveChange: true, periodLabel: "Last 7 days" },
];

export const mockCustomerOverviewStats: CustomerOverviewStat[] = [
  { label: "Active Customers", value: "25k" },
  { label: "Repeat Customers", value: "5.6k" },
  { label: "Shop Visitor", value: "250k" },
  { label: "Conversion Rate", value: "5.5%" },
];

export const mockCustomerOverviewChartData: CustomerOverviewChartPoint[] = [
  { day: "Sun", value: 20000 },
  { day: "Mon", value: 22000 },
  { day: "Tue", value: 30000 },
  { day: "Wed", value: 38000, highlighted: true, highlightLabel: "Thursday 25,409" },
  { day: "Thu", value: 35000 },
  { day: "Fri", value: 45000 },
  { day: "Sat", value: 48000 },
];

const generateRandomCustomerData = (id: number): Customer => {
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Chris", "Jessica", "James", "Linda"];
  const lastNames = ["Doe", "Smith", "Brown", "Wilson", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez"];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const emailDomain = ["example.com", "mail.com", "test.org"];
  const email = `${name.toLowerCase().replace(" ", ".")}@${emailDomain[Math.floor(Math.random() * emailDomain.length)]}`;
  const totalPurchaseCount = Math.floor(Math.random() * 50) + 1;
  const completedCount = Math.floor(Math.random() * totalPurchaseCount);

  return {
    id: `cust${id}`,
    userId: `#${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    name,
    email,
    phone: `+1234567${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
    address: `${Math.floor(Math.random() * 100) + 1}, Chandmari, Guwahati, 781003`,
    avatarUrl: `https://placehold.co/64x64.png?text=${name.charAt(0)}`,
    totalPurchase: (Math.random() * 500 + 50).toFixed(2),
    status: ["Active", "Inactive", "VIP"][Math.floor(Math.random() * 3)] as CustomerStatus,
    registrationDate: `15.01.202${Math.floor(Math.random() * 3) + 2}`, // 2022-2024
    lastPurchaseDate: `10.01.202${Math.floor(Math.random() * 3) + 3}`, // 2023-2025
    orderOverview: {
      totalPurchaseCount,
      completedCount,
      incompleteCount: totalPurchaseCount - completedCount,
    },
  };
};

export let mockCustomers: Customer[] = Array.from({ length: 25 }, (_, i) => generateRandomCustomerData(i + 1));


// Types for Categories Page
export type DiscoverCategory = {
  id: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  itemCount?: number; // For Topic/Exam categories
  bgColorClass?: string; // For specific background colors of Topic/Exam
  textColorClass?: string; // For specific text colors
};

export type ProductListItem = {
  id: string;
  name: string;
  createdDate: string;
  category: string;
};

export const mockDiscoverCategories: DiscoverCategory[] = [
  {
    id: "topic",
    title: "Topic Categories",
    imageUrl: "https://placehold.co/80x60.png",
    imageHint: "education concepts",
    itemCount: 120,
    bgColorClass: "bg-green-100 dark:bg-green-800/30",
    textColorClass: "text-green-700 dark:text-green-300"
  },
  {
    id: "exam",
    title: "Exam Categories",
    imageUrl: "https://placehold.co/80x60.png",
    imageHint: "exam preparation",
    itemCount: 45,
    bgColorClass: "bg-purple-100 dark:bg-purple-800/30",
    textColorClass: "text-purple-700 dark:text-purple-300"
  },
  { id: "genknow", title: "General Knowledge", imageUrl: "https://placehold.co/60x40.png", imageHint: "knowledge quiz" },
  { id: "assgk", title: "Assam GK", imageUrl: "https://placehold.co/60x40.png", imageHint: "assam map" },
  { id: "quant", title: "Quantitative Aptitude", imageUrl: "https://placehold.co/60x40.png", imageHint: "math symbols" },
  { id: "reason", title: "Reasoning", imageUrl: "https://placehold.co/60x40.png", imageHint: "brain puzzle" },
  { id: "adre", title: "ADRE", imageUrl: "https://placehold.co/60x40.png", imageHint: "government exam" },
  { id: "assampol", title: "Assam Police", imageUrl: "https://placehold.co/60x40.png", imageHint: "police badge" },
  { id: "ssc", title: "SSC", imageUrl: "https://placehold.co/60x40.png", imageHint: "exam paper" },
  { id: "tet", title: "TET", imageUrl: "https://placehold.co/60x40.png", imageHint: "teacher exam" },
];

export let mockProductListItems: ProductListItem[] = [
  { id: "prod1", name: "ADRE Quiz Set", createdDate: "01-01-2025", category: "Assam GK" },
  { id: "prod2", name: "General Knowledge Challenge Pack", createdDate: "15-12-2024", category: "General Knowledge" },
  { id: "prod3", name: "Quantitative Aptitude Masterclass", createdDate: "10-11-2024", category: "Quantitative Aptitude" },
  { id: "prod4", name: "Reasoning Skills Booster", createdDate: "05-10-2024", category: "Reasoning" },
  { id: "prod5", name: "Assam Police Exam Prep Kit", createdDate: "20-09-2024", category: "Assam Police" },
  { id: "prod6", name: "SSC CGL Full Course", createdDate: "01-09-2024", category: "SSC" },
  { id: "prod7", name: "TET Paper 1 & 2 Combo", createdDate: "15-08-2024", category: "TET" },
  { id: "prod8", name: "ADRE Advanced Mock Tests", createdDate: "12-01-2025", category: "ADRE" },
  { id: "prod9", name: "GK Current Affairs 2024", createdDate: "05-01-2025", category: "General Knowledge" },
  { id: "prod10", name: "Speed Maths Techniques", createdDate: "18-12-2024", category: "Quantitative Aptitude" },
  { id: "prod11", name: "Logical Reasoning Puzzles", createdDate: "22-11-2024", category: "Reasoning" },
];

export const totalQuizCount = mockProductListItems.length;
export const featuredProductCount = 20;
export const onSaleProductCount = 15;


// Types for Coupon Code Page
export type DiscountType = "percentage" | "fixed";
export type AssignmentType = "all_users" | "specific_user" | "all_categories" | "specific_categories";
export type CouponStatus = "active" | "inactive" | "expired";

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  minPurchaseAmount?: number;
  assignmentType: AssignmentType;
  assignedToUser?: string; // User ID if specific_user
  assignedToCategories?: string[]; // Category IDs if specific_categories
  status: CouponStatus;
};

export type CouponStatSummary = {
  title: string;
  value: string;
  icon: React.ElementType; // Lucide icon
  iconColor: string;
};

export const mockCouponStats: CouponStatSummary[] = [
  { title: "Total Coupons", value: "125", icon: Ticket, iconColor: "text-blue-500" },
  { title: "Active Coupons", value: "78", icon: CheckCircle2, iconColor: "text-green-500" },
  { title: "Coupons Redeemed (Month)", value: "1.2K", icon: Users, iconColor: "text-purple-500" },
  { title: "Expired Coupons", value: "12", icon: XCircle, iconColor: "text-red-500" },
];


export let mockCoupons: Coupon[] = [
  {
    id: "cpn1",
    code: "SUMMER25",
    description: "25% off on all summer collection quizzes.",
    discountType: "percentage",
    discountValue: 25,
    startDate: new Date("2024-06-01"),
    expiryDate: new Date("2024-08-31"),
    usageLimit: 1000,
    usedCount: 250,
    minPurchaseAmount: 500,
    assignmentType: "all_categories",
    status: "active",
  },
  {
    id: "cpn2",
    code: "NEWUSER100",
    description: "Flat ₹100 off for new users on first purchase.",
    discountType: "fixed",
    discountValue: 100,
    startDate: new Date("2024-01-01"),
    expiryDate: new Date("2024-12-31"),
    usageLimit: 500,
    usedCount: 150,
    assignmentType: "all_users",
    status: "active",
  },
  {
    id: "cpn3",
    code: "GKMASTER",
    description: "50% off on General Knowledge category.",
    discountType: "percentage",
    discountValue: 50,
    startDate: new Date("2024-07-01"),
    expiryDate: new Date("2024-07-31"),
    usageLimit: 200,
    usedCount: 180,
    assignmentType: "specific_categories",
    assignedToCategories: ["genknow"],
    status: "inactive", // Example: Manually deactivated
  },
  {
    id: "cpn4",
    code: "SPECIALUSER007",
    description: "Special ₹200 off for user #1234567890.",
    discountType: "fixed",
    discountValue: 200,
    startDate: new Date("2024-07-15"),
    expiryDate: new Date("2024-08-15"),
    usageLimit: 1,
    usedCount: 0,
    assignmentType: "specific_user",
    assignedToUser: mockCustomers[0]?.id, // Assign to the first mock customer
    status: "active",
  },
  {
    id: "cpn5",
    code: "EXPIRED01",
    description: "Old expired coupon.",
    discountType: "percentage",
    discountValue: 10,
    startDate: new Date("2023-01-01"),
    expiryDate: new Date("2023-03-31"),
    usageLimit: 100,
    usedCount: 95,
    assignmentType: "all_categories",
    status: "expired",
  },
];

// Quiz Management Types
export type QuizDifficulty = "Easy" | "Medium" | "Hard";
export type QuizStatus = "Draft" | "Published" | "Archived";

export type QuizListItem = {
  id: string;
  title: string;
  category: string; // Category ID from mockDiscoverCategories
  questionsCount: number;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  createdDate: string;
  lastUpdatedDate: string;
};

export let mockQuizListItems: QuizListItem[] = [
  {
    id: "quiz1",
    title: "Basics of Indian History",
    category: "genknow",
    questionsCount: 20,
    difficulty: "Easy",
    status: "Published",
    createdDate: "2024-05-01",
    lastUpdatedDate: "2024-05-10",
  },
  {
    id: "quiz2",
    title: "Advanced Algebra Challenge",
    category: "quant",
    questionsCount: 15,
    difficulty: "Hard",
    status: "Published",
    createdDate: "2024-04-15",
    lastUpdatedDate: "2024-05-05",
  },
  {
    id: "quiz3",
    title: "Assam Geography Overview",
    category: "assgk",
    questionsCount: 25,
    difficulty: "Medium",
    status: "Draft",
    createdDate: "2024-06-01",
    lastUpdatedDate: "2024-06-01",
  },
  {
    id: "quiz4",
    title: "Logical Puzzles Set 1",
    category: "reason",
    questionsCount: 10,
    difficulty: "Easy",
    status: "Published",
    createdDate: "2024-03-10",
    lastUpdatedDate: "2024-03-15",
  },
  {
    id: "quiz5",
    title: "ADRE Exam Mock Test",
    category: "adre",
    questionsCount: 50,
    difficulty: "Medium",
    status: "Archived",
    createdDate: "2023-12-01",
    lastUpdatedDate: "2024-01-10",
  },
  {
    id: "quiz6",
    title: "SSC CGL Tier 1 Practice",
    category: "ssc",
    questionsCount: 30,
    difficulty: "Medium",
    status: "Published",
    createdDate: "2024-02-20",
    lastUpdatedDate: "2024-03-01",
  },
];

export const quizCategories = mockDiscoverCategories.map(cat => ({ value: cat.id, label: cat.title }));
export const quizDifficulties: {value: QuizDifficulty, label: string}[] = [
    {value: "Easy", label: "Easy"},
    {value: "Medium", label: "Medium"},
    {value: "Hard", label: "Hard"}
];

export type QuizQuestion = {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    text: string;
    options?: string[]; // For multiple-choice
    correctAnswer: string | boolean; // string for MC/SA, boolean for T/F
    explanation?: string;
};

// Simple structure for the add quiz form for now
export type AddQuizFormValues = {
    title: string;
    category: string;
    difficulty: QuizDifficulty;
    description: string;
    // For simplicity, we'll use a JSON string for questions in the mock setup
    // In a real app, this would be a more structured array of question objects
    questionsJson: string;
};

// Course Categories
export type CourseCategory = {
  id: string;
  name: string;
  description: string;
  quizCount: number;
  imageUrl: string;
  imageHint: string;
  lastUpdated: string;
};

export let mockCourseCategories: CourseCategory[] = [
  { id: "ccat1", name: "Mathematics", description: "Covers algebra, geometry, calculus, and more.", quizCount: 25, imageUrl: "https://placehold.co/300x200.png", imageHint: "math equations", lastUpdated: "2024-07-15" },
  { id: "ccat2", name: "General Science", description: "Physics, Chemistry, Biology fundamentals.", quizCount: 18, imageUrl: "https://placehold.co/300x200.png", imageHint: "science experiment", lastUpdated: "2024-07-10" },
  { id: "ccat3", name: "History of Assam", description: "Detailed quizzes on Assam's rich history.", quizCount: 15, imageUrl: "https://placehold.co/300x200.png", imageHint: "historical monument", lastUpdated: "2024-06-20" },
  { id: "ccat4", name: "Logical Reasoning", description: "Puzzles and problems to sharpen analytical skills.", quizCount: 30, imageUrl: "https://placehold.co/300x200.png", imageHint: "brain gears", lastUpdated: "2024-07-01" },
  { id: "ccat5", name: "Competitive Exams Prep", description: "Focused on ADRE, SSC, TET patterns.", quizCount: 40, imageUrl: "https://placehold.co/300x200.png", imageHint: "exam hall", lastUpdated: "2024-07-18" },
];

// Product Reviews
export type ReviewStatus = "Pending" | "Approved" | "Rejected";
export type ProductReview = {
  id: string;
  productId: string; // Links to a quiz/product
  productName: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  status: ReviewStatus;
};

export let mockProductReviews: ProductReview[] = [
  { id: "rev1", productId: "quiz1", productName: "Basics of Indian History", userName: "Reviewer One", userAvatarUrl: "https://placehold.co/32x32.png?text=R1", rating: 5, comment: "Excellent quiz, very informative!", date: "2024-07-10", status: "Approved" },
  { id: "rev2", productId: "quiz2", productName: "Advanced Algebra Challenge", userName: "Math Wiz", userAvatarUrl: "https://placehold.co/32x32.png?text=MW", rating: 4, comment: "Challenging but good. Some questions could have better explanations.", date: "2024-07-05", status: "Pending" },
  { id: "rev3", productId: "quiz1", productName: "Basics of Indian History", userName: "History Buff", userAvatarUrl: "https://placehold.co/32x32.png?text=HB", rating: 3, comment: "A bit too easy for me.", date: "2024-06-28", status: "Approved" },
  { id: "rev4", productId: "quiz3", productName: "Assam Geography Overview", userName: "Local Expert", userAvatarUrl: "https://placehold.co/32x32.png?text=LE", rating: 5, comment: "Covers Assam geography very well.", date: "2024-07-12", status: "Approved" },
  { id: "rev5", productId: "quiz5", productName: "ADRE Exam Mock Test", userName: "AspirantX", userAvatarUrl: "https://placehold.co/32x32.png?text=AX", rating: 2, comment: "Content seems outdated.", date: "2024-06-15", status: "Rejected" },
];

// Admin Role
export type AdminRoleType = "Super Admin" | "Content Manager" | "User Manager" | "Support Staff";
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: AdminRoleType;
  lastLogin: string;
  status: "Active" | "Suspended";
};

export let mockAdminUsers: AdminUser[] = [
  { id: "admin1", name: "Alice Wonderland", email: "alice@prestudy.com", avatarUrl: "https://placehold.co/40x40.png?text=AW", role: "Super Admin", lastLogin: "2024-07-20 10:00 AM", status: "Active" },
  { id: "admin2", name: "Bob The Builder", email: "bob@prestudy.com", avatarUrl: "https://placehold.co/40x40.png?text=BB", role: "Content Manager", lastLogin: "2024-07-19 03:30 PM", status: "Active" },
  { id: "admin3", name: "Charlie Brown", email: "charlie@prestudy.com", avatarUrl: "https://placehold.co/40x40.png?text=CB", role: "User Manager", lastLogin: "2024-07-18 11:15 AM", status: "Active" },
  { id: "admin4", name: "Diana Prince", email: "diana@prestudy.com", avatarUrl: "https://placehold.co/40x40.png?text=DP", role: "Support Staff", lastLogin: "2024-07-20 09:00 AM", status: "Suspended" },
];

// Control Authority
export type Permission = {
  id: string;
  featureName: string;
  description: string;
  rolesAllowed: AdminRoleType[]; // Array of roles that can access this feature
  lastModified: string;
};

export let mockPermissions: Permission[] = [
  { id: "perm1", featureName: "User Management", description: "Add, edit, delete, suspend users.", rolesAllowed: ["Super Admin", "User Manager"], lastModified: "2024-07-01" },
  { id: "perm2", featureName: "Quiz Management", description: "Create, edit, publish, archive quizzes.", rolesAllowed: ["Super Admin", "Content Manager"], lastModified: "2024-07-05" },
  { id: "perm3", featureName: "Coupon Management", description: "Create, edit, delete coupons.", rolesAllowed: ["Super Admin"], lastModified: "2024-06-15" },
  { id: "perm4", featureName: "View Financial Reports", description: "Access sales and revenue data.", rolesAllowed: ["Super Admin"], lastModified: "2024-05-10" },
  { id: "perm5", featureName: "Review Management", description: "Approve or reject product reviews.", rolesAllowed: ["Super Admin", "Content Manager"], lastModified: "2024-07-10" },
  { id: "perm6", featureName: "Role Management", description: "Define and assign admin roles.", rolesAllowed: ["Super Admin"], lastModified: "2024-07-01" },
];
