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
    <div className='bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-custom sticky top-24'>
      <h2 className='font-extrabold text-xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
        Filters
      </h2>
      <div className='space-y-4'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search by title, skills, company name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border border-border rounded-xl w-full p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground'
          />
        </div>
        {selectedFilters?.length > 0 && (
          <div className='bg-muted/50 rounded-xl p-4 border border-border'>
            <div className='flex flex-wrap gap-2 mb-3'>
              {selectedFilters?.map((filter, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-3 py-1.5 border border-primary/30'
                >
                  <span className='text-xs font-semibold'>{filter.value}</span>
                  <FiX
                    className='text-sm cursor-pointer hover:text-destructive transition-colors duration-200'
                    onClick={() => removeFilter(filter.type, filter.value)}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={clearAllFilters}
              className='text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors duration-200'
            >
              Clear All Filters
            </button>
          </div>
        )}
        {filterOptions?.map((filter, index) => (
          <div key={filter.filterType} className='border-b border-border last:border-b-0 pb-3 last:pb-0'>
            <div
              className='flex items-center justify-between cursor-pointer py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors duration-200'
              onClick={() => toggleExpand(index)}
            >
              <h3 className='font-bold text-foreground'>{filter.filterType}</h3>
              <div className={`transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`}>
                {expandedIndex === index ? (
                  <FiMinus className='text-primary' />
                ) : (
                  <FiPlus className='text-muted-foreground' />
                )}
              </div>
            </div>
            {expandedIndex === index && (
              <div className='mt-2 space-y-2 pl-2'>
                {filter?.array?.map((item) => (
                  <div key={item} className='flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors duration-200'>
                    <input
                      type='checkbox'
                      id={item}
                      checked={selectedFilters.some(
                        (filter) => filter.value === item
                      )}
                      onChange={() =>
                        handleFilterSelection(filter.filterType, item)
                      }
                      className='w-4 h-4 accent-primary border-border rounded focus:ring-primary focus:ring-2 cursor-pointer'
                    />
                    <label htmlFor={item} className='text-sm text-foreground cursor-pointer font-medium'>{item}</label>
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
