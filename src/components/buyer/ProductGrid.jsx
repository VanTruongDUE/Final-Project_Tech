import ProductCard from './ProductCard'

export default function ProductGrid({ products, cardVariant = 'compact' }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={cardVariant} />
      ))}
    </div>
  )
}
