import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger,SelectGroup } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SelectValue } from '@radix-ui/react-select'
import React from 'react'

const FilterPage = () => {
  return (
    <div className='w-full md:w-[20%]'>
     <div className='flex items-center justify-between'>

        <h1 className='font-semibold text-lg md:text-xl'>Filter Options</h1>
        <Select>
          <SelectTrigger>
           <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>

           
            <SelectLabel>Sort by price </SelectLabel>
            <SelectItem value="low"> Low to High </SelectItem>
            <SelectItem value="high"> High to Low </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
     </div>

      <Separator className='my-4' />
      <div>
        <h1 className='font-semibold mb-2'>Category</h1>
      </div>
    </div>
  )
}

export default FilterPage