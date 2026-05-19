import React, { useEffect, useState, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Button } from "../../ui/button";
import { CarouselSkeleton } from "../../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCarouselData } from "@/redux/slices/job.slice";

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carousel } = useSelector((state) => state.job);
  const [carousels, setCarousels] = useState(carousel?.jobs || []);
  const [loading, setLoading] = useState(false);

  // Search job handler
  const searchJobHandler = (query) => {
    navigate(`/description/${query?._id}`);
  };

  // Fetch carousel data if not available
  useEffect(() => {
    if (!carousels || carousels.length === 0) {
      setLoading(true);
      
      dispatch(getCarouselData())
        .then((res) => {
          if (res?.payload?.status === 200) {
            setCarousels(res?.payload?.jobs || []);
          } else {
            console.error("Failed to fetch carousel data:", res?.payload?.message);
            // Set some default data if API fails
            const defaultData = [
              { _id: '1', title: 'Software Engineer' },
              { _id: '2', title: 'Data Scientist' },
              { _id: '3', title: 'Product Manager' },
              { _id: '4', title: 'UX Designer' },
              { _id: '5', title: 'Marketing Manager' },
              { _id: '6', title: 'Sales Executive' },
              { _id: '7', title: 'DevOps Engineer' },
              { _id: '8', title: 'Business Analyst' }
            ];
            setCarousels(defaultData);
          }
        })
        .catch((error) => {
          console.error("Error fetching carousel data:", error);
          // Set some default data if API fails
          const defaultData = [
            { _id: '1', title: 'Software Engineer' },
            { _id: '2', title: 'Data Scientist' },
            { _id: '3', title: 'Product Manager' },
            { _id: '4', title: 'UX Designer' },
            { _id: '5', title: 'Marketing Manager' },
            { _id: '6', title: 'Sales Executive' },
            { _id: '7', title: 'DevOps Engineer' },
            { _id: '8', title: 'Business Analyst' }
          ];
          setCarousels(defaultData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, carousels]);

  // Memoized sliced carousels for performance
  const carouselItems = useMemo(() => carousels?.slice(0, 10), [carousels]);

  if (loading) {
    return <CarouselSkeleton />;
  }

  if (!carouselItems || carouselItems.length === 0) {
    return (
      <div className='relative'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-foreground mb-2'>
            Popular <span className='text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]'>Job Categories</span>
          </h2>
          <p className='text-muted-foreground'>Explore trending job categories and find your perfect match</p>
        </div>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>No categories available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative py-12 px-4 md:px-6 lg:px-8 bg-transparent overflow-visible'>
      {/* Background decoration with ambient rotating glowing spots */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#00C8FF]/5 rounded-full blur-[110px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8040FF]/5 rounded-full blur-[110px] anim-spin-rev'></div>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-5xl font-extrabold mb-4 tracking-[-0.02em]'>
            <span className='text-[#E6EDF3]'>
              Popular{" "}
            </span>
            <span className='bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.3)] font-black'>
              Job Categories
            </span>
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto font-medium'>
            Explore trending job domains mapped by active market demand metrics.
          </p>
        </div>
        
        <div className='relative w-full overflow-visible py-4'>
          <div className='px-12 md:px-16 lg:px-20'>
            <Carousel className='w-full'>
              <CarouselContent className='grow-0 shrink-0 min-w-0 flex gap-4'>
                {carouselItems?.map((cat, index) => (
                  <CarouselItem
                    key={index}
                    className='grow-0 shrink-0 min-w-0 basis-auto md:basis-1/3 lg:basis-1/4'
                  >
                    <Button
                      onClick={() => searchJobHandler(cat)}
                      variant='outline'
                      className='rounded-2xl w-full max-w-full truncate px-6 py-6 text-base font-semibold text-start whitespace-nowrap overflow-hidden border border-white/5 hover:border-[#00C8FF]/30 hover:bg-white/5 hover:text-[#00C8FF] transition-all duration-300 shadow-[0_0_20px_rgba(0,100,220,0.05)] hover:shadow-[0_0_35px_rgba(0,200,255,0.15)] transform hover:scale-105 group bg-[#080C1E]/50 backdrop-blur-md relative overflow-hidden'
                    >
                      <div className='absolute top-0 right-0 w-16 h-16 bg-[#00C8FF]/5 rounded-full blur-lg group-hover:bg-[#00C8FF]/10 transition-colors duration-300 -z-10'></div>
                      <div className='flex items-center gap-3 w-full relative z-10'>
                        <div className='w-2 h-2 bg-[#00C8FF] rounded-full group-hover:scale-125 transition-transform duration-300 flex-shrink-0 group-hover:shadow-[0_0_8px_rgba(0,200,255,1)] anim-pulse-glow'></div>
                        <span className='truncate text-foreground group-hover:text-[#00C8FF] transition-colors duration-200'>{cat?.title}</span>
                      </div>
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-0 md:left-4 bg-[#080C1E]/80 border border-white/10 hover:border-[#00C8FF]/40 hover:bg-[#00C8FF]/10 hover:text-[#00C8FF] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all duration-300 transform hover:scale-110 z-10 h-10 w-10 text-foreground' />
              <CarouselNext className='right-0 md:right-4 bg-[#080C1E]/80 border border-white/10 hover:border-[#00C8FF]/40 hover:bg-[#00C8FF]/10 hover:text-[#00C8FF] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all duration-300 transform hover:scale-110 z-10 h-10 w-10 text-foreground' />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
