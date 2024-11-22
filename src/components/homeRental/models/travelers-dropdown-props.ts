export interface ITravelersDropdownProps {
  travelers: {
    adults: number
    childrens: number
  }
  onIncrement: (type: 'adults' | 'childrens') => void
  onDecrement: (type: 'adults' | 'childrens') => void
}
