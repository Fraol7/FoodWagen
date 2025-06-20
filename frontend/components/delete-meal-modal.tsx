"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FoodItem } from "./add-meal-modal"

interface DeleteMealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: FoodItem | null
  onDeleteSuccess?: (deletedMealId: string) => void
}

export function DeleteMealModal({ open, onOpenChange, meal, onDeleteSuccess }: DeleteMealModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!meal?._id) {
      setError("No meal selected for deletion")
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      
      const response = await fetch(`http://localhost:3000/foods/${meal._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete meal')
      }
      
      toast.success("Meal deleted successfully")
      onDeleteSuccess?.(meal._id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting meal:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete meal'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setError(null)
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="bg-white rounded-lg">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-orange-500">
              Delete Meal
            </DialogTitle>
            {meal?.name && (
              <DialogDescription className="text-center text-gray-600">
                {meal.name}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this meal? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <Button 
                onClick={handleDelete} 
                variant="destructive"
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : 'Delete'}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
