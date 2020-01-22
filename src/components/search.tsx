import * as React from 'react'

const Search: React.FC<Props> = ({ language }) => {
  return (
    <div>
      <h2>search</h2>
    </div>
  )
}

export default Search

interface Props {
  language: string
}

/*
        {query && (
          <div className='w-1/6'>
            <h3 className='text-2xl'>Kategorije</h3>
            <ul>
              {allCategories.type.map(({ value, count }) => {
                return (
                  <li
                    key={value}
                    onClick={() => {
                      if (categories.type === value[language]) {
                        setCategories({
                          ...categories,
                          type: '',
                        })
                      } else {
                        setCategories({
                          ...categories,
                          type: value[language],
                        })
                      }
                    }}
                    style={{
                      backgroundColor:
                        categories.type === value[language]
                          ? 'rebeccapurple'
                          : null,
                    }}
                  >
                    {value[language]} ({count})
                  </li>
                )
              })}
            </ul>
            <h3 className='text-2xl'>Brendovi</h3>
            <ul>
              {allCategories.brand.map(({ value, count }) => {
                return (
                  <li
                    key={value}
                    onClick={() => {
                      if (categories.brand === value) {
                        setCategories({
                          ...categories,
                          brand: '',
                        })
                      } else {
                        setCategories({
                          ...categories,
                          brand: value,
                        })
                      }
                    }}
                    style={{
                      backgroundColor:
                        categories.brand === value ? 'rebeccapurple' : null,
                    }}
                  >
                    {value} ({count})
                  </li>
                )
              })}
            </ul>
          </div>
        )}
