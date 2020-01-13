import '../styles/styles.css'
import MobileMenu from './modules/MobileMenu'

//let is the new instance of the class
let mobileMenu = new MobileMenu();

if (module.hot) {
  module.hot.accept()
}