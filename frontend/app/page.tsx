"use client"

import Image from "next/image"
import { Search, Star, MoreHorizontal, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { AddFoodModal } from "@/components/add-food-modal"
import { EditFoodModal } from "@/components/edit-food-modal"
import { DeleteFoodModal } from "@/components/delete-food-modal"
import { FoodItem, getFoods, deleteFood } from "@/lib/api"

// Default featured food items in case API is not available
const defaultFoods: FoodItem[] = [
  {
    _id: '1',
    name: "Bow Lasagna",
    price: 2.99,
    rating: 4.5,
    image: "/images/images/food.png",
    restaurant: "Denny's",
    status: "Closed",
    logo: "🍗",
  },
  {
    _id: '2',
    name: "Mixed Avocado Smoothie",
    price: 5.99,
    rating: 4.8,
    image: "/images/images/food.png",
    restaurant: "Fruit King",
    status: "Closed",
    logo: "🍗",
  },
  {
    _id: '3',
    name: "Pancake",
    price: 3.99,
    rating: 5.0,
    image: "/images/images/food.png",
    restaurant: "Pancake House",
    status: "Open",
    logo: "🥞",
  },
  {
    _id: '4',
    name: "Cupcake",
    price: 1.99,
    rating: 4.7,
    image: "/images/images/food.png",
    restaurant: "Sweet Tooth",
    status: "Open",
    logo: "🧁",
  },
  {
    _id: '5',
    name: "Burger",
    price: 8.99,
    rating: 4.6,
    image: "/images/images/food.png",
    restaurant: "Burger Joint",
    status: "Open",
    logo: "🥩",
  },
  {
    _id: '6',
    name: "Pizza",
    price: 12.99,
    rating: 4.9,
    image: "/images/images/food.png",
    restaurant: "Pizza Palace",
    status: "Open",
    logo: "🍗",
  },
  {
    _id: '7',
    name: "Salad",
    price: 7.99,
    rating: 4.3,
    image: "/images/images/food.png",
    restaurant: "Healthy Bites",
    status: "Open",
    logo: "🍗",
  },
  {
    _id: '8',
    name: "Breakfast Platter",
    price: 11.99,
    rating: 4.9,
    image: "/images/images/food.png",
    restaurant: "Breakfast Club",
    status: "Open",
    logo: "🍗",
  },
];

export default function HomePage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Fetch food items from the API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await getFoods();
        setFoods(data);
      } catch (err) {
        console.error('Failed to fetch food items:', err);
        setError('Failed to load food items. Using sample data.');
        setFoods(defaultFoods);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleAddFood = (newFood: FoodItem) => {
    setFoods([...foods, newFood]);
  };

  const handleUpdateFood = (updatedFood: FoodItem) => {
    setFoods(foods.map(food =>
      food._id === updatedFood._id ? updatedFood : food
    ));
  };

  const handleDeleteFood = async (id: string) => {
    try {
      await deleteFood(id);
      setFoods(foods.filter(food => food._id !== id));
    } catch (err) {
      console.error('Failed to delete food item:', err);
      setError('Failed to delete food item.');
    }
  };

  const handleEdit = (food: FoodItem) => {
    setSelectedFood(food)
    setShowEditModal(true)
  }

  const handleDelete = (food: FoodItem) => {
    setSelectedFood(food)
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
              Add Food Item
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
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-12">Find Food</Button>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Food Items</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={food.image || "/images/food.png"}
                    alt={food.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white">${food.price}</Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(food)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(food)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{food.logo || '🍽️'}</span>
                    <span className="text-sm text-gray-600">{food.restaurant}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{food.name}</h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{food.rating}</span>
                    </div>
                    <Badge
                      variant={food.status === "Open" ? "default" : "secondary"}
                      className={food.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                    >
                      {food.status}
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
      {/* Add Food Modal */}
      <AddFoodModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddFood={handleAddFood}
      />

      {/* Edit Food Modal */}
      <EditFoodModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        food={selectedFood}
        onUpdateFood={handleUpdateFood}
      />

      {/* Delete Food Modal */}
      <DeleteFoodModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        food={selectedFood}
        onDeleteSuccess={() => selectedFood && handleDeleteFood(selectedFood._id!)}
      />
    </div>
  )
}
