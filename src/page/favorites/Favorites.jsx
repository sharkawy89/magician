import React, { useContext } from 'react'
import { CartContext } from '../../components/context/cartContextValue'
import PageTransition from '../../components/PageTransition'
import Product from '../../components/slideProducts/Product'




function Favorites() {
    const {favorites} = useContext(CartContext)

  return (
    <PageTransition >
        <div>
            <div className="mx-auto w-[90%] max-w-337.5">
                <div className="relative mb-5 border-b border-line pt-3.75 pr-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-main after:content-['']">
                    <h2 className="mb-2.5 text-[30px] font-bold text-main capitalize">Your Favorites</h2>
                </div>

                {favorites.length === 0 ? (
                    <p>No Favorites Products yet.</p>
                ) : (
                    <div className="flex flex-wrap items-center justify-between gap-5 py-12.5">
                        {favorites.map(item => (
                            <Product item={item} key={item.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </PageTransition>
  )
}

export default Favorites
