"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowUpRight,
  Activity
} from "lucide-react"

const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    name: "Total Orders",
    value: "1,234",
    change: "+15.3% from last month", 
    changeType: "positive" as const,
    icon: ShoppingCart,
  },
  {
    name: "Products Sold",
    value: "2,345",
    change: "+8.2% from last month",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    name: "Active Customers",
    value: "573",
    change: "-2.1% from last month",
    changeType: "negative" as const,
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "#3426",
    customer: "John Doe",
    product: "Photo Editor Pro",
    amount: "$29.99",
    status: "completed",
  },
  {
    id: "#3425", 
    customer: "Jane Smith",
    product: "JavaScript Complete Guide",
    amount: "$14.99",
    status: "pending",
  },
  {
    id: "#3424",
    customer: "Bob Johnson", 
    product: "React Admin Dashboard",
    amount: "$24.99",
    status: "completed",
  },
  {
    id: "#3423",
    customer: "Alice Wilson",
    product: "Python for Beginners",
    amount: "$39.99", 
    status: "processing",
  },
  {
    id: "#3422",
    customer: "Charlie Brown",
    product: "Logo Design Bundle",
    amount: "$12.99",
    status: "completed",
  },
]

const topProducts = [
  {
    name: "Photo Editor Pro",
    sales: 234,
    revenue: "$7,016.66",
    trend: "up",
  },
  {
    name: "JavaScript Complete Guide", 
    sales: 198,
    revenue: "$2,968.02",
    trend: "up",
  },
  {
    name: "Python for Beginners",
    sales: 156,
    revenue: "$6,238.44", 
    trend: "down",
  },
  {
    name: "React Admin Dashboard",
    sales: 89,
    revenue: "$2,224.11",
    trend: "up",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <Button>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View Store
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your customers
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {order.customer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.product}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        order.status === "completed" 
                          ? "default" 
                          : order.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {product.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p className="text-sm font-medium">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your digital marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>View Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Customers</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Activity className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}