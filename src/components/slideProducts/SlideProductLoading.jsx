import React from 'react'

const productClasses = "relative w-[250px] overflow-hidden rounded-[5px] border border-line bg-white px-3.75 py-[25px] transition-all duration-300 ease-[ease] hover:border-main hover:shadow-[10px_10px_15px_#94949429]";

function SlideProductLoading() {
  return (
    <div>
        <div className='py-12.5'>
        <div className="mx-auto w-[90%] max-w-337.5">
            <div className="relative mb-5 h-26.25 border-b border-line pt-3.75 pr-5 pb-5 after:absolute after:-bottom-px after:h-0.5 after:w-25 after:bg-main after:content-['']">
                <h2 className='skeltion mb-2.5 h-8.75 w-62.5'></h2>
                <p className='skeltion h-6.25 w-87.5'></p>
            </div>


            <div className="flex gap-7.5">



                <div className={productClasses}>
                    <div className="skeltion relative mb-7.5 flex h-45 items-center justify-center px-5"></div>
                    <div className="skeltion mb-2.5 h-7.5"></div>
                    <div className="skeltion mb-2.5 h-7.5"></div>
                </div>


                <div className={productClasses}>
                    <div className="skeltion relative mb-7.5 flex h-45 items-center justify-center px-5"></div>
                    <div className="skeltion mb-2.5 h-7.5"></div>
                    <div className="skeltion mb-2.5 h-7.5"></div>
                </div>


                <div className={productClasses}>
                    <div className="skeltion relative mb-7.5 flex h-45 items-center justify-center px-5"></div>
                    <div className="skeltion mb-2.5 h-7.5"></div>
                    <div className="skeltion mb-2.5 h-7.5"></div>
                </div>

                
            </div>



            
        </div>
        
    </div>
    </div>
  )
}

export default SlideProductLoading
