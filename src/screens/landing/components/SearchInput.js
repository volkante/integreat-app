// @flow

import React from 'react'
import styled from 'styled-components'

import Icon from 'react-native-vector-icons/MaterialIcons'

export const Spacer = styled.View`
  ${props => props.space && `margin: 50px 0;`}
`

// width: calc(100% - ${searchLogoWidth} - 5px);
export const Input = styled.TextInput.attrs({
  multiline: false,
  textColor: props => props.theme.colors.textSecondaryColor,
  placeholderTextColor: props => props.theme.colors.textSecondaryColor
})`
  margin-left: 5px;
  flex-grow: 1;
  
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`

export const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justifyContent:center;
  width: 100%;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export const SearchIcon = styled(Icon).attrs({
  name: 'search',
  size: 40
})`
`

type PropsType = {
  placeholderText: string,
  filterText: string,
  onFilterTextChange: (string) => void,
  spaceSearch: boolean,
  onClickInput?: () => void
}

export class SearchInput extends React.Component<PropsType> {
  static defaultProps = {spaceSearch: false}
  onFilterTextChange = (text: string) => this.props.onFilterTextChange(text)

  render () {
    const {onClickInput, filterText, placeholderText} = this.props
    return (
      <Spacer space={this.props.spaceSearch}>
        <Wrapper>
          <SearchIcon />
          <Input placeholder={placeholderText}
                 aria-label={placeholderText}
                 defaultValue={filterText}
                 onChangeText={this.onFilterTextChange}
                 onClick={onClickInput}
                 autoFocus />
        </Wrapper>
      </Spacer>
    )
  }
}

export default SearchInput
