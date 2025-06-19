import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'

const ThemeModal = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state?.ui?.theme)

  const closeThemeModal = (e) => {
    if (e.target.classList.contains('theme')) {
      dispatch(uiActions.closeThemeModal())
    }
  }

  const changeBackgroundColor = (color) => {
    const newTheme = { ...theme, backgroundColor: color }
    dispatch(uiActions.changeTheme(newTheme))
    localStorage.setItem('theme', JSON.stringify(newTheme))
  }

  const changePrimaryColor = (color) => {
    const newTheme = { ...theme, primaryColor: color }
    dispatch(uiActions.changeTheme(newTheme))
    localStorage.setItem('theme', JSON.stringify(newTheme))
  }

  return (
    <section className="theme" onClick={closeThemeModal}>
      <div className="container theme__container">
        <article className="theme__primary">
          <h3>Primary Colors</h3>
          <ul>
            <li onClick={() => changePrimaryColor('red')}></li>
            <li onClick={() => changePrimaryColor('blue')}></li>
            <li onClick={() => changePrimaryColor('purple')}></li>
            <li onClick={() => changePrimaryColor('green')}></li>
            <li onClick={() => changePrimaryColor('yellow')}></li>
          </ul>
        </article>
        <article className="theme__background">
          <h3>Background Colors</h3>
          <ul>
            <li onClick={() => changeBackgroundColor('')}></li>
            <li onClick={() => changeBackgroundColor('dark')}></li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default ThemeModal