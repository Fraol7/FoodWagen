"use client"

import Image from "next/image"
import { Search, Star, MoreHorizontal, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { AddMealModal } from "@/components/add-meal-modal"
import { EditMealModal } from "@/components/edit-meal-modal"
import { DeleteMealModal } from "@/components/delete-meal-modal"

const featuredMeals = [
  {
    id: 1,
    name: "Bow Lasagna",
    price: 2.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Denny's",
    status: "Closed",
    logo: "🍽️",
  },
  {
    id: 2,
    name: "Mixed Avocado Smoothie",
    price: 5.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Fruit King",
    status: "Closed",
    logo: "🥑",
  },
  {
    id: 3,
    name: "Pancake",
    price: 3.99,
    rating: 5.0,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Pancake House",
    status: "Open",
    logo: "🥞",
  },
  {
    id: 4,
    name: "Cupcake",
    price: 1.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Sweet Treats",
    status: "Open",
    logo: "🧁",
  },
  {
    id: 5,
    name: "Creamy Steak",
    price: 12.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Steaky",
    status: "Open",
    logo: "🥩",
  },
  {
    id: 6,
    name: "Steak with Potatoes",
    price: 15.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "KFC",
    status: "Open",
    logo: "🍗",
  },
  {
    id: 7,
    name: "Indian Spicy Soup",
    price: 9.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Spice Palace",
    status: "Open",
    logo: "🍛",
  },
  {
    id: 8,
    name: "Steak Omelet",
    price: 11.99,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    restaurant: "Breakfast Club",
    status: "Open",
    logo: "🍳",
  },
]

export default function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<any>(null)

  const handleEdit = (meal: any) => {
    setSelectedMeal(meal)
    setShowEditModal(true)
  }

  const handleDelete = (meal: any) => {
    setSelectedMeal(meal)
    setShowDeleteModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍽️</span>
              <span className="text-xl font-bold text-gray-900">FoodWagen</span>
            </div>
            <Button className="bg-orange-400 hover:bg-orange-500 text-white px-6" onClick={() => setShowAddModal(true)}>
              Add Meal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-yellow-400 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">Are you starving?</h1>
              <p className="text-lg lg:text-xl mb-8 opacity-90">
                Within a few clicks, find meals that are accessible near you
              </p>

              {/* Search Section */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex space-x-4 mb-4">
                  <Button variant="ghost" className="text-orange-500 bg-orange-50">
                    <MapPin className="w-4 h-4 mr-2" />
                    Delivery
                  </Button>
                  <Button variant="ghost" className="text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Pickup
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input placeholder="What do you like to eat today?" className="pl-10 h-12 border-gray-200 text-gray-900" />
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-12">Find Meal</Button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                <Image
                  src="/images/food.png"
                  alt="Delicious noodle bowl"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Meals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={meal.image || "/images/food.png"}
                    alt={meal.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white">${meal.price}</Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(meal)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(meal)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{meal.logo}</span>
                    <span className="text-sm text-gray-600">{meal.restaurant}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{meal.name}</h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{meal.rating}</span>
                    </div>
                    <Badge
                      variant={meal.status === "Open" ? "default" : "secondary"}
                      className={meal.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                    >
                      {meal.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3">Load more →</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Help & Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Partner with us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Ride with us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Refund & Cancellation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">FOLLOW US</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-300 hover:text-white">
                  📷
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  🐦
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-300 mb-3">Receive exclusive offers in your mailbox</p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter Your email"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button className="bg-orange-400 hover:bg-orange-500 text-white">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">All rights Reserved © Your Company, 2021</p>
            <p className="text-gray-400 text-sm">Made with ❤️ by Themewagon</p>
          </div>
        </div>
      </footer>
      {/* Add Meal Modal */}
      <AddMealModal open={showAddModal} onOpenChange={setShowAddModal} />

      {/* Edit Meal Modal */}
      <EditMealModal open={showEditModal} onOpenChange={setShowEditModal} meal={selectedMeal} />

      {/* Delete Meal Modal */}
      <DeleteMealModal open={showDeleteModal} onOpenChange={setShowDeleteModal} meal={selectedMeal} />
    </div>
  )
}
