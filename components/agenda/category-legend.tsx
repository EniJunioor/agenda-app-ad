"use client"

import { categories } from "@/data/events"
import { CategoryBadge } from "./category-badge"
import { motion } from "framer-motion"

export function CategoryLegend() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Categorias</h3>
      <div className="flex flex-col gap-2">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CategoryBadge category={category} size="sm" className="w-full justify-start gap-2 h-8 px-2" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
