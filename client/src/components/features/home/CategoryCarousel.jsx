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
    <div className='relative py-20 md:py-24 px-4 md:px-6 lg:px-8 bg-background overflow-visible'>
      {/* Background decoration */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-5xl font-extrabold mb-4'>
            <span className='text-foreground'>
              Popular{" "}
            </span>
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]'>
              Job Categories
            </span>
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Explore trending job categories and find your perfect match across various industries
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
                      className='rounded-2xl w-full max-w-full truncate px-6 py-5 text-base font-semibold text-start whitespace-nowrap overflow-hidden border border-border hover:border-primary hover:bg-muted/50 hover:text-primary transition-all duration-300 shadow-md hover:shadow-neon transform hover:scale-110 group bg-card backdrop-blur-sm'
                    >
                      <div className='flex items-center gap-3 w-full'>
                        <div className='w-3 h-3 bg-primary rounded-full group-hover:scale-125 transition-transform duration-300 flex-shrink-0 group-hover:shadow-neon'></div>
                        <span className='truncate text-foreground group-hover:text-primary'>{cat?.title}</span>
                      </div>
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-0 md:left-4 bg-card border border-border hover:border-primary hover:bg-primary/20 hover:text-primary shadow-xl hover:shadow-neon transition-all duration-300 transform hover:scale-110 z-10 h-10 w-10 text-foreground' />
              <CarouselNext className='right-0 md:right-4 bg-card border border-border hover:border-primary hover:bg-primary/20 hover:text-primary shadow-xl hover:shadow-neon transition-all duration-300 transform hover:scale-110 z-10 h-10 w-10 text-foreground' />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
