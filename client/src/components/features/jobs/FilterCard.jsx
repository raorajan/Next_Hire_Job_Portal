import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";

const FilterCard = ({ setSearchParams, filterOptions }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleFilterSelection = (filterType, filterValue) => {
    const filterKey = filterType.toLowerCase();

    if (["location", "job type", "salary"].includes(filterKey)) {
      const existingFilter = selectedFilters.find(
        (filter) => filter.type === filterKey
      );

      if (existingFilter) {
        setSelectedFilters((prev) =>
          prev?.map((filter) =>
            filter.type === filterKey
              ? { ...filter, value: filterValue }
              : filter
          )
        );
      } else {
        setSelectedFilters((prev) => [
          ...prev,
          { type: filterKey, value: filterValue },
        ]);
      }
    } else {
      const isSelected = selectedFilters.some(
        (filter) => filter.type === filterKey && filter.value === filterValue
      );

      if (isSelected) {
        setSelectedFilters((prev) =>
          prev.filter(
            (filter) =>
              !(filter.type === filterKey && filter.value === filterValue)
          )
        );
      } else {
        setSelectedFilters((prev) => [
          ...prev,
          { type: filterKey, value: filterValue },
        ]);
      }
    }
  };

  const removeFilter = (filterType, filterValue) => {
    setSelectedFilters((prev) =>
      prev.filter(
        (filter) =>
          !(
            filter.type === filterType.toLowerCase() &&
            filter.value === filterValue
          )
      )
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const updatedSearchParams = {
      title: debouncedSearchTerm,
      location: selectedFilters.find((f) => f.type === "location")?.value || "",
      jobType: selectedFilters.find((f) => f.type === "job type")?.value || "",
      salary: selectedFilters.find((f) => f.type === "salary")?.value || "",
      page: 1,
    };

    setSearchParams((prevParams) => ({
      ...prevParams,
      ...updatedSearchParams,
    }));
  }, [selectedFilters, debouncedSearchTerm, setSearchParams]);

  return (
    <div className='bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_40px_rgba(0,200,255,0.08)] hover:border-[#00C8FF]/20 transition-all duration-300'>
      <h2 className='font-extrabold text-xl mb-4 bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,229,255,0.2)] tracking-wide text-start'>
        Filters Workspace
      </h2>
      <div className='space-y-4'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search by title, skills, company...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border border-white/10 rounded-xl w-full p-3 focus:border-[#00C8FF]/50 focus:ring-2 focus:ring-[#00C8FF]/15 outline-none transition-all duration-300 bg-[#050810]/50 text-foreground placeholder:text-muted-foreground font-semibold text-sm'
          />
        </div>
        {selectedFilters?.length > 0 && (
          <div className='bg-[#00C8FF]/5 rounded-xl p-4 border border-[#00C8FF]/15'>
            <div className='flex flex-wrap gap-2 mb-3'>
              {selectedFilters?.map((filter, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 bg-[#00C8FF]/10 text-[#00C8FF] rounded-lg px-3 py-1.5 border border-[#00C8FF]/20 shadow-[0_0_10px_rgba(0,200,255,0.05)]'
                >
                  <span className='text-xs font-bold'>{filter.value}</span>
                  <FiX
                    className='text-sm cursor-pointer hover:text-red-400 transition-colors duration-200'
                    onClick={() => removeFilter(filter.type, filter.value)}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={clearAllFilters}
              className='text-sm font-bold text-red-400 hover:text-red-300 transition-colors duration-200'
            >
              Clear All Filters
            </button>
          </div>
        )}
        {filterOptions?.map((filter, index) => (      
          <div key={filter.filterType} className='border-b border-white/5 last:border-b-0 pb-3 last:pb-0'>
            <div
              className='flex items-center justify-between cursor-pointer py-2 hover:bg-white/5 rounded-lg px-2 transition-colors duration-200'
              onClick={() => toggleExpand(index)}
            >
              <h3 className='font-extrabold text-sm text-[#8B949E] hover:text-[#00C8FF] transition-colors duration-200'>{filter.filterType}</h3>
              <div className={`transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`}>
                {expandedIndex === index ? (
                  <FiMinus className='text-[#00C8FF] anim-pulse-glow' />
                ) : (
                  <FiPlus className='text-muted-foreground' />
                )}
              </div>
            </div>
            {expandedIndex === index && (
              <div className='mt-2 space-y-2 pl-2 text-start'>
                {filter?.array?.map((item) => (
                  <div key={item} className='flex items-center gap-2.5 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors duration-200 group'>
                    <input
                      type='checkbox'
                      id={item}
                      checked={selectedFilters.some(
                        (filter) => filter.value === item
                      )}
                      onChange={() =>
                        handleFilterSelection(filter.filterType, item)
                      }
                      className='w-4 h-4 accent-[#00C8FF] border-white/10 rounded focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]/50'
                    />
                    <label htmlFor={item} className='text-sm text-[#8B949E] cursor-pointer font-bold group-hover:text-[#00C8FF] transition-colors duration-200'>{item}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
