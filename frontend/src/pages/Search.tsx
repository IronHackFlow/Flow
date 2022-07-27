import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/_Navbar/Navbar'
import { SearchList } from 'src/features/search/components/Item'
import { SearchInput } from 'src/features/search/components/Input'
import { LayoutTwo } from 'src/components/__Layout/LayoutWrappers'
import { ButtonTypes } from 'src/components/_Buttons/Icon/Icon'
import { RoundButton, BtnColorsEnum } from 'src/components/_Buttons/RoundButton/RoundButton'
import useSearch from 'src/features/search/hooks/useSearch'

type LocationPropTypes = {
  returnValue: string
}

function Search() {
  const navigate = useNavigate()
  const { searchResults, getSearchResults, clearSearchResults } = useSearch()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const renderRef = useRef<number>(0)

  const navigateOnClick = (id: string, type: string) => {
    if (type === 'song') navigate(`/songScreen/${id}`, { state: { currentSong: id } })
    else navigate(`/profile/${id}`)
  }

  const onClose = () => {
    navigate(-1)
  }

  return (
    <div id="Search" className="Search">
      <div className="search-inner" id="SearchInner">
        <LayoutTwo classes={['section-1_search-field', 'search-field_shadow-div-outset']}>
          <>{console.log(renderRef.current++, 'Lets take a looksie')}</>
          <form className="search-field-form" onSubmit={e => e.preventDefault()}>
            <div className="search-back-btn-container">
              <RoundButton
                type={ButtonTypes.Back}
                btnOptions={{
                  offset: 10,
                  bgColor: BtnColorsEnum.Primary,
                }}
                iconOptions={{ color: 'White', size: 75 }}
                onClick={() => onClose()}
              />
            </div>
            <SearchInput
              getResults={getSearchResults}
              clearResults={clearSearchResults}
              ref={searchInputRef}
            />
          </form>
        </LayoutTwo>

        <div className="section-2_search-results" id="SearchResults">
          <div className="results-1_recent"></div>
          <LayoutTwo classes={['results-2_suggestions', 'suggestions_shadow-div-inset']}>
            <SearchList
              users={searchResults.users}
              songs={searchResults.songs}
              onClick={navigateOnClick}
            />
          </LayoutTwo>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Search
